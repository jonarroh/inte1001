import {
  createBrowserRouter
} from "react-router-dom";
import Home from "./pages/home/page";
import TennisPage, { loader as TennisLoader } from "./pages/tennis/page";
import TennisErrorPage from "./pages/tennis/error";
import { loader as updateLoader } from "./pages/tennis/children/updatepage";
import Updatepage from "./pages/tennis/children/updatepage";
import { ActionCreateTennis, ActionTennisDelete, ActionTennisUpdate } from "./pages/tennis/children/actions";
import UserPage from "./pages/user/page";
import { loader as LocationsLoader } from "./pages/user/page";


const router = createBrowserRouter([
  {
    // el path es la ruta de la página
    path: "/",
    // element es el componente que se renderiza en la ruta
    element: <Home />
  },
  {
    path: "/globe",
    element: <UserPage />,
    loader: LocationsLoader
  },
  {
    path: "/tennis",
    element: <TennisPage />,
    // errorElement es el componente que se renderiza en caso de error (throw new Error())
    errorElement: <TennisErrorPage />,
    loader: TennisLoader,
    // actions son las acciones que se ejecutan en la ruta normalmente es una por ruta
    //en caso de tener subrutas se pueden tener varias acciones
    //mira: https://reactrouter.com/en/main/route/action#handling-multiple-actions-per-route
    action: ActionCreateTennis,
    children: [
      {
        //el path es la ruta de la subpágina al no tener element solo sirve para definir la acción
        path: "delete/:id",
        //action es la acción que se ejecuta en la subpágina
        action: ActionTennisDelete
      },
      {
        // el path es la ruta de la subpágina seria /tennis/update/:id
        path: "update/:id",
        element: <Updatepage />,
        action: ActionTennisUpdate,
        loader: updateLoader
      }
    ]
  }
]);

export default router;
