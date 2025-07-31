'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ResultsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="table">
          <TabsList>
            <TabsTrigger value="table">
              <Skeleton className="h-4 w-4 mr-1" />
              Table
            </TabsTrigger>
            <TabsTrigger value="chart">
              <Skeleton className="h-4 w-4 mr-1" />
              Chart
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="mt-4">
            <div className="rounded-md border">
              <div className="border-b">
                <div className="flex">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="divide-y">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="p-2 flex-1">
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="chart" className="mt-4">
            <div className="h-[400px] border rounded-md p-4">
              <Skeleton className="h-full w-full" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}