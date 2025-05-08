"use client";

import * as React from "react";
import { AppLayout } from "@/components/app-layout";
import { fetchPublicationData } from "@/utils/getData";
import { StatisticsPieChart } from "@/components/dashboard/statistics/pie-chart";
import { createChartConfig } from "@/utils/charts/config";
import { StackedBarChart } from "@/components/dashboard/statistics/stacked-bar-chart";
import { Heatmap } from "@/components/dashboard/statistics/heatmap";
import { PublicationTimeline } from "@/components/dashboard/statistics/publication-timeline";
import Loading from "@/components/loading";
import { SummaryCard } from "@/components/dashboard/statistics/summary-card";
import { Button } from "@/components/ui/button";

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
  const [selectedAlignments, setSelectedAlignments] = React.useState<string[]>([]);

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

  // Filter data based on selected alignments
  const filteredData = React.useMemo(() => {
    if (!selectedAlignments.length) return data;
    
    return data.filter(item => 
      selectedAlignments.includes(item["PO2 alignment (FY25/26)"] || "Unknown")
    );
  }, [data, selectedAlignments]);

  // Generate chart data based on filtered data
  const filteredFrequencyData = React.useMemo(() => {
    if (!filteredData.length) return [];

    const frequencyCounts: Record<string, number> = {};
    filteredData.forEach((item) => {
      const frequency = item["Frequency"] || "Unknown";
      frequencyCounts[frequency] = (frequencyCounts[frequency] || 0) + 1;
    });

    return Object.entries(frequencyCounts).map(([frequency, count], index) => ({
      name: frequency,
      value: count,
      fill: `hsl(${chartColors[index % chartColors.length]})`,
    }));
  }, [filteredData, chartColors]);

  const filteredDirectorateData = React.useMemo(() => {
    if (!filteredData.length) return [];

    const directorateCounts: Record<string, number> = {};
    filteredData.forEach((item) => {
      const directorate = item.Directorate || "Unknown";
      directorateCounts[directorate] = (directorateCounts[directorate] || 0) + 1;
    });

    return Object.entries(directorateCounts).map(
      ([directorate, count], index) => ({
        name: directorate,
        value: count,
        fill: `hsl(${chartColors[index % chartColors.length]})`,
      })
    );
  }, [filteredData, chartColors]);

  const filteredOutputTypeData = React.useMemo(() => {
    if (!filteredData.length) return [];

    const outputTypeCounts: Record<string, number> = {};
    filteredData.forEach((item) => {
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
  }, [filteredData, chartColors]);

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

  // Filter data for other charts based on selected alignments
  const filteredStackedBarData = React.useMemo(() => {
    if (!filteredData.length) return [];

    const frequencies = [
      ...new Set(filteredData.map((item) => item["Frequency"] || "Unknown")),
    ];
    const outputTypes = [
      ...new Set(filteredData.map((item) => item["Output type"] || "Unknown")),
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
    filteredData.forEach((item) => {
      const frequency = item["Frequency"] || "Unknown";
      const outputType = item["Output type"] || "Unknown";
      frequencyMap[frequency][outputType]++;
    });

    // Convert to format needed for stacked bar chart
    return frequencies.map((frequency) => ({
      name: frequency,
      ...frequencyMap[frequency],
    }));
  }, [filteredData]);

  // Extract unique output types for the stacked bar chart
  const filteredUniqueOutputTypes = React.useMemo(() => {
    return [...new Set(filteredData.map((item) => item["Output type"] || "Unknown"))];
  }, [filteredData]);

  // Process data for heatmap (Frequency vs Output Type)
  const filteredHeatmapData = React.useMemo(() => {
    if (!filteredData.length) return [];

    const result: Array<{ xKey: string; yKey: string; value: number }> = [];

    const frequencies = [
      ...new Set(filteredData.map((item) => item["Frequency"] || "Unknown")),
    ];
    const outputTypes = [
      ...new Set(filteredData.map((item) => item["Output type"] || "Unknown")),
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
    filteredData.forEach((item) => {
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
  }, [filteredData]);

  // Process data for publication timeline
  const filteredTimelineData = React.useMemo(() => {
    if (!filteredData.length) return [];

    // For this example, we'll assign publications to months based on their frequency
    // In a real app, you'd use actual publication dates
    const frequencyToMonthMap: Record<string, number[]> = {
      Annual: [1], // January
      Quarterly: [1, 4, 7, 10], // Jan, Apr, Jul, Oct
      Monthly: Array.from({ length: 12 }, (_, i) => i + 1), // All months
      Biannual: [1, 7], // Jan, Jul
      "Ad hoc": [3, 6, 9, 12], // Mar, Jun, Sep, Dec
    };

    return filteredData.flatMap((pub) => {
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
  }, [filteredData]);

  // Process data for PO2 alignment cards and get division counts
  const alignmentSummaryData = React.useMemo(() => {
    if (!data.length) return [];

    const alignmentMap: Record<string, { count: number, divisions: Set<string> }> = {};
    
    data.forEach((item) => {
      const alignment = item["PO2 alignment (FY25/26)"] || "Unknown";
      const division = item.Division || "Unknown Division";
      
      if (!alignmentMap[alignment]) {
        alignmentMap[alignment] = { count: 0, divisions: new Set() };
      }
      
      alignmentMap[alignment].count++;
      alignmentMap[alignment].divisions.add(division);
    });
    
    return Object.entries(alignmentMap).map(([alignment, info], index) => ({
      name: alignment,
      publicationCount: info.count,
      divisionCount: info.divisions.size,
      color: chartColors[index % chartColors.length],
    }));
  }, [data]);

  // Create configurations for pie charts
  const frequencyConfig = createChartConfig(filteredFrequencyData);
  const directorateConfig = createChartConfig(filteredDirectorateData);
  const outputTypeConfig = createChartConfig(filteredOutputTypeData);
  const alignmentConfig = createChartConfig(alignmentData);

  const handleCardClick = (alignment: string) => {
    setSelectedAlignments(prev => {
      if (prev.includes(alignment)) {
        // If already selected, deselect it
        return prev.filter(a => a !== alignment);
      } else {
        // Otherwise, add it to selection
        return [...prev, alignment];
      }
    });
  };

  const showAllAlignments = () => {
    setSelectedAlignments([]);
  };

  return (
    <AppLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">PO2 Alignments</h2>
              <Button 
                variant={selectedAlignments.length === 0 ? "default" : "outline"} 
                onClick={showAllAlignments}
                className="ml-auto"
              >
                Show All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {alignmentSummaryData.map((item) => (
                <SummaryCard
                  key={item.name}
                  title={item.name}
                  publicationCount={item.publicationCount}
                  divisionCount={item.divisionCount}
                  isSelected={selectedAlignments.includes(item.name)}
                  onClick={() => handleCardClick(item.name)}
                  color={item.color}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4">
            <div className="grid grid-cols-3 gap-6 w-full min-w-max">
              <StatisticsPieChart
                title="Publication Frequency"
                description="Distribution by frequency"
                data={filteredFrequencyData}
                config={frequencyConfig}
                centerLabel="Types"
                footerText="Distribution of publications by frequency"
              />

              <StatisticsPieChart
                title="Directorate Distribution"
                description="Publications by directorate"
                data={filteredDirectorateData}
                config={directorateConfig}
                centerLabel="Directorates"
                footerText="Publications grouped by directorate"
              />

              <StatisticsPieChart
                title="Output Types"
                description="Publication output types"
                data={filteredOutputTypeData}
                config={outputTypeConfig}
                centerLabel="Types"
                footerText="Distribution by output type category"
              />
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1">
            <StackedBarChart
              title="Output Types by Frequency"
              description="Distribution of output types across frequencies"
              data={filteredStackedBarData}
              keys={filteredUniqueOutputTypes}
              colors={chartColors}
              footerText="Shows how output types are distributed across different frequencies"
            />

            <Heatmap
              title="Frequency vs Output Type"
              description="Concentration of publications by frequency and type"
              data={filteredHeatmapData}
              xLabels={[
                ...new Set(
                  filteredData.map((item) => item["Output type"] || "Unknown")
                ),
              ]}
              yLabels={[
                ...new Set(filteredData.map((item) => item["Frequency"] || "Unknown")),
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
              data={filteredTimelineData}
              outputTypes={filteredUniqueOutputTypes}
              colors={chartColors}
              footerText="Shows when publications are released throughout the year"
            />
          </div>
        </div>
      )}
    </AppLayout>
  );
}
