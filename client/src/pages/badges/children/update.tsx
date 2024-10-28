import { LoaderFunction, useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { selectBadge } from "@server/schema/badge";

type ValidationError = {
  _errors: string[];
};

type ActionData = {
  name: ValidationError;
  pointsRequired: ValidationError;
  description: ValidationError;
  image: ValidationError;
};

export const loaderUpdateBadge: LoaderFunction = async ({ params }) => {
  const id = params.id;
  const response = await fetch(`http://localhost:3000/badge/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data: selectBadge = await response.json();
  return data;
};

const UpdateBadgePage = () => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const actionData = fetcher.data as ActionData | null;
  const badge = useLoaderData() as selectBadge;


  return (
    <div className="space-y-4">
      <div className=" min-h-full flex items-center justify-center p-5">
        <fetcher.Form method="POST" action={`/badges/update/${badge.id}`} encType="multipart/form-data">
          
          <div className="lg:grid lg:gap-x-3 lg:gap-y-2 md:grid-cols-8 md:grid-rows-6 lg:grid-cols-12 lg:grid-rows-5">

            <div className="lg:row-start-1 lg:col-start-11 md:flex md:justify-end ">
              <Button variant="delete" type="button" onClick={() => navigate("/badges")}>
                Cancelar
              </Button>
            </div>

            <div className="lg:row-start-2 lg:col-start-2 lg:col-end-6 md:col-start-2 md:col-end-7">
              <Label htmlFor="name">Nombre</Label>
              <Input type="text" id="name" placeholder="Nombre" name="name" defaultValue={badge.name} />
              {actionData?.name && <p className="text-red-500 text-sm">{actionData.name._errors[0]}</p>}
            </div>

            <div className="lg:row-start-3 lg:col-start-2 lg:col-end-6 md:col-start-2 md:col-end-7">
              <Label htmlFor="pointsRequired">Puntos requeridos</Label>
              <Input type="number" id="pointsRequired" name="pointsRequired" defaultValue={badge.pointsRequired} />
              {actionData?.pointsRequired && <p className="text-red-500 text-sm">{actionData.pointsRequired._errors[0]}</p>}
            </div>

            <div className="lg:mx-3 lg:row-start-2 lg:col-start-6 lg:col-end-11 md:col-start-2 md:col-end-7 md:row-start-4">
              <Label htmlFor="message">Descripción</Label>
              <Textarea id="message" name="description" defaultValue={badge?.description ?? ""} />
              {actionData?.description && <p className="text-red-500 text-sm">{actionData.description._errors[0]}</p>}
            </div>

            <div className="lg:mx-3 lg:row-start-3 lg:col-start-6 lg:col-end-11 md:col-start-2 md:col-end-7 md:row-start-5">
              <Label htmlFor="picture">Imagen</Label>
              <Input id="picture" type="file" name="image" accept="image/jpg, image/jpeg, image/png" />
              {actionData?.image && <p className="text-red-500 text-sm">{actionData.image._errors[0]}</p>}
            </div>

            <div className="lg:row-start-4 lg:flex lg:justify-center lg:col-start-6 lg:mt-3 md:row-start-6 md:col-start-1 md:mt-3 ">
              <Button type="submit" variant="edit" disabled={fetcher.state !== "idle"} size={"lg"} className="md:mx-3">
                Actualizar
              </Button>
              <Button variant="outline" type="button" size={"lg"}>
                Limpiar
              </Button>
            </div>

          </div>
        </fetcher.Form>
      </div>
    </div>
  );
};

export default UpdateBadgePage;
