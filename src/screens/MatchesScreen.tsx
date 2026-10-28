import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { FavoriteButton } from "../components/FavoriteButton";
import { UpdatedAgo } from "../components/UpdatedAgo";

import { useFavorites } from "../hooks/useFavorites";
import { FILTERS, useFilters } from "../hooks/useFilters";
import { useGetLabels } from "../hooks/useGetLabels";
import { useLoadMatches } from "../hooks/useLoadMatches";

// Экран «Матчи тура» — задание в README.md, часть 1.
export function MatchesScreen() {
  const {
    matches,
    loadMatches,
    filter,
    setFilter,
    loading,
    refreshing,
    error,
    updatedAt,
  } = useLoadMatches();

  const { isFavorite, toggle } = useFavorites();
  const { matchesFilter } = useFilters();
  const { getStatusLabel, getStartLabel } = useGetLabels();

  const visibleMatches = (matches?.matches ?? []).filter((match) =>
    matchesFilter(match, filter),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Матчи тура</Text>
          {updatedAt ? <UpdatedAgo since={updatedAt} /> : null}
        </View>
        <Pressable
          onPress={() => void loadMatches()}
          disabled={refreshing}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.refreshButton,
            pressed && !refreshing && styles.pressed,
            refreshing && styles.disabledButton,
          ]}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color="#2563eb" />
          ) : (
            <Text style={styles.refreshText}>Обновить</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.filters} accessibilityRole="radiogroup">
        {FILTERS.map(({ key, label }) => {
          const selected = filter === key;
          return (
            <Pressable
              key={key}
              onPress={() => setFilter(key)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              style={[styles.filter, selected && styles.selectedFilter]}
            >
              <Text
                style={[
                  styles.filterText,
                  selected && styles.selectedFilterText,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            onPress={() => void loadMatches()}
            disabled={refreshing}
            accessibilityRole="button"
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Повторить</Text>
          </Pressable>
        </View>
      ) : null}

      {loading && matches === null ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.mutedText}>Загружаем матчи...</Text>
        </View>
      ) : matches === null ? null : matches.matches.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>Матчей пока нет</Text>
          <Text style={styles.mutedText}>
            Попробуйте обновить список позже.
          </Text>
        </View>
      ) : visibleMatches.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>В этой категории матчей нет</Text>
        </View>
      ) : (
        <FlatList
          data={visibleMatches}
          numColumns={2}
          keyExtractor={(match) => match.id}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item: match }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.dateTag}>
                  <Text style={styles.startTime}>
                    {getStartLabel(match.startsAt)}
                  </Text>
                </View>
                <FavoriteButton
                  active={isFavorite(match.id)}
                  onPress={() => toggle(match.id)}
                />
              </View>
              <View style={styles.teams}>
                <View style={styles.team}>
                  <View style={styles.teamBadge}>
                    <Text style={styles.teamInitial}>
                      {match.home.name.slice(0, 1)}
                    </Text>
                  </View>
                  <Text style={styles.teamName} numberOfLines={2}>
                    {match.home.name}
                  </Text>
                </View>
                <View style={styles.scorePanel}>
                  {match.score ? (
                    <Text style={styles.score}>
                      {match.score.home} : {match.score.away}
                    </Text>
                  ) : (
                    <Text style={styles.vs}>VS</Text>
                  )}
                </View>
                <View style={styles.team}>
                  <View style={styles.teamBadge}>
                    <Text style={styles.teamInitial}>
                      {match.away.name.slice(0, 1)}
                    </Text>
                  </View>
                  <Text style={styles.teamName} numberOfLines={2}>
                    {match.away.name}
                  </Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <View
                  style={[
                    styles.statusBadge,
                    match.status === "live" && styles.liveBadge,
                    match.status === "finished" && styles.finishedBadge,
                    match.status === "postponed" && styles.postponedBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.status,
                      match.status === "live" && styles.liveStatus,
                      match.status === "finished" && styles.finishedStatus,
                      match.status === "postponed" && styles.postponedStatus,
                    ]}
                  >
                    {getStatusLabel(match)}
                  </Text>
                </View>
                <Text style={styles.roundLabel}>МАТЧ</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  refreshButton: {
    minWidth: 92,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#eff6ff",
  },
  refreshText: {
    color: "#1d4ed8",
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.65,
  },
  pressed: {
    opacity: 0.7,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  filter: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
  },
  selectedFilter: {
    backgroundColor: "#1d4ed8",
  },
  filterText: {
    color: "#374151",
    fontWeight: "500",
  },
  selectedFilterText: {
    color: "#fff",
  },
  errorBox: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fef2f2",
  },
  errorText: {
    color: "#b91c1c",
    marginBottom: 8,
  },
  retryButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  retryText: {
    color: "#b91c1c",
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  mutedText: {
    color: "#6b7280",
    textAlign: "center",
  },
  emptyTitle: {
    color: "#374151",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  list: {
    paddingBottom: 20,
  },
  gridRow: {
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8edf4",
    shadowColor: "#10213a",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  dateTag: {
    flex: 1,
    marginRight: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  startTime: {
    color: "#53647a",
    fontSize: 11,
    fontWeight: "600",
  },
  teams: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  team: {
    flex: 1,
    alignItems: "center",
    gap: 7,
  },
  teamBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eaf0f8",
    borderWidth: 1,
    borderColor: "#dce5f0",
  },
  teamInitial: {
    color: "#24466f",
    fontSize: 18,
    fontWeight: "800",
  },
  teamName: {
    width: "100%",
    color: "#111827",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    minHeight: 36,
  },
  scorePanel: {
    minWidth: 50,
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: "#14263f",
  },
  score: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  vs: {
    color: "#c5d2e3",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#edf1f6",
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 20,
    backgroundColor: "#eaf2ff",
  },
  status: {
    color: "#315f9b",
    fontSize: 10,
    fontWeight: "700",
  },
  liveBadge: {
    backgroundColor: "#fff0ef",
  },
  liveStatus: {
    color: "#d33b32",
  },
  finishedBadge: {
    backgroundColor: "#edf7f1",
  },
  finishedStatus: {
    color: "#34815a",
  },
  postponedBadge: {
    backgroundColor: "#fff6e5",
  },
  postponedStatus: {
    color: "#9a6816",
  },
  roundLabel: {
    color: "#9aa7b7",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
