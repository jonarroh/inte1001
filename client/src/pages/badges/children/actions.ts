
  import { ActionFunction, json, Navigate, redirect } from "react-router-dom";
import { BadgesService } from "../service";
import { z } from "zod";

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
  