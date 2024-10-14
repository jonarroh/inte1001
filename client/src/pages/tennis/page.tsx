import { Link } from "react-router-dom";

import PageContainer from "@/components/templates/page-container";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import DashboardLayout from "@/components/layout/app";



function TennisPage() {

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

            <Link
              to={'/dashboard/employee/new'}
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </div>
          <div>
            <p>Content goes here</p>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}

export default TennisPage;
