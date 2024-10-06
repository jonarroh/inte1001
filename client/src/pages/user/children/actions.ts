
  import { ActionFunction, json, redirect } from "react-router-dom";

  export const ActionUserDelete: ActionFunction = async ({ params }) => {
    return redirect("/user");
  }

  export const ActionUserUpdate: ActionFunction = async ({ request }) => {
    return redirect("/user");
  }

  export const ActionUserCreate: ActionFunction = async ({ request }) => {
    return redirect("/user");
  };
  