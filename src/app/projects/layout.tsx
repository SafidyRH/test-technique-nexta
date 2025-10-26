import Header from "@/widgets/header/header";

export default function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Header/>
        {children}
    </>
  );
}