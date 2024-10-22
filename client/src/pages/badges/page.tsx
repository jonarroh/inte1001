import { useState } from "react";
import { useNavigate, useLoaderData, Outlet, LoaderFunction, useFetcher } from "react-router-dom";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layout/app";
import PageContainer from "@/components/templates/page-container";
import { selectBadge } from "@server/schema/badge";
import { Pencil, Trash2 } from "lucide-react";

export const loader: LoaderFunction = async () => {
  const response = await fetch('http://localhost:3000/badge');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data: selectBadge[] = await response.json();
  return data;
};

export default function BadgesPage() {
  const data = useLoaderData() as selectBadge[];
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();

  const fetcher = useFetcher();

  const filteredData = data.filter((badge) =>
    badge.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <PageContainer scrollable>
        <div className="space-y-4">
          <Breadcrumbs
            items={[
              { title: "Dashboard", link: "/dashboard" },
              { title: "Insignias", link: "/badges" },
            ]}
          />

          <div className="flex items-start justify-between">
            <Heading description="Información general" title="Insignias" />
          </div>

          <div>
            <div className="flex justify-between gap-x-10 mb-3">
              <Outlet />
              <Input placeholder="Buscar" onChange={(e) => setSearch(e.target.value)} />
              <Button onClick={() => navigate("/badges/create")}>Nueva</Button>
            </div>

            <div className="bg-gray-50 min-h-full flex items-center justify-center p-5">
              {filteredData.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-white shadow-lg rounded-lg max-w-md mx-auto p-3 grid grid-cols-4 text-center"
                >
                  <div className="col-span-4">{badge.name}</div>
                  <div className="col-span-4">{badge.description}</div>
                  <div className="col-span-4">{badge.pointsRequired}</div>

                  <div className="col-start-1">
                    <Button variant={"delete"}
                      onClick={() => fetcher.submit(
                        { idle: true },
                        { method: "post", action: `/badges/delete/${badge.id}` }
                      )}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  <div className="col-start-4">
                    <Button variant={"edit"} onClick={() => navigate(`/badges/update/${badge.id}`)}>
                      <Pencil />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
