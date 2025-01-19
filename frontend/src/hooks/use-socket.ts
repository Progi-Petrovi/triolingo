/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, StompSubscription } from "@stomp/stompjs";
import { useToast } from "./use-toast";
import PathConstants from "@/routes/pathConstants";
import { Role } from "@/types/users";
import { LessonRequest, LessonRequestAggregate } from "@/types/lesson";
import { lessonRequestAggregatetoLessonRequest } from "@/utils/main";
import { useState } from "react";
import { User } from "../types/users";

type WebSocketProp = {
	socketUrl: string;
	socketCallback: (message: any) => void;
};

export async function useClient(): Promise<Client> {
	let connected: Function = () => {};
	const promise = new Promise((r) => {
		connected = r;
	});

	const [client] = useState(
		new Client({
			brokerURL: PathConstants.API_URL + "/ws",
			connectHeaders: {
				// You may need to pass authentication headers if required
			},
			onConnect: function () {
				console.log("Connected to WebSocket");
				connected();
			},
			onDisconnect: () => {
				console.log("Disconnected from WebSocket");
			},
			onStompError: (frame: any) => {
				console.error("Error in WebSocket connection:", frame);
			},
		})
	);
	if (!client.active) {
		client.activate();
		await promise;
	}

	return client;
}

export default function useSubscription(props: WebSocketProp[]) {
	const clientPromise = useClient();
	const subscriptions: StompSubscription[] = [];

	const subscribe = async () => {
		const client = await clientPromise;
		for (const prop of props)
			subscriptions.push(client.subscribe(prop.socketUrl, prop.socketCallback));
	};
	const unsubscribe = () => {
		for (const subscription of subscriptions) subscription.unsubscribe();
	};

	return { subscribe, unsubscribe };
}

export function useWSTeacherRequests(
	user: User,
	teacherSocketCallback?: (message: any) => void | undefined
) {
	const { toast } = useToast();

	const socketUrl = "/user/topic/lesson-requests";

	const socketCallback = (_message: any) => {
		const requestAggregate: LessonRequestAggregate = JSON.parse(_message.body);

		lessonRequestAggregatetoLessonRequest(requestAggregate).then(
			(lessonRequest: LessonRequest) => {
				console.log("Lesson request: ", lessonRequest);
				console.log("User: ", user);

				const requestsNavLink = document.getElementById(
					"nav-link-lesson-requests"
				);
				if (requestsNavLink) {
					requestsNavLink.classList.remove("text-foreground");
					requestsNavLink.classList.add("text-red-500");

					toast({
						title: "New lesson request",
						description: "You have a new lesson request",
					});

					if (typeof teacherSocketCallback === "function")
						teacherSocketCallback(_message);

					setTimeout(() => {
						requestsNavLink.classList.remove("text-red-500");
						requestsNavLink.classList.add("text-foreground");
					}, 5000);
				}
			}
		);
	};

	return useSubscription([{ socketUrl, socketCallback }]);
}

export function useWSStudentRequests(
	user: User,
	studentSocketCallback?: (message: any) => void | undefined
) {
	const { toast } = useToast();

	const webSocketAccepted = {
		socketUrl: "/user/topic/lesson-request-accepted",
		socketCallback: async (message: any) => {
			const lessonRequest: LessonRequest =
				await lessonRequestAggregatetoLessonRequest(
					JSON.parse(message.body)
				);
			console.log("Lesson request accepted: ", lessonRequest);
			console.log("User: ", user);

			toast({
				title:
					lessonRequest.lesson.teacher.fullName +
					" accepted your request for " +
					lessonRequest.lesson.language +
					" lesson " +
					lessonRequest.lesson.id,
			});

			if (typeof studentSocketCallback === "function")
				studentSocketCallback(message);
		},
	};

	const webSocketRejected = {
		socketUrl: "/user/topic/lesson-request-rejected",
		socketCallback: async (message: any) => {
			const lessonRequest: LessonRequest =
				await lessonRequestAggregatetoLessonRequest(
					JSON.parse(message.body)
				);
			console.log("Lesson request accepted: ", lessonRequest);
			console.log("User: ", user);

			toast({
				title:
					lessonRequest.lesson.teacher.fullName +
					" rejected your request for " +
					lessonRequest.lesson.language +
					" lesson " +
					lessonRequest.lesson.id,
				variant: "destructive",
			});

			if (typeof studentSocketCallback === "function")
				studentSocketCallback(message);
		},
	};

	return useSubscription([webSocketAccepted, webSocketRejected]);
}

function safeCallback({ callback, args }: { callback?: (args?: any) => void; args?: any }) {
	return () => {
		if (callback) {
			if (args !== undefined) {
				callback(args);
			} else {
				callback();
			}
		}
	};
}

export function useWSLessonRequests({
	user,
	teacherCallback,
	studentCallback,
	teacherWSCallback,
	studentWSCallback,
	teacherCallbackArgs,
	studentCallbackArgs,
	teacherWSCallbackArgs,
	studentWSCallbackArgs,
}: {
	user: User;
	teacherCallback?: (teacherCallbackArgs?: any) => void;
	studentCallback?: (studentCallbackArgs?: any) => void;
	teacherWSCallback?: ({
		_message,
		teacherWSCallbackArgs,
	}: {
		_message: any;
		teacherWSCallbackArgs: any;
	}) => void;
	studentWSCallback?: ({
		_message,
		studentWSCallbackArgs,
	}: {
		_message: any;
		studentWSCallbackArgs: any;
	}) => void;
	teacherCallbackArgs?: any;
	studentCallbackArgs?: any;
	teacherWSCallbackArgs?: any;
	studentWSCallbackArgs?: any;
}) {
	const teacherSafeCallback = safeCallback({
		callback: teacherCallback,
		args: teacherCallbackArgs,
	});

	const studentSafeCallback = safeCallback({
		callback: studentCallback,
		args: studentCallbackArgs,
	});

	const teacherWSCallbackFullArgs = {
		_message: null,
		teacherWSCallbackArgs,
	};

	const teacherWSSafeCallback = safeCallback({
		callback: teacherWSCallback,
		args: teacherWSCallbackFullArgs,
	});

	const studentWSCallbackFullArgs = {
		_message: null,
		studentWSCallbackArgs,
	};

	const studentWSSafeCallback = safeCallback({
		callback: studentWSCallback,
		args: studentWSCallbackFullArgs,
	});

	let returnedShit = { subscribe: () => {}, unsubscribe: () => {} };

	if (user?.role === Role.ROLE_TEACHER) {
		returnedShit = useWSTeacherRequests(user, teacherWSSafeCallback);
	} else if (user?.role === Role.ROLE_STUDENT) {
		returnedShit = useWSStudentRequests(user, studentWSSafeCallback);
	}

	return () => {
		if (user?.role === Role.ROLE_TEACHER) {
			teacherSafeCallback();
		} else if (user?.role === Role.ROLE_STUDENT) {
			studentSafeCallback();
		}
		return returnedShit;
	};
}
