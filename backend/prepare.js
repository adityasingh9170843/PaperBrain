process.removeAllListeners("warning");
process.on("warning", () => {});
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
dotenv.config({ quiet: true });



const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", 
  task: TaskType.TEXT_EMBEDDING,
  apiKey: process.env.GOOGLE_GENAI_API_KEY
});


const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY,
});

const pineconeIndex = pinecone.Index("pdf-agent");
export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

export async function indexTheDocument(filePath) {
  const loader = new PDFLoader(filePath, { splitPages: false });
  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const splits = await textSplitter.splitText(docs[0].pageContent);

  const documents = splits.map((chunks)=>{
    return{
      pageContent : chunks,
      metadata : docs[0].metadata
    }
  })
  console.log(documents);
  await vectorStore.addDocuments(documents);
  

  console.log(splits.length);
}
