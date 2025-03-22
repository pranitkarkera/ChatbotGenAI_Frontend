import React, { useState } from "react";
import FileUpload from "../components/FileUpload"; // Adjust the path as necessary
import FileList from "../components/FileList"; // Adjust the path as necessary

const FileUploader = () => {
  const [files, setFiles] = useState([]);

  const addFile = (file) => {
    setFiles((prevFiles) => [...prevFiles, file]);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div>
      <FileUpload addFile={addFile} />
      <FileList files={files} removeFile={removeFile} />
    </div>
  );
};

export default FileUploader;
