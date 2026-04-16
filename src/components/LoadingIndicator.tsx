import { Loader2 } from "lucide-react"


const LoadingIndicator = () => {
  return (
    <div className="flex min-h-screen justify-center items-center">
      <Loader2 className="size-4 font-semibold text-primary animate-spin" />
    </div>
  )
}

export default LoadingIndicator
