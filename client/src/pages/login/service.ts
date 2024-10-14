
  import { z } from "zod";
import { sendRequest } from "../../lib/sendRequest";

  const LoginSchema = z.object({
    email: z.string().email({
      message: "Ingrese un correo válido",
    }),
    password: z.string().min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    }),
  });

  export interface inserLogin {
    email: string;
    password: string;
  }

  

  export class LoginService {
    private baseUrl: string = "https://localhost:7268/Account/login";

    async login(newLogin: FormData): Promise<inserLogin | { success: false; error: any }
    > {
      const login: inserLogin = this.extractLoginData(newLogin);
      return sendRequest("POST", this.baseUrl, login);
    }
    
    

    private extractLoginData(formData: FormData): inserLogin {
      return {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };
    }
  }