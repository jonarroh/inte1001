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
import { selectLocation } from "@server/schema/location";


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

export async function loader() {
  const response = await fetch("https://localhost:7268/api/Promociones/allPromociones");

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();

  return data;
}

export default function OfertasPage() {
  const data = useLoaderData() as selectLocation[];

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
              <Input placeholder="Search" />
              {/* new offer modal */}
              <NewOfferModal />
            </div>

          </div>
          <div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de inicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de fin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badges</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limite de canje</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">{item.descripcion}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.fechainicio}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.dateend}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.descuento}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.productos}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.badge}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.limitecanje}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
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
          <fetcher.Form action="/ofertas" method="post">
            <div className="grid grid-cols-6 grid-rows-10 gap-0">
              <div className="col-start-1 col-end-4 row-start-1 row-end-3">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input type="text" id="nombre" placeholder="Nombre" name="nombre" />
                </div>
              </div>
              <div className="col-start-1 col-end-4 row-start-3 row-end-5">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="descripcion">Descripci&oacute;n</Label>
                  <Input type="text" id="descripcion" placeholder="Descripción" name="descripcion" />
                </div>
              </div>
              <div className="col-start-1 col-end-4 row-start-5 row-end-8">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="fechainicio">Fecha de inicio</Label>
                  <Input type="text" id="fechainicio" placeholder="Fecha de inicio" name="fechainicio" />
                </div>
              </div>
              <div className="col-start-1 col-end-4 row-start-8 row-end-11">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="dateend">Fecha de Fin</Label>
                  <Input type="text" id="dateend" placeholder="Fecha de fin" name="dateend" />
                </div>
              </div>
              <div className="col-start-4 col-end-7 row-start-1 row-end-3 mx-2">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="descuento">Descuento</Label>
                  <Input type="text" id="descuento" placeholder="Descuento" name="descuento" />
                </div>
              </div>
              <div className="col-start-4 col-end-7 row-start-3 row-end-5 mx-2">
                <div className="grid w-full max-w-sm items-center gap-1.5">
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
                    <PopoverContent className="w-[200px] p-0">
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
              </div>
              <div className="col-start-4 col-end-7 row-start-5 row-end-8 mx-2">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="badge">Badges</Label>
                  <Select>
                    <SelectTrigger className="w-[180px]">
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
              <div className="col-start-4 col-end-7 row-start-8 row-end-11 mx-2">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="limitecanje">Limite de canje</Label>
                  <Input type="text" id="limitecanje" placeholder="Limite" name="limitecanje" />
                </div>
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
  </>
}