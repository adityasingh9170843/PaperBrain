process.removeAllListeners("warning");
process.on("warning", () => {});
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({quiet: true});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


export async function indexTheDocument(filePath) {
  const loader = new PDFLoader(filePath, { splitPages: false });
  const docs = await loader.load();
  

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const splits = await textSplitter.splitText(docs[0].pageContent);
  console.log(splits.length);
  
}
