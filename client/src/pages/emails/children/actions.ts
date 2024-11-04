
  import { ActionFunction, redirect } from "react-router-dom";

  
  export const ActionEmailsCreate: ActionFunction = async ({ request }) => {
    console.log("ActionEmailsCreate");
    console.log(await request.formData());
    return redirect("/emails");
  };
  