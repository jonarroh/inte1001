import { Form, useActionData, useLoaderData, useNavigation, Outlet } from "react-router-dom";
import { useTennisLogic } from "./hook";
import { selectTennis } from "@server/schema/tennis";
import { Suspense } from "react";



export async function loader() {
  const response = await fetch("http://localhost:3000/tennis");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: selectTennis[] = await response.json();
  return data;
}

function TennisPage() {
  const data = useLoaderData() as selectTennis[];
  const navigation = useNavigation();
  const errorsAction = useActionData() as { issues: { path: string; message: string }[] };
  const isLoading = navigation.state === "loading";
  
  const {
    handleDelete,
    onClickEdit,
  } = useTennisLogic();
  
  return (
    <main>
      <h1>Tennis</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {isLoading && <p style={{ fontSize: "5em" }}>Loading...</p>}
        
        {data.map((item) => (
          <div key={item.id}>
            <h2>{item.modelo}</h2>
            <p>{item.marca}</p>
            <span id={String(item.id)}>
              <button onClick={() => onClickEdit(item.id)}>Edit</button>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </span>
          </div>
        ))}
        
        <section>
          <Form action="/tennis" method="post" noValidate>
            <label>
              Modelo:
              <input
                type="text"
                name="modelo"
                required
              />  
              {errorsAction?.issues?.find(issue => issue.path.includes("modelo")) && (
                <div style={{ color: "red" }}>
                  {errorsAction.issues.find(issue => issue.path.includes("modelo"))?.message}
                </div>
              )}
            </label>

            <label>
              Marca:
              <input
                type="text"
                name="marca"
                required
              />
              {errorsAction?.issues?.find(issue => issue.path.includes("marca")) && (
                <div style={{ color: "red" }}>
                  {errorsAction.issues.find(issue => issue.path.includes("marca"))?.message}
                </div>
              )}
            </label>

            <label>
              Precio:
              <input
                type="number"
                name="precio"
                required
              />
              {errorsAction?.issues?.find(issue => issue.path.includes("precio")) && (
                <div style={{ color: "red" }}>
                  {errorsAction.issues.find(issue => issue.path.includes("precio"))?.message}
                </div>
              )}
            </label>
            <button type="submit" name="intent" value="add">Add</button>
          </Form>
        </section>
      </Suspense>
      <Outlet />
    </main>
  );
}

export default TennisPage;
