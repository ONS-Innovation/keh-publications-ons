"use client"

import * as React from "react"
import { AppLayout } from "@/components/app-layout"
import { fetchPublicationData } from "@/utils/getData"
import { StatisticsPieChart } from "@/components/dashboard/statistics/pie-chart"
import { createChartConfig } from "@/utils/charts/config"   

interface PublicationData {
  "Publication Title": string;
  "Directorate": string;
  "Division": string;
  "DD": string;
  "BA Lead": string;
  "Frequency": string;
  "Output type": string;
  "PO2 alignment (FY25/26)": string;
}

// Chart colors
const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
]

export default function StatisticsPage() {
  const [data, setData] = React.useState<PublicationData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const csvData = await fetchPublicationData<PublicationData>();
        setData(csvData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Process data for frequency chart
  const frequencyData = React.useMemo(() => {
    if (!data.length) return [];
    
    const frequencyCounts: Record<string, number> = {};
    data.forEach(item => {
      const frequency = item["Frequency"] || "Unknown";
      frequencyCounts[frequency] = (frequencyCounts[frequency] || 0) + 1;
    });
    
    return Object.entries(frequencyCounts).map(([frequency, count], index) => ({
      name: frequency,
      value: count,
      fill: chartColors[index % chartColors.length]
    }));
  }, [data]);

  // Process data for directorate chart
  const directorateData = React.useMemo(() => {
    if (!data.length) return [];
    
    const directorateCounts: Record<string, number> = {};
    data.forEach(item => {
      const directorate = item.Directorate || "Unknown";
      directorateCounts[directorate] = (directorateCounts[directorate] || 0) + 1;
    });
    
    return Object.entries(directorateCounts).map(([directorate, count], index) => ({
      name: directorate,
      value: count,
      fill: chartColors[index % chartColors.length]
    }));
  }, [data]);

  // Process data for output type chart
  const outputTypeData = React.useMemo(() => {
    if (!data.length) return [];
    
    const outputTypeCounts: Record<string, number> = {};
    data.forEach(item => {
      const outputType = item["Output type"] || "Unknown";
      outputTypeCounts[outputType] = (outputTypeCounts[outputType] || 0) + 1;
    });
    
    return Object.entries(outputTypeCounts).map(([outputType, count], index) => ({
      name: outputType,
      value: count,
      fill: chartColors[index % chartColors.length]
    }));
  }, [data]);

  // Process data for PO2 alignment chart
  const alignmentData = React.useMemo(() => {
    if (!data.length) return [];
    
    const alignmentCounts: Record<string, number> = {};
    data.forEach(item => {
      const alignment = item["PO2 alignment (FY25/26)"] || "Unknown";
      alignmentCounts[alignment] = (alignmentCounts[alignment] || 0) + 1;
    });
    
    return Object.entries(alignmentCounts).map(([alignment, count], index) => ({
      name: alignment,
      value: count,
      fill: chartColors[index % chartColors.length]
    }));
  }, [data]);

  return (
    <AppLayout>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading data...</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          <StatisticsPieChart
            title="Publication Frequency"
            description="Distribution by frequency"
            data={frequencyData}
            config={createChartConfig(frequencyData)}
            centerLabel="Types"
            footerText="Distribution of publications by frequency"
          />

          <StatisticsPieChart
            title="Directorate Distribution"
            description="Publications by directorate"
            data={directorateData}
            config={createChartConfig(directorateData)}
            centerLabel="Directorates"
            footerText="Publications grouped by directorate"
          />

          <StatisticsPieChart
            title="Output Types"
            description="Publication output types"
            data={outputTypeData}
            config={createChartConfig(outputTypeData)}
            centerLabel="Types"
            footerText="Distribution by output type category"
          />

          <StatisticsPieChart
            title="PO2 Alignment"
            description="FY25/26 alignment distribution"
            data={alignmentData}
            config={createChartConfig(alignmentData)}
            centerLabel="Categories"
            footerText="Publications by PO2 alignment category"
          />
        </div>
      )}
    </AppLayout>
  )
}