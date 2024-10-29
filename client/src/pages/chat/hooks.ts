
  import { useState, useEffect } from "react";

  export function useChat() {
    const [chats, setChats] = useState([]);

    useEffect(() => {
      //llamar a la api para obtener los datos
    }, []);

    return { chats };
  }