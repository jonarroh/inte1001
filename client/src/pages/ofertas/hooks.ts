
  import { useState, useEffect } from "react";

  export function useOfertas() {
    const [ofertass, setOfertass] = useState([]);

    useEffect(() => {
      //llamar a la api para obtener los datos
    }, []);

    return { ofertass };
  }