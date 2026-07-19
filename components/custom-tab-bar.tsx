import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import type { ComponentProps } from "react";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type TabConfig = {
  accessibilityLabel: string;
  activeIcon: IconName;
  icon: IconName;
};

const HORIZONTAL_PADDING = 8;
const INDICATOR_HEIGHT = 56;
const INDICATOR_WIDTH = 56;

const tabs: Record<string, TabConfig> = {
  index: {
    accessibilityLabel: "Home",
    activeIcon: "home-variant",
    icon: "home-variant-outline",
  },
  learn: {
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
  const activeIndex = useSharedValue(state.index);
  const tabBarWidth = useSharedValue(0);

  useEffect(() => {
    activeIndex.value = withSpring(state.index, {
      damping: 20,
      mass: 0.7,
      stiffness: 180,
    });
  }, [activeIndex, state.index]);

  const indicatorStyle = useAnimatedStyle(() => {
    const itemWidth =
      (tabBarWidth.value - HORIZONTAL_PADDING * 2) / state.routes.length;

    return {
      opacity: tabBarWidth.value > 0 ? 1 : 0,
      transform: [
        {
          translateX:
            HORIZONTAL_PADDING +
            itemWidth * activeIndex.value +
            (itemWidth - INDICATOR_WIDTH) / 2,
        },
      ],
    };
  });

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom - 12, 8) },
      ]}
    >
      <View
        onLayout={(event) => {
          tabBarWidth.value = event.nativeEvent.layout.width;
        }}
        style={styles.items}
      >
        <Animated.View style={[styles.indicator, indicatorStyle]} />

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
                    color={isFocused ? colors.neutral.background : "#697593"}
                    name={isFocused ? config.activeIcon : config.icon}
                    size={28}
                  />
                </Animated.View>
              </View>
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
    height: INDICATOR_HEIGHT,
    justifyContent: "center",
    width: INDICATOR_WIDTH,
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  indicator: {
    backgroundColor: colors.brand.purple,
    borderRadius: 20,
    height: INDICATOR_HEIGHT,
    left: 0,
    position: "absolute",
    top: 7,
    width: INDICATOR_WIDTH,
    zIndex: 1,
  },
  items: {
    flexDirection: "row",
    height: 68,
    paddingHorizontal: HORIZONTAL_PADDING,
    position: "relative",
  },
  tab: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    zIndex: 2,
  },
});
