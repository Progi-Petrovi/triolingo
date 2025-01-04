import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Suspense } from "react";
import { Toaster } from "./ui/toaster";

export default function Layout() {
    return (
        <div
            id={location.pathname}
            className="min-h-screen w-screen flex flex-col"
        >
            <Header />
            <main className="flex-1 overflow-auto flex justify-center items-center">
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
                <Toaster />
            </main>
            <Footer />
        </div>
    );
}
