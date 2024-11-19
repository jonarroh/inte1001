
  import { useState, useEffect } from "react";

  export function usePersonalizadas() {
    const [personalizadass, setPersonalizadass] = useState([]);

    useEffect(() => {
      //llamar a la api para obtener los datos
    }, []);

    return { personalizadass };
  }