import React from "react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

const Header = () => {
  const username = localStorage.getItem("username");
  return (
    <div className="bg-blue-500 rounded-xl text-white p-4 text-center">
      <h1 className="text-2xl font-bold">
        <AccountBoxIcon className="mb-1" />
        GenAI Bot
      </h1>
      {username && <p className="mt-2">Welcome, {username}!</p>}
    </div>
  );
};

export default Header;
