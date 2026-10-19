import Header from "@/components/Header";

export default function SeriesPage() {
  return (
    <div className="min-h-screen bg-brand-background">
      <Header />
      <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 md:px-14">
        <div className="flex max-w-xl flex-col items-center gap-4 rounded-sm border border-white/10 bg-white/3 px-8 py-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#e50914]">
            Coming soon
          </p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            TV series are coming to MJBFLIX
          </h1>
          <p className="text-sm leading-relaxed text-white/55">
            The current catalog contains films. A dedicated TV series library
            will appear here when series support is available.
          </p>
        </div>
      </main>
    </div>
  );
}
