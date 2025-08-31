import express from "express";
import { indexTheDocument } from "./prepare.js";


const app = express();



const filePath = "./sample.pdf";
indexTheDocument(filePath);



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});