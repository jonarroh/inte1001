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
import { useState } from "react";
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
  const [search, setsearch] = useState<string>('');
  const [selected, setSelected] = useState<selectBadge | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const filteredData = data.filter((badge) => {
    return badge.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleFormView = (badge: selectBadge) => {
    console.log(badge);
    setSelected(badge);
    setIsEditing(true);
    setIsModalOpen(true);
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
            <Heading description="Información general"
              title="Estadísticas" />
          </div>

          <div>
            <div className="flex justify-between gap-x-10 mb-3" vaul-drawer-wrapper="">
              <Input placeholder="Search"
                onChange={(e) => setsearch(e.target.value)}
              />
              <NewBadgeModal badge={selected} isEditing={isEditing} isModalOpen={isModalOpen} onClose={ () => setIsModalOpen(false)} />
            </div>

            <div className="bg-gray-50 min-h-full flex items-center justify-center p-5 ">
              {
                filteredData.map((badge) => (
                  <div className="bg-white shadow-lg rounded-lg max-w-md mx-auto p-3 grid grid-cols-4 text-center" key={badge.id}>
                    
                    <div className="col-span-4">
                      {/* <img src={badge.picture} alt={badge.name} className="w-20 h-20 mx-auto" /> */}
                    </div>

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
                      <Button variant={"delete"}> 
                        <Trash2 />
                      </Button>
                    </div>

                    <div className="col-start-4">
                      <Button variant={"edit"} onClick={ () => handleFormView(badge)}>
                        <Pencil  />
                      </Button>
                    </div>

                  </div>
                ))
                
              }
            </div>
            
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  )
}



import { useActionData } from "react-router-dom";
import { a } from "react-spring";

type ActionData = {
  errors?: {
    name?: { _errors: string[] };
    requiredPoint?: { _errors: string[] };
    message?: { _errors: string[] };
    picture?: { _errors: string[] };
  };
};

type BadgeModalProps = {
  badge: selectBadge | null;
  isEditing?: boolean;
  isModalOpen: boolean;
  onClose: () => void;
  // onClean: () => void;
}


const NewBadgeModal = ({badge, isEditing, isModalOpen, onClose} : BadgeModalProps) => {
  const actionData = useActionData() as ActionData;
  const fetcher = useFetcher();

  const formAction = isEditing ? `/badge/update/${badge?.id}` : '/';
  const formMethod = isEditing ? 'put' : 'post';


  return (
    <Credenza open={isModalOpen}>
      <CredenzaTrigger asChild>
        <Button onClick={() => isModalOpen = true}>Nueva</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{isEditing ? "Editar medalla" : "Crear nueva medalla"}</CredenzaTitle>
          <CredenzaDescription>
            {isEditing ? "Edita los detalles de la medalla" : "Modal para crear nueva medalla con sus detalles"}
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <fetcher.Form action={formAction} method={formMethod} encType="multipart/form-data" >
            <div className="grid grid-cols-6 grid-rows-9 gap-0">

              <div className="col-start-1 col-end-4 row-start-1 row-end-3 ">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="name">Nombre</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    placeholder="Nombre" 
                    name="name" 
                    defaultValue={isEditing ? badge?.name : "" }
                    
                  />
                  {actionData?.errors?.name && (
                    <p className="text-red-500 text-sm">{actionData.errors.name._errors[0]}</p>
                  )}
                </div>
              </div>

              <div className="col-start-1 col-end-4 row-start-3 row-end-5 ">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="requiredPoint">Puntos requeridos</Label>
                  <Input
                    type="number"
                    id="requiredPoint"
                    placeholder="Puntos requeridos"
                    name="requiredPoint"
                    defaultValue={isEditing ? badge?.pointsRequired : "" }
                    
                  />
                  {actionData?.errors?.requiredPoint && (
                    <p className="text-red-500 text-sm">
                      {actionData.errors.requiredPoint._errors[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-start-1 col-end-4 row-start-5 row-end-8 ">
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="message">Descripción</Label>
                  <Textarea
                    className="resize-none"
                    placeholder="Type your message here."
                    id="message"
                    name="message"
                    defaultValue={isEditing ? badge?.description ?? "" : "" }
                    
                  />
                  {actionData?.errors?.message && (
                    <p className="text-red-500 text-sm">
                      {actionData.errors.message._errors[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-start-4 col-end-7 row-start-1 row-end-8">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="picture">Picture</Label>
                  <Input
                    id="picture"
                    type="file"
                    name="picture"
                    accept="image/jpg, image/jpeg, image/png, imgage/svg"
                    
                  />
                  {actionData?.errors?.picture && (
                    <p className="text-red-500 text-sm">
                      {actionData.errors.picture._errors[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-start-1 col-end-4 row-start-8 row-end-10 ">
                <Button type="submit" variant={isEditing ? "edit" : "create"} >{isEditing ? "Actualizar" : "Crear"}</Button>
              </div>

              <div className="col-start-4 col-end-7 row-start-8 row-end-10 ">
                <Button variant={"outline"} >Limpiar</Button>
              </div>
            </div>

          </fetcher.Form>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button onClick={onClose}>Cerrar</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
