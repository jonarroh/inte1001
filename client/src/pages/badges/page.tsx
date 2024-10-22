import DashboardLayout from "@/components/layout/app";
import { Credenza, CredenzaBody, CredenzaClose, CredenzaContent, CredenzaDescription, CredenzaFooter, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "@/components/templates/credenza";
import PageContainer from "@/components/templates/page-container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { insertBadge, selectBadge } from "@server/schema/badge";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Form, LoaderFunction, useFetcher, useLoaderData } from "react-router-dom";


export const loader: LoaderFunction = async () => {
  const response = await fetch('http://localhost:3000/badge');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data: selectBadge[] = await response.json();

  return data;
}


export default function BadgesPage() {
  const data = useLoaderData() as selectBadge[];
  const [search, setSearch] = useState<string>('');
  const [selected, setSelected] = useState<selectBadge | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  // const fetcher = useFetcher();

  const filteredData = data.filter((badge) => {
    return badge.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleUpdateBadge = (badge: selectBadge) => {
    setSelected(badge);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleNewBadge = () => {
    setSelected(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleDeleteBadge = (badge: selectBadge) => {
    setSelected(badge);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selected) {
      console.log(selected.id);
      // fetcher.submit(null, { method: "delete", action: `/badges/delete/${selected.id}` });
    }
    setIsConfirmOpen(false);
    setSelected(null);
  };


  return (
    <DashboardLayout>
      <PageContainer scrollable>
        <div className="space-y-4">
          <Breadcrumbs items={[
            { title: 'Dashboard', link: '/dashboard' },
            { title: 'Estadísticas', link: '/stats' }
          ]} />
          <div className="flex items-start justify-between">
            <Heading description="Información general" title="Estadísticas" />
          </div>

          <div>
            <div className="flex justify-between gap-x-10 mb-3" vaul-drawer-wrapper="">
              <Input placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
              <NewBadgeModal
                badge={selected}
                isEditing={isEditing}
                isModalOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                handleNew={handleNewBadge}
              />
            </div>

            <div className="bg-gray-50 min-h-full flex items-center justify-center p-5 ">
              {filteredData.map((badge) => (
                <div className="bg-white shadow-lg rounded-lg max-w-md mx-auto p-3 grid grid-cols-4 text-center" key={badge.id}>
                  <div className="col-span-4">
                    <span>{badge.name}</span>
                  </div>
                  <div className="col-span-4">
                    <p>{badge.description}</p>
                  </div>
                  <div className="col-span-4">
                    <p>{badge.pointsRequired}</p>
                  </div>

                  <div className="col-start-1">
                    <Button variant={"delete"} onClick={() => handleDeleteBadge(badge)}>
                      <Trash2 />
                    </Button>
                    
                  </div>

                  <div className="col-start-4">
                    <Button variant={"edit"} onClick={() => handleUpdateBadge(badge)}>
                      <Pencil />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Credenza open={isConfirmOpen} >
          <CredenzaHeader>
            <CredenzaTitle>Confirmar eliminación</CredenzaTitle>
            <CredenzaDescription>¿Estás seguro que deseas eliminar la medalla "{selected?.name}"?</CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            Esta acción no se puede deshacer.
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                Cancelar
              </Button>
            </CredenzaClose>
            <Button variant="delete" onClick={confirmDelete}>
              Confirmar
            </Button>
          </CredenzaFooter>
        </Credenza>

      </PageContainer>
    </DashboardLayout>
  );
}

type ValidationError = {
  _errors: string[];
};

type ActionData = {
  _errors: string[];
  name: ValidationError;
  requiredPoint: ValidationError;
  description: ValidationError;
  image: ValidationError;
};

type BadgeModalProps = {
  badge: selectBadge | null;
  isEditing?: boolean;
  isModalOpen: boolean;
  onClose: () => void;
  handleNew: () => void;
};


const NewBadgeModal = ({ badge, isEditing, isModalOpen, onClose, handleNew }: BadgeModalProps) => {
  const fetcher = useFetcher();
  const actionData = fetcher.data as ActionData | null;

  const [open, setOpen] = useState(isModalOpen);

  useEffect(() => {
    setOpen(isModalOpen);
  }, [isModalOpen]);

  const formAction = isEditing ? `/badges/update/${badge?.id}` : '/badges';
  // onOpenChange={setOpen}

  return (
    <Credenza open={open} >

      <CredenzaTrigger asChild>
        <Button onClick={handleNew}>
          Nueva
        </Button>
      </CredenzaTrigger>

      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{isEditing ? "Editar medalla" : "Crear nueva medalla"}</CredenzaTitle>
          <CredenzaDescription>{isEditing ? "Edita los detalles de la medalla" : "Modal para crear nueva medalla con sus detalles"}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <fetcher.Form action={formAction} method="POST">
            <div className="grid grid-cols-12 grid-rows-5 gap-0">


              <div className="col-start-1 col-end-6 row-start-1 row-end-3">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Nombre"
                  name="name"
                  defaultValue={isEditing && badge ? badge.name : ""}
                />
                {actionData?.name && <p className="text-red-500">{actionData.name._errors[0]}</p>}
              </div>

              <div className="col-start-1 col-end-6 row-start-3 row-end-5">
                <Label htmlFor="requiredPoint">Puntos requeridos</Label>
                <Input
                  type="number"
                  id="requiredPoint"
                  placeholder="Puntos requeridos"
                  name="pointsRequired"
                  defaultValue={isEditing && badge ? badge.pointsRequired : ""}
                />
                {actionData?.requiredPoint && <p className="text-red-500">{actionData.requiredPoint._errors[0]}</p>}
              </div>

              <div className="col-start-7 col-end-12 row-start-1 row-end-3">
                <Label htmlFor="picture">Imagen</Label>
                <Input
                  id="picture"
                  type="file"
                  name="image"
                  accept="image/jpg, image/jpeg, image/png, image/svg+xml"
                />
                {actionData?.image && <p className="text-red-500">{actionData.image._errors[0]}</p>}
              </div>

              <div className="col-start-7 col-end-12 row-start-3 row-end-5">
                <Label htmlFor="message">Descripción</Label>
                <Textarea
                  className="resize-none"
                  placeholder="Descripción"
                  id="message"
                  name="description"
                  defaultValue={isEditing && badge ? badge.description ?? "" : ""}
                />
                {actionData?.description && <p className="text-red-500">{actionData.description._errors[0]}</p>}
              </div>


              <div className="col-start-1 col-end-5 row-start-6 row-end-6">
                <Button className="disabled:opacity-50" disabled={fetcher.state !== "idle"} type="submit" variant={isEditing ? "edit" : "create"}>
                  {isEditing ? "Actualizar" : "Crear"}
                </Button>
              </div>

              {/* <div className="col-start-4 col-end-7 row-start-8 row-end-10">
                <Button variant={"outline"} type="button" >
                  Limpiar
                </Button>
              </div> */}
            </div>
          </fetcher.Form>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button onClick={onClose}>
              Cerrar
            </Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

