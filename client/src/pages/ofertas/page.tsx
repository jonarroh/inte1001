import DashboardLayout from "@/components/layout/app";
import PageContainer from "@/components/templates/page-container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Outlet, useLoaderData, useNavigate, useFetcher, LoaderFunction } from "react-router-dom";
import { async } from '../../lib/sendRequest';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";


type OfertasData = {
  id: number;
  nombre: string;
  descripcion: string;
  fechainicio: string;
  fechafin: string;
  descuento: number;
  estado: number;
  productos: number;
  badgepromoid: number;
  limitecanje: number;
  imagen: string;
}

export const loader: LoaderFunction = async () => {
  const response = await fetch("https://191.101.1.86:7268/api/Promociones/Promos");

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data: OfertasData[] = await response.json();

  return data;
}

export default function OfertasPage() {
  const fetcher = useFetcher();
  // http://191.101.1.86:5000/static/products/id.webp

  const data = useLoaderData() as OfertasData[];

  // Estado para el valor de búsqueda
  const [searchQuery, setSearchQuery] = useState("");

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filtrar las ofertas en base al valor del campo de búsqueda
  const filteredData = data.filter((item) =>
    item.nombre.toLowerCase().includes(searchQuery) ||
    item.descripcion.toLowerCase().includes(searchQuery)
  );

  const navigate = useNavigate();

  return <>
    <DashboardLayout>
      <PageContainer scrollable>
        <div className="space-y-4">
          <Breadcrumbs items={[
            { title: 'Dashboard', link: '/dashboard' },
            { title: 'Ofertas', link: '/ofertas' }
          ]} />

          <div className="flex items-start justify-between">
            <Heading description="" title="Ofertas de los productos" />
          </div>

          <div>
            <div className="flex justify-between gap-x-10">
              <Outlet />
              <Input
                placeholder="Buscar una oferta específica"
                value={searchQuery}
                onChange={handleSearchChange}
              />

              <Button onClick={() => navigate("/ofertas/create")}>Nueva</Button>
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
                      <img src={`http://191.101.1.86:5000/static/products/${item.productos}.webp`} alt={item.nombre} />
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="edit" onClick={() => navigate(`/ofertas/update/${item.id}`)}>Editar</Button>
                    <Button className="mx-3" variant="delete" onClick={() => fetcher.submit({ idle: true }, { method: "post", action: `/ofertas/delete/${item.id}` })}>Eliminar</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  </>
}
