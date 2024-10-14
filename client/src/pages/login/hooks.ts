
  import { useState, useEffect } from "react";

  export function useLogin() {
    const [logins, setLogins] = useState([]);

    useEffect(() => {
      //llamar a la api para obtener los datos
    }, []);

    return { logins };
  }