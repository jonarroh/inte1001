import DashboardLayout from "@/components/layout/app";
import PageContainer from "@/components/templates/page-container";
import {
  AlertDialog, AlertDialogTrigger,
  AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction
} from "@/components/ui/alert-dialog";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Heading } from "@/components/ui/heading";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useFetcher } from "react-router-dom";
import { z } from "zod";

const options = [
  { value: "todos", label: "Todos" },
  { value: "lessActivity", label: "Menos actividad" },
  { value: "MoreActivity", label: "Más actividad" }
];

// Esquema de validación usando Zod
const formSchema = z.object({
  message: z.string().min(1, "El mensaje es requerido"),
  framework: z.string().default("todos").refine((val) => options.some(option => option.value === val), {
    message: "Seleccione una opción válida",
  })
});

export default function EmailsPage() {
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("todos");
  const [errors, setErrors] = useState({ message: "", framework: "" });

  const handleSubmit = (formData: { message: string; framework: string }) => {
    const validation = formSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        message: fieldErrors.message?.[0] || "",
        framework: fieldErrors.framework?.[0] || "",
      });
      return false;
    }
    setErrors({ message: "", framework: "" });
    return true;
  };

  return (
    <DashboardLayout>
      <PageContainer scrollable>
        <div className="space-y-4">
          <Breadcrumbs items={[{ title: "Dashboard", link: "/dashboard" }, { title: "Chat", link: "/badges" }]} />

          <div className="flex items-start justify-between">
            <Heading description="Información general" title="Chat" />
          </div>

          <div>
            <div className="flex justify-between gap-x-10 mb-3">
              <div className="w-full bg-white h-[500px]">
                <fetcher.Form
                  onSubmit={(e) => e.preventDefault()} // Evitar el envío HTML nativo
                >
                  <Textarea placeholder="Escribe tu mensaje" name="message" className="w-full h-full" />
                  {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
                  <div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" type="button">Enviar mensaje</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro de enviar el mensaje?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Una vez enviado, no se podrá deshacer. Asegúrate de que el mensaje sea el correcto.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            type="button"
                            onClick={() => {
                              const message = (document.querySelector('textarea[name="message"]') as HTMLTextAreaElement)?.value || "";
                              const formData = { message, framework: value };

                              if (handleSubmit(formData)) {
                                const data = new FormData();
                                data.append("message", formData.message);
                                data.append("framework", formData.framework);
                                fetcher.submit(data, { method: "post" });
                              }
                            }}
                          >
                            Enviar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                          {value ? options.find((opt) => opt.value === value)?.label : "Select framework..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search framework..." />
                          <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                              {options.map((opt) => (
                                <CommandItem
                                  key={opt.value}
                                  value={opt.value}
                                  onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "todos" : currentValue);
                                    setOpen(false);
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", value === opt.value ? "opacity-100" : "opacity-0")} />
                                  {opt.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {errors.framework && <p className="text-red-500 text-sm">{errors.framework}</p>}
                  </div>
                </fetcher.Form>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
