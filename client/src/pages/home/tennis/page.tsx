// TennisPage.tsx
import { ActionFunction, Form, redirect, useActionData, useLoaderData, useNavigation, useRevalidator } from "react-router-dom";
import { useTennisLogic } from "./hook";
import { TennisActions } from "./actions";
import { selectTennis } from "@t/schema/tennis";
import { error } from "elysia";

export const Actions: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actions = new TennisActions();
  
  const result = await actions.createTenis(formData);
  
  if ('success' in result && !result.success) {
    console.log(result.error);
    return result.error.error;
  }
  
  return redirect("/tennis");
};

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
  const revalidator = useRevalidator();
  const errorsAction = useActionData() as { issues: { path: string; message: string }[] };
  const isLoading = navigation.state === "loading";
  
  const {
    selectedItem,
    isEditing,
    handleDelete,
    onClickEdit,
    errors,
    handleEdit,
    handleInputChange,
  } = useTennisLogic();

  console.log(errors)

  return (
    <main>
      <h1>Tennis</h1>
      {isLoading && <p style={{ fontSize: "5em" }}>Loading...</p>}
      
      {data.map((item) => (
        <div key={item.id}>
          <h2>{item.modelo}</h2>
          <p>{item.marca}</p>
          <span>
            <button onClick={() => onClickEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id, revalidator)}>Delete</button>
          </span>
        </div>
      ))}
      
      <section>
        <Form action="/tennis" method="post" noValidate>
          <input type="hidden" name="id" value={selectedItem.id || ""} />
          <label>
            Modelo:
            <input
              type="text"
              name="modelo"
              required
              value={selectedItem.modelo || ""}
              onChange={handleInputChange}
            />
            {errors?.issues?.find(issue => issue.path.includes("modelo")) && (
              <div style={{ color: "red" }}>
                {errors.issues.find(issue => issue.path.includes("modelo"))?.message}
              </div>
            )}
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
              value={selectedItem.marca || ""}
              onChange={handleInputChange}
            />
            {errors?.issues?.find(issue => issue.path.includes("marca")) && (
              <div style={{ color: "red" }}>
                {errors.issues.find(issue => issue.path.includes("marca"))?.message}
              </div>
            )}
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
              value={selectedItem.precio || ""}
              onChange={handleInputChange}
            />
            {errors?.issues?.find(issue => issue.path.includes("precio")) && (
              <div style={{ color: "red" }}>
                {errors.issues.find(issue => issue.path.includes("precio"))?.message}
              </div>
            )}
             {errorsAction?.issues?.find(issue => issue.path.includes("precio")) && (
              <div style={{ color: "red" }}>
                {errorsAction.issues.find(issue => issue.path.includes("precio"))?.message}
              </div>
            )}
          </label>

          {
            isEditing ? (
              <button onClick={() => handleEdit(revalidator)} type="button">Edit</button>
            ) : (
              <button type="submit" name="intent" value="add">Add</button>
            )
          }
        </Form>
      </section>
    </main>
  );
}

export default TennisPage;
