export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex w-screen items-center justify-center p-4">
      {children}
    </main>
  );
}
