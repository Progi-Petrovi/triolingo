import { Outlet } from "react-router-dom";
// import Header from "./Header"
import { Footer } from "./Footer"
import { Suspense } from "react";
import { Toaster } from "./ui/toaster";

export default function Layout() {
  return (
    <div id={location.pathname}>
      {/* <Header /> */}
      <main className="flex h-screen w-screen items-center justify-center">
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
        <Toaster />
      </main>
      <Footer />
    </div>
  );
}
