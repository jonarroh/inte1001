import { inserTennis } from "@t/schema/tennis";

export class TennisActions {
  private baseUrl: string = "http://localhost:3000/tennis";

  async createTenis(newTenni: FormData): Promise<inserTennis | { success: false; error: any }> {
    const tenni: inserTennis = this.extractTennisData(newTenni);
    return this.sendRequest("POST", this.baseUrl, tenni);
  }

  async deleteTennis(id: number): Promise<void> {
    await this.sendRequest("DELETE", `${this.baseUrl}/${id}`);
  }

  async updateTennis(tennis: inserTennis, id: number): Promise<inserTennis | { success: false; error: any }> {
    return this.sendRequest("PUT", `${this.baseUrl}/${id}`, tennis);
  }

  private extractTennisData(formData: FormData): inserTennis {
    return {
      marca: formData.get("marca") as string,
      modelo: formData.get("modelo") as string,
      precio: Number(formData.get("precio")),
    };
  }

  private async sendRequest(method: string, url: string, body?: any): Promise<any> {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData, "errorData");
        if(errorData.error){
          return { success: false, error: errorData.error };
        }
        return { success: false, error: errorData };
      }

      const data = await response.json();
      return data;

    } catch (error) {
      return {
        success: false,
        error: {
          message: "Network error",
          details: error,
        },
      };
    }
  }
}
