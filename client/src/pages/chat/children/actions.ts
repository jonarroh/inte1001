
  import { ActionFunction, json, redirect } from "react-router-dom";

  export const ActionChatDelete: ActionFunction = async ({ params }) => {
    return redirect("/chat");
  }

  export const ActionChatUpdate: ActionFunction = async ({ request }) => {
    return redirect("/chat");
  }

  export const ActionChatCreate: ActionFunction = async ({ request }) => {
    return redirect("/chat");
  };
  