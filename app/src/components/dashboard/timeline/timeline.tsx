"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, startOfWeek, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Calendar as CalendarIcon,
  LayoutGrid,
  Filter,
  Search,
  ChevronDown,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface TimelinePublication {
  "Publication Title": string;
  Directorate: string;
  Division: string;
  DD: string;
  "BA Lead": string;
  Frequency: string;
  "Output type": string;
  "PO2 alignment (FY25/26)": string;
  publish_dates: string;
}

interface TimelinePointProps {
  date: Date;
  publication: TimelinePublication;
  color: string;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

interface TimelineProps {
  publications: TimelinePublication[];
  chartColors: Record<string, string>;
}

type ViewMode = "day" | "week" | "month";

function ColorLegend({ chartColors }: { chartColors: Record<string, string> }) {
  return (
    <div className="flex flex-wrap gap-3 mt-2">
      {Object.entries(chartColors).map(([alignment, color]) => (
        <div key={alignment} className="flex items-center">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: `hsl(${color})` }}
          />
          <span className="text-xs">{alignment}</span>
        </div>
      ))}
    </div>
  );
}

// TimelinePoint component to render individual points on the timeline
function TimelinePoint({
  date,
  publication,
  color,
  isSelected,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: TimelinePointProps) {
  return (
    <div
      className="flex items-center justify-center"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`
          w-4 h-4 rounded-full
          transition-all cursor-pointer
          ${isSelected ? "scale-150 ring-2 ring-white" : "hover:scale-125"}
        `}
        style={{ backgroundColor: `hsl(${color})` }}
        title={publication["Publication Title"]}
      />
    </div>
  );
}

