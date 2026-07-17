import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type TabConfig = {
  accessibilityLabel: string;
  activeIcon: IconName;
  icon: IconName;
  label: string;
};

const tabs: Record<string, TabConfig> = {
  index: {
    accessibilityLabel: "Home",
    activeIcon: "home",
    icon: "home-outline",
    label: "Home",
  },
  learn: {
    accessibilityLabel: "Learn",
    activeIcon: "book-open-page-variant",
    icon: "book-open-page-variant-outline",
    label: "Learn",
  },
  "ai-teacher": {
    accessibilityLabel: "AI Teacher",
    activeIcon: "robot-happy",
    icon: "robot-happy-outline",
    label: "AI Teacher",
  },
  chat: {
    accessibilityLabel: "Chat",
    activeIcon: "message-processing",
    icon: "message-processing-outline",
    label: "Chat",
  },
  profile: {
    accessibilityLabel: "Profile",
    activeIcon: "account",
    icon: "account-outline",
    label: "Profile",
  },
};

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-t border-border bg-background"
      style={{
        boxShadow: "0 -8px 28px rgba(13, 19, 43, 0.06)",
        paddingBottom: Math.max(insets.bottom, 8),
      }}
    >
      <View className="h-16 flex-row px-1 pt-2">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const config = tabs[route.name];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              canPreventDefault: true,
              target: route.key,
              type: "tabPress",
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              target: route.key,
              type: "tabLongPress",
            });
          };

          return (
            <Pressable
              accessibilityLabel={
                options.tabBarAccessibilityLabel ?? config.accessibilityLabel
              }
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              key={route.key}
              onLongPress={onLongPress}
              onPress={onPress}
              className="flex-1 items-center justify-center active:opacity-60"
              testID={options.tabBarButtonTestID}
            >
              <MaterialCommunityIcons
                color={
                  isFocused ? colors.brand.purple : colors.text.secondary
                }
                name={isFocused ? config.activeIcon : config.icon}
                size={27}
              />
              <Text
                className={`caption mt-0.5 ${
                  isFocused
                    ? "font-poppins-semibold text-brand-purple"
                    : "font-poppins-medium text-text-secondary"
                }`}
                numberOfLines={1}
              >
                {config.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
