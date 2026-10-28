import { Match } from "./useLoadMatches";

export const useGetLabels = () => {

const getStatusLabel = (match: Match): string => {
      switch (match.status) {
        case "finished":
          return "Завершён";
        case "scheduled":
          return "Предстоящий";
        case "live":
          return typeof match.minute === "number"
            ? `Идёт · ${match.minute}′`
            : "Идёт";
        case "postponed":
          return "Перенесён";
        default:
          return "Статус неизвестен";
      }
    };
    
    const getStartLabel = (startsAt: string | null): string => {
      if (startsAt === null) {
        return "Дата и время уточняются";
      }
    
      const date = new Date(startsAt);
    
      return date.toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };
    
  return { getStatusLabel, getStartLabel }
}
