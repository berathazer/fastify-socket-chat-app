"use client";

import useSocket from "@/hooks/use-socket";
import React, { FormEvent, useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import MessageCard from "./MessageCard";

export const CONNECTION_COUNT_UPDATED_CHANNEL = "chat:connection-count-updated";
export const NEW_MESSAGE_CHANNEL = "chat:new-message";
export const MESSAGES_KEY = "chat:messages";

export interface Message {
	id: string;
	message: string;
	createdAt: string;
	port: string;
}

const ChatForm = () => {
	const [message, setMessage] = useState("");
	const socket = useSocket();
	const [messages, setMessages] = useState<Message[]>([]);
	const [connectionCount, setConnectionCount] = useState("");

	useEffect(() => {
		socket?.on("connect", () => {
			console.log("Connected to server");
		});

		socket?.on(NEW_MESSAGE_CHANNEL, (message: Message) => {
			setMessages((prev) => [...prev, message]);
		});

		socket?.on(CONNECTION_COUNT_UPDATED_CHANNEL, ({ count }: { count: string }) => {
			setConnectionCount(count);
		});

		return () => {
			socket?.off("connect");
			socket?.off("disconnect");
		};
	}, [socket]);

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();

		socket?.emit(NEW_MESSAGE_CHANNEL, {
			message: message,
		});
		setMessage("");
	};

	return (
		<div className="flex flex-col">
			<h2 className="text-center pb-4 font-medium">Total Connection: {connectionCount}</h2>
			<ol className="flex flex-col gap-y-4  border h-full px-4 pb-32">
				{messages.map((message) => (
					<MessageCard
						key={message.id}
						message={message}
					/>
				))}
			</ol>

			<form
				onSubmit={onSubmit}
				className="flex  w-full gap-x-4 p-4 fixed bottom-0 "
			>
				<Textarea
					placeholder="Type a message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					rows={2}
					cols={2}
				></Textarea>
				<Button>Send Message</Button>
			</form>
		</div>
	);
};

export default ChatForm;
