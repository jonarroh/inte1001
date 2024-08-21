
import { useState } from "react";
import { TennisService } from "./service";
import { inserTennis, selectTennis } from "@server/schema/tennis";
import { useSubmit } from "react-router-dom";

export function useTennisLogic() {
  const [selectedItem, setSelectedItem] = useState<selectTennis>({
    modelo: '',
    id: 0,
    marca: '',
    precio: 0,
    descripcion: null,
    imagen: null,
  });
  const submit = useSubmit();
  const [errors, setErrors] = useState<{ issues: { path: string; message: string }[] } | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleDelete = async (id: number) => {
    submit({
      id: id,
    },{
      action: `/tennis/delete/${id}`, // Asegúrate de incluir el id en la URL
      method: 'POST',
    });

  };

  const onClickEdit = (item: selectTennis) => {
    setSelectedItem(item);
    setIsEditing(true);
  };

  const handleEdit = async (revalidator: { revalidate: () => void }) => {
    const editTenni: inserTennis = {
      marca: selectedItem.marca,
      modelo: selectedItem.modelo,
      precio: selectedItem.precio,
      id: selectedItem.id,
    };
    const result = await new TennisService().updateTennis(editTenni, selectedItem.id);
    if ('success' in result && !result.success) {
      setErrors(result.error.error);
      return result.error.error;
    }
    setSelectedItem({
      modelo: '',
      id: 0,
      marca: '',
      precio: 0,
      descripcion: null,
      imagen: null,
    });
    setIsEditing(false);
    revalidator.revalidate();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) : value;
    setSelectedItem(prev => prev ? { ...prev, [name]: newValue } : prev);
  };

  return {
    selectedItem,
    isEditing,
    errors,
    handleDelete,
    onClickEdit,
    handleEdit,
    handleInputChange,
  };
}
