import { Outlet } from "react-router-dom";
import { Header } from "./Header"
// import Footer from "./Footer"
import { Suspense } from "react";
import { Toaster } from "./ui/toaster";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="flex full-height w-screen items-center justify-center">
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
        <Toaster />
      </main>
      {/* <Footer /> */}
    </>
  );
}
