import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Suspense } from "react";
import { Toaster } from "./ui/toaster";
import { UserProvider } from "@/context/UserContext";

export default function Layout() {
    return (
        <UserProvider>
            <div
                id={location.pathname}
                className="min-h-screen w-screen flex flex-col"
            >
                <Header />
                <main className="flex-1 overflow-auto flex justify-center items-center pt-6">
                    <Suspense fallback={<div>Loading...</div>}>
                        <Outlet />
                    </Suspense>
                    <Toaster />
                </main>
                <Footer />
            </div>
        </UserProvider>
    );
}
