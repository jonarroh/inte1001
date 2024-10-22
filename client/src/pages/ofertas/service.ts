
  import { sendRequest } from "../../lib/sendRequest";
  import { inserOfertas } from "@server/schema/ofertas";

  export class OfertasService {
    private baseUrl: string = "http://localhost:3000/ofertas";

    async createOfertas(newOfertas: FormData): Promise<inserOfertas | { success: false; error: any }
    > {
      const ofertas: inserOfertas = this.extractOfertasData(newOfertas);
      return sendRequest("POST", this.baseUrl, ofertas);
    }
    
    async deleteOfertas(id: number): Promise<void> {
      await sendRequest("DELETE", `${this.baseUrl}/${id}`);
    }

    async updateOfertas(ofertas: inserOfertas, id: number): Promise<inserOfertas | { success: false; error: any }
    > {
      return sendRequest("PUT", `${this.baseUrl}/${id}`, ofertas);
    }

    private extractOfertasData(formData: FormData): inserOfertas {
      return {
        //poner los campos de la entidad
      };
    }
  }