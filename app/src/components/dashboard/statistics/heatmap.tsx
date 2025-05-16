"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HeatmapProps {
  data: Array<{
    xKey: string;
    yKey: string;
    value: number;
  }>;
  xLabels: string[];
  yLabels: string[];
  title: string;
  description: string;
  xAxisTitle: string;
  yAxisTitle: string;
  footerText?: string;
}

export function Heatmap({
  data,
  xLabels,
  yLabels,
  title,
  description,
  xAxisTitle,
  yAxisTitle,
  footerText,
}: HeatmapProps) {
  // Calculate the max value to establish color scale
  const maxValue = Math.max(...data.map((item) => item.value));
  
  // Function to get a color intensity based on value
  const getColor = (value: number): string => {
    // Use a heat-like gradient from light (low) to dark (high)
    const intensity = Math.max(0, Math.min(0.9, value / maxValue));
    return `var(--chart-5) / ${0.1 + intensity * 0.9}`;
  };

  // Helper function to get cell value for a given x,y key pair
  const getCellValue = (xKey: string, yKey: string): number => {
    const cell = data.find(item => item.xKey === xKey && item.yKey === yKey);
    return cell ? cell.value : 0;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mb-2 pl-14 text-center text-sm font-medium">
          {xAxisTitle}
        </div>
        <div className="flex">
          <div className="flex w-14 items-center justify-end pr-2">
            <div 
              className="vertical-text text-sm font-medium"
              style={{
                writingMode: "vertical-rl", 
                transform: "rotate(180deg)",
                whiteSpace: "nowrap"
              }}
            >
              {yAxisTitle}
            </div>
          </div>
          
          <div className="w-full overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-20 p-1"></th>
                  {xLabels.map((label) => (
                    <th key={label} className="p-1 text-xs font-medium">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {yLabels.map((yLabel) => (
                  <tr key={yLabel}>
                    <td className="whitespace-nowrap p-1 text-xs font-medium">
                      {yLabel}
                    </td>
                    {xLabels.map((xLabel) => {
                      const value = getCellValue(xLabel, yLabel);
                      return (
                        <td
                          key={`${xLabel}-${yLabel}`}
                          className="relative p-0 text-center"
                        >
                          <div
                            className="flex h-12 w-full items-center justify-center transition-colors hover:opacity-90"
                            style={{
                              backgroundColor: `hsl(${getColor(value)})`,
                            }}
                            title={`${yLabel} × ${xLabel}: ${value} publications`}
                          >
                            <span className="text-xs font-medium">
                              {value > 0 ? value : ""}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
      {footerText && (
        <CardFooter className="pt-4">
          <div className="text-sm text-muted-foreground">{footerText}</div>
        </CardFooter>
      )}
    </Card>
  );
} 