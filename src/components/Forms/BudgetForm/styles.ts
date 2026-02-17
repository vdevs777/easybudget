import { colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    padding: 20,
    gap: 20,
  },
  actions: {
    position: "absolute",
    backgroundColor: "white",
    bottom: 0,
    left: 0,
    right: 0,

    flexDirection: "row",
    justifyContent: "center",
    gap: 12,

    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.gray[300],
  },
});
