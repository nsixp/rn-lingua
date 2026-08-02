import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontFamilies } from "@/theme";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type TabConfig = {
  accessibilityLabel: string;
  activeIcon: IconName;
  icon: IconName;
};

const tabs: Record<string, TabConfig> = {
  index: {
    accessibilityLabel: "Home",
    activeIcon: "home-variant",
    icon: "home-variant-outline",
  },
  lesson: {
    accessibilityLabel: "Learn",
    activeIcon: "book-open-page-variant",
    icon: "book-open-page-variant-outline",
  },
  "ai-teacher": {
    accessibilityLabel: "AI Teacher",
    activeIcon: "face-agent",
    icon: "face-agent",
  },
  chat: {
    accessibilityLabel: "Chat",
    activeIcon: "chat",
    icon: "chat-outline",
  },
  profile: {
    accessibilityLabel: "Profile",
    activeIcon: "account-circle",
    icon: "account-circle-outline",
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
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom - 12, 8) },
      ]}
    >
      <View style={styles.items}>
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
              style={styles.tab}
              testID={options.tabBarButtonTestID}
            >
              <View style={styles.iconSlot}>
                <Animated.View
                  entering={FadeIn.duration(180)}
                  exiting={FadeOut.duration(120)}
                  key={`${route.key}-${isFocused ? "active" : "inactive"}`}
                  style={styles.icon}
                >
                  <MaterialCommunityIcons
                    color={isFocused ? colors.brand.purple : "#697593"}
                    name={isFocused ? config.activeIcon : config.icon}
                    size={27}
                  />
                </Animated.View>
              </View>
              <Text
                numberOfLines={1}
                style={[
                  styles.label,
                  isFocused ? styles.activeLabel : styles.inactiveLabel,
                ]}
              >
                {options.title ?? config.accessibilityLabel}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.background,
    borderColor: "#F1F2F7",
    borderTopWidth: 1,
    boxShadow: "0 -6px 24px rgba(13, 19, 43, 0.07)",
  },
  iconSlot: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    width: 48,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  items: {
    alignItems: "center",
    flexDirection: "row",
    height: 70,
    paddingHorizontal: 5,
    position: "relative",
  },
  label: {
    fontFamily: fontFamilies.medium,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 1,
  },
  activeLabel: {
    color: colors.brand.purple,
  },
  inactiveLabel: {
    color: "#697593",
  },
  tab: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
