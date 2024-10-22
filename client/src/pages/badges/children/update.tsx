import { LoaderFunction, useFetcher, useLoaderData } from "react-router-dom";
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
  const fetcher = useFetcher();
  const actionData = fetcher.data as ActionData | null;
  const badge = useLoaderData() as selectBadge;

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 min-h-full flex items-center justify-center p-5">
        <fetcher.Form method="POST">
          <div className="grid grid-cols-6 grid-rows-9 gap-0">
            <div className="col-start-1 col-end-4">
              <Label htmlFor="name">Nombre</Label>
              <Input type="text" id="name" placeholder="Nombre" name="name" defaultValue={badge.name} />
              {actionData?.name && <p className="text-red-500 text-sm">{actionData.name._errors[0]}</p>}
            </div>

            <div className="col-start-1 col-end-4">
              <Label htmlFor="pointsRequired">Puntos requeridos</Label>
              <Input type="number" id="pointsRequired" name="pointsRequired" defaultValue={badge.pointsRequired} />
              {actionData?.pointsRequired && <p className="text-red-500 text-sm">{actionData.pointsRequired._errors[0]}</p>}
            </div>

            <div className="col-start-1 col-end-4">
              <Label htmlFor="message">Descripción</Label>
              <Textarea id="message" name="description" defaultValue={badge?.description ?? ""} />
              {actionData?.description && <p className="text-red-500 text-sm">{actionData.description._errors[0]}</p>}
            </div>

            <div className="col-start-4 col-end-7">
              <Label htmlFor="picture">Imagen</Label>
              <Input id="picture" type="file" name="image" accept="image/jpg, image/jpeg, image/png, image/svg+xml" />
              {actionData?.image && <p className="text-red-500 text-sm">{actionData.image._errors[0]}</p>}
            </div>

            <div className="col-start-1 col-end-4">
              <Button type="submit" variant="edit" disabled={fetcher.state !== "idle"}>
                Actualizar
              </Button>
            </div>

            <div className="col-start-4 col-end-7">
              <Button variant="outline" type="button">
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
