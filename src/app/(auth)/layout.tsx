import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50/50">
      <div className="mb-8">
        <Link href="/" className="flex flex-col items-center">
          <div className="relative w-[180px] h-[60px] overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              className="object-cover object-center scale-110 mix-blend-multiply"
              priority
            />
          </div>
        </Link>
      </div>
      <div className="w-full max-w-[400px] bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {children}
      </div>
    </div>
  );
}
