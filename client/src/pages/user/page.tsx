import { Await, defer, useLoaderData } from "react-router-dom";
import { selectLocation } from "@server/schema/location";
import { Suspense } from "react";
import DashboardLayout from "@/components/layout/app";
import PageContainer from "@/components/templates/page-container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Label, XAxis, YAxis } from "recharts";
import { Pie, PieChart } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export function loader() {
  return defer({
    both: fetch('http://localhost:3000/location/both', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: 'lastYear' })
    }).then((res) => res.json()),

    device: fetch('http://localhost:3000/location/device', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: 'lastYear' })
    }).then((res) => res.json())
  });
}

export default function UserPage() {
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

  return (
    <DashboardLayout>
      <PageContainer scrollable>
        <div className="space-y-4">
          <Breadcrumbs items={[{ title: "Dashboard", link: "/dashboard" }, { title: "Chat", link: "/badges" }]} />

          <div className="flex items-start justify-between">
            <Heading description="Información general" title="Chat" />
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
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
