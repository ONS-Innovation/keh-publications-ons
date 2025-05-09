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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TreeMapNode {
  name: string;
  size?: number;
  value?: number;
  children?: TreeMapNode[];
  color?: string;
  depth?: number;
  type?: string;
  details?: Record<string, string>; // Additional details to show when clicked
}

interface TreeMapProps {
  data: TreeMapNode[];
  footerText?: string;
  className?: string;
}

// Chart colors array to use for the nodes
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

export function TreeMap({
  data,
  footerText,
  className,
}: TreeMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = React.useState<TreeMapNode | null>(
    null
  );
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [scale, setScale] = React.useState(1);


  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse leave to stop dragging
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Handle wheel for zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    setScale((prevScale) => {
      const newScale = delta > 0 ? prevScale * 0.9 : prevScale * 1.1;
      return Math.min(Math.max(0.5, newScale), 5);
    });
  };

  const handleNodeClick = (node: TreeMapNode) => {
    setSelectedNode(node);
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="pb-0 h-full relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 bottom-0 overflow-auto"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          ref={containerRef}
        >
          <div
            className="relative min-w-full min-h-full"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: "0 0",
              transition: isDragging ? "none" : "transform 0.1s ease-out",
            }}
          >
            <div className="flex justify-center w-full">
              <div className="flex flex-row space-x-12 relative -mt-3">
                {[...data].sort((a, b) => 
                  a.name === 'Other' ? 1 : 
                  b.name === 'Other' ? -1 : 
                  a.name.localeCompare(b.name)
                ).map((parentNode, parentIndex) => {
                  const parentColor =
                    chartColors[parentIndex % chartColors.length];

                  return (
                    <div
                      key={`parent-${parentIndex}`}
                      className="flex flex-col items-center"
                    >
                      <div
                        className="px-5 py-2 rounded-md shadow-md cursor-pointer min-w-[180px] text-center font-semibold"
                        style={{
                          backgroundColor: `hsl(${parentColor} / 0.1)`,
                          borderBottom: `4px solid hsl(${parentColor})`,
                        }}
                        onClick={() => handleNodeClick(parentNode)}
                      >
                        <div className="text-[2rem]">{parentNode.name}</div>
                        {parentNode.value && (
                          <div className="text-xs mt-1">
                            {parentNode.value} publication
                            {parentNode.value !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>

                      {parentNode.children &&
                        parentNode.children.length > 0 && (
                          <>
                            <div className="h-8 w-px mt-2"></div>

                            <div className="flex flex-row space-x-8 relative -mt-3">
                              {parentNode.children.map((division, divIndex) => {
                                return (
                                  <div
                                    key={`division-${parentIndex}-${divIndex}`}
                                    className="flex flex-col items-center"
                                  >
                                    <div className="h-3 w-px"></div>
                                    <div
                                      className="px-5 py-2 rounded-md shadow-md border cursor-pointer min-w-[250px] text-center"
                                      style={{
                                        backgroundColor: `hsl(${parentColor} / 0.1)`,
                                        borderBottom: `4px solid hsl(${parentColor})`,
                                      }}
                                      onClick={() => handleNodeClick(division)}
                                    >
                                      <div className="text-[1.25rem] font-semibold">
                                        {division.name}
                                      </div>
                                      {division.value && (
                                        <div className="text-xs mt-1">
                                          {division.value} publication
                                          {division.value !== 1 ? "s" : ""}
                                        </div>
                                      )}
                                    </div>

                                    {division.children &&
                                      division.children.length > 0 && (
                                        <>
                                          <div className="h-6 w-px mt-2"></div>

                                          <div className="flex flex-col space-y-4 items-center">
                                            {division.children.map(
                                              (publication, pubIndex) => {
                                                return (
                                                  <div
                                                    key={`pub-${parentIndex}-${divIndex}-${pubIndex}`}
                                                    className="flex flex-col items-center"
                                                  >
                                                    {pubIndex > 0 && (
                                                      <div className="h-px w-px mb-2"></div>
                                                    )}
                                                    <div
                                                      className="px-4 py-2 rounded-md shadow-sm border cursor-pointer min-w-[160px] max-w-[220px] text-center"
                                                      style={{
                                                        backgroundColor: `hsl(${parentColor} / 0.1)`,
                                                        borderBottom: `4px solid hsl(${parentColor})`,
                                                      }}
                                                      onClick={() =>
                                                        handleNodeClick(
                                                          publication
                                                        )
                                                      }
                                                    >
                                                      <div
                                                        className="font-normal text-sm truncate"
                                                        title={publication.name}
                                                      >
                                                        {publication.name}
                                                      </div>
                                                    </div>
                                                  </div>
                                                );
                                              }
                                            )}
                                          </div>
                                        </>
                                      )}
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {selectedNode && (
        <div
          className="p-4 mt-2 bg-card rounded-md mx-4 max-h-50 w-[400px] overflow-y-auto absolute cursor-move shadow-md border border-border"
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            touchAction: "none",
            userSelect: "none",
          }}
          onMouseDown={(e) => {
            const target = e.currentTarget;
            const initialX = e.clientX;
            const initialY = e.clientY;
            const initialLeft = target.offsetLeft;
            const initialTop = target.offsetTop;

            const onMouseMove = (moveEvent: MouseEvent) => {
              const dx = moveEvent.clientX - initialX;
              const dy = moveEvent.clientY - initialY;
              target.style.left = `${initialLeft + dx}px`;
              target.style.top = `${initialTop + dy}px`;
              target.style.bottom = "auto";
              target.style.right = "auto";
            };

            const onMouseUp = () => {
              document.removeEventListener("mousemove", onMouseMove);
              document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{selectedNode.name}</h4>
          </div>
          {selectedNode.details &&
            Object.entries(selectedNode.details).map(([key, val]) => (
              <div key={key} className="text-sm grid grid-cols-4 gap-2 border-t border-border py-1">
                <span className="font-bold">{key}:</span>
                <span className="col-span-3">{String(val)}</span>
              </div>
            ))}
          <div className="flex justify-end gap-2 items-center mt-4">
            <Button variant="secondary" size="sm" onClick={() => setSelectedNode(null)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {footerText && (
        <CardFooter className="text-xs text-muted-foreground pt-0">
          {footerText}
        </CardFooter>
      )}
    </Card>
  );
}
