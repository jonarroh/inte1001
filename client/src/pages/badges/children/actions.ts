
  import { ActionFunction, json, redirect } from "react-router-dom";

  export const ActionBadgesDelete: ActionFunction = async ({ params }) => {
    return redirect("/badges");
  }

  export const ActionBadgesUpdate: ActionFunction = async ({ request }) => {
    return redirect("/badges");
  }

  export const ActionBadgesCreate: ActionFunction = async ({ request }) => {
    return redirect("/badges");
  };
  