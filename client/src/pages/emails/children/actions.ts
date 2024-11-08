
  import { ActionFunction, redirect } from "react-router-dom";
  import { sendLog } from "@utils/sendlog";

  
  export const ActionEmailsCreate: ActionFunction = async ({ request }) => {
    console.log("ActionEmailsCreate");
    console.log(await request.formData());
    await sendLog("Email creado", "info", "ActionEmailsCreate", "CRM");
    return redirect("/emails");
  };
  