import { Match } from "./useLoadMatches";

export type Filter = "all" | "upcoming" | "finished";

export const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "upcoming", label: "Предстоящие" },
  { key: "finished", label: "Завершённые" },
];

export const useFilters = () => {
  const matchesFilter = (match: Match, filter: Filter): boolean => {
  if (filter === "finished") {
    return match.status === "finished";
  }
  if (filter === "upcoming") {
    return match.status === "scheduled" || match.status === "live";
  }
  return true;
};

  return { matchesFilter };
}
