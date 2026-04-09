import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

export default function ReservationSuccess() {
    const { code } = useParams();
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30">
            <div className="rounded-xl border bg-background shadow-sm px-10 py-12 text-center space-y-6 max-w-md w-full">
                <CheckCircle className="mx-auto text-green-600" size={52} />
                <h1 className="text-2xl font-semibold">You're in!</h1>
                <p className="text-muted-foreground text-sm">
                    Show this QR code or reservation code at the venue.
                </p>

                <div className="flex justify-center">
                    <div className="rounded-xl border p-4 bg-white">
                        <QRCodeSVG value={code!} size={180} />
                    </div>
                </div>

                <div className="rounded-lg bg-muted px-6 py-4">
                    <p className="text-xs text-muted-foreground mb-1">Reservation code</p>
                    <p className="text-2xl font-mono font-bold tracking-widest text-green-600">{code}</p>
                </div>

                <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => navigate("/")}>Back to home</Button>
                    <Button
                        className="bg-green-600 text-black hover:bg-green-800 hover:text-white"
                        onClick={() => navigate("/my-reservations")}
                    >
                        My reservations
                    </Button>
                </div>
            </div>
        </div>
    );
}