import React from "react"
import { cn } from "../../lib/utils"
 

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("ecfw-animate-pulse ecfw-rounded-md ecfw-bg-muted", className)}
      {...props}
    />
  )
}
 
export { Skeleton }