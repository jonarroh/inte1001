
  import { ActionFunction, json, redirect } from "react-router-dom";

  export const ActionEmailsDelete: ActionFunction = async ({ params }) => {
    return redirect("/emails");
  }

  export const ActionEmailsUpdate: ActionFunction = async ({ request }) => {
    return redirect("/emails");
  }

  export const ActionEmailsCreate: ActionFunction = async ({ request }) => {
    return redirect("/emails");
  };
  