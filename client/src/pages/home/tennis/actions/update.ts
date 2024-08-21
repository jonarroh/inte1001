import { ActionFunction, json, redirect } from "react-router-dom";
import { TennisService } from "../service";
import { inserTennis } from "@server/schema/tennis";

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