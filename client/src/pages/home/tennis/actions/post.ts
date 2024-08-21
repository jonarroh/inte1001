import { ActionFunction, redirect } from "react-router-dom";
import { TennisService } from "../service";

export const ActionCreateTennis: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actions = new TennisService();
  const result = await actions.createTenis(formData);
  
  if ('success' in result && !result.success) {
    console.log(result.error);
    return result.error.error;
  }
  console.log(result);
  return redirect("/tennis");
};
