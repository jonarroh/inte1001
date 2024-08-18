import useFetch from "./lib/useFetcht";
import { selectTennis } from "@t/schema/tennis";



function App() {
  const { data, isLoading, error } = useFetch<selectTennis[]>('/tennis');
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Tennis List</h1>
      {data && data.map((tennis) => (
        <div key={tennis.id}>
          <h2>{tennis.marca} - {tennis.modelo}</h2>
          <p>{tennis.descripcion}</p>
          <p>Price: ${tennis.precio}</p>
          <p>Stock: {tennis.modelo}</p>
        </div>
      ))}
    </div>
  );
};

export default App
