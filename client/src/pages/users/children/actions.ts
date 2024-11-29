
  import { ActionFunction, json, redirect } from "react-router-dom";

  export const ActionUsersDelete: ActionFunction = async ({ params }) => {
    return redirect("/users");
  }

  export const ActionUsersUpdate: ActionFunction = async ({ request }) => {
    return redirect("/users");
  }

  export const ActionUsersCreate: ActionFunction = async ({ request }) => {
    return redirect("/users");
  };
  