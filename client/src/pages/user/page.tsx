import { Await, defer, LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router-dom";
import { selectLocation } from "@server/schema/location";
import { Suspense, useState } from "react";
import DashboardLayout from "@/components/layout/app";
import PageContainer from "@/components/templates/page-container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Label, XAxis, YAxis } from "recharts";
import { Pie, PieChart } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    promos: fetch('https:', {

    }),

    // actividad en la pagina | Bar Chart - Interactive | fecha - logetcount - nologetcount
    actividad: fetch(''),

    // cantidad usuarios por badge
    badges: fetch(''),

    // salon mas usado barras normal
    lugares: fetch(''),
  });
}

export default function UserPage() {
  const nav = useNavigate();
  const data = useLoaderData() as {
    device: { deviceType: string, count: number, browser: string }[],
    both: { logged: selectLocation[], notLogged: selectLocation[], loggedCount: number, notLoggedCount: number }
  };

  const chartConfig = {
    visitors: { label: "Usuarios totales" },
    logged: { label: "Usuarios logeados", color: "hsl(var(--chart-1))" },
    notLogged: { label: "Usuarios no logeados", color: "hsl(var(--chart-2))" }
  } satisfies ChartConfig;

  const deviceChartConfig = {
    visitors: { label: "Usuarios totales" },
    desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
    mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
    tablet: { label: "Tablet", color: "hsl(var(--chart-3))" }
  } satisfies ChartConfig;

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]

  const chartData2 = [
    { year: "2019", kids: 186, adults: 80 },
    { year: "2020", kids: 305, adults: 200 },
    { year: "2021", kids: 237, adults: 120 },
    { year: "2022", kids: 73, adults: 190 },
    { year: "2023", kids: 209, adults: 130 },
    { year: "2024", kids: 214, adults: 140 },
  ]

  const chartData3 = [
    { videogame: "Halo", sell: 234, price: 30 },
    { videogame: "Fifa", sell: 305, price: 60 },
    { videogame: "Call of Duty", sell: 237, price: 80 },
    { videogame: "GTA", sell: 73, price: 90 },
    { videogame: "Minecraft", sell: 209, price: 20 },
    { videogame: "Fortnite", sell: 214, price: 10 },
  ]

  const chartConfig2 = {
    chartData: {
      keys: ["desktop", "mobile"],
      labels: { desktop: "Desktop", mobile: "Mobile" },
      colors: { desktop: "#2563eb", mobile: "#60a5fa" },
      xAxisKey: "month",
    },
    chartData2: {
      keys: ["kids", "adults"],
      labels: { kids: "Kids", adults: "Adults" },
      colors: { kids: "#4caf50", adults: "#ff5722" },
      xAxisKey: "year",
    },
    chartData3: {
      keys: ["sell", "price"],
      labels: { sell: "Sell", price: "Price" },
      colors: { sell: "#934CAFFF", price: "#22FFB9FF" },
      xAxisKey: "videogame",
    },
  };


  const handleChartChange = (value: string) => {
    nav(`/stats/?date=${value}`);
  };

  // const currentChartData = selectedChart === "chartData" ? chartData : selectedChart === "chartData2" ? chartData2 : chartData3;
  // const currentConfig = chartConfig2[selectedChart];


  return (
    <DashboardLayout>
      <PageContainer scrollable>
        <div className="space-y-4">
          <Breadcrumbs items={[{ title: "Dashboard", link: "/dashboard" }, { title: "Chat", link: "/badges" }]} />

          <div className="flex items-start justify-between">
            <Heading description="Información general" title="Graficas" />
          </div>

          <div>
            <div className="flex gap-x-10 mb-3">
              <div className="w-full bg-white h-screen ">
                <Card className="h-full w-full">
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
                                <p className="block text-sm font-medium text-gray-700text-center mb-4">Dispositivos</p>


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
            </div>
          </div>
          <div>
            <div className="flex gap-x-10 mb-3">
              <div className="w-50 bg-white h-screen">
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
            </div>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
