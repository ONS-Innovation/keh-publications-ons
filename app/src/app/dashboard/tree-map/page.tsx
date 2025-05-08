"use client";

import * as React from "react";
import { AppLayout } from "@/components/app-layout";
import { fetchPublicationData } from "@/utils/getData";
import { TreeMap } from "@/components/dashboard/tree-map/map";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardDescription } from "@/components/ui/card";
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

interface TreeMapNode {
  name: string;
  value?: number;
  children?: TreeMapNode[];
  color?: string;
  details?: Record<string, string>;
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
];

export default function TreeMapPage() {
  const [data, setData] = React.useState<PublicationData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [treeMapData, setTreeMapData] = React.useState<TreeMapNode[]>([]);
  const [selectedAlignments, setSelectedAlignments] = React.useState<string[]>(
    []
  );

  React.useEffect(() => {
    async function fetchData() {
      try {
        const csvData = await fetchPublicationData<PublicationData>();
        setData(csvData);

        // Process the data for the tree map
        const processedData = processDataForTreeMap(csvData);
        setTreeMapData(processedData);
        setSelectedAlignments(processedData.map((node) => node.name));
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Process data for tree map hierarchy (PO2 alignment > Division > Publication Title)
  const processDataForTreeMap = (
    publicationData: PublicationData[]
  ): TreeMapNode[] => {
    // Group by PO2 alignment
    const po2Groups: Record<string, PublicationData[]> = {};

    publicationData.forEach((pub) => {
      const po2 = pub["PO2 alignment (FY25/26)"] || "Unknown";
      if (!po2Groups[po2]) {
        po2Groups[po2] = [];
      }
      po2Groups[po2].push(pub);
    });

    // Create TreeMap nodes
    return Object.entries(po2Groups).map(([po2, pubsInPo2], po2Index) => {
      // Group by Division within each PO2 alignment
      const divisionGroups: Record<string, PublicationData[]> = {};

      pubsInPo2.forEach((pub) => {
        const division = pub.Division || "Unknown Division";
        if (!divisionGroups[division]) {
          divisionGroups[division] = [];
        }
        divisionGroups[division].push(pub);
      });

      // Create division children nodes
      const divisionNodes = Object.entries(divisionGroups).map(
        ([division, pubsInDivision], divIndex) => {
          // Create publication nodes for each division
          const publicationNodes = pubsInDivision.map((pub) => ({
            name: pub["Publication Title"],
            value: 1, // Each publication counts as 1
            color: chartColors[(po2Index + divIndex + 2) % chartColors.length],
            details: {
              Publication: pub["Publication Title"],
              Division: pub.Division,
              Directorate: pub.Directorate,
              Frequency: pub.Frequency,
              "Output Type": pub["Output type"],
              DD: pub.DD,
              "BA Lead": pub["BA Lead"],
              "PO2 Alignment": pub["PO2 alignment (FY25/26)"],
            },
          }));

          return {
            name: division,
            value: pubsInDivision.length,
            color: chartColors[(po2Index + divIndex + 1) % chartColors.length],
            children: publicationNodes,
            details: {
              Division: division,
              Publications: String(pubsInDivision.length),
              "PO2 Alignment": po2,
            },
          };
        }
      );

      return {
        name: po2,
        value: pubsInPo2.length,
        color: chartColors[po2Index % chartColors.length],
        children: divisionNodes,
        details: {
          "PO2 Alignment": po2,
          "Total Publications": String(pubsInPo2.length),
          Divisions: String(Object.keys(divisionGroups).length),
        },
      };
    });
  };

  const filteredTreeMapData = treeMapData.filter((node) =>
    selectedAlignments.includes(node.name)
  );

  return (
    <AppLayout>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-6 h-full">
          <div className="flex justify-between pb-4">
            <CardHeader className="p-0">
              <CardTitle>Publications by PO2 Alignment</CardTitle>
              <CardDescription>
                Hierarchical flow: PO2 Alignment → Division → Publication
              </CardDescription>
            </CardHeader>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Alignments <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {treeMapData.map((node) => (
                  <DropdownMenuCheckboxItem
                    key={node.name}
                    checked={selectedAlignments.includes(node.name)}
                    onCheckedChange={(value) =>
                      setSelectedAlignments((prev) =>
                        value
                          ? [...prev, node.name]
                          : prev.filter((n) => n !== node.name)
                      )
                    }
                  >
                    {node.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <TreeMap
            data={filteredTreeMapData}
            title=""
            description=""
            className="h-[100%] shadow-none border-none"
          />
        </div>
      )}
    </AppLayout>
  );
}
