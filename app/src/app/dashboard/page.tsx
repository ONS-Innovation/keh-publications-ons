import { AppLayout } from "@/components/app-layout"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/statistics">
          <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>View detailed analytics and insights about publications.</CardDescription>
            </CardHeader>

          </Card>
        </Link>
        
        <Link href="/dashboard/tree-map">
          <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-0">
              <CardTitle>Tree Map</CardTitle>
              <CardDescription>View the tree map of publications.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link href="/dashboard/explore">
          <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-0">
              <CardTitle>Explore</CardTitle>
              <CardDescription>Browse and search through all available publications in the system.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </AppLayout>
  )
} 