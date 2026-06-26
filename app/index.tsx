import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-6 bg-background px-screen">
      <Text className="h1 color-brand-purple">Lingua</Text>
      <Link href="/onboarding" asChild>
        <TouchableOpacity
          activeOpacity={0.85}
          className="button-primary w-64"
        >
          <Text className="font-poppins-semibold text-[18px] leading-7 text-white">
            Open onboarding
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
