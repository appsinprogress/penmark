export function CompatibleSSGCard({
    children,
}) {
    return (
        <div className="text-center border w-80 h-24 p-12 mx-4 bg-white rounded-lg shadow-md flex justify-center items-center">
            {children}
        </div>
    )
}

export function HowToSSGSelector({
    children,
}) {
    return (
        <div className="border w-40 h-12 p-8 mx-4 bg-white rounded-lg shadow-md flex justify-center items-center">
            {children}
        </div>
    )
}

export function HowToStepSelector({
    children,
}) {
    return (
        <div className="col-span-1 border p-7 m-4 bg-white rounded-lg shadow-md flex justify-center items-center">
            {children}
        </div>
    )
}

export function FeaturesTitle({
    children,
}) {
    return (
        <div className="text-3xl font-semibold">
            {children}
        </div>
    )
}

export function FeaturesDescription({
    children,
}) {
    return (
        <div className="text-xl text-zinc-500">
            {children}
        </div>
    )
}

export function SectionTitle({
    children,
}) {
    return (
        <div className="text-5xl font-semibold text-center max-w-5xl m-auto my-12">
            {children}
        </div> 
    )
}

export function HowItWorksStep({
    children,
}) {
    return (
        <div className="border rounded-lg shadow-md p-8">
            {children}
        </div>
    )
}