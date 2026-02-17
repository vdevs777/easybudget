import { Pressable, Text, View } from "react-native";
import { styles } from "./styles";
import { truncateText } from "@/utils/string";
import { Currency } from "@/components/Currency";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { ServiceModel } from "@/storage/budget-storage";

export function BudgetServiceCard({
  editable = true,
  data,
  onOpenEdit,
}: {
  editable?: boolean;
  data: ServiceModel;
  onOpenEdit?: (data: ServiceModel) => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.titleAndDescriptionContainer}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.description}>
          {truncateText(data.description, 31)}
        </Text>
      </View>
      <View style={styles.valuesAndActionsContainer}>
        <View style={styles.valueAndQuantityContainer}>
          <Currency value={data.price} />
          <Text style={styles.quantity}>Qt: {data.qty}</Text>
        </View>

        {editable && (
          <Pressable onPress={() => onOpenEdit && onOpenEdit(data)}>
            <MaterialIcons name="edit" size={20} color={colors.purple.base} />
          </Pressable>
        )}
      </View>
    </View>
  );
}
