import { Client } from "@stomp/stompjs";
import { useToast } from "./use-toast";
import PathConstants from "@/routes/pathConstants";
import { Role, User } from "@/types/users";
import { LessonRequest, LessonRequestDTO } from "@/types/lesson";
import { lessonRequestDTOtoLessonRequest } from "@/utils/main";
import { showChatPopupStudent } from "./use-chat";

type WebSocketProp = {
    socketUrl: string;
    socketCallback: (message: any) => void;
};

export default function useWebSocket(props: WebSocketProp[] | WebSocketProp) {
    if (!Array.isArray(props)) {
        props = [props];
    }
    const client = new Client({
        brokerURL: PathConstants.API_URL + "/ws",
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

export function useWSTeacherRequests(user: User, teacherSocketCallback?: (message: any) => void | undefined) {
    const { toast } = useToast();

    const socketUrl = "/topic/lesson-requests";

    const socketCallback = (_message: any) => {
        const lessonRequest: LessonRequestDTO = JSON.parse(_message.body);

        lessonRequestDTOtoLessonRequest(lessonRequest).then((lessonRequest: LessonRequest) => {

            console.log("Lesson request: ", lessonRequest);
            console.log("User: ", user);
            console.log("lessonRequest.teacherId !== user.id", lessonRequest.lesson.teacher.id !== user.id);

            if (lessonRequest.lesson.teacher.id !== user?.id || !user) {
                console.warn("Not for this user");
                return;
            }

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
        });
    };

    return useWebSocket({ socketUrl, socketCallback });
}

export function useWSStudentRequests(user: User, studentSocketCallback?: (message: any) => void | undefined) {
    const { toast } = useToast();
    const safeStudentSocketCallback = safeCallback(studentSocketCallback);

    const webSocketAccepted = {
        socketUrl: "/topic/lesson-request-accepted",
        socketCallback: (message: any) => {
            const lessonRequest = JSON.parse(message.body);
            const email = lessonRequest.lesson.teacher.email;
            const fullName = lessonRequest.lesson.teacher.fullName;
            const lessonTitle = lessonRequest.lesson.language.name + " lesson " + lessonRequest.lesson.id;
             
            console.log("Lesson request accepted: ", lessonRequest);
            console.log("User: ", user);
            console.log("lessonRequest.student.id !== user.id", lessonRequest.student.id !== user.id);

            if (lessonRequest.student.id !== user?.id || !user) {
                console.warn("Not for this user");
                return;
            }

            toast({
                title:
                    lessonRequest.lesson.teacher.fullName +
                    " accepted your request for " +
                    lessonRequest.lesson.language.name +
                    " lesson " +
                    lessonRequest.lesson.id,
            });

            showChatPopupStudent({lessonTitle, email, fullName});

            safeStudentSocketCallback(message);
        },
    };

    const webSocketRejected = {
        socketUrl: "/topic/lesson-request-rejected",
        socketCallback: (message: any) => {
            const lessonRequest = JSON.parse(message.body);
            console.log("Lesson request rejected: ", lessonRequest);
            console.log("User: ", user);
            console.log("lessonRequest.student.id !== user.id", lessonRequest.student.id !== user.id);

            if (lessonRequest.student.id !== user?.id || !user) {
                console.warn("Not for this user");
                return;
            }

            toast({
                title:
                    lessonRequest.lesson.teacher.fullName +
                    " rejected your request for " +
                    lessonRequest.lesson.language.name +
                    " lesson " +
                    lessonRequest.lesson.id,
                variant: "destructive",
            });

            safeStudentSocketCallback(message);
        },
    };

    return useWebSocket([webSocketAccepted, webSocketRejected]);
}

function safeCallback(callback?: (args?: any) => void) {
    return (args?: any) => {
        if (callback) {
            callback(args);
        }
    }
}

function safeCallbackWithArgs(
    {
        callback,
        args,
    }:
    {
        callback?: (args?: any) => void;
        args?: any;
    }
) {
    const safeCallbackFn = safeCallback(callback);

    return () => {
        if (args) {
            safeCallbackFn(args);
        } else {
            safeCallbackFn();
        }
    }
}

type WebSocketLessonRequestProps = {
    user: User;
    teacherCallback?: (teacherCallbackArgs?: any) => void;
    studentCallback?: (studentCallbackArgs?: any) => void;
    teacherWSCallback?: (
        {_message, teacherWSCallbackArgs}:
        {_message: any; teacherWSCallbackArgs: any}
    ) => void;
    studentWSCallback?: (
        {_message, studentWSCallbackArgs}:
        {_message: any; studentWSCallbackArgs: any}
    ) => void;
    teacherCallbackArgs?: any;
    studentCallbackArgs?: any;
    teacherWSCallbackArgs?: any;
    studentWSCallbackArgs?: any;
};

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
}:
WebSocketLessonRequestProps
) {
    const teacherSafeCallback = safeCallbackWithArgs({ callback: teacherCallback, args: teacherCallbackArgs });

    const studentSafeCallback = safeCallbackWithArgs({ callback: studentCallback, args: studentCallbackArgs });

    const teacherWSCallbackFullArgs = {
        _message: null,
        teacherWSCallbackArgs,
    };

    const teacherWSSafeCallback = safeCallbackWithArgs({ callback: teacherWSCallback, args: teacherWSCallbackFullArgs });

    const studentWSCallbackFullArgs = {
        _message: null,
        studentWSCallbackArgs,
    };

    const studentWSSafeCallback = safeCallbackWithArgs({ callback: studentWSCallback, args: studentWSCallbackFullArgs });

    const useClientTeacher = useWSTeacherRequests(user, teacherWSSafeCallback);
    const useClientStudent = useWSStudentRequests(user, studentWSSafeCallback);

    return () => {
        if (user?.role === Role.ROLE_TEACHER) {
            teacherSafeCallback();
            useClientTeacher();
        } else if (user?.role === Role.ROLE_STUDENT) {
            studentSafeCallback();
            useClientStudent();
        }
    }
}