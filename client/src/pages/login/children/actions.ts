
  import { ActionFunction, json, redirect } from "react-router-dom";

  export const ActionLogin: ActionFunction = async ({ params }) => {
    return redirect("/login");
  }

