import DashboardLayout from "@/components/layout/app";
import { Credenza, CredenzaContent, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "@/components/templates/credenza";
import PageContainer from "@/components/templates/page-container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";

export default function OfertasPage() {
  return <>
    <DashboardLayout>
      <PageContainer scrollable>
        <div className="space-y-4">
          <Breadcrumbs items={[
            { title: 'Dashboard', link: '/dashboard' },
            { title: 'Ofertas', link: '/ofertas' }
          ]}/>

          <div className="flex items-start justify-between">
            <Heading description="" title="Ofertas"/>
          </div>

          <div>
            <div className="flex justify-between gap-x-10">
              <Input placeholder="Search" />
              {/* new offer modal */}
              <NewOfferModal />
            </div>
            
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  </>
} 

const NewOfferModal = () => {
  // const fetcher = useFetcher();

  return <>
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>New Offer</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>New Offer</CredenzaTitle>
        </CredenzaHeader>
      </CredenzaContent>
    </Credenza>
  </>
}