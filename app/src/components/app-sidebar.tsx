"use client"

import type * as React from "react"
import { Frame, LifeBuoy, SquareTerminal, Activity } from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Example User",
    email: "seb@ons.gov.uk",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Demo Main",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Child 1",
          url: "#",
        },
        {
          title: "Child 2",
          url: "#",
        },
        {
          title: "Child 3",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Demo Secondary",
      url: "#",
      icon: LifeBuoy,
    },
  ],
  projects: [
    {
      name: "Demo Project",
      url: "#",
      icon: Frame,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Activity className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Regular Releases</span>
                  <span className="truncate text-xs">ONS</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
