import { ActionFunction, json, redirect } from "react-router-dom";
import { TennisService } from "../service";
import { type inserTennis } from "@server/schema/tennis";

export const ActionTennisDelete: ActionFunction = async ({ params }) => {
  const id = Number(params.id);
  const actions = new TennisService();
  await actions.deleteTennis(id);
  return redirect("/tennis");
}

export const ActionTennisUpdate: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const updatedTennis: inserTennis = {
    marca: formData.get("marca") as string,
    modelo: formData.get("modelo") as string,
    precio: Number(formData.get("precio")),
    id: Number(formData.get("id")),

  }

  const id = Number(formData.get("id"));
  const actions = new TennisService();
  const result = await actions.updateTennis(updatedTennis, id);

  if ('success' in result && !result.success) {
    console.log(result.error, "error");
    return json({ error: result.error }, { status: 400 });
  }

  return redirect("/tennis");

}

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
