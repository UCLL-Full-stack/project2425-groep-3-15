import React from "react";

const Loading: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg font-bold text-gray-500">{message}</p>
    </div>
  );
};

export default Loading;
