import { ActionFunction, redirect } from "react-router-dom";
import { TennisService } from "../service";

export const ActionTennisDelete: ActionFunction = async ({ params }) => {
  const id = Number(params.id);
  const actions = new TennisService();
  await actions.deleteTennis(id);
  return redirect("/tennis");
}