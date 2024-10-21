import {
  createBrowserRouter
} from "react-router-dom";
import TennisPage from "./pages/tennis/page";
import TennisErrorPage from "./pages/tennis/error";
import { loader as updateLoader } from "./pages/tennis/children/updatepage";
import Updatepage from "./pages/tennis/children/updatepage";
import { ActionCreateTennis, ActionTennisDelete, ActionTennisUpdate } from "./pages/tennis/children/actions";
import UserPage from "./pages/user/page";
import { loader as LocationsLoader } from "./pages/user/page";
import LoginPage from "./pages/login/page";
import BadgesPage, { loader as BadgesLoader } from "./pages/badges/page";
import { ActionBadgesCreate, ActionBadgesDelete } from "./pages/badges/children/actions";
import { ActionLogin } from "./pages/login/children/actions";


const router = createBrowserRouter([
  {
    // el path es la ruta de la página
    path: "/",
    // element es el componente que se renderiza en la ruta
    element: <LoginPage />,
    action: ActionLogin
  },
  {
    path: "/badges",
    element: <BadgesPage />,
    loader: BadgesLoader,
    action: ActionBadgesCreate,
    children: [
      {
        path: "delete/:id",
        action: ActionBadgesDelete
      },
      {
        path: "update/:id",
        element: <Updatepage />,
        action: ActionBadgesCreate,
        loader: updateLoader
      }
    ]
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
