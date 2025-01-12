/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component, ErrorInfo } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { UserNotLoadedError } from "./context/user-not-loaded";
import { useToast } from "./hooks/use-toast";

class GlobalErrorBoundary extends Component<
    {
        children: React.ReactNode;
        navigate: NavigateFunction;
        toast: any;
    },
    { hasError: boolean }
> {
    constructor(props: {
        children: React.ReactNode;
        navigate: NavigateFunction;
        toast: any;
    }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        if (error instanceof UserNotLoadedError) {
            return { hasError: true };
        }
        return null;
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (error instanceof UserNotLoadedError) {
            this.props.navigate("/login");
        } else {
            console.error("Unhandled error:", error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            this.props.navigate("/login");
            this.props.toast({
                title: "Please login before accessing that page.",
                variant: "destructive",
            });
        }
        return this.props.children;
    }
}

export function GlobalErrorBoundaryWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const navigate = useNavigate();
    const { toast } = useToast();
    return (
        <GlobalErrorBoundary navigate={navigate} toast={toast}>
            {children}
        </GlobalErrorBoundary>
    );
}
