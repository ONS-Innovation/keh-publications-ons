"use client";

import * as React from "react";
import { AppLayout } from "@/components/app-layout";
import { VerticalTimeline } from "@/components/dashboard/timeline/timeline";
import { fetchPublicationData } from "@/utils/getData";
import Loading from "@/components/loading";

interface PublicationData {
  "Publication Title": string;
  "Directorate": string;
  "Division": string;
  "DD": string;
  "BA Lead": string;
  "Frequency": string;
  "Output type": string;
  "PO2 alignment (FY25/26)": string;
  "publish_dates": string;
}

// Chart colors map for PO2 alignments
const ALIGNMENT_COLORS: Record<string, string> = {
  "Employment": "var(--chart-1)",
  "GDP": "var(--chart-2)",
  "GDP & Employment": "var(--chart-3)",
  "Population": "var(--chart-4)",
  "Prices": "var(--chart-5)",
  "Other": "var(--chart-6)",
  "Unknown": "var(--chart-7)",
};

export default function TimelinePage() {
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

  return (
    <AppLayout>
      <div className="rounded-xl bg-card p-0">
        {isLoading ? (
          <Loading />
        ) : (
          <VerticalTimeline 
            publications={data} 
            chartColors={ALIGNMENT_COLORS} 
          />
        )}
      </div>
    </AppLayout>
  );
} 