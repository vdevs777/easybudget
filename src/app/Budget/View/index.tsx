import { Alert, ScrollView, Text, ToastAndroid, View } from "react-native";

import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Separator } from "@/components/Separator";
import { CreateBudgetCard } from "@/components/CreateBudgetCard";
import { Button } from "@/components/Button";
import { Currency } from "@/components/Currency";
import { BudgetViewCard } from "./components/BudgetViewCard";

import { Status } from "@/types/enums/status";

import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { styles } from "./styles";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { StackNavigationProps, StackRoutesList } from "@/routes/StackRoutes";
import { useCallback, useState } from "react";
import { BudgetModel, budgetStorage } from "@/storage/budget-storage";
import { Loading } from "@/components/Loading";
import dayjs from "dayjs";
import { BudgetServiceCard } from "@/components/BudgetServiceCard";
import { numberToLocale } from "@/utils/number";

type RouteProps = RouteProp<StackRoutesList, "budgetView">;

export function BudgetView() {
  const navigation = useNavigation<StackNavigationProps<"budgetView">>();
  const route = useRoute<RouteProps>();
  const { id } = route.params;

  const [data, setData] = useState<BudgetModel>();
  const [isFetching, setIsFetching] = useState(false);

  function handleDelete() {
    if (!data) return;

    Alert.alert(
      "Delete orçamento",
      "Você tem certeza que deseja deletar este orçamento?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          onPress: async () => {
            try {
              await budgetStorage.deleteById(data?.id);
              navigation.navigate("home");
              ToastAndroid.show(
                "Orçamento deletado com sucesso!",
                ToastAndroid.SHORT,
              );
            } catch (error) {
              Alert.alert("Erro", "Não foi possível deletar este orçamento.");
              console.error(error);
            }
          },
        },
      ],
    );
  }

  function handleCopy() {
    if (!data) return;

    Alert.alert(
      "Copiar orçamento",
      "Você tem certeza que deseja criar uma cópia deste orçamento?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          onPress: async () => {
            try {
              const id = await budgetStorage.duplicateById(data?.id);
              navigation.navigate("budgetView", { id });
              ToastAndroid.show(
                "Orçamento copiado com sucesso!",
                ToastAndroid.SHORT,
              );
            } catch (error) {
              Alert.alert("Erro", "Não foi possível copiar este orçamento.");
              console.error(error);
            }
          },
        },
      ],
    );
  }

  const discountValue = data?.discountPct
    ? (data.discountPct / 100) * data.totalValue
    : null;

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

  return (
    <View style={{ flex: 1 }}>
      {data && (
        <>
          <PageHeader
            title={`Orçamento ${data.id}`}
            extra={<StatusBadge status={data.status} />}
          />
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <BudgetViewCard
              icon="store"
              topContent={
                <Text
                  style={[
                    typography.title.lg,
                    { color: colors.gray[700], maxWidth: "80%" },
                  ]}
                >
                  {data.title}
                </Text>
              }
              bottomContent={
                <View style={{ padding: 16, gap: 16 }}>
                  <View style={{ gap: 8 }}>
                    <Text
                      style={[typography.text.xs, { color: colors.gray[600] }]}
                    >
                      Cliente
                    </Text>
                    <Text
                      style={[typography.text.sm, { color: colors.gray[700] }]}
                    >
                      {data.customer}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ gap: 8, flex: 1 }}>
                      <Text
                        style={[
                          typography.text.xs,
                          { color: colors.gray[600] },
                        ]}
                      >
                        Criado em
                      </Text>
                      <Text
                        style={[
                          typography.text.sm,
                          { color: colors.gray[700] },
                        ]}
                      >
                        {dayjs(data.createdAt).format("DD/MM/YYYY")}
                      </Text>
                    </View>
                    <View style={{ gap: 8, flex: 1 }}>
                      <Text
                        style={[
                          typography.text.xs,
                          { color: colors.gray[600] },
                        ]}
                      >
                        Atualizado em
                      </Text>
                      <Text
                        style={[
                          typography.text.sm,
                          { color: colors.gray[700] },
                        ]}
                      >
                        {dayjs(data.updatedAt).format("DD/MM/YYYY")}
                      </Text>
                    </View>
                  </View>
                </View>
              }
            />
            {data.items.length > 0 && (
              <>
                <CreateBudgetCard
                  title="Serviços inclusos"
                  icon="assignment"
                  content={
                    <View style={{ gap: 16 }}>
                      {data.items.map((service) => (
                        <BudgetServiceCard
                          editable={false}
                          data={service}
                          key={service.id}
                        />
                      ))}
                    </View>
                  }
                />
                <BudgetViewCard
                  icon="credit-card"
                  topContent={
                    <View style={{ gap: 8 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          width: "93%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={[
                            typography.text.sm,
                            { color: colors.gray[600], flex: 1 },
                          ]}
                        >
                          Subtotal
                        </Text>
                        <Text
                          style={[
                            typography.title.xs,
                            {
                              color: colors.gray[600],
                              textDecorationLine: "line-through",
                            },
                          ]}
                        >
                          R${" "}
                          {numberToLocale(data.totalValue, { minDecimals: 2 })}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          width: "93%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={[
                            typography.text.sm,
                            { color: colors.gray[600], flex: 1 },
                          ]}
                        >
                          Desconto
                        </Text>
                        <Text
                          style={[
                            typography.title.xs,
                            {
                              color: colors.success.dark,
                            },
                          ]}
                        >
                          {discountValue != null
                            ? `- R$ ${numberToLocale(discountValue, { minDecimals: 2 })}`
                            : "-"}
                        </Text>
                      </View>
                      <View style={{ marginVertical: 8 }}>
                        <Separator color={colors.gray[300]} />
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          width: "93%",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={[
                            typography.title.sm,
                            { color: colors.gray[700], flex: 1 },
                          ]}
                        >
                          Total
                        </Text>
                        <Currency
                          value={data.totalValue - (discountValue ?? 0)}
                          valueStyle={typography.title.lg}
                        />
                      </View>
                    </View>
                  }
                />
              </>
            )}
          </ScrollView>
          <View style={styles.actions}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Button
                variant="danger"
                icon="delete-outline"
                onPress={handleDelete}
              />
              <Button
                variant="secondary"
                icon="content-copy"
                onPress={handleCopy}
              />
              <Button
                variant="secondary"
                icon="edit"
                onPress={() => navigation.navigate("budgetEdit", { id })}
              />
            </View>
            <Button text="Compartilhar" icon="send" />
          </View>
        </>
      )}
    </View>
  );
}
