import { AppLayout } from "@/components/app-layout"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, CalendarDays, Network } from "lucide-react"
export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/statistics">
          <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart className="w-4 h-4"/> Statistics</CardTitle>
              <CardDescription>View detailed analytics and insights about publications.</CardDescription>
            </CardHeader>

          </Card>
        </Link>
        
        <Link href="/dashboard/tree-map">
          <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-2"><Network className="w-4 h-4"/> Tree Map</CardTitle>
              <CardDescription>View the tree map of publications.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link href="/dashboard/timeline">
          <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-2"><CalendarDays className="w-4 h-4"/> Timeline</CardTitle>
              <CardDescription>View the timeline of publications.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </AppLayout>
  )
} 