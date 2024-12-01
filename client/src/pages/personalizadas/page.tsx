import DashboardLayout from "@/components/layout/app";
import PageContainer from "@/components/templates/page-container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LoaderFunction, Outlet, useFetcher, useLoaderData, useNavigate } from "react-router-dom";

type OfertasPersonalizadasData = {
  id: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  descuento: number;
  estatus: number;
  productoId: number;
  badgePromoId: number;
  limiteCanje: number;
  motivo: string;
}

export const loader: LoaderFunction = async () => {
  const response = await fetch("http://191.101.1.86:5275/api/PromocionesPersonalizadas/Promos");

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data: OfertasPersonalizadasData[] = await response.json();

  return data;
}


export default function PersonalizadasPage() {
  const fetcher = useFetcher();

  const data = useLoaderData() as OfertasPersonalizadasData[];

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredData = data.filter((item) =>
    item.nombre.toLowerCase().includes(searchQuery) ||
    item.descripcion.toLowerCase().includes(searchQuery)
  );

  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <PageContainer scrollable>
        <div className="space-y-4">
          <Breadcrumbs items={[
            { title: "Dashboard", link: "/dashboard" },
            { title: "Ofertas Personalizadas", link: "/personalizadas" },
          ]} />

          <div className="flex items-start justify-between">
            <Heading description="" title="Ofertas Personalizadas" />
          </div>

          <div>
            <div className="flex justify-between gap-x-10">
              <Outlet />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />

              <Button onClick={() => navigate("/personalizadas/create")}>Nueva</Button>
            </div>

          </div>
          <div>
            {/* grid responsive para 5 cards por cada row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* datos filtrados por la busqueda */}
              {filteredData.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle>{item.nombre}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      {item.descripcion}
                      <img src={`http://191.101.1.86:5000/static/products/${item.productoId}.webp`} alt={item.nombre} />
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="edit" onClick={() => navigate(`/personalizadas/update/${item.id}`)}>Editar</Button>
                    <Button variant="delete" onClick={() => fetcher.submit({ idle: true }, { method: "put", action: `/personalizadas/delete/${item.id}` })}>Eliminar</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  )
} 