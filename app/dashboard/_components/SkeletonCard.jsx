import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function JobCardSkeleton() {
  return (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
         
          <div>
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  )
}