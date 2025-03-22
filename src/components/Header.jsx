// Header.jsx
import React from "react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

const Header = () => {
  // Retrieve the username from local storage
  const username = localStorage.getItem("username");

  return (
    <div className="bg-blue-500 rounded-xl text-white p-4 text-center">
      <h1 className="text-2xl font-bold">
        <AccountBoxIcon className="mb-1" />
        PRIVATE GPT
      </h1>
      {username && (
        <p className="mt-2">Welcome, {username}!</p> // Display the username if it exists
      )}
    </div>
  );
};

export default Header;
