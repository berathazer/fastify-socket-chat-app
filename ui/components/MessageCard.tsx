import React from "react";
import { Message } from "./ChatForm";

import { CircleUser } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MessageCard = ({ message }: { message: Message }) => {
	return (
		<Alert>
			<CircleUser className="h-5 w-5" />
			<AlertTitle className="font-medium text-sm">{message.id.slice(0, 5)}</AlertTitle>
			<AlertDescription>{message.message}</AlertDescription>
		</Alert>
	);
};

export default MessageCard;
