import { useLoaderData } from "react-router-dom";
import { Globe } from "../../components/ui/globe";
import { selectLocation } from "@server/schema/location";
import { Marker } from "cobe";


export async function loader() {
  const response = await fetch('http://localhost:3000/location');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data: selectLocation[] = await response.json();
  return data;
}


export default function UserPage() {

  const data = useLoaderData() as selectLocation[];

  const locations: Marker[] = data.map((location) => ({
    location: [location.latitude, location.longitude],
    size: 0.1,
  }));



  return (
    <Globe
      baseColor="#777A80"
      glowColor="#50505A"
      markerColor="#22d3ee"
      opacity={0.85}
      brightness={1}
      offsetX={320}
      offsetY={64}
      scale={1.125}
      markers={locations}
    />
  )
} 