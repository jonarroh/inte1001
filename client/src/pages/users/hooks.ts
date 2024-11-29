
  import { useState, useEffect } from "react";

  export function useUsers() {
    const [userss, setUserss] = useState([]);

    useEffect(() => {
      //llamar a la api para obtener los datos
    }, []);

    return { userss };
  }