process.removeAllListeners("warning");
process.on("warning", () => {});

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import NodeCache from "node-cache";
import { GoogleGenAI } from "@google/genai";
import { indexTheDocument, vectorStore } from "./prepare.js";
import cors from "cors";
dotenv.config({ quiet: true });

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
    
}));


const upload = multer({ dest: "uploads/" });


const memory = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});


async function generateResponse(message, ConversationID = "default") {

  let history = memory.get(ConversationID) || [];


  const result = await vectorStore.similaritySearch(message, 5);
  const context = result.map((res) => res.pageContent).join("\n\n");

  const SYSTEM_PROMPT = `You are a helpful AI assistant specialized in answering questions 
based on retrieved context and conversation history.

Guidelines:
- Use the context + history to answer as accurately as possible. 
- If the context does not contain the answer, respond with: "I don't know based on the provided document."
- Do not invent information not supported by the context.
- Be concise, clear, and direct.`;

  const conversationHistory = history
    .map((m) => `${m.role}: ${m.text}`)
    .join("\n");

  const userQuery = `Conversation so far:
${conversationHistory}

Context from document:
${context}

User question: ${message}
Answer:`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: userQuery }],
      },
    ],
    config: {
      systemInstructions: SYSTEM_PROMPT,
    },
  });

  const answer = response.text;

  history.push({ role: "user", text: message });
  history.push({ role: "ai", text: answer });
  memory.set(ConversationID, history);

  return answer;
}


app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const filePath = path.join("uploads", req.file.filename);

    await indexTheDocument(filePath);

    

    res.status(200).send("File uploaded and indexed successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading file");
  }
});

app.post("/chat", async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const response = await generateResponse(
      message,
      conversationId || "default"
    );

    res.json({ answer: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating response" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
