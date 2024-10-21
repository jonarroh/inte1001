import DashboardLayout from "@/components/layout/app";
import { cn } from "@/lib/utils";
import { Credenza, CredenzaBody, CredenzaClose, CredenzaContent, CredenzaFooter, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "@/components/templates/credenza";
import PageContainer from "@/components/templates/page-container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetcher, useLoaderData } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

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
}

export const loader: LoaderFunction = async () => {
  const response = await fetch("https://localhost:7268/api/Promociones/allPromociones");

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data: OfertasData[] = await response.json();

  return data;
}

export default function OfertasPage() {
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

  return <>
    <DashboardLayout>
      <PageContainer scrollable>
        <div className="space-y-4">
          <Breadcrumbs items={[
            { title: 'Dashboard', link: '/dashboard' },
            { title: 'Ofertas', link: '/ofertas' }
          ]} />

          <div className="flex items-start justify-between">
            <Heading description="" title="Ofertas" />
          </div>

          <div>
            <div className="flex justify-between gap-x-10">
              {/* Input para búsqueda */}
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {/* new offer modal */}
              <NewOfferModal />
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
                    <CardDescription>{item.descripcion}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Editar</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">Eliminar</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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


const NewOfferModal = () => {
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")



  return <>
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>Agregar</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Nueva oferta</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <fetcher.Form method="post" action="">
            {/* grid para 2 columnas */}
            <div className="grid grid-cols-2 gap-4 mb-5 mt-2">
              <div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input type="text" id="nombre" placeholder="Nombre" name="nombre" />
                </div>
              </div>
              <div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="descripcion">Descripcion</Label>
                  <Textarea id="descripcion" placeholder="Descripcion" name="descripcion" />
                </div>
              </div>
            </div>
            {/* grid para 2 columnas */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="fechainicio">Fecha de inicio</Label>
                  <Input type="date" id="fechainicio" placeholder="Fecha de inicio" name="fechainicio" />
                </div>
              </div>
              <div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="fechafin">Fecha de fin</Label>
                  <Input type="date" id="fechafin" placeholder="Fecha de fin" name="fechafin" />
                </div>
              </div>
            </div>
            {/* grid para 2 columnas */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="limitecanje">Limite de canje</Label>
                  <Input type="number" id="limitecanje" placeholder="Limite" name="limitecanje" max={10} min={1} />
                </div>
              </div>
              <div className="">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="descuento">Descuento</Label>
                  <Input type="number" id="descuento" placeholder="Descuento" name="descuento" />
                </div>
              </div>
            </div>
            {/* grid para 2 columnas */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <Label htmlFor="productos">Productos</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {value
                        ? frameworks.find((framework) => framework.value === value)?.label
                        : "Seleccionar producto"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                          {frameworks.map((framework) => (
                            <CommandItem
                              key={framework.value}
                              value={framework.value}
                              onSelect={(currentValue) => {
                                setValue(currentValue === value ? "" : currentValue)
                                setOpen(false)
                              }}
                            >
                              {framework.label}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  value === framework.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="badge">Badges</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar Badge" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Badges</SelectLabel>
                      <SelectItem value="bronce">bronce</SelectItem>
                      <SelectItem value="plata">plata</SelectItem>
                      <SelectItem value="oro">oro</SelectItem>
                      <SelectItem value="platino">platino</SelectItem>
                      <SelectItem value="star">star</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </fetcher.Form>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose>
            {/* grid de 2 columnas que muestre los 2 botones de cerrar y registrar */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">Cancelar</Button>
              <Button type="submit">Registrar</Button>
            </div>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  </>
}
