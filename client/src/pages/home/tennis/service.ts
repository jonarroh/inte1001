import { sendRequest } from "../../../lib/sendRequest";
import { inserTennis } from "@server/schema/tennis";

export class TennisService {
  private baseUrl: string = "http://localhost:3000/tennis";

  async createTenis(newTenni: FormData): Promise<inserTennis | { success: false; error: any }> {
    const tenni: inserTennis = this.extractTennisData(newTenni);
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
