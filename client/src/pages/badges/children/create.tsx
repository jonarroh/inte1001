import { useFetcher } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type ValidationError = {
  _errors: string[];
};

type ActionData = {
  name: ValidationError;
  requiredPoint: ValidationError;
  description: ValidationError;
  image: ValidationError;
};

const CreateBadgePage = () => {
  const fetcher = useFetcher();
  const actionData = fetcher.data as ActionData | null;

  return (
    <div className="bg-gray-50 min-h-full flex items-center justify-center p-5">
      <fetcher.Form method="POST" action="/badges">
        <div className="grid grid-cols-6 grid-rows-9 gap-0">
          <div className="col-start-1 col-end-4">
            <Label htmlFor="name">Nombre</Label>
            <Input type="text" id="name" placeholder="Nombre" name="name" />
            {actionData?.name && <p className="text-red-500 text-sm">{actionData.name._errors[0]}</p>}
          </div>

          <div className="col-start-1 col-end-4">
            <Label htmlFor="requiredPoint">Puntos requeridos</Label>
            <Input type="number" id="requiredPoint" name="requiredPoint" />
            {actionData?.requiredPoint && <p className="text-red-500 text-sm">{actionData.requiredPoint._errors[0]}</p>}
          </div>

          <div className="col-start-1 col-end-4">
            <Label htmlFor="message">Descripción</Label>
            <Textarea id="message" name="description" />
            {actionData?.description && <p className="text-red-500 text-sm">{actionData.description._errors[0]}</p>}
          </div>

          <div className="col-start-4 col-end-7">
            <Label htmlFor="picture">Imagen</Label>
            <Input id="picture" type="file" name="image" accept="image/jpg, image/jpeg, image/png, image/svg+xml" />
            {actionData?.image && <p className="text-red-500 text-sm">{actionData.image._errors[0]}</p>}
          </div>

          <div className="col-start-1 col-end-4">
            <Button type="submit" variant="create" disabled={fetcher.state !== "idle"}>
              Crear
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
  );
};

export default CreateBadgePage;
