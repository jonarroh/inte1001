import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, Mail } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { selectExternalUserInteractions } from '@server/schema/badge';

const MessageHistory = () => {
  const [interactions, setInteractions] = useState<selectExternalUserInteractions[] | null>(null);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const res = await fetch('http://localhost:3000/external/email');
        const data = await res.json();
        setInteractions(data);
      } catch (error) {
        console.error('Failed to fetch interactions:', error);
      }
    };

    fetchInteractions();
  }, []);

  return (
    <Card className="w-full max-w-md max-h-80 overflow-scroll">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" /> Historial de Mensajes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {interactions?.map((interaction) => (
            <div
              key={interaction.id}
              className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 mr-4">
                <h3 className="font-semibold text-sm">{interaction.subject}</h3>
                <p className="text-xs text-gray-500 truncate max-w-[200px]">
                  {interaction.interactionData}
                </p>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {formatDistance(new Date(interaction.interactionAt), new Date(), {
                  addSuffix: true,
                  locale: es
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageHistory;