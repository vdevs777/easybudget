import { CreateBudgetCard } from "@/components/CreateBudgetCard";
import { Input } from "@/components/Input";
import { View } from "react-native";
import { styles } from "./styles";

type MainInfoProps = {
  title: string;
  customer: string;
  onTitleChange: (title: string) => void;
  onCustomerChange: (customer: string) => void;
};

export function MainInfo({
  title,
  customer,
  onTitleChange,
  onCustomerChange,
}: MainInfoProps) {
  return (
    <CreateBudgetCard
      title="Informações gerais"
      icon="store"
      content={
        <View style={styles.container}>
          <Input
            placeholder="Título"
            value={title}
            onChangeText={onTitleChange}
          />
          <Input
            placeholder="Cliente"
            value={customer}
            onChangeText={onCustomerChange}
          />
        </View>
      }
    />
  );
}
