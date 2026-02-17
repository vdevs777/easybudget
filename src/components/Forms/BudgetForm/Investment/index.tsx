import { CreateBudgetCard } from "@/components/CreateBudgetCard";
import { Currency } from "@/components/Currency";
import { Input } from "@/components/Input";
import { NumberInput } from "@/components/Input/NumberInput";
import { ServiceModel } from "@/storage/budget-storage";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { numberToLocale } from "@/utils/number";
import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";

type InvestmentProps = {
  services: ServiceModel[];
  defaultDiscountPct?: number;
  onDiscountPctChange: (value: number) => void;
  onTotalChange: (value: number) => void;
};

export function Investment({
  services,
  onDiscountPctChange,
  onTotalChange,
  defaultDiscountPct,
}: InvestmentProps) {
  const [discountPct, setDiscountPct] = useState(defaultDiscountPct ?? 0);

  const subtotal = useMemo(() => {
    return services.reduce(
      (acc, service) => acc + service.qty * service.price,
      0,
    );
  }, [services]);

  const discountValue = (discountPct / 100) * subtotal;
  const total = subtotal - discountValue;

  useEffect(() => {
    onDiscountPctChange(discountPct);
    onTotalChange(subtotal);
  }, [discountPct, subtotal]);

  return (
    <CreateBudgetCard
      title="Investimento"
      icon="attach-money"
      content={
        <View style={{ gap: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={[typography.text.sm, { color: colors.gray[700] }]}>
              Subtotal
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={[typography.text.xs, { color: colors.gray[500] }]}>
                {services.length} {services.length === 1 ? "item" : "itens"}
              </Text>
              <Currency value={subtotal} valueStyle={typography.text.sm} />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                width: 180,
              }}
            >
              <Text style={[typography.text.sm, { color: colors.gray[700] }]}>
                Desconto (%)
              </Text>
              <NumberInput
                containerStyle={{ height: 32 }}
                hasStepper={false}
                value={discountPct}
                onChange={setDiscountPct}
                min={0}
                max={100}
              />
            </View>

            <Currency
              value={discountValue}
              valueStyle={{
                ...typography.text.sm,
                color: colors.danger.base,
              }}
              symbolStyle={{
                color: colors.danger.base,
              }}
              negative
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[typography.title.sm, { color: colors.gray[700] }]}>
              Valor total
            </Text>
            <View style={{ gap: 8, alignItems: "flex-end" }}>
              {discountValue > 0 && (
                <Text
                  style={[
                    typography.text.xs,
                    {
                      color: colors.gray[600],
                      textDecorationLine: "line-through",
                    },
                  ]}
                >
                  R$ {numberToLocale(subtotal)}
                </Text>
              )}
              <Currency value={total} />
            </View>
          </View>
        </View>
      }
    />
  );
}
