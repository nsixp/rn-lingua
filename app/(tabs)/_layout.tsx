import { Tabs, usePathname } from "expo-router";

import { CustomTabBar } from "@/components/custom-tab-bar";

export default function TabLayout() {
  const pathname = usePathname();
  const isAudioLesson = pathname.includes("/lesson/");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "#FFFFFF" },
      }}
      tabBar={(props) =>
        isAudioLesson ? null : <CustomTabBar {...props} />
      }
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="lesson" options={{ title: "Learn" }} />
      <Tabs.Screen name="ai-teacher" options={{ title: "AI Teacher" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
