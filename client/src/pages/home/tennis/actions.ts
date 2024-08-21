import { inserTennis } from "@t/schema/tennis";


export class TennisActions {
  
  async createTenis(newTenni: FormData): Promise<inserTennis | { success: false; error: any }> {
    const tenni: inserTennis = {
      marca: newTenni.get("marca") as string,
      modelo: newTenni.get("modelo") as string,
      precio: Number(newTenni.get("precio")),
    };
  
    try {
      const response = await fetch("http://localhost:3000/tennis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tenni),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Parseamos la respuesta con el error
        console.log(errorData, "errorData");
        return { success: false, error: errorData };
      }
  
      const data: inserTennis = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Error al crear el tenis",
          details: error,
        },
      };
    }
  }

  async deleteTennis(id: number): Promise<void> {
    const response = await fetch(`http://localhost:3000/tennis/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  }

  async updateTennis(tennis: inserTennis, id: number): Promise<inserTennis | { success: false; error: any }> {
    const response = await fetch(`http://localhost:3000/tennis/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tennis),
    });
    if (!response.ok) {
      const errorData = await response.json(); // Parseamos la respuesta con el error
      console.log(errorData, "errorData");
        return { success: false, error: errorData.error };
    }
    const data: inserTennis = await response.json();

    if(data === null){
      return {
        success: false,
        error: {
          message: "Error al actualizar el tenis",
        },
      };
    }

    return data;
  }

  
  

}