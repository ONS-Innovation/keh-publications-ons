"use client"

import * as React from "react"
import { Label, Pie, PieChart as RechartsPieChart, Cell } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface PieChartProps {
  title: string
  description: string
  data: Array<{ name: string; value: number; fill: string }>
  config: ChartConfig
  centerLabel: string
  footerText: string
}

export function StatisticsPieChart({
  title,
  description,
  data,
  config,
  centerLabel,
  footerText,
}: PieChartProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto w-[400px] h-[300px] flex flex-col"
        >
          <RechartsPieChart
            className="h-[200px]"
            role="img"
            aria-label={title}
          >
            <title>{title}</title>
            <desc>{description}</desc>
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
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
                          {data.length}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {centerLabel}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
              {data.map(({ name, value, fill }) => (
                <Cell
                  key={name}
                  fill={fill}
                  role="img"
                  aria-label={`${name}: ${value}`}
                  tabIndex={-1}
                />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="mt-auto h-[100px] flex-wrap gap-2 [&>*]:basis-1/6 [&>*]:justify-center pb-4"
            />
          </RechartsPieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}