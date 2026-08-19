import SearchResults from "@/components/SearchResults";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;

  return <SearchResults initialQuery={q} />;
}