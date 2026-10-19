"use client";

import Header from "@/components/Header";
import MoviesRow from "@/components/movie/MoviesRow";
import useFetchMovies from "@/hooks/movie/useFetchMovies";
import useFetchTrendingMovies from "@/hooks/movie/useFetchTrendingMovies";

function Message({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-sm border border-white/10 bg-white/3 px-6 text-center">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="max-w-lg text-sm text-white/55">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-sm bg-white px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/80"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default function NewAndPopularPage() {
  const moviesQuery = useFetchMovies();
  const trendingQuery = useFetchTrendingMovies();
  const recentlyAdded = Array.isArray(moviesQuery.data) ? moviesQuery.data : [];
  const trending = Array.isArray(trendingQuery.data)
    ? trendingQuery.data
    : [];

  return (
    <div className="min-h-screen bg-brand-background">
      <Header />
      <main className="flex flex-col gap-12 px-4 pb-16 pt-10 md:px-14">
        <div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            New &amp; Popular
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Recent catalog additions and films marked as trending.
          </p>
        </div>

        <section aria-label="Recently Added">
          {moviesQuery.isLoading ? (
            <Message
              title="Loading recent additions…"
              description="Checking the newest films in the catalog."
            />
          ) : moviesQuery.isError ? (
            <Message
              title="Recent additions could not be loaded"
              description="This section is temporarily unavailable."
              onRetry={() => void moviesQuery.refetch()}
            />
          ) : recentlyAdded.length === 0 ? (
            <Message
              title="No recent additions"
              description="Newly added films will appear here."
            />
          ) : (
            <MoviesRow
              title="Recently Added"
              movies={recentlyAdded}
              eagerThumbnailUrl={recentlyAdded[0]?.thumbnailUrl ?? null}
              highPriorityThumbnailUrl={recentlyAdded[0]?.thumbnailUrl ?? null}
            />
          )}
        </section>

        <section aria-label="Trending">
          {trendingQuery.isLoading ? (
            <Message
              title="Loading trending films…"
              description="Checking what is currently featured as trending."
            />
          ) : trendingQuery.isError ? (
            <Message
              title="Trending films could not be loaded"
              description="This section is temporarily unavailable."
              onRetry={() => void trendingQuery.refetch()}
            />
          ) : trending.length === 0 ? (
            <Message
              title="Nothing is trending yet"
              description="Films marked as trending will appear here."
            />
          ) : (
            <MoviesRow
              title="Trending Now"
              movies={trending}
              eagerThumbnailUrl={trending[0]?.thumbnailUrl ?? null}
              highPriorityThumbnailUrl={trending[0]?.thumbnailUrl ?? null}
            />
          )}
        </section>
      </main>
    </div>
  );
}
