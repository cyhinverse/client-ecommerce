export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="w-full min-h-screen  dark:bg-black">{children}</main>;
}
