import { Link, Stack } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { colors } from "@/theme";

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="screen flex-1 px-screen pb-screen pt-5">
        <View className="flex-row items-center justify-center gap-2">
          <View className="relative h-10 w-10 overflow-hidden">
            <Image
              className="absolute -left-3 -top-2 h-16 w-16"
              resizeMode="contain"
              source={images.mascotLogo}
            />
          </View>
          <Text className="h2 text-text-primary">Lingua</Text>
        </View>

        <View className="mt-12">
          <Text className="h1 text-text-primary">Your AI Language</Text>
          <Text className="h1 text-brand-deep-purple">Teacher</Text>
          <Text className="h4 mt-4 text-text-secondary">
            Real conversations, personalized{"\n"}lessons, anytime, anywhere.
          </Text>
        </View>

        <View className="flex-1 justify-center">
          <View className="relative h-96 w-full">
            <View
              className="absolute top-6 origin-top-left"
              style={styles.helloBubble}
            >
              <View className="rounded-control bg-blue-50 px-card py-3">
                <Text className="h3 text-text-primary">Hello!</Text>
              </View>
              <View
                className="-mt-4 ml-12 h-6 w-7 rounded bg-blue-50"
                style={styles.bubbleTail}
              />
            </View>

            <View
              className="absolute right-32 origin-top-right"
              style={styles.holaBubble}
            >
              <View className="rounded-control bg-purple-50 px-card py-3">
                <Text className="h3 italic text-brand-deep-purple">¡Hola!</Text>
              </View>
              <View
                className="-mt-4 ml-7 h-6 w-7 rounded bg-purple-50"
                style={styles.bubbleTail}
              />
            </View>

            <View
              className="absolute right-0 top-18 origin-top-right"
              style={styles.niHaoBubble}
            >
              <View className="rounded-control bg-red-50 px-card py-3">
                <Text className="h3 text-error">你好!</Text>
              </View>
              <View
                className="-mt-4 ml-6 h-6 w-7 rounded bg-red-50"
                style={styles.bubbleTail}
              />
            </View>

            <View className="absolute inset-x-0 bottom-0 items-center">
              <Image
                className="h-94 w-94"
                resizeMode="contain"
                source={images.mascotWelcome}
              />
            </View>
          </View>
        </View>

        <Link href="/sign-up" asChild>
          <TouchableOpacity
            activeOpacity={0.85}
            className="button-primary relative h-16 w-full flex-row"
          >
            <Text className="h3 text-white">Get Started</Text>
            <Text className="absolute right-7 text-4xl leading-10 text-white">
              ›
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bubbleTail: {
    transform: [{ rotate: "32deg" }],
  },
  safeArea: {
    backgroundColor: colors.neutral.background,
    flex: 1,
  },
  helloBubble: {
    transform: [{ rotate: "-8deg" }],
  },
  holaBubble: {
    transform: [{ rotate: "6deg" }],
  },
  niHaoBubble: {
    transform: [{ rotate: "16deg" }],
  },
});
