import {
  createBrowserRouter
} from "react-router-dom";
import Home from "./pages/home/page";
import TennisPage, {loader as TennisLoader, Actions as TennisActions} from "./pages/home/tennis/page";
import TennisErrorPage from "./pages/home/tennis/error";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/tennis",
    element:<TennisPage />,
    errorElement: <TennisErrorPage />,
    loader: TennisLoader,
    action: TennisActions
  }
]);

export default router;