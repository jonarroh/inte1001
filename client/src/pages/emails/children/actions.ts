
  import { ActionFunction, redirect } from "react-router-dom";
  import { sendLog } from "@utils/sendlog";

  
  export const ActionEmailsCreate: ActionFunction = async ({ request }) => {
    console.log("ActionEmailsCreate");
    const formData = await request.formData();
    await sendLog("Email creado", "info", "ActionEmailsCreate", "CRM");
    await fetch("http://191.101.1.86:3000/email/sendToEmail", {
      method: "POST",
      body: JSON.stringify({
        framework:"todos",
        message: formData.get("message"),
      }),
    });
    return redirect("/emails");
  };
  