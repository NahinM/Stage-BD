import { useUserStore } from "@/store/User/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Profile() {
    const { user } = useUserStore();

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Welcome Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-foreground">Welcome to Your Profile</h1>
                    <p className="text-muted-foreground text-lg">
                        {user ? `Nice to see you again, ${user.firstname}!` : "Please sign in to continue"}
                    </p>
                </div>

                {/* User Profile Card */}
                {user && (
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Personal Information</CardTitle>
                                <CardDescription>Your account details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {user.firstname} {user.lastname}
                                    </p>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p className="text-lg text-foreground break-all">{user.email}</p>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-sm font-medium text-muted-foreground">Username</p>
                                    <p className="text-lg text-foreground">@{user.username}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Additional Info</CardTitle>
                                <CardDescription>More about you</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Birth Year</p>
                                    <p className="text-lg font-semibold text-foreground">{user.birthyear}</p>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-sm font-medium text-muted-foreground">Gender</p>
                                    <p className="text-lg text-foreground capitalize">{user.gender}</p>
                                </div>
                                <div className="border-t pt-4">
                                    <p className="text-sm font-medium text-muted-foreground">City</p>
                                    <p className="text-lg text-foreground">{user.city}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Bio Section */}
                {user && user.bio && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Bio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-foreground leading-relaxed">{user.bio}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Roles Badge */}
                {user && user.roles && user.roles.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Assigned Roles</CardTitle>
                            <CardDescription>Your permissions and access levels</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {user.roles.map((role) => (
                                    <div
                                        key={role}
                                        className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                                    >
                                        {role}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}