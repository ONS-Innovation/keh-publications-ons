"use client";

import * as React from "react";
import { AppLayout } from "@/components/app-layout";
import { fetchPublicationData } from "@/utils/getData";
import { StatisticsPieChart } from "@/components/dashboard/statistics/pie-chart";
import { createChartConfig } from "@/utils/charts/config";
import { StackedBarChart } from "@/components/dashboard/statistics/stacked-bar-chart";
import { Heatmap } from "@/components/dashboard/statistics/heatmap";
import { PublicationTimeline } from "@/components/dashboard/statistics/publication-timeline";

interface PublicationData {
  "Publication Title": string;
  Directorate: string;
  Division: string;
  DD: string;
  "BA Lead": string;
  Frequency: string;
  "Output type": string;
  "PO2 alignment (FY25/26)": string;
}

// Chart colors
const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

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
    data.forEach((item) => {
      const frequency = item["Frequency"] || "Unknown";
      frequencyCounts[frequency] = (frequencyCounts[frequency] || 0) + 1;
    });

    return Object.entries(frequencyCounts).map(([frequency, count], index) => ({
      name: frequency,
      value: count,
      fill: `hsl(${chartColors[index % chartColors.length]})`,
    }));
  }, [data]);

  // Process data for directorate chart
  const directorateData = React.useMemo(() => {
    if (!data.length) return [];

    const directorateCounts: Record<string, number> = {};
    data.forEach((item) => {
      const directorate = item.Directorate || "Unknown";
      directorateCounts[directorate] =
        (directorateCounts[directorate] || 0) + 1;
    });

    return Object.entries(directorateCounts).map(
      ([directorate, count], index) => ({
        name: directorate,
        value: count,
        fill: `hsl(${chartColors[index % chartColors.length]})`,
      })
    );
  }, [data]);

  // Process data for output type chart
  const outputTypeData = React.useMemo(() => {
    if (!data.length) return [];

    const outputTypeCounts: Record<string, number> = {};
    data.forEach((item) => {
      const outputType = item["Output type"] || "Unknown";
      outputTypeCounts[outputType] = (outputTypeCounts[outputType] || 0) + 1;
    });

    return Object.entries(outputTypeCounts).map(
      ([outputType, count], index) => ({
        name: outputType,
        value: count,
        fill: `hsl(${chartColors[index % chartColors.length]})`,
      })
    );
  }, [data]);

  // Process data for PO2 alignment chart
  const alignmentData = React.useMemo(() => {
    if (!data.length) return [];

    const alignmentCounts: Record<string, number> = {};
    data.forEach((item) => {
      const alignment = item["PO2 alignment (FY25/26)"] || "Unknown";
      alignmentCounts[alignment] = (alignmentCounts[alignment] || 0) + 1;
    });

    return Object.entries(alignmentCounts).map(([alignment, count], index) => ({
      name: alignment,
      value: count,
      fill: `hsl(${chartColors[index % chartColors.length]})`,
    }));
  }, [data]);

  // Process data for stacked bar chart (Frequency vs Output Type)
  const stackedBarData = React.useMemo(() => {
    if (!data.length) return [];

    const frequencies = [
      ...new Set(data.map((item) => item["Frequency"] || "Unknown")),
    ];
    const outputTypes = [
      ...new Set(data.map((item) => item["Output type"] || "Unknown")),
    ];

    // Create a frequency map with counts for each output type
    const frequencyMap: Record<string, Record<string, number>> = {};

    // Initialize with zeros
    frequencies.forEach((frequency) => {
      frequencyMap[frequency] = {};
      outputTypes.forEach((type) => {
        frequencyMap[frequency][type] = 0;
      });
    });

    // Count publications for each frequency and output type
    data.forEach((item) => {
      const frequency = item["Frequency"] || "Unknown";
      const outputType = item["Output type"] || "Unknown";
      frequencyMap[frequency][outputType]++;
    });

    // Convert to format needed for stacked bar chart
    return frequencies.map((frequency) => ({
      name: frequency,
      ...frequencyMap[frequency],
    }));
  }, [data]);

  // Extract unique output types for the stacked bar chart
  const uniqueOutputTypes = React.useMemo(() => {
    return [...new Set(data.map((item) => item["Output type"] || "Unknown"))];
  }, [data]);

  // Process data for heatmap (Frequency vs Output Type)
  const heatmapData = React.useMemo(() => {
    if (!data.length) return [];

    const result: Array<{ xKey: string; yKey: string; value: number }> = [];

    const frequencies = [
      ...new Set(data.map((item) => item["Frequency"] || "Unknown")),
    ];
    const outputTypes = [
      ...new Set(data.map((item) => item["Output type"] || "Unknown")),
    ];

    // Create a frequency-outputType map with counts
    const countMap: Record<string, Record<string, number>> = {};

    // Initialize with zeros
    frequencies.forEach((frequency) => {
      countMap[frequency] = {};
      outputTypes.forEach((type) => {
        countMap[frequency][type] = 0;
      });
    });

    // Count publications for each frequency and output type
    data.forEach((item) => {
      const frequency = item["Frequency"] || "Unknown";
      const outputType = item["Output type"] || "Unknown";
      countMap[frequency][outputType]++;
    });

    // Convert to format needed for heatmap
    frequencies.forEach((frequency) => {
      outputTypes.forEach((outputType) => {
        result.push({
          xKey: outputType,
          yKey: frequency,
          value: countMap[frequency][outputType],
        });
      });
    });

    return result;
  }, [data]);

  // Process data for sankey diagram (Frequency → Output Type → PO2 alignment)
  const sankeyData = React.useMemo(() => {
    if (!data.length) return { nodes: [], links: [] };

    const frequencies = [
      ...new Set(data.map((item) => item["Frequency"] || "Unknown")),
    ];
    const outputTypes = [
      ...new Set(data.map((item) => item["Output type"] || "Unknown")),
    ];
    const alignments = [
      ...new Set(
        data.map((item) => item["PO2 alignment (FY25/26)"] || "Unknown")
      ),
    ];

    // Create nodes for sankey diagram
    const nodes = [
      // Frequency nodes
      ...frequencies.map((freq) => ({ name: freq, category: "Frequency" })),
      // Output Type nodes
      ...outputTypes.map((type) => ({ name: type, category: "Output type" })),
      // PO2 Alignment nodes
      ...alignments.map((align) => ({
        name: align,
        category: "PO2 alignment",
      })),
    ];

    // Create links between nodes
    const links: Array<{ source: number; target: number; value: number }> = [];

    // Create a mapping of node name to index
    const nodeIndex: Record<string, number> = {};
    nodes.forEach((node, index) => {
      nodeIndex[`${node.category}|${node.name}`] = index;
    });

    // Helper to count links
    const linkCounts: Record<string, Record<string, number>> = {};

    // Initialize link counts
    frequencies.forEach((freq) => {
      linkCounts[`Frequency|${freq}`] = {};
      outputTypes.forEach((type) => {
        linkCounts[`Frequency|${freq}`][`Output type|${type}`] = 0;
      });
    });

    outputTypes.forEach((type) => {
      linkCounts[`Output type|${type}`] = {};
      alignments.forEach((align) => {
        linkCounts[`Output type|${type}`][`PO2 alignment|${align}`] = 0;
      });
    });

    // Count publications for each link
    data.forEach((item) => {
      const frequency = item["Frequency"] || "Unknown";
      const outputType = item["Output type"] || "Unknown";
      const alignment = item["PO2 alignment (FY25/26)"] || "Unknown";

      linkCounts[`Frequency|${frequency}`][`Output type|${outputType}`]++;
      linkCounts[`Output type|${outputType}`][`PO2 alignment|${alignment}`]++;
    });

    // Create actual links with counts
    Object.entries(linkCounts).forEach(([source, targets]) => {
      Object.entries(targets).forEach(([target, value]) => {
        if (value > 0) {
          links.push({
            source: nodeIndex[source],
            target: nodeIndex[target],
            value,
          });
        }
      });
    });

    return { nodes, links };
  }, [data]);

  // Process data for publication timeline
  const timelineData = React.useMemo(() => {
    if (!data.length) return [];

    // For this example, we'll assign publications to months based on their frequency
    // In a real app, you'd use actual publication dates
    const frequencyToMonthMap: Record<string, number[]> = {
      Annual: [1], // January
      Quarterly: [1, 4, 7, 10], // Jan, Apr, Jul, Oct
      Monthly: Array.from({ length: 12 }, (_, i) => i + 1), // All months
      Biannual: [1, 7], // Jan, Jul
      "Ad hoc": [3, 6, 9, 12], // Mar, Jun, Sep, Dec
    };

    return data.flatMap((pub) => {
      const frequency = pub["Frequency"] || "Unknown";
      const outputType = pub["Output type"] || "Unknown";
      const months = frequencyToMonthMap[frequency] || [6]; // Default to June

      return months.map((month) => ({
        title: pub["Publication Title"],
        frequency,
        outputType,
        month,
        count: 1,
      }));
    });
  }, [data]);

  // Create configurations for pie charts
  const frequencyConfig = createChartConfig(frequencyData);
  const directorateConfig = createChartConfig(directorateData);
  const outputTypeConfig = createChartConfig(outputTypeData);
  const alignmentConfig = createChartConfig(alignmentData);

  return (
    <AppLayout>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-6 overflow-x-auto pb-4">
            <div className="grid grid-cols-4 gap-6 w-full min-w-max">
              <StatisticsPieChart
                title="Publication Frequency"
                description="Distribution by frequency"
                data={frequencyData}
                config={frequencyConfig}
                centerLabel="Types"
                footerText="Distribution of publications by frequency"
              />

              <StatisticsPieChart
                title="Directorate Distribution"
                description="Publications by directorate"
                data={directorateData}
                config={directorateConfig}
                centerLabel="Directorates"
                footerText="Publications grouped by directorate"
              />

              <StatisticsPieChart
                title="Output Types"
                description="Publication output types"
                data={outputTypeData}
                config={outputTypeConfig}
                centerLabel="Types"
                footerText="Distribution by output type category"
              />

              <StatisticsPieChart
                title="PO2 Alignment"
                description="FY25/26 alignment distribution"
                data={alignmentData}
                config={alignmentConfig}
                centerLabel="Categories"
                footerText="Publications by PO2 alignment category"
              />
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1">
            <StackedBarChart
              title="Output Types by Frequency"
              description="Distribution of output types across frequencies"
              data={stackedBarData}
              keys={uniqueOutputTypes}
              colors={chartColors}
              footerText="Shows how output types are distributed across different frequencies"
            />

            <Heatmap
              title="Frequency vs Output Type"
              description="Concentration of publications by frequency and type"
              data={heatmapData}
              xLabels={[
                ...new Set(
                  data.map((item) => item["Output type"] || "Unknown")
                ),
              ]}
              yLabels={[
                ...new Set(data.map((item) => item["Frequency"] || "Unknown")),
              ]}
              xAxisTitle="Output Type"
              yAxisTitle="Frequency"
              footerText="Darker cells indicate higher concentration of publications"
            />
          </div>
          <div className="grid gap-6 grid-cols-1">
            <PublicationTimeline
              title="Monthly Publication Distribution"
              description="Publications distributed across the year by output type"
              data={timelineData}
              outputTypes={uniqueOutputTypes}
              colors={chartColors}
              footerText="Shows when publications are released throughout the year"
            />
          </div>
        </div>
      )}
    </AppLayout>
  );
}
