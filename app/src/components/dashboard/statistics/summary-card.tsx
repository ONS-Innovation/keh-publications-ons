"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  publicationCount: number;
  divisionCount: number;
  isSelected: boolean;
  onClick: () => void;
  color: string;
}

export function SummaryCard({
  title,
  publicationCount,
  divisionCount,
  isSelected,
  onClick,
  color,
}: SummaryCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isSelected 
          ? "ring-2 ring-primary shadow-md" 
          : "hover:shadow-md"
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div 
              className="text-3xl font-bold"
              style={{ color: `hsl(${color})` }}
            >
              {publicationCount}
            </div>
            <div className="text-xs text-muted-foreground">
              Publications
            </div>
          </div>
          <div>
            <div 
              className="text-3xl font-bold"
              style={{ color: `hsl(${color})` }}
            >
              {divisionCount}
            </div>
            <div className="text-xs text-muted-foreground">
              Divisions
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 