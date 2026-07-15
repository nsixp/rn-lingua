import { ScrollView, Text } from "react-native";

type TabPlaceholderScreenProps = {
  title: string;
};

export function TabPlaceholderScreen({ title }: TabPlaceholderScreenProps) {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        alignItems: "center",
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
      }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text className="h2 text-text-primary">{title}</Text>
    </ScrollView>
  );
}
