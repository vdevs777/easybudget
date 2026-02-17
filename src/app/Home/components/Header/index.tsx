import { Text, View } from "react-native";

import { styles } from "./styles";
import { Button } from "@/components/Button";
import { useNavigation } from "@react-navigation/native";
import {
  StackNavigationProps,
  StackRoutesList,
  StackRoutesProps,
} from "@/routes/StackRoutes";
import { numberToLocale } from "@/utils/number";

type HeaderProps = {
  draftItems?: number;
};

export function Header({ draftItems }: HeaderProps) {
  const navigation = useNavigation<StackNavigationProps<"home">>();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Orçamentos</Text>
        <Text style={styles.description}>
          Você tem {numberToLocale(draftItems)}{" "}
          {draftItems === 1 ? "item" : "itens"} em rascunho
        </Text>
      </View>
      <Button
        text="Novo"
        icon="add"
        onPress={() => navigation.navigate("budgetCreate")}
      />
    </View>
  );
}
