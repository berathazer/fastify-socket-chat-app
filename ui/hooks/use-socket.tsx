import { useEffect, useState } from "react";

import { Socket, io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "ws://127.0.0.1";

const useSocket = () => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		console.log(SOCKET_URL);

		const socketIo: Socket = io(SOCKET_URL, {
			reconnection: true,
			upgrade: true,
			transports: ["websocket", "polling"],
			reconnectionAttempts: 5,
			reconnectionDelay: 3000,
		});

		setSocket(socketIo);

		return () => {
			socketIo.disconnect();
		};
	}, []);

	return socket;
};

export default useSocket;
