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
import { useState } from "react";
import { Form, LoaderFunction, useFetcher, useLoaderData } from "react-router-dom"


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
  const filteredData = data.filter((badge) => {
    return badge.name.toLowerCase().includes(search.toLowerCase());
  });




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
            <div className="flex justify-between gap-x-10" vaul-drawer-wrapper="">
              <Input placeholder="Search"
                onChange={(e) => setsearch(e.target.value)}
              />
              <NewBadgeModal />
            </div>
            {
              filteredData.map((badge) => (
                <div key={badge.id}>
                  <img src={`http://localhost:5000/static/badge/${badge.id}.webp`} alt=""
                    onError={(e: any) => {

                      e.target.src = "https://via.placeholder.com/150"; // URL del placeholder
                    }}
                  />
                  <p>{badge.name}</p>
                  <p>{badge.description}</p>
                  <p>{badge.pointsRequired}</p>
                </div>
              ))
            }
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


const NewBadgeModal = () => {
  const actionData = useActionData() as ActionData;
  ;
  const fetcher = useFetcher();

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>Nuevo</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Credenza</CredenzaTitle>
          <CredenzaDescription>
            A responsive modal component for shadcn/ui.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <fetcher.Form action="/badges" method="post">
            <div className="grid grid-cols-6 grid-rows-9 gap-0">
              <div className="col-start-1 col-end-4 row-start-1 row-end-3 ">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="name">Nombre</Label>
                  <Input type="text" id="name" placeholder="Nombre" name="name" />
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
                    accept="image/jpg, image/jpeg, image/png"
                  />
                  {actionData?.errors?.picture && (
                    <p className="text-red-500 text-sm">
                      {actionData.errors.picture._errors[0]}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-start-1 col-end-4 row-start-8 row-end-10 ">
                <Button variant={"default"}>Enviar</Button>
              </div>
              <div className="col-start-4 col-end-7 row-start-8 row-end-10 ">
                <Button variant={"default"}>Limpiar</Button>
              </div>
            </div>
          </fetcher.Form>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button>Cerrar</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
