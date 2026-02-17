import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { StatusBadge } from "@/components/StatusBadge";
import { numberToLocale } from "@/utils/number";
import { Status } from "@/types/enums/status";
import { Currency } from "../../../../components/Currency";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProps } from "@/routes/StackRoutes";

type BudgetCardData = {
  id: string;
  title: string;
  customer: string;
  value: number;
  status: Status;
};

type BudgetCardProps = {
  data: BudgetCardData;
};

export function BudgetCard({ data }: BudgetCardProps) {
  const navigation = useNavigation<StackNavigationProps<"home">>();
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("budgetView", { id: data.id })}
    >
      <View style={styles.internalContainer}>
        <Text style={styles.title}>{data.title}</Text>

        <StatusBadge status={data.status} />
      </View>
      <View style={styles.internalContainer}>
        <Text style={styles.customer}>{data.customer}</Text>
        <Currency value={data.value} />
      </View>
    </TouchableOpacity>
  );
}