// Publication detail component for the right panel
function PublicationDetail({
  publication,
  color,
  date,
}: {
  publication: TimelinePublication;
  color: string;
  date: Date;
}) {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-4 mb-2">
        <div
          className="w-2 h-8 rounded-sm"
          style={{ backgroundColor: `hsl(${color})` }}
        />
        <h3 className="text-xl font-medium">{publication["Publication Title"]}</h3>
      </div>
      
      <div className="flex items-center justify-start gap-2 mb-4">
        <Badge variant="outline">{format(date, "PPP")}</Badge>
        <span className="text-sm text-muted-foreground">
          {publication["Directorate"]} / {publication["Division"]}
        </span>
      </div>
      
      <div className="grid grid-cols-4 gap-y-2 text-sm">
        {Object.entries(publication)
          .filter(([key]) => key !== "publish_dates")
          .map(([key, value]) => (
          <React.Fragment key={key}>
            <div className="font-medium col-span-1">{key}:</div>
            <div className="col-span-3">{value}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// Statistics panel component
function TimeframeStatistics({
  points,
  viewMode,
  date,
  chartColors,
}: {
  points: Array<{date: Date; publication: TimelinePublication}>;
  viewMode: ViewMode;
  date: Date;
  chartColors: Record<string, string>;
}) {
  // Count publications by PO2 alignment
  const alignmentCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    points.forEach((point) => {
      const alignment = point.publication["PO2 alignment (FY25/26)"] || "Unknown";
      counts[alignment] = (counts[alignment] || 0) + 1;
    });
    return counts;
  }, [points]);
  
  // Count publications by directorate
  const directorateCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    points.forEach((point) => {
      const directorate = point.publication["Directorate"] || "Unknown";
      counts[directorate] = (counts[directorate] || 0) + 1;
    });
    return counts;
  }, [points]);
  
  // Format timeframe title based on view mode
  const timeframeTitle = React.useMemo(() => {
    if (viewMode === "day") {
      return format(date, "MMMM d, yyyy");
    } else if (viewMode === "week") {
      const weekEnd = addDays(startOfWeek(date, { weekStartsOn: 1 }), 6);
      return `Week of ${format(startOfWeek(date, { weekStartsOn: 1 }), "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
    } else {
      return format(date, "MMMM yyyy");
    }
  }, [date, viewMode]);
  
  return (
    <div className="p-4 mt-4 border-t">
      <h3 className="text-lg font-medium mb-3">{timeframeTitle} Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">PO2 Alignments</h4>
          <div className="space-y-2">
            {Object.entries(alignmentCounts).map(([alignment, count]) => (
              <div key={alignment} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: `hsl(${chartColors[alignment] || "var(--chart-1)"})` }}
                  />
                  <span className="text-sm">{alignment}</span>
                </div>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Directorates</h4>
          <div className="space-y-2">
            {Object.entries(directorateCounts).map(([directorate, count]) => (
              <div key={directorate} className="flex items-center justify-between">
                <span className="text-sm truncate max-w-[180px]">{directorate}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Empty state for the info panel
function EmptyInfoPanel() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
      <CalendarIcon className="h-12 w-12 mb-4 opacity-20" />
      <h3 className="text-lg font-medium mb-2">No Publication Selected</h3>
      <p>Hover over a timeline point to see details, or click to lock the selection.</p>
    </div>
  );
}

export function VerticalTimeline({ publications, chartColors }: TimelineProps) {
  const [selectedPoint, setSelectedPoint] = React.useState<{
    date: Date;
    publication: TimelinePublication;
    group: { 
      key: string;
      points: Array<{date: Date; publication: TimelinePublication}>;
      date: Date;
    };
  } | null>(null);

  const [hoveredPoint, setHoveredPoint] = React.useState<{
    date: Date;
    publication: TimelinePublication;
    group: { 
      key: string;
      points: Array<{date: Date; publication: TimelinePublication}>;
      date: Date;
    };
  } | null>(null);

  const [viewMode, setViewMode] = React.useState<ViewMode>("day");
  
  // State to track sort order - default is descending (newest first)
  const [sortAscending, setSortAscending] = React.useState(false);

  // State to track selected PO2 alignments for filtering
  const [selectedAlignments, setSelectedAlignments] = React.useState<
    string[]
  >([]);
  
  // State to track selected directorates and divisions
  const [selectedDirectorates, setSelectedDirectorates] = React.useState<
    string[]
  >([]);
  const [selectedDivisions, setSelectedDivisions] = React.useState<string[]>(
    []
  );
  
  // State for search input
  const [searchQuery, setSearchQuery] = React.useState("");

  // Get unique PO2 alignments from the data
  const availableAlignments = React.useMemo(() => {
    const alignments = new Set<string>();
    publications.forEach((publication) => {
      const alignment = publication["PO2 alignment (FY25/26)"] || "Unknown";
      alignments.add(alignment);
    });
    return Array.from(alignments).sort();
  }, [publications]);
  
  // Get unique directorates and divisions from the data
  const availableDirectorates = React.useMemo(() => {
    const directorates = new Set<string>();
    publications.forEach((publication) => {
      const directorate = publication["Directorate"] || "Unknown";
      directorates.add(directorate);
    });
    return Array.from(directorates).sort();
  }, [publications]);
  
  const availableDivisions = React.useMemo(() => {
    const divisions = new Set<string>();
    publications.forEach((publication) => {
      const division = publication["Division"] || "Unknown";
      divisions.add(division);
    });
    return Array.from(divisions).sort();
  }, [publications]);

  // Process the publication data to extract all dates from the last year
  const allTimelinePoints = React.useMemo(() => {
    const points: Array<{
      date: Date;
      publication: TimelinePublication;
    }> = [];

    // Calculate 1 year ago from now
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    publications.forEach((publication) => {
      // Apply alignment filter
      if (
        selectedAlignments.length > 0 &&
        !selectedAlignments.includes(
          publication["PO2 alignment (FY25/26)"] || "Unknown"
        )
      ) {
        return;
      }
      
      // Apply directorate filter
      if (
        selectedDirectorates.length > 0 &&
        !selectedDirectorates.includes(publication["Directorate"] || "Unknown")
      ) {
        return;
      }
      
      // Apply division filter
      if (
        selectedDivisions.length > 0 &&
        !selectedDivisions.includes(publication["Division"] || "Unknown")
      ) {
        return;
      }
      
      // Apply search filter
      if (
        searchQuery &&
        !publication["Publication Title"]
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return;
      }

      if (publication.publish_dates) {
        const dateStrings = publication.publish_dates.split(";");

        dateStrings.forEach((dateStr) => {
          if (dateStr.trim()) {
            const date = new Date(dateStr);

            // Only include dates from the last year
            if (date >= oneYearAgo) {
              points.push({
                date,
                publication,
              });
            }
          }
        });
      }
    });

    // Sort by date according to the selected sort order
    return points.sort((a, b) => {
      if (sortAscending) {
        return a.date.getTime() - b.date.getTime(); // Oldest first
      } else {
        return b.date.getTime() - a.date.getTime(); // Newest first
      }
    });
  }, [
    publications,
    selectedAlignments,
    selectedDirectorates,
    selectedDivisions,
    searchQuery,
    sortAscending,
  ]);

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedAlignments([]);
    setSelectedDirectorates([]);
    setSelectedDivisions([]);
    setSearchQuery("");
  };
  
  // Count total active filters
  const totalActiveFilters =
    selectedAlignments.length +
    selectedDirectorates.length +
    selectedDivisions.length +
    (searchQuery ? 1 : 0);

  // Group timeline points based on view mode
  const groupedTimelinePoints = React.useMemo(() => {
    const groups: Record<
      string,
      Array<{
        date: Date;
        publication: TimelinePublication;
      }>
    > = {};

    allTimelinePoints.forEach((point) => {
      let groupKey: string;

      if (viewMode === "day") {
        groupKey = format(point.date, "yyyy-MM-dd");
      } else if (viewMode === "week") {
        const weekStart = startOfWeek(point.date, { weekStartsOn: 1 });
        groupKey = format(weekStart, "yyyy-MM-dd");
      } else {
        // month
        groupKey = format(point.date, "yyyy-MM");
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }

      groups[groupKey].push(point);
    });

    return Object.entries(groups)
      .map(([key, points]) => ({
        key,
        points,
        date: points[0].date, // Use the first point's date for the group
      }))
      .sort((a, b) => {
        if (sortAscending) {
          return a.date.getTime() - b.date.getTime(); // Oldest first
        } else {
          return b.date.getTime() - a.date.getTime(); // Newest first
        }
      });
  }, [allTimelinePoints, viewMode, sortAscending]);

  // Handle point click
  const handlePointClick = (date: Date, publication: TimelinePublication, group: any) => {
    // Toggle selection if clicking the same point, otherwise set new selection
    if (
      selectedPoint &&
      selectedPoint.date.getTime() === date.getTime() &&
      selectedPoint.publication === publication
    ) {
      setSelectedPoint(null);
    } else {
      setSelectedPoint({ date, publication, group });
    }
  };

  // Handle point hover
  const handlePointMouseEnter = (
    date: Date,
    publication: TimelinePublication,
    group: any
  ) => {
    setHoveredPoint({ date, publication, group });
  };

  const handlePointMouseLeave = () => {
    setHoveredPoint(null);
  };

  // Get PO2 alignment color
  const getPublicationColor = (
    publication: TimelinePublication | undefined
  ): string => {
    const alignment = publication?.["PO2 alignment (FY25/26)"] || "Unknown";
    return chartColors[alignment] || "var(--chart-1)";
  };

  // Format the time group header based on the view mode
  const formatTimeGroupHeader = (date: Date): string => {
    if (viewMode === "day") {
      return format(date, "MMMM d, yyyy");
    } else if (viewMode === "week") {
      const weekEnd = addDays(startOfWeek(date, { weekStartsOn: 1 }), 6);
      return `Week of ${format(
        startOfWeek(date, { weekStartsOn: 1 }),
        "MMM d"
      )} - ${format(weekEnd, "MMM d, yyyy")}`;
    } else {
      // month
      return format(date, "MMMM yyyy");
    }
  };
  
  // Determine which point data to show in the info panel
  const activePoint = selectedPoint || hoveredPoint;

  return (
<div className="flex h-[calc(100vh-8rem)]">
      {/* Left side: Timeline */}
      <div className="w-3/5 pr-4 flex flex-col">
        {/* Timeline header */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm pb-4 pt-2">
          <div className="flex flex-col gap-3 mb-3">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold">Publication Timeline</h2>
              <p className="text-muted-foreground">
              Publications from the past year ({allTimelinePoints.length} items)
              {totalActiveFilters > 0 &&
                ` with ${totalActiveFilters} active filter${
                  totalActiveFilters > 1 ? "s" : ""
                }`}
            </p>
              </div>
              <div className="flex flex-col justify-end items-end gap-2">
                {/* Search */}
                <div className="w-64 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search publications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-8"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
              {/* View mode dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    {viewMode === "day" && <CalendarIcon className="h-4 w-4" />}
                    {viewMode === "week" && <CalendarDays className="h-4 w-4" />}
                    {viewMode === "month" && <LayoutGrid className="h-4 w-4" />}
                    {viewMode === "day" && "Daily"}
                    {viewMode === "week" && "Weekly"}
                    {viewMode === "month" && "Monthly"}
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>View Mode</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onSelect={() => setViewMode("day")}
                    className={
                      viewMode === "day" ? "bg-accent text-accent-foreground" : ""
                    }
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Daily
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => setViewMode("week")}
                    className={
                      viewMode === "week"
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }
                  >
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Weekly
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={() => setViewMode("month")}
                    className={
                      viewMode === "month"
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }
                  >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Monthly
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort order toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortAscending(!sortAscending)}
                title={
                  sortAscending
                    ? "Currently: Oldest first - Click for newest first"
                    : "Currently: Newest first - Click for oldest first"
                }
                className="gap-1"
              >
                {sortAscending ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
                {sortAscending ? "Oldest First" : "Newest First"}
              </Button>

              {/* Filter dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                    {totalActiveFilters > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {totalActiveFilters}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72">
                  {/* PO2 Alignments */}
                  <DropdownMenuLabel>PO2 Alignments</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-40 overflow-y-auto py-1">
                    {availableAlignments.map((alignment) => (
                      <DropdownMenuCheckboxItem
                        key={alignment}
                        checked={selectedAlignments.includes(alignment)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedAlignments([
                              ...selectedAlignments,
                              alignment,
                            ]);
                          } else {
                            setSelectedAlignments(
                              selectedAlignments.filter((a) => a !== alignment)
                            );
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: `hsl(${
                                chartColors[alignment] || "var(--chart-1)"
                              })`,
                            }}
                          />
                          {alignment}
                        </div>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>

                  {/* Directorates */}
                  <DropdownMenuLabel className="mt-2">
                    Directorates
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-40 overflow-y-auto py-1">
                    {availableDirectorates.map((directorate) => (
                      <DropdownMenuCheckboxItem
                        key={directorate}
                        checked={selectedDirectorates.includes(directorate)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedDirectorates([
                              ...selectedDirectorates,
                              directorate,
                            ]);
                          } else {
                            setSelectedDirectorates(
                              selectedDirectorates.filter(
                                (d) => d !== directorate
                              )
                            );
                          }
                        }}
                      >
                        {directorate}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>

                  {/* Divisions */}
                  <DropdownMenuLabel className="mt-2">
                    Divisions
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-40 overflow-y-auto py-1">
                    {availableDivisions.map((division) => (
                      <DropdownMenuCheckboxItem
                        key={division}
                        checked={selectedDivisions.includes(division)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedDivisions([
                              ...selectedDivisions,
                              division,
                            ]);
                          } else {
                            setSelectedDivisions(
                              selectedDivisions.filter((d) => d !== division)
                            );
                          }
                        }}
                      >
                        {division}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>

                  {totalActiveFilters > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center"
                        onClick={clearAllFilters}
                      >
                        Clear All Filters
                      </Button>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
              </div>
            </div>
            <ColorLegend chartColors={chartColors} />
          </div>
        </div>

        {/* Timeline scrollable container */}
        <div className="overflow-y-auto flex-grow pb-8">
          {/* Timeline points */}
          <div className="space-y-8">
            {groupedTimelinePoints.map((group) => (
              <div key={group.key} className="relative">
                {/* Time group header */}
                <div className="text-lg font-medium mb-3 ml-12">
                  {formatTimeGroupHeader(group.date)}
                </div>

                <div className="relative flex items-start">
                  {/* Timeline node */}
                  <div className="absolute left-6 w-3 h-3 bg-primary rounded-full -translate-x-1/2 mt-2" />

                  {/* Day content with stacked points */}
                  <div className="ml-12 w-full">
                    <div className="flex flex-wrap gap-3 mb-3">
                      {group.points.map((point) => (
                        <TimelinePoint
                          key={`${
                            point.publication["Publication Title"]
                          }-${point.date.toISOString()}`}
                          date={point.date}
                          publication={point.publication}
                          color={getPublicationColor(point.publication)}
                          isSelected={
                            selectedPoint?.date.getTime() ===
                              point.date.getTime() &&
                            selectedPoint?.publication === point.publication
                          }
                          onClick={() =>
                            handlePointClick(point.date, point.publication, group)
                          }
                          onMouseEnter={() =>
                            handlePointMouseEnter(point.date, point.publication, group)
                          }
                          onMouseLeave={handlePointMouseLeave}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {groupedTimelinePoints.length === 0 && (
            <div className="flex justify-center items-center h-48 text-muted-foreground">
              No publications in the last year
            </div>
          )}
        </div>
      </div>
      
      {/* Right side: Info panel */}
      <div className="w-2/5 border-l pl-4 flex flex-col">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Info panel content */}
          <Card className="flex-grow overflow-y-auto">
            {activePoint ? (
              <div className="flex flex-col h-full">
                <PublicationDetail
                  publication={activePoint.publication}
                  color={getPublicationColor(activePoint.publication)}
                  date={activePoint.date}
                />
                
                {activePoint.group && (
                  <TimeframeStatistics
                    points={activePoint.group.points}
                    viewMode={viewMode}
                    date={activePoint.group.date}
                    chartColors={chartColors}
                  />
                )}
              </div>
            ) : (
              <EmptyInfoPanel />
            )}
          </Card>
          
          {/* Selection status */}
          <div className="mt-2 text-sm text-muted-foreground flex justify-between">
            <span>
              {selectedPoint 
                ? "Selection locked - click point again to unlock" 
                : "Hover over a publication to see details"}
            </span>
            {selectedPoint && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setSelectedPoint(null)}
                className="h-auto text-xs font-normal"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
