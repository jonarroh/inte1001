
  import { useState, useEffect } from "react";

  export function useBadges() {
    const [badgess, setBadgess] = useState([]);

    useEffect(() => {
      //llamar a la api para obtener los datos
    }, []);

    return { badgess };
  }