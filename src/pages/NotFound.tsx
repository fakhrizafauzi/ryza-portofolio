import { Link } from "react-router-dom";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 selection:bg-primary selection:text-primary-foreground">
            <div className="max-w-md text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="space-y-4">
                    <h1 className="text-8xl md:text-9xl font-black text-primary">404</h1>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Page Not Found</h2>
                    <p className="text-muted-foreground text-lg">
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                </div>

                <Link
                    to="/"
                    className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary text-primary-foreground font-bold hover:scale-105 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    <MoveLeft className="mr-2 w-5 h-5" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
