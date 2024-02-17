"use client";

import useSocket from "@/hooks/use-socket";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import MessageCard from "./MessageCard";
import { Alert } from "./ui/alert";

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
	const bottomRef = useRef<HTMLDivElement>(null);

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

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const onSubmit = (e: FormEvent) => {
		e.preventDefault();

		socket?.emit(NEW_MESSAGE_CHANNEL, {
			message: message,
		});
		setMessage("");
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			onSubmit(e as unknown as FormEvent);
		}
	};

	return (
		<div className="flex flex-col items-center">
			<h2 className="text-center pb-4 font-medium">Total Connection: {connectionCount}</h2>
			<div className="max-w-2xl w-full rounded-md">
				<ol className="flex flex-col gap-y-4 w-full px-4 pb-32">
					{messages.length === 0 && (
						<Alert>
							<span className="font-medium">System:</span> There is no message in room
						</Alert>
					)}
					{messages.map((message) => (
						<MessageCard
							key={message.id}
							message={message}
						/>
					))}
					<div ref={bottomRef} />
				</ol>
			</div>

			<form
				onSubmit={onSubmit}
				className="flex  max-w-2xl w-full gap-x-4 p-4 fixed bottom-0 bg-white"
			>
				<Textarea
					placeholder="Type a message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={handleKeyDown}
					rows={2}
					cols={2}
				></Textarea>
				<Button>Send Message</Button>
			</form>
		</div>
	);
};

export default ChatForm;
