



export default function ProductsLayout({children}: {children: React.ReactNode}) {
    return (
        <main className="w-full max-w-7xl mx-auto flex h-full flex-col m-5">
            {children}
        </main>
    )
}