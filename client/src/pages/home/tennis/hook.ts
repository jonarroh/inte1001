import { useNavigate, useSubmit } from "react-router-dom";

export function useTennisLogic() {
  //el hook useSubmit() nos permite de manera programática enviar una petición al servidor
  //documentación: https://reactrouter.com/en/main/hooks/use-submit
  const submit = useSubmit();
  //el hook useNavigate() nos permite navegar a una ruta de manera programática
  //documentación: https://reactrouter.com/en/main/hooks/use-navigate
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    submit({
      id: id,
    },{
      action: `/tennis/delete/${id}`, // Asegúrate de incluir el id en la URL
      method: 'POST',
    });

  };

  const onClickEdit = (id: number) => {
    console.log(id);
    navigate(`/tennis/update/${id}`);
  };

  return {
    handleDelete,
    onClickEdit,
  };
}
