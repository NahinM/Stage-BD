import { Link } from "react-router-dom"

export default function PageNotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
            <div className="flex flex-col items-center gap-4 rounded-lg border bg-background p-8 text-center shadow-sm">
                <h1 className="text-4xl font-semibold">Oops..</h1>
                <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
                <p className="text-muted-foreground">The page you are looking for does not exist.</p>
                <Link to="/" className="text-primary hover:bg-primary/80 hover:text-primary-foreground inline-flex items-center gap-1 px-4 py-2 rounded-md border border-primary">
                    Go back to home
                </Link>
            </div>
        </main>
    )
}