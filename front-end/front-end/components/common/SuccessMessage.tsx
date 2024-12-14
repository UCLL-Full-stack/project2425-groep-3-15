// components/common/SuccessMessage.tsx
import React from "react";

type SuccessMessageProps = {
  message: string;
};

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return (
    <div
      className="flex items-center bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg shadow-lg mb-6 animate-fade-in"
      role="alert"
    >
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default SuccessMessage;
