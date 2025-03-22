import React from "react";

const FileList = ({ files, removeFile }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col">
      <h3 className="text-xl p-2 text-dark mb-4">
        File Upload (Max: 10 MB):-
      </h3>
      <ul className="divide-y divide-gray-200">
        {files.map((file, index) => (
          <li
            key={file.name}
            className="flex justify-between items-center py-2"
          >
            <span className="text-gray-700">{file.name}</span>
            <button
              onClick={() => removeFile(index)}
              className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              aria-label={`Delete ${file.name}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
