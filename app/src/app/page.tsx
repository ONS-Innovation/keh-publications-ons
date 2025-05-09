import { AppLayout } from "@/components/app-layout"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
export default function HomePage() {
  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/statistics">
          <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Dashboard <Badge variant="destructive" className="ml-2">Authorised Only</Badge></CardTitle> 
              <CardDescription>View detailed analytics and insights about publications.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </AppLayout>
  )
} 