import { Alert, ScrollView, ToastAndroid, View } from "react-native";
import { PageHeader } from "@/components/PageHeader";
import { CreateBudgetCard } from "@/components/CreateBudgetCard";
import { Button } from "@/components/Button";

import { MainInfo } from "./MainInfo";
import { styles } from "./styles";
import { RadioGroup } from "@/components/RadioGroup";
import { Status } from "@/types/enums/status";
import { StatusBadge } from "@/components/StatusBadge";
import { useEffect, useRef, useState } from "react";
import { IncludedServices } from "./IncludedServices";
import { Investment } from "./Investment";
import { ServiceSheetFormValues, ServiceSheet } from "./ServiceSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  BudgetModel,
  BudgetRequest,
  budgetStorage,
  ServiceModel,
} from "@/storage/budget-storage";
import { v4 as uuid } from "uuid";
import { setFormValue } from "@/utils/form";
import { isBlank } from "@/utils/string";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProps } from "@/routes/StackRoutes";

type BudgetFormProps = {
  defaultValues?: BudgetModel;
};

export function BudgetForm({ defaultValues }: BudgetFormProps) {
  const navigation = useNavigation<StackNavigationProps<"budgetCreate">>();
  const [formValues, setFormValues] = useState<BudgetRequest>(
    defaultValues || {
      title: "",
      customer: "",
      items: [],
      status: Status.DRAFT,
      totalValue: 0,
      discountPct: undefined,
    },
  );
  const [services, setServices] = useState<ServiceModel[]>(
    defaultValues?.items || [],
  );
  const [serviceToBeEdited, setServiceToBeEdited] = useState<ServiceModel>();

  const serviceSheetRef = useRef<BottomSheet>(null);

  const handleOpenService = () => {
    setServiceToBeEdited(undefined);
    serviceSheetRef.current?.expand();
  };

  function handleAddService(data: ServiceSheetFormValues) {
    setServices((prev) => [...prev, { id: uuid(), ...data }]);
    serviceSheetRef.current?.close();
  }

  function handleEditService(id: string, data: ServiceSheetFormValues) {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, ...data } : service,
      ),
    );

    serviceSheetRef.current?.close();
  }

  function handleDelete(id: string) {
    Alert.alert(
      "Confirmação",
      "Você tem certeza que deseja deletar esse item?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          style: "destructive",
          onPress: () => {
            setServices((prev) => prev.filter((service) => service.id !== id));
            serviceSheetRef.current?.close();
          },
        },
      ],
    );
  }

  const status = Object.values(Status).map((status) => ({
    value: status,
    label: <StatusBadge status={status} />,
  }));

  function validate(): boolean {
    const isTitleBlank = isBlank(formValues.title);
    const isCustomerBlank = isBlank(formValues.customer);
    const isServicesInvalid =
      services.length === 0 && formValues.status != Status.DRAFT;

    if (isTitleBlank || isCustomerBlank || isServicesInvalid) {
      Alert.alert(
        "Erro no formulário",
        `${isTitleBlank ? "O título deve ser preenchido." : ""} ${isCustomerBlank ? "O cliente deve ser preenchido." : ""} ${isServicesInvalid ? "Deve haver pelo menos um serviço" : ""}`,
      );
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    const isValid = validate();
    if (!isValid) return;

    try {
      if (defaultValues) {
        await budgetStorage.edit(defaultValues.id, formValues);
        ToastAndroid.show(
          "Orçamento atualizado com sucesso!",
          ToastAndroid.SHORT,
        );
        navigation.navigate("budgetView", { id: defaultValues.id });
      } else {
        const id = await budgetStorage.add(formValues);
        ToastAndroid.show("Orçamento salvo com sucesso!", ToastAndroid.SHORT);
        navigation.navigate("budgetView", { id });
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível salvar o orçamento.");
    }
  }

  useEffect(() => {
    if (serviceToBeEdited) {
      serviceSheetRef.current?.expand();
    }
  }, [serviceToBeEdited]);

  useEffect(() => {
    setFormValue(setFormValues, "items", services);
  }, [services]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <PageHeader title="Orçamento" />

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <MainInfo
            title={formValues.title}
            customer={formValues.customer}
            onTitleChange={(title) =>
              setFormValue(setFormValues, "title", title)
            }
            onCustomerChange={(customer) =>
              setFormValue(setFormValues, "customer", customer)
            }
          />
          <CreateBudgetCard
            title="Status"
            icon="sell"
            content={
              <RadioGroup
                items={status}
                onChange={(value) =>
                  // @ts-ignore
                  setFormValue(setFormValues, "status", value)
                }
                selectedValue={formValues.status}
                style={{ flexDirection: "row", flexWrap: "wrap" }}
                itemWidth="40%"
              />
            }
          />
          <IncludedServices
            onAddService={handleOpenService}
            services={services}
            onOpenEdit={(data) => {
              setServiceToBeEdited({ ...data });
            }}
          />
          <Investment
            services={services}
            defaultDiscountPct={defaultValues?.discountPct}
            onDiscountPctChange={(value) =>
              setFormValue(setFormValues, "discountPct", value)
            }
            onTotalChange={(value) =>
              setFormValue(setFormValues, "totalValue", value)
            }
          />
          <View style={{ height: 120 }} />
        </ScrollView>

        <View style={styles.actions}>
          <Button
            variant="secondary"
            text="Cancelar"
            onPress={() => navigation.goBack()}
          />
          <Button icon="check" text="Salvar" onPress={handleSubmit} />
        </View>
      </View>
      <ServiceSheet
        ref={serviceSheetRef}
        onCreate={handleAddService}
        onEdit={handleEditService}
        defaultValues={serviceToBeEdited}
        onDelete={handleDelete}
      />
    </View>
  );
}
