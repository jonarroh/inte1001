
import { sendLog } from "@utils/sendlog";
import { ActionFunction, json, redirect } from "react-router-dom";

export const ActionPersonalizadasDelete: ActionFunction = async ({ params }) => {
  const id = params.id;

  const deleteOferta = await fetch(`http://191.101.1.86:5275/api/PromocionesPersonalizadas/deletePromocion/${id}`, {
    method: "PUT",
  }).then((res) => res.json()).then(async (data) => {
    // console.log(data);
    alert("Promoción eliminada");
    await sendLog(`Promoción eliminada: ${data.nombre}`, "info", "Ofertas", "CRM");
  }).catch(async (error) => {
    console.log(error);
    alert("Error al eliminar promoción");
    await sendLog(`Error en la solicitud deletePromocion: ${error.message}`, "error", "Ofertas", "CRM");
  });

  return redirect("/personalizadas");
}

export const ActionPersonalizadasUpdate: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const formFields = {
    id: Number(formData.get("id")),
    nombre: String(formData.get("nombre")),
    descripcion: String(formData.get("descripcion")),
    fechainicio: String(formData.get("fechainicio")),
    fechafin: String(formData.get("fechafin")),
    descuento: Number(formData.get("descuento")),
    badgepromoid: Number(formData.get("badgepromoid")),
    productoId: Number(formData.get("productoId")),
    limitecanje: Number(formData.get("limitecanje")),
    motivo: String(formData.get("motivo")),
    userId: 4
  }

  const data = {
    id: formFields.id,
    nombre: formFields.nombre,
    descripcion: formFields.descripcion,
    fechaInicio: formFields.fechainicio,
    fechaFin: formFields.fechafin,
    descuento: formFields.descuento,
    estatus: 1,
    productoId: formFields.productoId ?? 0,
    badgePromoId: formFields.badgepromoid ?? 0,
    limiteCanje: formFields.limitecanje,
    motivo: formFields.motivo ?? "",
    userId: user.id,
  }

  const updateOffer = await fetch(`http://191.101.1.86:5275/api/PromocionesPersonalizadas/updatePromocion/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json()).then(async (data) => {
    // console.log(data);
    alert("Promoción actualizada");
    await sendLog(`Promoción actualizada: ${data.nombre}`, "info", "Ofertas", "CRM");
  }).catch(async (error) => {
    // console.log(error);
    alert("Error al actualizar promoción");
    await sendLog(`Error en la solicitud updatePromocion: ${error.message}`, "error", "Ofertas", "CRM");

  });

  return redirect("/personalizadas");
}

export const ActionPersonalizadasCreate: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const formFields = {
    nombre: String(formData.get("nombre")),
    descripcion: String(formData.get("descripcion")),
    fechainicio: String(formData.get("fechainicio")),
    fechafin: String(formData.get("fechafin")),
    descuento: Number(formData.get("descuento")),
    badgepromoid: Number(formData.get("badgepromoid")),
    productoId: Number(formData.get("productoId")),
    limitecanje: Number(formData.get("limitecanje")),
    motivo: String(formData.get("motivo")),
    userId: 4
  }

  const data = {
    nombre: formFields.nombre,
    descripcion: formFields.descripcion,
    fechaInicio: formFields.fechainicio,
    fechaFin: formFields.fechafin,
    descuento: formFields.descuento,
    estatus: 1,
    productoId: formFields.productoId,
    badgePromoId: formFields.badgepromoid,
    limiteCanje: formFields.limitecanje,
    motivo: formFields.motivo,
    userId: user.id,
  }

  console.log(data);

  const addOferta = await fetch(`http://191.101.1.86:5275/api/PromocionesPersonalizadas/addPromocionPersonalizada`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json()).then(async (data) => {
    // console.log(data);
    // alert("Promoción creada");
    await sendLog(`Promoción creada: ${data.nombre}`, "info", "Ofertas", "CRM");
  }).catch(async (error) => {
    // console.log(error);
    // alert("Error al crear promoción");
    await sendLog(`Error en la solicitud addPromocion: ${error.message}`, "error", "Ofertas", "CRM");
  });

  return redirect("/personalizadas");
};
