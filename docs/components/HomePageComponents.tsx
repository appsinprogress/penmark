export function CompatibleSSGCard({
    children,
    className
}) {

    const classNameVar = `
        flex justify-center items-center md:basis-1/5 basis-1/4
        lg:text-base lg:p-7 lg:mx-2
        sm:p-6 md:mx-2
        text-xs p-2 mx-1
        text-center border bg-white rounded-lg shadow-md flex justify-center items-center
        ${className}
    `

    return (
        <div className={classNameVar}>
            {children}
        </div>
    )
}

export function HowToSSGSelector({
    children,
    onClick,
    selected
}) {
    const classNameVar = `
        flex justify-center items-center basis-1/3
        lg:px-32
        md:px-18
        sm:px-12
        px-4
        py-2
        text-center border bg-white rounded-lg shadow-md flex justify-center items-center
        ${selected ? 'bg-slate-100	' : 'border-gray-300'}
    `;

    return (
        <div className={classNameVar} onClick={onClick}>
            {children}
        </div>
    )
}

export function HowToStepSelector({
    children, onClick, selected
}) {

    const classNameVar = `
        grow cursor-pointer sm:col-span-1 row-span-1 py-4 sm:px-8 px-2 mt-4  rounded-t-lg flex justify-center items-center font-semibold
        ${selected ? 'bg-indigo-100	' : 'bg-gray-50'}
    `;

    return (
        <div className={classNameVar} onClick={onClick}>
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
        <div className="md:text-5xl sm:text-4xl text-3xl font-semibold text-center max-w-5xl m-auto my-12">
            {children}
        </div> 
    )
}

export function HowItWorksStep({
    children,
    onClick
}) {
    return (
        <div className="border rounded-lg shadow-md md:p-8 p-4 sm:col-span-1 col-span-1 md:block md:text-left flex justify-center items-center text-center cursor-pointer" onClick={onClick}>
            {children}
        </div>
    )
}