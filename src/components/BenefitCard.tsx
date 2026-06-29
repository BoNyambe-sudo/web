import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BenefitCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  className?: string
}

function BenefitCard({
  title,
  description,
  icon,
  className,
}: BenefitCardProps) {
  return (
    <Card
      className={cn(
        "h-full border-border/50 hover:border-primary/30 transition-colors duration-200",
        className
      )}
    >
      <CardHeader className="space-y-3">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <CardTitle className="text-base font-semibold leading-tight">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

export { BenefitCard }
