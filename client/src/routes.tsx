import { createBrowserRouter, redirect } from "react-router-dom";
import TennisPage from "./pages/tennis/page";
import TennisErrorPage from "./pages/tennis/error";
import { loader as updateLoader } from "./pages/tennis/children/updatepage";
import Updatepage from "./pages/tennis/children/updatepage";
import {
  ActionCreateTennis,
  ActionTennisDelete,
  ActionTennisUpdate,
} from "./pages/tennis/children/actions";
import UserPage from "./pages/user/page";
import { loader as LocationsLoader } from "./pages/user/page";
import LoginPage from "./pages/login/page";
import BadgesPage, { loader as BadgesLoader } from "./pages/badges/page";
import OfertasPage, { loader as OfertasLoader } from "./pages/ofertas/page";
import {
  ActionBadgesCreate,
  ActionBadgesDelete,
  ActionBadgesUpdate,
} from "./pages/badges/children/actions";
import { ActionLogin } from "./pages/login/children/actions";
import {
  ActionOfertasCreate,
  ActionOfertasDelete,
  ActionOfertasUpdate,
} from "./pages/ofertas/children/actions";
import CreateBadgePage from "./pages/badges/children/create";
import UpdateBadgePage, {
  loaderUpdateBadge,
} from "./pages/badges/children/update";
import CreateOfferPage, {
  loader as loaderOfferPage,
} from "./pages/ofertas/children/create";
import UpdateOfferPage, {
  loaderUpdateOffer,
} from "./pages/ofertas/children/update";
import ChatPage, { ChatLoader } from "./pages/chat/page";
import EmailsPage, { userData } from "./pages/emails/page";
import { ActionEmailsCreate } from "./pages/emails/children/actions";
import CreatePersonOfferPage, { loader as loaderPersonPage } from "./pages/personalizadas/children/create";
import PersonalizadasPage, { loader as PersonalizadasLoader } from "./pages/personalizadas/page";
import { ActionPersonalizadasCreate, ActionPersonalizadasUpdate, ActionPersonalizadasDelete } from "./pages/personalizadas/children/actions";
import UpdateOfferPersonalPage, { loaderUpdateOfferPersonal } from "./pages/personalizadas/children/update";

const router = createBrowserRouter([
  {
    // el path es la ruta de la página
    path: "/",
    // element es el componente que se renderiza en la ruta
    element: <LoginPage />,
    action: ActionLogin,
    loader: () => {
      const token = localStorage.getItem("token");
      if (token) return redirect("/badges");
      return null;
    },
  },
  {
    path: "/badges",
    element: <BadgesPage />,
    loader: BadgesLoader,
    action: ActionBadgesCreate,
    children: [
      {
        path: "create",
        element: <CreateBadgePage />,
      },
      {
        path: "delete/:id",
        action: ActionBadgesDelete,
      },
      {
        path: "update/:id",
        action: ActionBadgesUpdate,
        loader: loaderUpdateBadge,
        element: <UpdateBadgePage />,
      },
    ],
  },
  {
    path: "/stats",
    element: <UserPage />,
    loader: LocationsLoader,
  },
  {
    path: "/ofertas",
    element: <OfertasPage />,
    loader: OfertasLoader,
    action: ActionOfertasCreate,
    children: [
      {
        path: "delete/:id",
        action: ActionOfertasDelete,
      },
      {
        path: "update/:id",
        action: ActionOfertasUpdate,
        loader: loaderUpdateOffer,
        element: <UpdateOfferPage />,
      },
      {
        path: "create",
        loader: loaderOfferPage,
        element: <CreateOfferPage />,
      },
    ],
  },
  {
    path: "/personalizadas",
    element: <PersonalizadasPage />,
    loader: PersonalizadasLoader,
    action: ActionPersonalizadasCreate,
    children: [
      {
        path: "create",
        loader: loaderPersonPage,
        element: <CreatePersonOfferPage />,
      }, {
        path: "update/:id",
        action: ActionPersonalizadasUpdate,
        loader: loaderUpdateOfferPersonal,
        element: <UpdateOfferPersonalPage />,
      }, {
        path: "delete/:id",
        action: ActionPersonalizadasDelete,
      }
    ]
  },
  {
    path: "/auth",
    loader: () => {
      const token = localStorage.getItem("token");
      if (!token) return redirect("/");
      return null;
    },
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
        action: ActionTennisDelete,
      },
      {
        // el path es la ruta de la subpágina seria /tennis/update/:id
        path: "update/:id",
        element: <Updatepage />,
        action: ActionTennisUpdate,
        loader: updateLoader,
      },
    ],
  },
  {
    path: "/chat",
    element: <ChatPage />,
    loader: ChatLoader,
  },
  {
    path: "/emails",
    element: <EmailsPage />,
    action: ActionEmailsCreate,
    loader: userData
  }
]);

export default router;
