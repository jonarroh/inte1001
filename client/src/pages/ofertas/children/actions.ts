import { desc } from "drizzle-orm";
import { ActionFunction, redirect } from "react-router-dom";
import { sendLog } from "@utils/sendlog";

export const ActionOfertasDelete: ActionFunction = async ({ params }) => {
  console.log(params);

  const id = params.id as string;

  console.log(id);

  const deleteOferta = await fetch(`https://localhost:7268/api/Promociones/deletePromocion/${id}`, {
    method: "PUT",
  }).then((res) => res.json()).then(async (data) => {
    // console.log(data);
    await sendLog(`Promoción eliminada: ${data.nombre}`, "info", "Ofertas", "CRM");
  }).catch(async (error) => {
    // console.log(error);
    await sendLog(`Error en la solicitud deletePromocion: ${error.message}`, "error", "Ofertas", "CRM");
  });

  return redirect("/ofertas");
}

export const ActionOfertasUpdate: ActionFunction = async ({ request }) => {
  // console.log({ request });
  // console.log('update');

  const formData = await request.formData();

  const formFields = {
    id: Number(formData.get("id")),
    nombre: String(formData.get("nombre")),
    descripcion: String(formData.get("descripcion")),
    fechainicio: String(formData.get("fechainicio")),
    fechafin: String(formData.get("fechafin")),
    descuento: Number(formData.get("descuento")),
    badgepromoid: Number(formData.get("badgepromoid")),
    limitecanje: Number(formData.get("limitecanje")),
    productos: String(formData.get("productos")),
  };

  // Validar que los campos no estén vacíos
  if (!formFields.id || !formFields.nombre || !formFields.descripcion || !formFields.fechainicio || !formFields.fechafin || !formFields.descuento || !formFields.badgepromoid || !formFields.limitecanje || !formFields.productos) {
    alert("Todos los campos son requeridos");
    return redirect("/ofertas");
  }

  // console.log(formFields);

  const data = {
    id: formFields.id,
    nombre: formFields.nombre,
    descripcion: formFields.descripcion,
    fechaInicio: formFields.fechainicio,
    fechaFin: formFields.fechafin,
    productos: formFields.productos,
    descuento: formFields.descuento,
    estado: 1,
    badgePromoId: formFields.badgepromoid,
    limiteCanje: formFields.limitecanje,
  }

  // console.log(data);

  const updateOferta = await fetch(`https://localhost:7268/api/Promociones/updatePromocion/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json()).then(async (data) => {
    // console.log(data);
    await sendLog(`Promoción actualizada: ${data.nombre}`, "info", "Ofertas", "CRM");
  }).catch(async (error) => {
    // console.log(error);
    await sendLog(`Error en la solicitud updatePromocion: ${error.message}`, "error" , "Ofertas", "CRM");
  });

  return redirect("/ofertas");
}

export const ActionOfertasCreate: ActionFunction = async ({ request }) => {
  // console.log({ request });
  // console.log('create');

  const formData = await request.formData();

  const formFields = {
    nombre: String(formData.get("nombre")),
    descripcion: String(formData.get("descripcion")),
    fechainicio: String(formData.get("fechainicio")),
    fechafin: String(formData.get("fechafin")),
    descuento: Number(formData.get("descuento")),
    badgepromoid: Number(formData.get("badgepromoid")),
    limitecanje: Number(formData.get("limitecanje")),
    productos: String(formData.get("productos")),
  }

  // console.log(formFields);

  const data = {
    nombre: formFields.nombre,
    descripcion: formFields.descripcion,
    fechaInicio: formFields.fechainicio,
    fechaFin: formFields.fechafin,
    productos: formFields.productos,
    descuento: formFields.descuento,
    estado: 1,
    badgePromoId: formFields.badgepromoid,
    limiteCanje: formFields.limitecanje,
  }

  // console.log(data);

  const addOferta = await fetch("https://localhost:7268/api/Promociones/addPromocion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json()).then(async (data) => {
    // console.log(data);
    await sendLog(`Promoción creada: ${data.nombre}`, "info", "Ofertas", "CRM");
  }).catch(async (error) => {
      // console.log(error);
      await sendLog(`Error en la solicitud addPromocion: ${error.message}`, "error", "Ofertas", "CRM");
    });

  return redirect("/ofertas");
};
