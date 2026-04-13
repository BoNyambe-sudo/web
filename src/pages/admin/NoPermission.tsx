import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const NoPermission = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No Permission</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You do not have permission to access this page.</p>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NoPermission
