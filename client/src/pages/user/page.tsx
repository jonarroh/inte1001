import { Await, defer, useLoaderData, useRevalidator } from "react-router-dom";
import { Globe } from "../../components/ui/globe";
import { selectLocation } from "@server/schema/location";
import { Marker } from "cobe";
import { Suspense, useEffect } from "react";


export async function loader() {
  const response = fetch('http://localhost:3000/location/logged', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      date: 'lastYear'
    })
  }).then((res) => res.json());


  return defer({
    p: response
  })

}


export default function UserPage() {

  const data = useLoaderData() as { p: selectLocation[] };
  let revalidator = useRevalidator();

  useEffect(() => {
    const interval = setInterval(() => {
      if (revalidator.state === 'idle') {
        revalidator.revalidate();
      }
    }
      , 100000);
    return () => clearInterval(interval);
  }, [revalidator]);

  console.log(data);


  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data.p}>
          {data => <Globe
            baseColor="#777A80"
            glowColor="#50505A"
            markerColor="#22d3ee"
            opacity={0.85}
            brightness={1}
            offsetX={320}
            offsetY={64}
            scale={1.125}
            markers={data.map((location: any) => ({
              location: [location.latitude, location.longitude],
              size: 0.1,
            }))}
          />}
        </Await>
      </Suspense>
    </>
  )
} 