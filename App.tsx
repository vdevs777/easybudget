import "react-native-get-random-values";
import "react-native-reanimated";
import React from "react";

import {
  useFonts,
  Lato_400Regular,
  Lato_700Bold,
} from "@expo-google-fonts/lato";
import { Loading } from "@/components/Loading";

import { Routes } from "@/routes";

import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const [isFontLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });

  if (!isFontLoaded) {
    return <Loading />;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Routes />
    </GestureHandlerRootView>
  );
}
