import BottomNav from "@/components/bottomNav";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center w-full">
        {children}
      </div>
      <BottomNav />
    </section>
  );
}
