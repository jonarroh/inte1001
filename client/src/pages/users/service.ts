
  import { sendRequest } from "../../lib/sendRequest";
  import { inserUsers } from "@server/schema/users";

  export class UsersService {
    private baseUrl: string = "http://191.101.1.86:3000/users";

    async createUsers(newUsers: FormData): Promise<inserUsers | { success: false; error: any }
    > {
      const users: inserUsers = this.extractUsersData(newUsers);
      return sendRequest("POST", this.baseUrl, users);
    }
    
    async deleteUsers(id: number): Promise<void> {
      await sendRequest("DELETE", `${this.baseUrl}/${id}`);
    }

    async updateUsers(users: inserUsers, id: number): Promise<inserUsers | { success: false; error: any }
    > {
      return sendRequest("PUT", `${this.baseUrl}/${id}`, users);
    }

    private extractUsersData(formData: FormData): inserUsers {
      return {
        //poner los campos de la entidad
      };
    }
  }