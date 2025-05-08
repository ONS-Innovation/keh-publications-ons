"use client";

import { AppLayout } from "@/components/app-layout";
import {
  DataTable,
  createSortableColumn,
} from "@/components/dashboard/explore/table";
import { fetchPublicationData } from "@/utils/getData";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import Loading from "@/components/loading";

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

const columns: ColumnDef<PublicationData>[] = [
  createSortableColumn("Publication Title", "Title"),
  createSortableColumn("Directorate", "Directorate"),
  createSortableColumn("Division", "Division"),
  createSortableColumn("DD", "DD"),
  createSortableColumn("BA Lead", "BA Lead"),
  createSortableColumn("Frequency", "Frequency"),
  createSortableColumn("Output type", "Output type"),
  createSortableColumn("PO2 alignment (FY25/26)", "PO2 alignment"),
];

export default function ExplorePage() {
  const [data, setData] = useState<PublicationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      <div className="rounded-xl bg-card">
        {isLoading ? (
          <Loading />
        ) : (
          <DataTable
            columns={columns}
            data={data}
            filterColumn="Publication Title"
            filterPlaceholder="Search publications..."
          />
        )}
      </div>
    </AppLayout>
  );
}
