import { Await, defer, LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router-dom";
import { selectLocation } from "@server/schema/location";
import React, { Suspense, useState } from "react";
import DashboardLayout from "@/components/layout/app";
import PageContainer from "@/components/templates/page-container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Label, XAxis, YAxis } from "recharts";
import { Pie, PieChart, LabelList, Line, LineChart } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car } from "lucide-react";
import { table } from "console";

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const date = url.searchParams.get('date') ?? 'lastMonth';

  return defer({
    both: fetch('http://localhost:3000/location/both', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date })
    }).then((res) => res.json()),

    device: fetch('http://localhost:3000/location/device', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date })
    }).then((res) => res.json()),

    // productos mas comprados
    promos: fetch(`https://localhost:7268/api/Orders/getBestSellers/${date}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json()),

    // actividad en la pagina | Bar Chart - Interactive | fecha - logetcount - nologetcount
    actividad: fetch(''),

    // cantidad usuarios por badge
    badges: fetch('http://localhost:3000/badge/usersPerBadge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date })
    }).then((res) => res.json()),

    // salon mas usado barras normal
    lugares: fetch(`https://localhost:7268/api/Espacios/espacioMasSolicitado/${date}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json()),
  });
}

export default function UserPage() {
  const nav = useNavigate();

  const data = useLoaderData() as {
    device: { deviceType: string, count: number, browser: string }[],
    both: { logged: selectLocation[], notLogged: selectLocation[], loggedCount: number, notLoggedCount: number },
    promos: { ordersDeliver: number, ordersNoDeliver: number },
    lugares: { reservasEspacio: number, personasEspacio: number, nombreEspacio: string },
    badges: { badge: string, userCount: number },
  };

  const actividadData = [
    { date: "2024-04-01", desktop: 222, mobile: 150, tablet: 100 },
    { date: "2024-04-02", desktop: 97, mobile: 180, tablet: 120 },
    { date: "2024-04-03", desktop: 167, mobile: 120, tablet: 80 },
    { date: "2024-04-04", desktop: 242, mobile: 260, tablet: 200 },
    { date: "2024-04-05", desktop: 373, mobile: 290, tablet: 250 },
    { date: "2024-04-06", desktop: 301, mobile: 340, tablet: 300 },
    { date: "2024-04-07", desktop: 245, mobile: 180, tablet: 150 },
    { date: "2024-04-08", desktop: 409, mobile: 320, tablet: 270 },
    { date: "2024-04-09", desktop: 59, mobile: 110, tablet: 70 },
    { date: "2024-04-10", desktop: 261, mobile: 190, tablet: 150 },
    { date: "2024-04-11", desktop: 327, mobile: 350, tablet: 300 },
    { date: "2024-04-12", desktop: 292, mobile: 210, tablet: 170 },
    { date: "2024-04-13", desktop: 342, mobile: 380, tablet: 330 },
    { date: "2024-04-14", desktop: 137, mobile: 220, tablet: 180 },
    { date: "2024-04-15", desktop: 120, mobile: 170, tablet: 130 },
    { date: "2024-04-16", desktop: 138, mobile: 190, tablet: 150 },
    { date: "2024-04-17", desktop: 446, mobile: 360, tablet: 310 },
    { date: "2024-04-18", desktop: 364, mobile: 410, tablet: 350 },
    { date: "2024-04-19", desktop: 243, mobile: 180, tablet: 140 },
    { date: "2024-04-20", desktop: 89, mobile: 150, tablet: 100 },
    { date: "2024-04-21", desktop: 137, mobile: 200, tablet: 160 },
    { date: "2024-04-22", desktop: 224, mobile: 170, tablet: 130 },
    { date: "2024-04-23", desktop: 138, mobile: 230, tablet: 190 },
    { date: "2024-04-24", desktop: 387, mobile: 290, tablet: 250 },
    { date: "2024-04-25", desktop: 215, mobile: 250, tablet: 200 },
    { date: "2024-04-26", desktop: 75, mobile: 130, tablet: 90 },
    { date: "2024-04-27", desktop: 383, mobile: 420, tablet: 370 },
    { date: "2024-04-28", desktop: 122, mobile: 180, tablet: 140 },
    { date: "2024-04-29", desktop: 315, mobile: 240, tablet: 200 },
    { date: "2024-04-30", desktop: 454, mobile: 380, tablet: 330 },
    { date: "2024-05-01", desktop: 165, mobile: 220, tablet: 180 },
    { date: "2024-05-02", desktop: 293, mobile: 310, tablet: 260 },
    { date: "2024-05-03", desktop: 247, mobile: 190, tablet: 150 },
    { date: "2024-05-04", desktop: 385, mobile: 420, tablet: 370 },
    { date: "2024-05-05", desktop: 481, mobile: 390, tablet: 340 },
    { date: "2024-05-06", desktop: 498, mobile: 520, tablet: 470 },
    { date: "2024-05-07", desktop: 388, mobile: 300, tablet: 250 },
    { date: "2024-05-08", desktop: 149, mobile: 210, tablet: 170 },
    { date: "2024-05-09", desktop: 227, mobile: 180, tablet: 140 },
    { date: "2024-05-10", desktop: 293, mobile: 330, tablet: 280 },
    { date: "2024-05-11", desktop: 335, mobile: 270, tablet: 220 },
    { date: "2024-05-12", desktop: 197, mobile: 240, tablet: 200 },
    { date: "2024-05-13", desktop: 197, mobile: 160, tablet: 120 },
    { date: "2024-05-14", desktop: 448, mobile: 490, tablet: 430 },
    { date: "2024-05-15", desktop: 473, mobile: 380, tablet: 330 },
    { date: "2024-05-16", desktop: 338, mobile: 400, tablet: 350 },
    { date: "2024-05-17", desktop: 499, mobile: 420, tablet: 370 },
    { date: "2024-05-18", desktop: 315, mobile: 350, tablet: 300 },
    { date: "2024-05-19", desktop: 235, mobile: 180, tablet: 140 },
    { date: "2024-05-20", desktop: 177, mobile: 230, tablet: 190 },
    { date: "2024-05-21", desktop: 82, mobile: 140, tablet: 100 },
    { date: "2024-05-22", desktop: 81, mobile: 120, tablet: 80 },
    { date: "2024-05-23", desktop: 252, mobile: 290, tablet: 240 },
    { date: "2024-05-24", desktop: 294, mobile: 220, tablet: 180 },
    { date: "2024-05-25", desktop: 201, mobile: 250, tablet: 200 },
    { date: "2024-05-26", desktop: 213, mobile: 170, tablet: 130 },
    { date: "2024-05-27", desktop: 420, mobile: 460, tablet: 400 },
    { date: "2024-05-28", desktop: 233, mobile: 190, tablet: 150 },
    { date: "2024-05-29", desktop: 78, mobile: 130, tablet: 90 },
    { date: "2024-05-30", desktop: 340, mobile: 280, tablet: 230 },
    { date: "2024-05-31", desktop: 178, mobile: 230, tablet: 190 },
    { date: "2024-06-01", desktop: 178, mobile: 200, tablet: 160 },
    { date: "2024-06-02", desktop: 470, mobile: 410, tablet: 360 },
    { date: "2024-06-03", desktop: 103, mobile: 160, tablet: 120 },
    { date: "2024-06-04", desktop: 439, mobile: 380, tablet: 330 },
    { date: "2024-06-05", desktop: 88, mobile: 140, tablet: 100 },
    { date: "2024-06-06", desktop: 294, mobile: 250, tablet: 200 },
    { date: "2024-06-07", desktop: 323, mobile: 370, tablet: 320 },
    { date: "2024-06-08", desktop: 385, mobile: 320, tablet: 270 },
    { date: "2024-06-09", desktop: 438, mobile: 480, tablet: 430 },
    { date: "2024-06-10", desktop: 155, mobile: 200, tablet: 160 },
    { date: "2024-06-11", desktop: 92, mobile: 150, tablet: 110 },
    { date: "2024-06-12", desktop: 492, mobile: 420, tablet: 370 },
    { date: "2024-06-13", desktop: 81, mobile: 130, tablet: 90 },
    { date: "2024-06-14", desktop: 426, mobile: 380, tablet: 330 },
    { date: "2024-06-15", desktop: 307, mobile: 350, tablet: 300 },
    { date: "2024-06-16", desktop: 371, mobile: 310, tablet: 260 },
    { date: "2024-06-17", desktop: 475, mobile: 520, tablet: 470 },
    { date: "2024-06-18", desktop: 107, mobile: 170, tablet: 130 },
    { date: "2024-06-19", desktop: 341, mobile: 290, tablet: 240 },
    { date: "2024-06-20", desktop: 408, mobile: 450, tablet: 400 },
    { date: "2024-06-21", desktop: 169, mobile: 210, tablet: 170 },
    { date: "2024-06-22", desktop: 317, mobile: 270, tablet: 220 },
    { date: "2024-06-23", desktop: 480, mobile: 530, tablet: 480 },
    { date: "2024-06-24", desktop: 132, mobile: 180, tablet: 140 },
    { date: "2024-06-25", desktop: 141, mobile: 190, tablet: 150 },
    { date: "2024-06-26", desktop: 434, mobile: 380, tablet: 330 },
    { date: "2024-06-27", desktop: 448, mobile: 490, tablet: 430 },
    { date: "2024-06-28", desktop: 149, mobile: 200, tablet: 160 },
    { date: "2024-06-29", desktop: 103, mobile: 160, tablet: 120 },
    { date: "2024-06-30", desktop: 446, mobile: 400, tablet: 350 },
  ];

  const chartConfig = {
    visitors: { label: "Usuarios totales" },
    logged: { label: "Usuarios logeados", color: "hsl(var(--chart-1))" },
    notLogged: { label: "Usuarios no logeados", color: "hsl(var(--chart-2))" }
  } satisfies ChartConfig;

  const promosChartConfig = {
    ordersDeliver: { label: "Ordenes entregadas", color: "hsl(var(--chart-1))" },
    ordersNoDeliver: { label: "Ordenes no entregadas", color: "hsl(var(--chart-2))" }
  } satisfies ChartConfig;

  const deviceChartConfig = {
    visitors: { label: "Usuarios totales" },
    desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
    mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
    tablet: { label: "Tablet", color: "hsl(var(--chart-3))" }
  } satisfies ChartConfig;

  const espaciosChartConfig = {
    reservasEspacio: { label: "Reservas", color: "hsl(var(--chart-1))" },
    personasEspacio: { label: "Personas", color: "hsl(var(--chart-2))" }
  } satisfies ChartConfig;

  const badgeschartConfig = {
    userCount: { label: "Usuarios" }
  } satisfies ChartConfig;

  const actividadChartConfig = {
    views: {
      label: "Visitas totales",
    },
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
    tablet: {
      label: "Tablet",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof actividadChartConfig>("desktop")
  const total = React.useMemo(
    () => ({
      desktop: actividadData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: actividadData.reduce((acc, curr) => acc + curr.mobile, 0),
      tablet: actividadData.reduce((acc, curr) => acc + curr.tablet, 0),
    }),
    []
  )


  const handleChartChange = (value: string) => {
    nav(`/stats/?date=${value}`);
  };

  return (
    <DashboardLayout>
      <PageContainer scrollable>
        <div className="space-y-4">
          <Breadcrumbs items={[{ title: "Dashboard", link: "/dashboard" }]} />

          <div className="flex items-start justify-between">
            <Heading description="Información general" title="Graficas" />
          </div>
          <div className="w-50 bg-white">
            <Select onValueChange={handleChartChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="yesterday">Ayer</SelectItem>
                  <SelectItem value="lastWeek">Última semana</SelectItem>
                  <SelectItem value="lastMonth">Último mes</SelectItem>
                  <SelectItem value="lastYear">Último año</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            {/* Charts 4 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="w-50 bg-white h-50 ">
                <Card className="h-50 w-50">
                  <CardHeader>
                    <CardTitle>Información de ubicación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between gap-4">
                      {/* Pie Chart */}
                      <div className="flex-1">
                        <Suspense fallback={<Skeleton className="w-full h-full" />}>
                          <Await resolve={data.both}>
                            {(data: { logged: selectLocation[], notLogged: selectLocation[], loggedCount: number, notLoggedCount: number }) => (
                              <>
                                <p className="block text-sm font-medium text-gray-700
                                text-center mb-4
                                ">Usuarios totales</p>
                                <ChartContainer
                                  config={chartConfig}
                                  className="mx-auto aspect-square max-h-[250px] mb-4"
                                >
                                  <PieChart title="Usuarios totales">
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Pie
                                      data={[
                                        { browser: "Logged", visitors: data.loggedCount, fill: "hsl(var(--chart-1))" },
                                        { browser: "Not logged", visitors: data.notLoggedCount, fill: "hsl(var(--chart-2))" }
                                      ]}
                                      dataKey="visitors"
                                      nameKey="browser"
                                      innerRadius={60}
                                      strokeWidth={5}
                                    >
                                      <Label
                                        content={({ viewBox }) => {
                                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                              <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                              >
                                                <tspan
                                                  x={viewBox.cx}
                                                  y={viewBox.cy}
                                                  className="fill-foreground text-3xl font-bold"
                                                >
                                                  {data.loggedCount + data.notLoggedCount}
                                                </tspan>
                                                <tspan
                                                  x={viewBox.cx}
                                                  y={(viewBox.cy || 0) + 24}
                                                  className="fill-muted-foreground"
                                                >
                                                  Visitors
                                                </tspan>
                                              </text>
                                            );
                                          }
                                        }}
                                      />
                                    </Pie>
                                  </PieChart>
                                </ChartContainer>
                              </>
                            )}
                          </Await>
                        </Suspense>
                      </div>

                      {/* Bar Chart */}
                      <div className="flex-1">
                        <Suspense fallback={<Skeleton className="w-full h-full" />}>
                          <Await resolve={data.device}>
                            {(deviceData: { deviceType: string, count: number, browser: string }[]) => (
                              <>
                                <p className="block text-sm font-medium text-gray-700 mb-4 text-center">Dispositivos</p>
                                <ChartContainer
                                  config={deviceChartConfig}
                                  className="mx-auto aspect-square max-h-[250px]"
                                >
                                  <BarChart
                                    accessibilityLayer
                                    data={[
                                      { browser: "Desktop", visitors: deviceData.find((item) => item.deviceType === "Desktop")?.count || 0, fill: "hsl(var(--chart-1))" },
                                      { browser: "Mobile", visitors: deviceData.find((item) => item.deviceType === "Mobile")?.count || 0, fill: "hsl(var(--chart-2))" },
                                      { browser: "Tablet", visitors: deviceData.find((item) => item.deviceType === "Tablet")?.count || 0, fill: "hsl(var(--chart-3))" }
                                    ]}
                                    layout="vertical"
                                    margin={{
                                      left: 0,
                                    }}
                                  >
                                    <YAxis
                                      dataKey="browser"
                                      type="category"
                                      tickLine={false}
                                      tickMargin={10}
                                      axisLine={false}
                                      tickFormatter={(value) =>
                                        deviceChartConfig[value as keyof typeof deviceChartConfig]?.label || value
                                      }
                                    />
                                    <XAxis dataKey="visitors" type="number" hide />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Bar dataKey="visitors" layout="vertical" radius={5} />
                                  </BarChart>
                                </ChartContainer>
                              </>
                            )}
                          </Await>
                        </Suspense>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="w-50 bg-white h-50">
                <Card className="h-50 w-50">
                  <CardHeader>
                    <CardTitle>Información de las ordenes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between gap-4">
                      <div className="flex-1">
                        <Suspense fallback={<Skeleton className="w-full h-full" />}>
                          <Await resolve={data.promos}>
                            {(data: { ordersDeliver: number, ordersNoDeliver: number }) => (
                              <>
                                <p className="block text-sm font-medium text-gray-700 mb-4 text-center">Ordenes realizadas por clientes</p>

                                <ChartContainer config={promosChartConfig} className="mx-auto aspect-square max-h-[265px] px-0">
                                  <PieChart>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Pie
                                      data={[
                                        { name: "Ordenes a domicilio: ", value: data.ordersDeliver, fill: "hsl(var(--chart-1))" },
                                        { name: "Ordenes en tienda: ", value: data.ordersNoDeliver, fill: "hsl(var(--chart-2))" }
                                      ]}
                                      dataKey="value"
                                      nameKey="name"
                                      strokeWidth={5}
                                    >
                                      <Label
                                        content={({ viewBox }) => {
                                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                              <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle" className="text-white" textDecoration="text-white"
                                              >
                                                <tspan
                                                  x={viewBox.cx}
                                                  y={viewBox.cy}
                                                  className="fill-white text-3xl font-bold"
                                                >
                                                  {data.ordersDeliver + data.ordersNoDeliver}
                                                </tspan>
                                                <tspan
                                                  x={viewBox.cx}
                                                  y={(viewBox.cy || 0) + 24}
                                                  className="fill-white"
                                                >
                                                  Ordenes
                                                </tspan>
                                              </text>
                                            );
                                          }
                                        }}
                                      />
                                    </Pie>
                                  </PieChart>
                                </ChartContainer>
                              </>
                            )}
                          </Await>
                        </Suspense>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="w-50 bg-white h-50">
                <Card className="h-50 w-50">
                  <CardHeader>
                    <CardTitle>Información de los espacios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between gap-4">
                      <div className="flex-1">
                        <Suspense fallback={<Skeleton className="w-full h-full" />}>
                          <Await resolve={data.lugares}>
                            {(espaciosData: { reservasEspacio: number, personasEspacio: number, nombreEspacio: string }) => (
                              <>
                                <p className="block text-sm font-medium text-gray-700 mb-4 text-center">Espacio más reservado - "{espaciosData.nombreEspacio}" </p>
                                <ChartContainer config={espaciosChartConfig} className="mx-auto aspect-square max-h-[250px]">
                                  <BarChart
                                    accessibilityLayer
                                    data={[
                                      { nombre: "Total de reservas", reservas: espaciosData.reservasEspacio, fill: "hsl(var(--chart-1))" },
                                      { nombre: "Capacidad de personas", reservas: espaciosData.personasEspacio, fill: "hsl(var(--chart-2))" }
                                    ]}
                                    layout="vertical"
                                    margin={{
                                      right: 16,
                                    }}
                                  >
                                    <CartesianGrid horizontal={false} />
                                    <YAxis
                                      dataKey="nombre"
                                      type="category"
                                      tickLine={false}
                                      tickMargin={10}
                                      axisLine={false}
                                      tickFormatter={(value) => value.slice(0, 3)}
                                      hide
                                    />
                                    <XAxis dataKey="reservas" type="number" hide />
                                    <ChartTooltip
                                      cursor={false}
                                      content={<ChartTooltipContent indicator="line" />}
                                    />
                                    <Bar
                                      dataKey="reservas"
                                      layout="vertical"
                                      fill="var(--color-desktop)"
                                      radius={4}
                                    >
                                      <LabelList
                                        dataKey="nombre"
                                        position="insideLeft"
                                        offset={8}
                                        className="fill-[--color-label]"
                                        fontSize={12}
                                      />
                                      <LabelList
                                        dataKey="reservas"
                                        position="right"
                                        offset={8}
                                        className="fill-foreground"
                                        fontSize={12}
                                      />
                                    </Bar>
                                  </BarChart>
                                </ChartContainer>
                              </>
                            )}
                          </Await>
                        </Suspense>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="w-50 bg-white h-50">
                <Card className="h-50 w-50">
                  <CardHeader>
                    <CardTitle>Información de Insignias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between gap-4">
                      <div className="flex-1">
                        <Suspense fallback={<Skeleton className="w-full h-full" />}>
                          <Await resolve={data.badges}>
                            {(data: { badge: string, userCount: number }[]) => (
                              <>
                                <p className="block text-sm font-medium text-gray-700 mb-4 text-center">Usuarios por Insignias</p>

                                <ChartContainer config={badgeschartConfig} className="mx-auto aspect-square max-h-[250px]">
                                  <LineChart
                                    accessibilityLayer
                                    data={data.map((badgeData) => ({
                                      badge: badgeData.badge,
                                      userCount: badgeData.userCount,
                                    }))}
                                    margin={{
                                      top: 20,
                                      left: 12,
                                      right: 12,
                                    }}
                                  >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                      dataKey="badge"
                                      tickLine={false}
                                      axisLine={false}
                                      tickMargin={8}
                                      tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip
                                      cursor={false}
                                      content={<ChartTooltipContent indicator="line" />}
                                    />
                                    <Line
                                      dataKey="userCount"
                                      type="natural"
                                      stroke="hsl(var(--chart-1))"
                                      strokeWidth={2}
                                      dot={{
                                        fill: "hsl(var(--chart-1))",
                                      }}
                                      activeDot={{
                                        r: 6,
                                      }}
                                    >
                                      <LabelList
                                        position="top"
                                        offset={12}
                                        className="fill-foreground"
                                        fontSize={12}
                                      />
                                    </Line>
                                  </LineChart>
                                </ChartContainer>
                              </>
                            )}
                          </Await>
                        </Suspense>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Chart de actividad de la página */}
            <div className="grid grid-cols-1 gap-4 mt-4">
              <Card>
                <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Información sobre la actividad en la página</CardTitle>
                  </div>
                  <div className="flex">
                    {["desktop", "mobile", "tablet"].map((key) => {
                      const chart = key as keyof typeof actividadChartConfig
                      return (
                        <button
                          key={chart}
                          data-active={activeChart === chart}
                          className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                          onClick={() => setActiveChart(chart)}
                        >
                          <span className="text-xs text-muted-foreground">
                            {actividadChartConfig[chart].label}
                          </span>
                          <span className="text-lg font-bold leading-none sm:text-3xl">
                            {total[key as keyof typeof total].toLocaleString()}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </CardHeader>
                <CardContent className="px-2 sm:p-6">
                  <ChartContainer
                    config={actividadChartConfig}
                    className="aspect-auto h-[250px] w-full"
                  >
                    <BarChart
                      accessibilityLayer
                      data={actividadData}
                      margin={{
                        left: 12,
                        right: 12,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        }}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            className="w-[150px]"
                            nameKey="views"
                            labelFormatter={(value) => {
                              return new Date(value).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            }}
                          />
                        }
                      />
                      <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
