import { useState } from "react";
import { useNavigate, useLoaderData, Outlet, LoaderFunction, useFetcher, useLocation } from "react-router-dom";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layout/app";
import PageContainer from "@/components/templates/page-container";
import { selectBadge } from "@server/schema/badge";
import { Pencil, Trash2 } from "lucide-react";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaClose,
} from "@/components/templates/credenza";


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
  const [badgeToDelete, setBadgeToDelete] = useState<{ id: number; name: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();


  const filteredData = data.filter((badge) =>
    badge.name.toLowerCase().includes(search.toLowerCase())
  );

  const isCreateorUpdate = location.pathname.includes("/create") || location.pathname.includes("/update");

  const openDeleteModal = (badgeId: number, badgeName: string) => {
    setBadgeToDelete({ id: badgeId, name: badgeName });
  };

  const closeDeleteModal = () => {
    setBadgeToDelete(null);
  };

  return (
    <DashboardLayout>
      <PageContainer scrollable>
        <div className="space-y-4">
          <Breadcrumbs
            items={[
              { title: "Dashboard", link: "/dashboard" },
              { title: "Insignias", link: "/badges" },
              ...(location.pathname.includes("/create") ?
                [{ title: "Crear", link: "/badges/create" }] :
                location.pathname.includes("/update") ?
                  [{ title: "Editar", link: "/badges/update" }] :
                  []),
            ]}
          />

          <div className="flex items-start justify-between">
            <Heading description="Información general" title="Insignias" />
          </div>

          <div>
            <div className="flex justify-between gap-x-10 mb-3">
              <Input placeholder="Buscar" onChange={(e) => setSearch(e.target.value)} />
              <Button onClick={() => navigate("/badges/create")}>Nueva</Button>
            </div>

            <div className="">
              <Outlet />
              {!isCreateorUpdate && (
                <div className="bg-gray-50 min-h-full flex items-center justify-center p-5">
                  {filteredData.map((badge) => (
                    <div
                      key={badge.id}
                      className="bg-white shadow-lg rounded-lg max-w-lg mx-auto p-3 grid grid-cols-4 text-center"
                    >
                      <div className="col-span-4">
                        <div className="flex justify-center">
                          <img src={`http://127.0.0.1:5000/static/badge/${badge.id}.webp`} alt={badge.name}
                            width={100} height={100}
                          />
                        </div>
                      </div>
                      <div className="col-span-4">{badge.name}</div>
                      <div className="col-span-4">{badge.description}</div>
                      <div className="col-span-4">{badge.pointsRequired}</div>

                      <div className="col-start-1">
                        <Button
                          variant={"delete"}
                          onClick={() => openDeleteModal(badge.id, badge.name)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                      <div className="col-start-4">
                        <Button
                          variant={"edit"}
                          onClick={() => navigate(`/badges/update/${badge.id}`)}
                        >
                          <Pencil />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {badgeToDelete && (
          <DeleteBadgeModal
            badgeId={badgeToDelete.id}
            badgeName={badgeToDelete.name}
            closeModal={closeDeleteModal}
          />
        )}

      </PageContainer>
    </DashboardLayout>
  );
}

type DeleteModalProps = {
  badgeId: number;
  badgeName: string;
  closeModal: () => void;
};

const DeleteBadgeModal = ({ badgeId, badgeName, closeModal }: DeleteModalProps) => {
  const fetcher = useFetcher();

  const handleDelete = () => {
    fetcher.submit(null, { method: "post", action: `/badges/delete/${badgeId}` });

    closeModal();
  };

  return (
    <Credenza open={true} onOpenChange={closeModal}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Confirmar Eliminación</CredenzaTitle>
          <CredenzaDescription>
            ¿Estás seguro de que deseas eliminar la insignia "{badgeName}"? Esta acción no se puede deshacer.
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaFooter>
          <Button variant="outline" onClick={closeModal}>
            Cancelar
          </Button>
          <CredenzaClose asChild>
            <Button variant="delete" onClick={handleDelete}>
              Confirmar
            </Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
