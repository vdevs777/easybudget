import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Separator } from "@/components/Separator";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { NumberInput } from "@/components/Input/NumberInput";
import { CurrencyInput } from "@/components/CurrencyInput";

import { colors } from "@/theme/colors";
import { styles } from "./styles";
import { isBlank } from "@/utils/string";
import { ServiceModel } from "@/storage/budget-storage";
import { setFormValue } from "@/utils/form";

export interface ServiceSheetFormValues {
  title: string;
  description: string;
  qty: number;
  price: number;
}

type ServiceScheetProps = {
  onCreate: (data: ServiceSheetFormValues) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, data: ServiceSheetFormValues) => void;
  defaultValues?: ServiceModel;
};

export const ServiceSheet = forwardRef<BottomSheet, ServiceScheetProps>(
  ({ onCreate, onEdit, onDelete, defaultValues }, ref) => {
    const placeholderValue: ServiceSheetFormValues = {
      title: "",
      description: "",
      price: 0,
      qty: 1,
    };

    const [values, setValues] = useState<ServiceSheetFormValues>(
      defaultValues ?? placeholderValue,
    );

    function validate(): boolean {
      const isTitleBlank = isBlank(values.title);
      const isPriceInvalid = values.price <= 0;

      if (isTitleBlank || isPriceInvalid) {
        Alert.alert(
          "Erro no formulário",
          `${isTitleBlank ? "O nome do serviço deve ser preenchido;" : ""} ${isPriceInvalid ? "O valor deve ser maior do que zero" : ""}`,
        );
        return false;
      }
      return true;
    }

    function handleSubmit() {
      const isValid = validate();
      if (!isValid) return;
      defaultValues ? onEdit(defaultValues.id, values) : onCreate(values);

      setValues(placeholderValue);
    }

    const snapPoints = useMemo(() => ["1%", "52%"], []);

    const bottomSheetRef = useRef<BottomSheetMethods>(null);

    useImperativeHandle(ref, () => bottomSheetRef.current!, []);

    useEffect(() => {
      if (defaultValues) {
        setValues(defaultValues);
      } else {
        setValues(placeholderValue);
      }
    }, [defaultValues]);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        onClose={() => {
          setValues(placeholderValue);
        }}
        handleComponent={null}
        enablePanDownToClose
        backdropComponent={(props) => <BottomSheetBackdrop {...props} />}
      >
        <BottomSheetView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Serviço</Text>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => bottomSheetRef.current?.close()}
            >
              <MaterialIcons name="close" size={24} color={colors.gray[600]} />
            </TouchableOpacity>
          </View>
          <Separator color={colors.gray[300]} />
          <View style={styles.content}>
            <Input
              placeholder="Nome do serviço"
              value={values.title}
              onChangeText={(value) => setFormValue(setValues, "title", value)}
            />

            <Input
              placeholder="Descrição"
              containerStyle={{ borderRadius: 16, height: 120 }}
              multiline
              value={values.description}
              onChangeText={(value) =>
                setFormValue(setValues, "description", value)
              }
            />

            <View style={{ gap: 6, flexDirection: "row" }}>
              <CurrencyInput
                placeholder="Valor (R$)"
                value={values.price}
                onChangeValue={(value) =>
                  setFormValue(setValues, "price", value ?? 0)
                }
              />

              <NumberInput
                min={1}
                value={values.qty}
                onChange={(value) => setFormValue(setValues, "qty", value)}
              />
            </View>
          </View>
          <Separator color={colors.gray[300]} />
          <View style={styles.actions}>
            {defaultValues && (
              <Button
                variant="danger"
                icon="delete-outline"
                onPress={() => onDelete(defaultValues.id)}
              />
            )}
            <Button text="Salvar" icon="check" onPress={handleSubmit} />
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);
