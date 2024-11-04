
  import { useState, useEffect } from "react";

  export function useEmails() {
    const [emailss, setEmailss] = useState([]);

    useEffect(() => {
      //llamar a la api para obtener los datos
    }, []);

    return { emailss };
  }