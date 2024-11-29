import React, { useEffect, useState } from 'react';
import { defer, LoaderFunction, useFetcher, useLoaderData, useParams, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, ChevronsUpDown, Check, LoaderCircle } from "lucide-react";
import { Heading } from '@/components/ui/heading';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import PageContainer from '@/components/templates/page-container';
import DashboardLayout from '@/components/layout/app';
import useFetch from '@/lib/useFetcht';
import { set } from 'zod';
import MessageHistory from './children/History';

export interface Address {
  id: number;
  calle: string;
  colonia: string;
  ciudad: string;
  estado: string;
  pais: string;
  codigoPostal: string;
  userId: number;
  numeroExterior: number;
  estatus: string;
}

export interface CreditCard {
  id: number;
  cardNumber: string;
  expiryDate: string;
  cardHolderName: string;
  userId: number;
  estatus: string;
  cvv: string;
}

export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  token: string;
  estatus: string;
  direcciones: Address[];
  creditCards: CreditCard[];
}

const options = [
  { value: "todos", label: "Todos" },
  { value: "lessActivity", label: "Menos actividad" },
  { value: "moreActivity", label: "Más actividad" },
  { value: "custom", label: "Personalizado" }
];

export const userData: LoaderFunction = async () => {
  const response = await fetch("http://localhost:5275/api/Users");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: User[] = await response.json();

  return { data };
};

export default function EmailsPage() {
  const data = useLoaderData() as { data: User[] };
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("todos");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Initialize users from loader data
  const [users, setUsers] = useState(data.data || []);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState({ message: "", framework: "" });
  const featcher = useFetcher();
  let [searchParams] = useSearchParams();

  useEffect(() => {
    console.log({ searchParams });
    const emailparam = searchParams.get("email");
    if (emailparam) {
      setValue("custom");
      //agreagar el email a los seleccionados
      const user = users.find((u) => u.email === emailparam);
      if (user) {
        handleAddUser(user);
      }
    }
  }, []
  )

  const handleSubmit = () => {
    if (!message.trim()) {
      setErrors((prev) => ({ ...prev, message: "El mensaje es requerido" }));
      return false;
    }

    if (!value) {
      setErrors((prev) => ({ ...prev, framework: "Seleccione una opción válida" }));
      return false;
    }

    setErrors({ message: "", framework: "" });
    return true;
  };

  const handleAddUser = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
    setUsers(users.filter((u) => u.id !== user.id));
  };

  const handleRemoveUser = (user: User) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    setUsers([...users, user]);
  };

  return (
    <DashboardLayout>
      <PageContainer scrollable>
        <div className="space-y-4">
          <Breadcrumbs
            items={[
              { title: "Dashboard", link: "/dashboard" },
              { title: "Envío de correos", link: "/emails" }
            ]}
          />

          <div className="flex items-start justify-between">
            <Heading
              description="Información general"
              title="Envío de correos"
            />
          </div>
          <div>
            <div className="p-4 max-w-4xl mx-auto flex flex-row">
              <MessageHistory />

              <div className="bg-white  rounded-lg shadow-md border p-4 w-96 gap-5">
                <h2 className="text-lg font-semibold mb-3">Enviar Correos</h2>
                <textarea
                  placeholder="Escribe el mensaje que se enviará a los destinatarios."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-48 p-2 border rounded mb-3"
                />
                {errors.message && <p className="text-red-500 text-sm mb-3">{errors.message}</p>}

                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Button
                      variant="outline"
                      onClick={() => setOpen(!open)}
                      className="w-[200px] justify-between"
                    >
                      {value ? options.find((opt) => opt.value === value)?.label : "Buscar..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>

                    {open && (
                      <div className="absolute z-10 w-[200px] bg-white border rounded shadow-lg mt-1">
                        {options.map((opt) => (
                          <div
                            key={opt.value}
                            onClick={() => {
                              setValue(opt.value);
                              if (opt.value === "custom") {
                                setIsSheetOpen(true);
                              }
                              setOpen(false);
                            }}
                            className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          >
                            <Check className={`mr-2 h-4 w-4 ${value === opt.value ? "opacity-100" : "opacity-0"}`} />
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      if (handleSubmit()) {
                        console.log("Sending message:", message);
                        console.log("To recipients:", value);


                        if (value == "custom") {
                          fetch('http://localhost:3000/email/customToEmail', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              message,
                              subject: selectedUsers.map((u) => u.email),
                            })
                          }).then(() => {
                            window.location.href = "/emails";
                          }
                          )
                          return;
                        }

                        const data = {
                          message,
                          framework: value
                        };

                        // const form
                        setIsLoaded(true);
                        featcher.submit(data, { method: "post" });




                      }
                    }}
                  >
                    {
                      isLoaded ? (
                        <LoaderCircle className="h-6 w-6 animate-spin" />

                      )


                        : "Enviar"
                    }
                  </Button>
                  {
                    value == "custom" && (
                      <div>
                        <Button
                          onClick={() => {
                            setIsSheetOpen(true);
                          }}
                        >
                          Seleccionar Usuarios
                        </Button>
                      </div>
                    )
                  }
                </div>
                {errors.framework && <p className="text-red-500 text-sm mt-2">{errors.framework}</p>}
              </div>

              {isSheetOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
                  <div className="w-[600px] bg-white h-full p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Seleccionar Usuarios Personalizados</h2>
                      <Button variant="ghost" size="icon" onClick={() => setIsSheetOpen(false)}>
                        <X className="h-6 w-6" />
                      </Button>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Usuarios Disponibles</h3>
                      {users.length === 0 ? (
                        <p className="text-gray-500">No hay usuarios disponibles</p>
                      ) : (
                        <div className="space-y-3">
                          {users.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-100"
                            >
                              <div className="flex items-center space-x-4">
                                <Avatar>
                                  <AvatarImage src={
                                    `http://localhost:5000/static/users/${user.id}.webp`
                                  }
                                    alt={user.name} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => handleAddUser(user)}>
                                Agregar
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Usuarios Seleccionados</h3>
                      {selectedUsers.length === 0 ? (
                        <p className="text-gray-500">No se han seleccionado usuarios</p>
                      ) : (
                        <div className="space-y-3">
                          {selectedUsers.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between p-3 border rounded-lg bg-green-50"
                            >
                              <div className="flex items-center space-x-4">
                                <Avatar>
                                  <AvatarImage src={
                                    `http://localhost:5000/static/users/${user.id}.webp`
                                  } alt={user.name} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                              </div>
                              <Button variant="destructive" size="sm" onClick={() => handleRemoveUser(user)}>
                                <X className="h-4 w-4 mr-2" /> Eliminar
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={() => {
                          setValue("custom");
                          setIsSheetOpen(false);
                        }}
                      >
                        Confirmar Selección
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
