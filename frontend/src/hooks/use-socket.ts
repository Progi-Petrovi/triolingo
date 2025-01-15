import { Client } from "@stomp/stompjs";
import { useToast } from "./use-toast";

type WebSocketProp = {
    socketUrl: string;
    socketCallback: (message: any) => void;
};

export default function useWebSocket  (props: WebSocketProp[] | WebSocketProp) {
    if (!Array.isArray(props)) {
        props = [props];
    }
    const client = new Client({
        brokerURL: "ws://localhost:5000/ws",
        connectHeaders: {
            // You may need to pass authentication headers if required
        },
        onConnect: () => {
            console.log("Connected to WebSocket");
            props.forEach((prop) => {
                client.subscribe(prop.socketUrl, (message: { body: any }) => {
                    prop.socketCallback(message);
                });
            });
        },
        onDisconnect: () => {
            console.log("Disconnected from WebSocket");
        },
        onStompError: (frame: any) => {
            console.error("Error in WebSocket connection:", frame);
        },
    });
    
    const useClient = () => {
        client.activate();
        return () => {
            client.deactivate();
        };
    };

    return useClient;
};

export function useWSTeacherRequests(teacherSocketCallback?: (message: any) => void | undefined) {
    console.log("teacherSocketCallback");
    console.log(teacherSocketCallback);

    const { toast } = useToast();

    const socketUrl = "/topic/lesson-requests";

    const socketCallback = (_message: any) => {
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
    };

    return useWebSocket({ socketUrl, socketCallback });
}

export function useWSStudentRequests(studentSocketCallback?: (message: any) => void | undefined) {
    const { toast } = useToast();

    const webSocketAccepted = {
        socketUrl: "/topic/lesson-request-accepted",
        socketCallback: (message: any) => {
            const lessonRequest = JSON.parse(message.body);
            toast({
                title:
                    lessonRequest.lesson.teacher.fullName +
                    " accepted your request for " +
                    lessonRequest.lesson.language.name +
                    " lesson " +
                    lessonRequest.lesson.id,
            });

            if (typeof studentSocketCallback === "function")
                studentSocketCallback(message);
        },
    };

    const webSocketRejected = {
        socketUrl: "/topic/lesson-request-rejected",
        socketCallback: (message: any) => {
            const lessonRequest = JSON.parse(message.body);
            toast({
                title:
                    lessonRequest.lesson.teacher.fullName +
                    " rejected your request for " +
                    lessonRequest.lesson.language.name +
                    " lesson " +
                    lessonRequest.lesson.id,
                variant: "destructive",
            });

            if (typeof studentSocketCallback === "function")
                studentSocketCallback(message);
        },
    };

    return useWebSocket([webSocketAccepted, webSocketRejected]);
}