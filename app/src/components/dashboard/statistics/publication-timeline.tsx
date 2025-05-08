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
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell,
} from "recharts";

interface Publication {
  title: string;
  frequency: string;
  outputType: string;
  month: number; // 1-12 representing the month
  count: number;
}

interface PublicationTimelineProps {
  data: Publication[];
  title: string;
  description: string;
  outputTypes: string[];
  colors: string[];
  footerText?: string;
}

export function PublicationTimeline({
  data,
  title,
  description,
  outputTypes,
  colors,
  footerText,
}: PublicationTimelineProps) {
  // Process the data to aggregate by month and output type
  const timelineData = React.useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    // Create a map to hold counts for each month and output type
    const monthlyCounts: Record<string, Record<string, number>> = {};
    
    // Initialize all months with 0 counts for all output types
    months.forEach((month, index) => {
      monthlyCounts[month] = {};
      outputTypes.forEach(type => {
        monthlyCounts[month][type] = 0;
      });
    });
    
    // Aggregate the data
    data.forEach(pub => {
      if (pub.month >= 1 && pub.month <= 12) {
        const monthName = months[pub.month - 1];
        monthlyCounts[monthName][pub.outputType] += pub.count;
      }
    });
    
    // Convert to the format expected by recharts
    return months.map(month => ({
      name: month,
      ...monthlyCounts[month],
    }));
  }, [data, outputTypes]);

  // Create a custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const totalPublications = payload.reduce(
        (sum: number, entry: any) => sum + entry.value,
        0
      );

      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="font-medium mb-1">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div 
              key={`tooltip-${index}`} 
              className="flex items-center gap-2 text-sm"
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
          <div className="mt-1 pt-1 border-t text-sm font-medium">
            Total: {totalPublications}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={timelineData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                label={{ 
                  value: "Publications", 
                  angle: -90, 
                  position: "insideLeft",
                  style: { textAnchor: "middle" }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              
              {outputTypes.map((type, typeIndex) => (
                <Bar 
                  key={`bar-${type}`}
                  dataKey={type} 
                  stackId="a"
                  name={type}
                  fill={`hsl(${colors[typeIndex % colors.length]})`}
                  radius={typeIndex === outputTypes.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      {footerText && (
        <CardFooter className="pt-2">
          <div className="text-sm text-muted-foreground">{footerText}</div>
        </CardFooter>
      )}
    </Card>
  );
} 