import { ActionFunction, redirect } from "react-router-dom";
import { sendLog } from "@utils/sendlog";

export const ActionLogin: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  const BASE_URL = "https://localhost:7268/Account/login";

  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*"
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    console.log("Login successful", response);
    

    const data = await response.json();
    const jwtToken = data.jwtToken;
    localStorage.setItem("token", jwtToken);

    // Función para decodificar el JWT y obtener el ID de usuario
    function parseJwt(token:string) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    }

    const decodedToken = parseJwt(jwtToken);
    const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    await sendLog(`Inicio de sesión exitoso: IdUser - ${userId}`, "info", "Login", "CRM");

    // Realiza la petición para obtener los datos del usuario
    try {
      const userResponse = await fetch(`https://localhost:7268/api/Users/${userId}`, {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Datos del usuario guardados en localStorage:', userData);

        if (userData.role === 'Admin') {
          return redirect("/badges");
        }

      } else {
        console.log("Error al obtener los datos del usuario", userResponse);
        return {
          error: "Error al obtener los datos del usuario",
        }
      }
    } catch (error) {
      console.log("Error al obtener los datos del usuario", error);
      return {
        error: "Error al obtener los datos del usuario",
      }
    }

    return {
      error: "Error al obtener los datos del usuario",
      
    }
  } else {
    console.log("Login failed");
    await sendLog(`Inicio de sesión fallido: ${response.statusText}`, "error", "Login", "CRM");
    return response;
  }
};
