import { cn } from "@/lib/utils"

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-foreground/10",
                className
            )}
            {...props}
        />
    )
}

/** Full-page skeleton shown while Firestore data is loading */
function LandingPageSkeleton() {
    return (
        <div className="space-y-24 pt-4">
            {/* Hero Skeleton */}
            <section className="space-y-6 max-w-4xl pt-12 md:pt-24">
                <Skeleton className="h-14 md:h-24 w-3/4 rounded-xl" />
                <Skeleton className="h-14 md:h-24 w-1/2 rounded-xl" />
                <div className="space-y-3 pt-4">
                    <Skeleton className="h-5 w-full max-w-xl" />
                    <Skeleton className="h-5 w-4/5 max-w-md" />
                </div>
                <Skeleton className="h-[300px] md:h-[500px] w-full rounded-2xl mt-8" />
            </section>

            {/* Projects Grid Skeleton */}
            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-48 rounded-lg" />
                    <Skeleton className="h-1 flex-1 rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-4 rounded-2xl border border-border/50 p-4">
                            <Skeleton className="h-48 w-full rounded-xl" />
                            <div className="space-y-2 px-1">
                                <Skeleton className="h-6 w-3/4 rounded" />
                                <Skeleton className="h-4 w-full rounded" />
                                <Skeleton className="h-4 w-2/3 rounded" />
                            </div>
                            <div className="flex gap-2 px-1">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-14 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Skills Skeleton */}
            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-32 rounded-lg" />
                    <Skeleton className="h-1 flex-1 rounded-full" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border/50">
                            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-3/4 rounded" />
                                <Skeleton className="h-3 w-1/2 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Experience Skeleton */}
            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-40 rounded-lg" />
                    <Skeleton className="h-1 flex-1 rounded-full" />
                </div>
                <div className="space-y-6 max-w-3xl">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-4 p-6 rounded-xl border border-border/50">
                            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                            <div className="space-y-3 flex-1">
                                <Skeleton className="h-5 w-1/2 rounded" />
                                <Skeleton className="h-4 w-1/3 rounded" />
                                <Skeleton className="h-4 w-full rounded" />
                                <Skeleton className="h-4 w-4/5 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Skeleton */}
            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-36 rounded-lg" />
                    <Skeleton className="h-1 flex-1 rounded-full" />
                </div>
                <div className="max-w-lg space-y-4">
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-12 w-40 rounded-xl" />
                </div>
            </section>
        </div>
    )
}

export { Skeleton, LandingPageSkeleton }
