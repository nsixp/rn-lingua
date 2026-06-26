import "../global.css";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";

import { colors, fontAssets, fontFamilies } from "@/theme";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View className="flex-1 bg-background">
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.neutral.background },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.neutral.background },
          headerTitleStyle: {
            color: colors.text.primary,
            fontFamily: fontFamilies.semiBold,
          },
        }}
      />
      <StatusBar style="dark" />
    </View>
  );
}
