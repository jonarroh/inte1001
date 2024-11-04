
  import { sendRequest } from "../../lib/sendRequest";
  import { inserEmails } from "@server/schema/emails";

  export class EmailsService {
    private baseUrl: string = "http://localhost:3000/emails";

    async createEmails(newEmails: FormData): Promise<inserEmails | { success: false; error: any }
    > {
      const emails: inserEmails = this.extractEmailsData(newEmails);
      return sendRequest("POST", this.baseUrl, emails);
    }
    
    async deleteEmails(id: number): Promise<void> {
      await sendRequest("DELETE", `${this.baseUrl}/${id}`);
    }

    async updateEmails(emails: inserEmails, id: number): Promise<inserEmails | { success: false; error: any }
    > {
      return sendRequest("PUT", `${this.baseUrl}/${id}`, emails);
    }

    private extractEmailsData(formData: FormData): inserEmails {
      return {
        //poner los campos de la entidad
      };
    }
  }