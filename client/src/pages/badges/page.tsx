import DashboardLayout from "@/components/layout/app";
import { Credenza, CredenzaBody, CredenzaClose, CredenzaContent, CredenzaDescription, CredenzaFooter, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "@/components/templates/credenza";
import PageContainer from "@/components/templates/page-container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button, buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { selectBadge } from "@server/schema/badge";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link, LoaderFunction, useLoaderData } from "react-router-dom"


export const loader: LoaderFunction = async ({ request }) => {
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
              <Credenza>
                <CredenzaTrigger asChild>
                  <Button>Open modal</Button>
                </CredenzaTrigger>
                <CredenzaContent>
                  <CredenzaHeader>
                    <CredenzaTitle>Credenza</CredenzaTitle>
                    <CredenzaDescription>
                      A responsive modal component for shadcn/ui.
                    </CredenzaDescription>
                  </CredenzaHeader>
                  <CredenzaBody>
                    This component is built using shadcn/ui&apos;s dialog and drawer
                    component, which is built on top of Vaul.
                  </CredenzaBody>
                  <CredenzaFooter>
                    <CredenzaClose asChild>
                      <Button>Close</Button>
                    </CredenzaClose>
                  </CredenzaFooter>
                </CredenzaContent>
              </Credenza>
            </div>
            {
              filteredData.map((badge) => (
                <div key={badge.id}>
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