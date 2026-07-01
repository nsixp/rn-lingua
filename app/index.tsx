import { useClerk } from "@clerk/expo";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { signOut } = useClerk();

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-background px-screen">
      <Text className="h1 color-brand-purple">Lingua</Text>
      <TouchableOpacity
        activeOpacity={0.85}
        className="button-primary w-64"
        onPress={() => void signOut()}
      >
        <Text className="font-poppins-semibold text-[18px] leading-7 text-white">
          Sign out
        </Text>
      </TouchableOpacity>
    </View>
  );
}
