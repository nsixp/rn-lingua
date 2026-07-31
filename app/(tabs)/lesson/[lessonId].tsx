import { Redirect, Stack, useLocalSearchParams } from "expo-router";

import { AudioLessonScreen } from "@/components/audio-lesson-screen";
import { lessons } from "@/data/lessons";

export default function AudioLessonRoute() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const lesson = lessons.find((item) => item.id === lessonId);

  if (!lesson) {
    return <Redirect href="/(tabs)/lesson" />;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AudioLessonScreen lesson={lesson} />
    </>
  );
}
