import React, { useState } from "react";
import axios from "axios";
import FileUpload from "../components/FileUpload"; // Adjust the path as necessary
import FileList from "../components/FileList"; // Adjust the path as necessary

const FileUploader = ({ onFilesProcessed }) => {
  const [files, setFiles] = useState([]);

  const addFile = async (file) => {
    setFiles((prevFiles) => [...prevFiles, file]);
    await uploadFile(file); // Automatically upload the file when added
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append("files", file)

    try {
      const response = await axios.post(
        "http://localhost:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("File uploaded successfully!");
      console.log(response.data)
      onFilesProcessed(response.data)
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.")
    }
  };

  return (
    <div>
      <FileUpload addFile={addFile} />
      <FileList files={files} removeFile={removeFile} />
    </div>
  );
};

export default FileUploader;
