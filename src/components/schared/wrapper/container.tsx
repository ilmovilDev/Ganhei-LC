export default function Container({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex flex-col gap-y-4 p-4">{children}</div>;
}
