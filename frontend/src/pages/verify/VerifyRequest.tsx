import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { useUser } from "@/context/use-user-context";
import { useFetch } from "@/hooks/use-fetch";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyRequest() {
    const fetch = useFetch();
    const navigate = useNavigate();
    const user = useUser();

    useEffect(() => {
        fetch("verification/request", {
            method: "GET",
        }).then((res) => {
            if (res.status === 400) {
                navigate("/");
            }
        });
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">
                    {" "}
                    A verification request has been sent to {user.email}
                </CardTitle>
                <CardDescription>Check your inbox</CardDescription>
            </CardHeader>
        </Card>
    );
}
