import { useState } from "react";
import { View, TextInput, TouchableOpacity, ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { styles } from "../styles";

type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;

  step?: number;
  min?: number;
  max?: number;
  hasStepper?: boolean;
  error?: boolean;
  containerStyle?: ViewStyle;
};

export function NumberInput({
  value,
  onChange,
  step = 1,
  min,
  max,
  error,
  containerStyle,
  hasStepper = true,
}: NumberInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  function clamp(next: number) {
    if (min !== undefined && next < min) return min;
    if (max !== undefined && next > max) return max;
    return next;
  }

  function handleStepper(delta: number) {
    onChange(clamp(value + delta));
  }

  function handleInput(text: string) {
    // permite só números
    const cleaned = text.replace(/[^0-9]/g, "");

    if (cleaned === "") {
      onChange(min ?? 0);
      return;
    }

    onChange(clamp(Number(cleaned)));
  }

  return (
    <View
      style={[
        styles.container,
        error ? styles.errorContainer : isFocused && styles.containerFocused,
        containerStyle,
      ]}
    >
      {hasStepper && (
        <TouchableOpacity
          onPress={() => handleStepper(-step)}
          style={styles.stepperButton}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="remove"
            size={20}
            color={error ? colors.danger.base : colors.purple.base}
          />
        </TouchableOpacity>
      )}

      <TextInput
        value={String(value)}
        onChangeText={handleInput}
        keyboardType="number-pad"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          styles.input,
          styles.numberText,
          error && { color: colors.danger.base },
        ]}
        textAlign="center"
        selectTextOnFocus
      />
      {hasStepper && (
        <TouchableOpacity
          onPress={() => handleStepper(step)}
          style={styles.stepperButton}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="add"
            size={20}
            color={error ? colors.danger.base : colors.purple.base}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
