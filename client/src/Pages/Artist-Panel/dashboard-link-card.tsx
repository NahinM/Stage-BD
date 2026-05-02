import { Link } from "react-router-dom";

export default function DashboardLink({
    to,
    icon: Icon,
    title,
    description,
}: {
    to: string;
    icon: any;
    title: string;
    description: string;
}) {
    return (
        <Link
            to={to}
            className="rounded-xl border bg-gray-50 p-4 transition hover:border-green-500 hover:bg-green-50"
        >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                <Icon className="h-5 w-5 text-green-600" />
            </div>

            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
        </Link>
    );
}