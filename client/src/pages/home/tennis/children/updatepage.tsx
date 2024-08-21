import { selectTennis } from "@server/schema/tennis";
import { Form, LoaderFunctionArgs, redirect, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  if (!id) {
    return redirect("/tennis");
  }

  const response = await fetch(`http://localhost:3000/tennis/${id}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data: selectTennis = await response.json();
  return data;
}

function Updatepage() {
  const loadedData = useLoaderData() as selectTennis;

  const [data, setData] = useState<selectTennis | null>(null);

  useEffect(() => {
    console.log(loadedData, "loadedData");
    setData(loadedData);
  }, [loadedData]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => prevData ? {
      ...prevData,
      [name]: value,
    } : null);
  };

  return (
    <main>
      <h1>Edit Tennis {data.modelo}</h1>
      <Form action={`/tennis/update/${data.id}`} method="post">
        <label htmlFor="marca">Marca</label>
        <input
          type="text"
          name="marca"
          value={data.marca}
          onChange={handleInputChange}
        />
        
        <label htmlFor="modelo">Modelo</label>
        <input
          type="text"
          name="modelo"
          value={data.modelo}
          onChange={handleInputChange} // Agregar el onChange handler
        />
        
        <label htmlFor="precio">Precio</label>
        <input
          type="number"
          name="precio"
          value={data.precio}
          onChange={handleInputChange} // Agregar el onChange handler
        />
        
        <input type="hidden" name="id" value={data.id} />
        <button type="submit">Update</button>
      </Form>
    </main>
  );
}

export default Updatepage;
