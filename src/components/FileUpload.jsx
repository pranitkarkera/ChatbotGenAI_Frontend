import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FileUpload = ({ addFile }) => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleUpload(selectedFile)
    }
  };

  const handleUpload = (selectedFile) => {
    if (selectedFile) {
      addFile(selectedFile)
      setFile(null)
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded shadow-md">
      <VisuallyHiddenInput
        type="file"
        onChange={handleChange}
        onClick={(event) => {
          event.target.value = null;
        }}
      />
      <Button
        component="span"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        onClick={() => {
          document.querySelector('input[type="file"]').click()
        }}
      >
        Upload files
      </Button>
      {file && <p className="mt-2">Selected file: {file.name}</p>}
    </div>
  );
};

export default FileUpload;
