
  import { sendRequest } from "../../lib/sendRequest";
  import { inserPersonalizadas } from "@server/schema/personalizadas";

  export class PersonalizadasService {
    private baseUrl: string = "http://localhost:3000/personalizadas";

    async createPersonalizadas(newPersonalizadas: FormData): Promise<inserPersonalizadas | { success: false; error: any }
    > {
      const personalizadas: inserPersonalizadas = this.extractPersonalizadasData(newPersonalizadas);
      return sendRequest("POST", this.baseUrl, personalizadas);
    }
    
    async deletePersonalizadas(id: number): Promise<void> {
      await sendRequest("DELETE", `${this.baseUrl}/${id}`);
    }

    async updatePersonalizadas(personalizadas: inserPersonalizadas, id: number): Promise<inserPersonalizadas | { success: false; error: any }
    > {
      return sendRequest("PUT", `${this.baseUrl}/${id}`, personalizadas);
    }

    private extractPersonalizadasData(formData: FormData): inserPersonalizadas {
      return {
        //poner los campos de la entidad
      };
    }
  }