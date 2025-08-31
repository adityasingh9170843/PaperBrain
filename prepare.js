import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function indexTheDocument(filePath){
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    console.log(docs);
}