import React from "react";
import classNames from "classnames";

type StatusMessagesProps = {
  messages: { message: string; type: string }[];
};

const StatusMessages: React.FC<StatusMessagesProps> = ({ messages }) => {
  if (!messages.length) return null;

  return (
    <ul className="list-none mb-3">
      {messages.map(({ message, type }, index) => (
        <li
          key={index}
          className={classNames({
            "text-red-500": type === "error",
            "text-green-500": type === "success",
            "text-base": true,
          })}
        >
          {message}
        </li>
      ))}
    </ul>
  );
};

export default StatusMessages;
