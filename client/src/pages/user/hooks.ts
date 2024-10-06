
  import { useState, useEffect } from "react";

  export function useUser() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
      //llamar a la api para obtener los datos
    }, []);

    return { users };
  }