import { toast } from "sonner";

export default function TestPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30">
            <div className="p-2">
                <h1 className="text-3xl font-bold">This is a test page</h1>
                <button 
                className="bg-green-500 px-4 py-1 rounded-md"
                onClick={()=> {
                    toast("This is a test toast" , {
                        description: "This is a test toast description",
                        action: {
                            label: "Click me",
                            onClick: () => {
                                toast("You clicked the toast action!");
                            }
                        },
                        position: "bottom-right",
                    });
                }}
                >
                    toast
                </button>
            </div>
        </div>
    )
}