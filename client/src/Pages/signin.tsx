export default function SignIn() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
            <div className="flex flex-col tems-center gap-4 rounded-lg border bg-background p-8 text-center shadow-sm">
                <h1 className="text-4xl font-semibold">Sign In</h1>
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
            </div>
        </div>
    )
}