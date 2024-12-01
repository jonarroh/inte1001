
  import { sendRequest } from "../../lib/sendRequest";
  import { inserChat } from "@server/schema/chat";

  export class ChatService {
    private baseUrl: string = "http://191.101.1.86:3000/chat";

    async createChat(newChat: FormData): Promise<inserChat | { success: false; error: any }
    > {
      const chat: inserChat = this.extractChatData(newChat);
      return sendRequest("POST", this.baseUrl, chat);
    }
    
    async deleteChat(id: number): Promise<void> {
      await sendRequest("DELETE", `${this.baseUrl}/${id}`);
    }

    async updateChat(chat: inserChat, id: number): Promise<inserChat | { success: false; error: any }
    > {
      return sendRequest("PUT", `${this.baseUrl}/${id}`, chat);
    }

    private extractChatData(formData: FormData): inserChat {
      return {
        //poner los campos de la entidad
      };
    }
  }