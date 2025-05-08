"use client";

import type * as React from "react";
import { useState } from "react";
import {
  LifeBuoy,
  ChartNoAxesColumn,
  BarChart,
  Network,
  SearchCheck,
  Home,
} from "lucide-react";

import { NavDash } from "./nav-dash";
import { NavSecondary } from "./nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const data = {
  user: {
    name: "Example User",
    email: "seb@ons.gov.uk",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
    {
      title: "Help",
      url: "#",
      icon: LifeBuoy,
    },
  ],
  navDashItems: [
    {
      name: "Statistics",
      url: "/dashboard/statistics",
      icon: BarChart,
    },
    {
      name: "Tree Map",
      url: "/dashboard/tree-map",
      icon: Network,
    },
    {
      name: "Explore",
      url: "/dashboard/explore",
      icon: SearchCheck,
    },
  ],
};

// Help content based on current path
function getHelpContent(pathname: string) {
  if (pathname === "/") {
    return {
      title: "Home Page Help",
      description: "This is the main landing page for the ONS Publications application. From here you can navigate to various dashboards and tools."
    };
  } else if (pathname.includes("/dashboard/statistics")) {
    return {
      title: "Statistics Dashboard Help",
      description: "The Statistics Dashboard provides key metrics and analytics about ONS publications. Use the filters to narrow down the data you're interested in."
    };
  } else if (pathname.includes("/dashboard/tree-map")) {
    return {
      title: "Tree Map Help",
      description: "The Tree Map visualization shows hierarchical data about publications organized by PO2 Alignment, Division, and individual publications. Click on sections to zoom in and see more details."
    };
  } else if (pathname.includes("/dashboard/explore")) {
    return {
      title: "Explore Help",
      description: "The Explore section allows you to search and filter publications using various criteria. Use the search bar to find specific publications."
    };
  } else {
    return {
      title: "Help",
      description: "Welcome to the ONS Publications application. If you need further assistance, please contact the support team."
    };
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const pathname = usePathname();
  const helpContent = getHelpContent(pathname);

  return (
    <>
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground p-1">
                    <img src="/favicon.ico" alt="Publications icon" className="rounded-sm" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Publications</span>
                    <span className="truncate text-xs">ONS</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <Link href="/">
              <SidebarMenuButton>
                <Home /> Home
              </SidebarMenuButton>
            </Link>
          </SidebarGroup>
          <NavDash items={data.navDashItems} />
          <SidebarGroup>
            <SidebarMenuButton onClick={() => setIsHelpOpen(true)}>
              <LifeBuoy /> Help
            </SidebarMenuButton>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <Sheet open={isHelpOpen} onOpenChange={setIsHelpOpen} >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{helpContent.title}</SheetTitle>
            <SheetDescription>
              {helpContent.description}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
}
