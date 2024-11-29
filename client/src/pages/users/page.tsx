import React, { useState } from "react";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import { format, formatDistance } from "date-fns";
import { es } from "date-fns/locale";
import {
  Mail,
  MessageCircle,
  Phone,
  Video,
  Clock,
  Send
} from "lucide-react";

import { User } from "../emails/page";
import DashboardLayout from "@/components/layout/app";
import PageContainer from "@/components/templates/page-container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Message {
  id: number;
  userId: number;
  interactionType: string;
  subject: string;
  interactionAt: string;
}

export default function UsersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: users, error } = useSWR<User[]>(
    'http://localhost:5275/api/Users',
    fetcher
  );

  const { data: messages } = useSWR<Message[]>(
    'http://localhost:3000/external/email',
    fetcher
  );

  const filteredUsers = React.useMemo(() =>
    users?.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    ) || [],
    [users, search]
  );

  const getInteractionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'email': return <Mail className="text-blue-500" />;
      case 'sms': return <MessageCircle className="text-green-500" />;
      case 'call': return <Phone className="text-purple-500" />;
      case 'videocall': return <Video className="text-red-500" />;
      default: return <MessageCircle className="text-gray-500" />;
    }
  };

  const userMessages = React.useMemo(() => {
    if (!messages || !selectedUserId) return [];
    return messages.filter(m => m.userId === selectedUserId)
      .sort((a, b) => new Date(b.interactionAt).getTime() - new Date(a.interactionAt).getTime());
  }, [messages, selectedUserId]);

  const renderContent = () => {
    if (error) return <div className="text-center text-red-500">Error al cargar usuarios</div>;
    if (!users) return <div className="text-center text-gray-500">Cargando usuarios...</div>;

    return filteredUsers.length > 0 ? (
      filteredUsers.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-md mb-2"
        >
          <div className="flex items-center">
            <Avatar>
              <AvatarImage
                src={`http://localhost:5000/static/users/${user.id}.webp`}
                alt={user.name}
              />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <div className="font-semibold">{user.name}</div>
              <div className="text-gray-500">{user.email}</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setSelectedUserId(user.id)}
              variant="outline"
            >
              Ver mensajes
            </Button>
            <Button
              onClick={() => navigate(`/emails?email=${user.email}`)}
              variant="default"
            >
              <Send className="mr-2 h-4 w-4" />
              Enviar mensaje
            </Button>
          </div>
        </div>
      ))
    ) : (
      <div className="text-center text-gray-500">
        No se encontraron usuarios
      </div>
    );
  };

  return (
    <>
      <DashboardLayout>
        <PageContainer scrollable>
          <div className="space-y-4">
            <Breadcrumbs
              items={[
                { title: "Dashboard", link: "/dashboard" },
                { title: "Usuarios", link: "/users" }
              ]}
            />
            <div className="flex items-start justify-between">
              <Heading
                description=""
                title="Usuarios"
              />
            </div>
            <div>
              <div className="flex justify-between gap-x-10 mb-3">
                <Input
                  placeholder="Buscar"
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-gray-400"
                />
              </div>
              {renderContent()}
            </div>
          </div>
        </PageContainer>
      </DashboardLayout>

      <Dialog
        open={!!selectedUserId}
        onOpenChange={() => setSelectedUserId(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Historial de Mensajes
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {userMessages.length === 0 ? (
              <div className="text-center text-gray-500">
                No hay mensajes para este usuario
              </div>
            ) : (
              userMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-center border-b py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="mr-4">
                    {getInteractionIcon(message.interactionType)}
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{message.subject}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDistance(new Date(message.interactionAt), new Date(), {
                        addSuffix: true,
                        locale: es
                      })}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(message.interactionAt), 'dd MMM yyyy', { locale: es })}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}