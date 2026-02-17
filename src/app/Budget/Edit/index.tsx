import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";

import { BudgetForm } from "@/components/Forms/BudgetForm";
import { Loading } from "@/components/Loading";

import { BudgetModel, budgetStorage } from "@/storage/budget-storage";
import { StackRoutesList } from "@/routes/StackRoutes";

type RouteProps = RouteProp<StackRoutesList, "budgetEdit">;

export function BudgetEdit() {
  const route = useRoute<RouteProps>();
  const { id } = route.params;

  const [data, setData] = useState<BudgetModel>();
  const [isFetching, setIsFetching] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setIsFetching(true);
        try {
          const budget = await budgetStorage.getById(id);
          setData(budget);
        } catch (error) {
          Alert.alert("Erro", "Não foi possível encontrar orçamento");
        } finally {
          setIsFetching(false);
        }
      })();
    }, [id]),
  );

  if (isFetching) return <Loading />;

  return <BudgetForm defaultValues={data} />;
}
