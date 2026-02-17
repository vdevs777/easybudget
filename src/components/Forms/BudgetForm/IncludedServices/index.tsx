import { BudgetServiceCard } from "@/components/BudgetServiceCard";
import { Button } from "@/components/Button";
import { CreateBudgetCard } from "@/components/CreateBudgetCard";
import { ServiceModel } from "@/storage/budget-storage";
import { View } from "react-native";

type InclduedServicesProps = {
  onAddService: () => void;
  onOpenEdit: (data: ServiceModel) => void;
  services: ServiceModel[];
};

export function IncludedServices({
  onAddService,
  services,
  onOpenEdit,
}: InclduedServicesProps) {
  return (
    <CreateBudgetCard
      title="Serviços inclusos"
      icon="assignment"
      content={
        <View style={{ gap: 16 }}>
          {services.map((service) => (
            <BudgetServiceCard
              data={service}
              key={service.id}
              onOpenEdit={onOpenEdit}
            />
          ))}
          <Button
            onPress={onAddService}
            text="Adicionar serviço"
            icon="add"
            variant="secondary"
            style={{ width: "100%", justifyContent: "center" }}
          />
        </View>
      }
    />
  );
}
