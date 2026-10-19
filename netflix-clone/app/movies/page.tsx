"use client";

import Header from "@/components/Header";
import MoviesRow from "@/components/movie/MoviesRow";
import useFetchMovies from "@/hooks/movie/useFetchMovies";

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
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-sm border border-white/10 bg-white/3 px-6 text-center">
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

export default function MoviesPage() {
  const moviesQuery = useFetchMovies();
  const movies = Array.isArray(moviesQuery.data) ? moviesQuery.data : [];
  const firstThumbnail = movies[0]?.thumbnailUrl ?? null;

  return (
    <div className="min-h-screen bg-brand-background">
      <Header />
      <main className="px-4 pb-16 pt-10 md:px-14">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white md:text-4xl">Films</h1>
          <p className="mt-2 text-sm text-white/55">
            Browse the complete MJBFLIX film catalog.
          </p>
        </div>

        {moviesQuery.isLoading ? (
          <Message
            title="Loading films…"
            description="Fetching the latest catalog."
          />
        ) : moviesQuery.isError ? (
          <Message
            title="Films could not be loaded"
            description="The catalog is temporarily unavailable."
            onRetry={() => void moviesQuery.refetch()}
          />
        ) : movies.length === 0 ? (
          <Message
            title="No films available"
            description="Films will appear here after they are added to the catalog."
          />
        ) : (
          <MoviesRow
            title="All Films"
            movies={movies}
            eagerThumbnailUrl={firstThumbnail}
            highPriorityThumbnailUrl={firstThumbnail}
          />
        )}
      </main>
    </div>
  );
}
