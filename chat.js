process.removeAllListeners("warning");
process.on("warning", () => {});
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createInterface } from "node:readline/promises";
import { vectorStore } from "./prepare.js";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
dotenv.config({ quiet: true });
export async function chat() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while(true){
    const question = await rl.question("You: ");
    if(question === "exit"){
      break;
    }

    //start retreivl
    const result = await vectorStore.similaritySearch(question,5)
    const context = result.map((res)=> res.pageContent).join('/n/n')
    
    console.log(context)

    
    const SYSTEM_PROMPT =`you are an assitant for question-answering tasks .Use the Following relevant pieces of context to answer the users question. If you don't know the answer, just say that you don't know, don't try to make up an answer.`;

    const userQuery = `context: ${context} question: ${question} answer: `
    const response = await ai.models.generateContent({
      model:"gemini-2.5-flash",
      contents :[{
          role: "user",
          text: userQuery
      }],
      config:{
        systemInstructions: SYSTEM_PROMPT
      }
  })







  }














  
}
chat();