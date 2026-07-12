import { useClerk } from "@clerk/expo";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { signOut } = useClerk();

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-background px-screen">
      <Text className="h1 text-brand-purple">Lingua</Text>
      <Link href="/language-selection" asChild>
        <TouchableOpacity activeOpacity={0.85} className="button-primary w-64">
          <Text className="h4 text-white">Choose a language</Text>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity
        activeOpacity={0.85}
        className="button-secondary w-64 border border-border"
        onPress={() => void signOut()}
      >
        <Text className="h4 text-text-primary">Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
