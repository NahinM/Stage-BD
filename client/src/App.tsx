import { Button } from "@/components/ui/button"

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="flex flex-col items-center gap-4 rounded-lg border bg-background p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold">shadcn/ui is ready</h1>
        <p className="text-muted-foreground">Your Vite frontend is now configured with Tailwind v4 + shadcn.</p>
        <Button>Primary Action</Button>
      </div>
    </main>
  )
}

export default App
