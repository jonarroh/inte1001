import { sendRequest } from "../../lib/sendRequest";
import { inserTennis } from "@server/schema/tennis";

/*
por cada page que tenga un servicio, se debe crear un archivo service.ts en la carpeta de la page
este archivo solo tendra peticiones de mutación(POST, PUT, DELETE) y no de consulta(GET)
las peticiones de consulta se haran el page directamente
*/
export class TennisService {
  private baseUrl: string = "http://localhost:3000/tennis";

  async createTenis(newTenni: FormData): Promise<inserTennis | { success: false; error: any }> {
    const tenni: inserTennis = this.extractTennisData(newTenni);
    //sendRequest es una función que se encarga de hacer la petición a la API
    //directamente como el servidor espera las peticiones
    return sendRequest("POST", this.baseUrl, tenni);
  }

  async deleteTennis(id: number): Promise<void> {
    await sendRequest("DELETE", `${this.baseUrl}/${id}`);
  }

  async updateTennis(tennis: inserTennis, id: number): Promise<inserTennis | { success: false; error: any }> {
    return sendRequest("PUT", `${this.baseUrl}/${id}`, tennis);
  }

  private extractTennisData(formData: FormData): inserTennis {
    return {
      marca: formData.get("marca") as string,
      modelo: formData.get("modelo") as string,
      precio: Number(formData.get("precio")),
    };
  }

}
