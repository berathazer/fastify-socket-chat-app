import React from "react";
import { Message } from "./ChatForm";

const MessageCard = ({ message }: { message: Message }) => {
	return (
		<li className=" bg-white shadow-md rounded-lg p-4 w-full mx-auto my-4">
			<p className="text-sm text-gray-600">ID: {message.id}</p>
			<h3 className="text-lg font-semibold text-gray-900 mb-2">Message: {message.message}</h3>
			<p className="text-sm text-gray-600">Port: {message.port}</p>
			<p className="text-sm text-gray-600 italic">CreatedAt: {message.createdAt} </p>
		</li>
	);
};

export default MessageCard;
