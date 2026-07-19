import "../global.css";

import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { PostHogProvider } from "posthog-react-native";
import { View } from "react-native";

import { posthog } from "@/lib/posthog";
import { useLanguageStore } from "@/store/language-store";
import { useLearningProgressStore } from "@/store/learning-progress-store";
import { colors, fontAssets, fontFamilies } from "@/theme";

void SplashScreen.preventAutoHideAsync().catch(() => false);

function getPublishableKey() {
  const key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!key) {
    throw new Error(
      "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Run `clerk env pull` and restart Expo.",
    );
  }

  return key;
}

const publishableKey = getPublishableKey();

function RootNavigator() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const pathname = usePathname();
  const previousUserIdRef = useRef<string | null | undefined>(undefined);
  const previousPathname = useRef<string | undefined>(undefined);
  const hasLanguageHydrated = useLanguageStore((state) => state.hasHydrated);
  const hasLearningProgressHydrated = useLearningProgressStore(
    (state) => state.hasHydrated,
  );
  const selectedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId,
  );

  const hasSelectedLanguage = selectedLanguageId !== null;
  const isAppReady =
    isLoaded &&
    (!isSignedIn ||
      (hasLanguageHydrated && hasLearningProgressHydrated));

  useEffect(() => {
    const previousUserId = previousUserIdRef.current;

    if (previousUserId === userId) {
      return;
    }

    if (userId) {
      posthog.identify(userId);
    } else if (previousUserId) {
      posthog.reset();
    }

    previousUserIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    if (isAppReady && previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
      });
      previousPathname.current = pathname;
    }
  }, [isAppReady, pathname]);

  if (!isAppReady) {
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
      >
        <Stack.Protected
          guard={Boolean(isSignedIn && hasSelectedLanguage)}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={Boolean(isSignedIn)}>
          <Stack.Screen
            name="language-selection"
            options={{ headerShown: false }}
          />
        </Stack.Protected>

        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
      <StatusBar style="dark" />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      try {
        SplashScreen.hide();
      } catch {
        // The native splash may already be gone after a development reload.
      }
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <PostHogProvider
        autocapture={{ captureScreens: false, captureTouches: true }}
        client={posthog}
      >
        <RootNavigator />
      </PostHogProvider>
    </ClerkProvider>
  );
}
