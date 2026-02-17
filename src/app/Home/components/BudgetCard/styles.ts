import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: colors.gray[300],
    backgroundColor: colors.gray[100],
    padding: 16,
    gap: 10,
    justifyContent: "space-between",
  },
  internalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    ...typography.title.md,
    color: colors.gray[700],
    maxWidth: "60%",
  },
  customer: {
    ...typography.text.sm,
    color: colors.gray[600],
    maxWidth: "60%",
  },
  valueContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "flex-end",
  },
  currency: {
    ...typography.text.xs,
    color: colors.gray[700],
  },
  value: {
    ...typography.title.md,
    color: colors.gray[700],
  },
});
