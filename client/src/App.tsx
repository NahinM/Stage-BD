import { Button } from "@/components/ui/button"
import axios from "axios"
import { useEffect, useState } from "react"

function App() {
  const [message, setMessage] = useState("Loading...")

  useEffect(() => {
    axios
      .get("/api/hello")
      .then((response) => {
        setMessage(response.data?.message ?? "No message returned")
      })
      .catch((error) => {
        console.error("Error fetching message:", error)
        setMessage("Error fetching message")
      })
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="flex flex-col items-center gap-4 rounded-lg border bg-background p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold">Testing axios</h1>
        <p className="text-muted-foreground">Message from server: {message}</p>
        <Button>Primary Action</Button>
      </div>
    </main>
  )
}

export default App
