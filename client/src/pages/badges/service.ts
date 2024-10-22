
  import { sendForm, sendRequest } from "../../lib/sendRequest";
  import { insertBadge } from "@server/schema/badge";

  export class BadgesService {
    private baseUrl: string = "http://localhost:3000/badge";

    async createBadges(newBadges: insertBadge): Promise<insertBadge | { success: false; error: any }
    > {
      
      return sendRequest("POST", this.baseUrl, newBadges);
    }
    
    async deleteBadges(id: number): Promise<void> {
      await sendRequest("DELETE", `${this.baseUrl}/${id}`);
    }

    // async updateBadges(badges: insertBadge, id: number): Promise<insertBadge | { success: false; error: any }
    // > {
    //   console.log({ badges });
    //   return sendRequest("PUT", `${this.baseUrl}/${id}`, badges);
    // }

    async updateBadges(badges: FormData, id: number): Promise<insertBadge | { success: false; error: any }> {        
      return sendForm("PUT", `${this.baseUrl}/${id}`, badges);
    }
    
    

    private extractBadgesData(formData: FormData): insertBadge {
      return {
        name: formData.get("name") as string,
        description: formData.get("message") as string,
        pointsRequired: parseInt(formData.get("pointsRequired") as string),
      };
    }
  }