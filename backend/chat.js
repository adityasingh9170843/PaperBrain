process.removeAllListeners("warning");
process.on("warning", () => {});
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createInterface } from "node:readline/promises";
import { vectorStore } from "./prepare.js";
dotenv.config({ quiet: true });
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});
dotenv.config({ quiet: true });
export async function chat() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const question = await rl.question("You: ");
    if (question === "exit") {
      break;
    }

    //start retreivl
    const result = await vectorStore.similaritySearch(question, 5);
    const context = result.map((res) => res.pageContent).join("/n/n");

    const SYSTEM_PROMPT = `You are a helpful AI assistant specialized in answering questions based on retrieved context. 
        The context comes from a document provided by the user. 

        Guidelines:
        - Use the context to answer the user's question as accurately as possible. 
        - If the context does not contain the answer, respond with: "I don't know based on the provided document."
        - Do not invent information that is not supported by the context.
        - Be concise, clear, and direct in your answers.
        - If the question cannot be answered fully, provide the most relevant information from the context and explain any limitations.`;

    const userQuery = `context: ${context} question: ${question} answer: `;
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

    console.log(`AI: ${response.text}`);
  }
}
chat();
