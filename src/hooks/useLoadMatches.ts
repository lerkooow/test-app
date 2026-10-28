
import { useCallback, useEffect, useState } from "react";

import { MATCHES_URL } from "../config";

import type { Filter } from "./useFilters";

type Team = {
  id: string;
  name: string;
};

export type Match = {
  id: string;
  startsAt: string | null;
  status: string;
  home: Team;
  away: Team;
  score: { home: number; away: number } | null;
  minute?: number;
};

export type MatchesResponse = {
  matches: Match[];
};

export const useLoadMatches = () => {
  const [matches, setMatches] = useState<MatchesResponse | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const loadMatches = useCallback(async () => {
  setLoading(true);
  setRefreshing(true);
  setError(null);

  try {
    const response = await fetch(MATCHES_URL);

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}`);
    }

    setMatches(await response.json());
    setUpdatedAt(new Date());
  } catch {
    setError(
      "Не удалось загрузить матчи. Проверьте подключение и попробуйте ещё раз."
    );
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, []);

  useEffect(() => {
     loadMatches();
  }, [loadMatches]);

  return {
    matches,
    filter,
    setFilter,
    loading,
    refreshing,
    error,
    updatedAt,
    loadMatches,
  };
};
