import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function VerifySuccess() {
    const navigate = useNavigate();
    const [dots, setDots] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("../");
        }, 2000);

        const dotting = setInterval(() => {
            setDots((d) => (d.length < 3 ? d + "." : ""));
        }, 250);

        return () => {
            clearTimeout(timer);
            clearInterval(dotting);
        }
    }, [navigate]);

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Verification Successful!</CardTitle>
                <CardDescription>
                    Redirecting{dots}
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
