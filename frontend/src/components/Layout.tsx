import { Outlet } from "react-router-dom"
// import Header from "./Header"
// import Footer from "./Footer"
import { Suspense } from "react"

export default function Layout() {
    return (
        <>
            {/* <Header /> */}
            <main className="flex h-screen w-screen items-center justify-center">
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
            </main>
            {/* <Footer /> */}
        </>
    )
}