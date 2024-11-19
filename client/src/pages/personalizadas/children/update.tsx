import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { LoaderFunction, useFetcher, useLoaderData, useNavigate } from "react-router-dom";


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
    userId: number;
}

type prod = {
    id: number;
    nombre: string;
}

export const loaderUpdateOfferPersonal: LoaderFunction = async ({ params }) => {
    const id = params.id;
    const response = await fetch(`https://localhost:7268/api/PromocionesPersonalizadas/getPromocion/${id}`);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data: OfertasPersonalizadasData = await response.json();
    return data;
};

export const loadProducts = async () => {
    const response = await fetch("https://localhost:7268/api/Productos");

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data: prod[] = await response.json();
    return data;
}

const UpdateOfferPersonalPage = () => {
    const fetcher = useFetcher();
    const offer = useLoaderData() as OfertasPersonalizadasData;

    const [prods, setProds] = useState<prod[]>([]);

    useEffect(() => {
        loadProducts().then(setProds).catch(console.error);
    }, []);

    const navigate = useNavigate();

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    function setOffer(arg0: { limiteCanje: number; id: number; nombre: string; descripcion: string; fechaInicio: string; fechaFin: string; descuento: number; productos: number; badgePromoId: string; motivo: string }): void {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="bg-gray-50 min-h-full flex items-center justify-center p-5">
            <fetcher.Form method="POST" >
                {/* grid para 2 columnas */}
                <Input name="id" id="id" className="hidden" defaultValue={offer.id} />
                <div className="grid grid-cols-2 gap-4 mb-5 mt-2">
                    <div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input type="text" id="nombre" placeholder="Nombre" name="nombre" required defaultValue={offer.nombre} />
                        </div>
                    </div>
                    <div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="descripcion">Descripcion</Label>
                            <Textarea id="descripcion" placeholder="Descripcion" name="descripcion" required defaultValue={offer.descripcion} />
                        </div>
                    </div>
                </div>
                {/* grid para 2 columnas */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="fechainicio">Fecha de inicio</Label>
                            <Input type="date" id="fechainicio" placeholder="Fecha de inicio" name="fechainicio" required defaultValue={new Date(offer.fechaInicio).toISOString().split('T')[0]} />
                        </div>
                    </div>
                    <div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="fechafin">Fecha de fin</Label>
                            <Input type="date" id="fechafin" placeholder="Fecha de fin" name="fechafin" required defaultValue={new Date(offer.fechaFin).toISOString().split('T')[0]} />
                        </div>
                    </div>
                </div>
                {/* grid para 2 columnas */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="limitecanje">Limite de canje</Label>
                            <Input type="number" id="limitecanje" placeholder="Limite" name="limitecanje" defaultValue={offer.limiteCanje} />
                        </div>
                    </div>
                    <div>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="descuento">Descuento</Label>
                            <Input type="number" id="descuento" placeholder="Descuento" name="descuento" required defaultValue={offer.descuento} />
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
                                    className="w-[140px] justify-between"
                                >
                                    {value
                                        ? prods.find((pro) => pro.id.toString() === value)?.nombre
                                        : "Seleccionar..."}
                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Buscar..." className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No framework found.</CommandEmpty>
                                        <CommandGroup>
                                            {prods.map((pro) => (
                                                <CommandItem
                                                    key={pro.id}
                                                    value={pro.id.toString()}
                                                    onSelect={(currentValue) => {
                                                        setValue(currentValue === value ? "" : currentValue)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    {pro.nombre}
                                                    <CheckIcon
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            value === pro.id.toString() ? "opacity-100" : "opacity-0"
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
                        <Select name="badgepromoid">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar Badge" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Badges</SelectLabel>
                                    <SelectItem value="1">bronce</SelectItem>
                                    <SelectItem value="2">plata</SelectItem>
                                    <SelectItem value="3">oro</SelectItem>
                                    <SelectItem value="4">platino</SelectItem>
                                    <SelectItem value="5">star</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {
                    value && (
                        <Input type="hidden" name="productoId" value={value} />
                    )
                }

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="motivo">Motivo</Label>
                    <Select name="motivo">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar motivo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Motivo</SelectLabel>
                                <SelectItem value="Cumpleanio">Cumpleaños</SelectItem>
                                <SelectItem value="Cantidad">Cantidad producto comprado</SelectItem>
                                <SelectItem value="Producto">Producto m&aacute;s comprado</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Grid para 2 columnas con los botones crear y limpiar */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Button type="submit" variant="edit" disabled={fetcher.state !== "idle"}>
                            Actualizar
                        </Button>
                    </div>
                    <div>
                        <Button variant="outline" type="button" onClick={() => navigate("/personalizadas")}>
                            Cancelar
                        </Button>
                    </div>
                </div>
            </fetcher.Form>
        </div>
    );
};

export default UpdateOfferPersonalPage;
