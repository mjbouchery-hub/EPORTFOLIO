"use client";

import Header from "@/components/Header";
import MoviesRow from "@/components/movie/MoviesRow";
import { useProfileContext } from "@/context/profileContext";
import useFetchMyListMovies from "@/hooks/my-list/useFetchMyListMovies";
import useFetchProfiles from "@/hooks/profile/useFetchProfiles";
import Link from "next/link";

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

export default function MyListPage() {
  const { activeProfileId } = useProfileContext();
  const profilesQuery = useFetchProfiles();
  const myListQuery = useFetchMyListMovies();
  const profiles = Array.isArray(profilesQuery.data) ? profilesQuery.data : [];

  let content: React.ReactNode;

  if (profilesQuery.isLoading) {
    content = (
      <Message
        title="Loading profiles…"
        description="Finding the active profile for My List."
      />
    );
  } else if (profilesQuery.isError) {
    content = (
      <Message
        title="Profiles could not be loaded"
        description="Try again before opening a profile’s saved list."
        onRetry={() => void profilesQuery.refetch()}
      />
    );
  } else if (profiles.length === 0) {
    content = (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-sm border border-white/10 bg-white/3 px-6 text-center">
        <h2 className="text-xl font-semibold text-white">No profile selected</h2>
        <p className="max-w-lg text-sm text-white/55">
          Create a profile before adding films to My List.
        </p>
        <Link
          href="/manage-profiles"
          className="mt-2 rounded-sm bg-white px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/80"
        >
          Manage profiles
        </Link>
      </div>
    );
  } else if (!activeProfileId) {
    content = (
      <Message
        title="Selecting a profile…"
        description="My List will appear when the active profile is ready."
      />
    );
  } else if (myListQuery.isLoading) {
    content = (
      <Message
        title="Loading My List…"
        description="Fetching the films saved to this profile."
      />
    );
  } else if (myListQuery.isError) {
    content = (
      <Message
        title="My List could not be loaded"
        description="The saved films for this profile are temporarily unavailable."
        onRetry={() => void myListQuery.refetch()}
      />
    );
  } else if ((myListQuery.data?.length ?? 0) === 0) {
    content = (
      <Message
        title="My List is empty"
        description="Add films from the catalog and they will appear here for this profile."
      />
    );
  } else {
    const movies = myListQuery.data ?? [];
    const firstThumbnail = movies[0]?.thumbnailUrl ?? null;

    content = (
      <MoviesRow
        title="Saved for this profile"
        movies={movies}
        eagerThumbnailUrl={firstThumbnail}
        highPriorityThumbnailUrl={firstThumbnail}
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-background">
      <Header />
      <main className="px-4 pb-16 pt-10 md:px-14">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white md:text-4xl">My List</h1>
          <p className="mt-2 text-sm text-white/55">
            Films saved to the active profile.
          </p>
        </div>
        {content}
      </main>
    </div>
  );
}
