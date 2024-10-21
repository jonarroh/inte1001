
import { ActionFunction, json, Navigate, redirect } from "react-router-dom";
import { BadgesService } from "../service";
import { z } from "zod";
import { insertBadge } from "@server/schema/badge";

const badgeSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "El nombre es obligatorio" }),
  requiredPoint: z
    .number({ invalid_type_error: "Debe ser un número" })
    .min(1, { message: "Los puntos requeridos deben ser al menos 1" }),
  message: z.string().min(1, { message: "La descripción es obligatoria" }),
  picture: z.string().min(1, { message: "La imagen es obligatoria" }),
});


  export const ActionBadgesDelete: ActionFunction = async ({ params }) => {
    console.log(params);
    return redirect("/badges");
  }

  export const ActionBadgesUpdate: ActionFunction = async ({ request }) => {
    console.log({ request });

    const formData = await request.formData();
    
    const updatedBadge : insertBadge  = {
      id: Number(formData.get("id")),
      name: formData.get("name") as string,
      pointsRequired: Number(formData.get("requiredPoint")) as number,
      description: formData.get("message") as string,
      // picture: formData.get("picture") as string,
    }

    const id = Number(formData.get("id"));
    const service = new BadgesService();
    const result = await service.updateBadges(updatedBadge, id);

    if ('success' in result && !result.success) {
      console.log(result.error, "error");
      return json({ error: result.error }, { status: 400 });
    }

    return redirect("/badges");
  }

  export const ActionBadgesCreate: ActionFunction = async ({ request }) => {
    console.log({ request });
    const formData = await request.formData();
    // Extraer los datos del formulario
  const formFields = {
    name: formData.get("name"),
    requiredPoint: Number(formData.get("requiredPoint")),
    message: formData.get("message"),
    picture: formData.get("picture"),
  };

  console.log(typeof formFields.picture);

  const validation = badgeSchema.safeParse(formFields);

  if (!validation.success) {
    // Si hay errores, devuelve el objeto de errores a la interfaz
    const errors = validation.error.format();
    return json({ errors }, { status: 400 });
  }

  const service = new BadgesService();
  await service.createBadges(formData);
  return window.location.reload();
  };
  