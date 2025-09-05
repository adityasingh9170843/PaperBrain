
import axios from "axios";
import { useState } from "react";
function Agent() {
    const[file,setFile] = useState(null);
  const handleUpload = async (e) => {
    
    if(!file){
        return;
    }

    const formdata = new FormData();
    formdata.append("file",file);
    const response = axios.post("http://localhost:8080/upload",formdata);

    console.log(response);
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />
      <button onClick={handleUpload}>Upload PDF</button>
    </div>
  );
}

export default Agent;
