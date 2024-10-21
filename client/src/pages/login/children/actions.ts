
  import { ActionFunction, redirect } from "react-router-dom";
 import { useNavigate } from "react-router-dom";

  export const ActionLogin: ActionFunction = async ({ params,request }) => {
    const formData = await request.formData();
    console.log({ formData });
    const BASE_URL = "https://localhost:7268/Account/login";
    console.log(Object.fromEntries(formData));
    const response = await fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    if (response.ok) {
      console.log(response);
    }

    else {
      console.log(response);
    }


    return redirect("/");
  }

