import React from "react"
import PathConstants from "./pathConstants"

// const Home = React.lazy(() => import("../pages/Home"))
const Login = React.lazy(() => import("../pages/Login"))

const routes = [
    // { path: PathConstants.HOME, element: <Home /> },
    { path: PathConstants.LOGIN, element: <Login/> },
]

export default routes