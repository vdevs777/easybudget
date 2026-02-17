import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, gap: 4 },
  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    ...typography.title.sm,
    color: colors.gray[700],
  },
  content: {
    padding: 20,
    gap: 16,
  },
  actions: {
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
});
