import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogIn, ShieldAlert, LogOut } from 'lucide-react';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAdmin, loading, login, logout } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Case 1: Not logged in at all
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full text-center space-y-6 p-8 border rounded-2xl bg-card shadow-sm">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                        <LogIn className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Admin Authentication</h2>
                        <p className="text-muted-foreground">
                            Please sign in with your authorized Google account to access the dashboard.
                        </p>
                    </div>
                    <button
                        onClick={login}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-xl font-semibold transition-all"
                    >
                        <LogIn className="w-5 h-5" />
                        Login with Google
                    </button>
                </div>
            </div>
        );
    }

    // Case 2: Logged in but NOT as the admin
    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full text-center space-y-6 p-8 border border-destructive/20 rounded-2xl bg-destructive/5 shadow-sm">
                    <div className="bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-8 h-8 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-destructive">Access Denied</h2>
                        <p className="text-muted-foreground">
                            Secondary accounts do not have permission to view this dashboard.
                            Logged in as: <span className="font-medium text-foreground">{user.email}</span>
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 border border-destructive/20 text-destructive hover:bg-destructive/10 py-3 rounded-xl font-semibold transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout & Try Another Account
                    </button>
                </div>
            </div>
        );
    }

    // Case 3: Authorized admin
    return <>{children}</>;
};

export default AuthGuard;
