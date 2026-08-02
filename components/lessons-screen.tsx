import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LessonCard, type LessonStatus } from "@/components/lesson-card";
import { getLessonCover } from "@/constants/images";
import { defaultLanguageId, languages } from "@/data/languages";
import { lessons } from "@/data/lessons";
import { units } from "@/data/units";
import { posthog } from "@/lib/posthog";
import { useLanguageStore } from "@/store/language-store";
import { useLearningProgressStore } from "@/store/learning-progress-store";
import { colors } from "@/theme";

type Section = "lessons" | "practice";

const sceneColors = [
  "#EAF8FF",
  "#FFF2E6",
  "#E8F6E5",
  "#EEF1FF",
  "#FFF4D8",
  "#F3EEFF",
] as const;

export function LessonsScreen() {
  const [section, setSection] = useState<Section>("lessons");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const selectedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId,
  );
  const completedLessonIds = useLearningProgressStore(
    (state) => state.completedLessonIds,
  );
  const currentLessonId = useLearningProgressStore(
    (state) => state.currentLessonId,
  );
  const setCurrentLesson = useLearningProgressStore(
    (state) => state.setCurrentLesson,
  );

  const language =
    languages.find(
      (item) => item.id === (selectedLanguageId ?? defaultLanguageId),
    ) ?? languages[0];
  const unit =
    units.find((item) => item.languageId === language.id) ?? units[0];
  const unitLessons = useMemo(
    () =>
      unit.lessonIds
        .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId))
        .filter((lesson): lesson is (typeof lessons)[number] => Boolean(lesson)),
    [unit.lessonIds],
  );
  const savedCurrentLesson = unitLessons.find(
    (lesson) => lesson.id === currentLessonId,
  );
  const currentLesson = savedCurrentLesson ?? unitLessons[2] ?? unitLessons[0];
  const hasSavedProgress = unitLessons.some((lesson) =>
    completedLessonIds.includes(lesson.id),
  );
  const mockCompletedLessonIds = hasSavedProgress
    ? completedLessonIds
    : unitLessons.slice(0, 2).map((lesson) => lesson.id);

  if (!currentLesson) {
    return null;
  }

  const openLesson = (lessonId: string) => {
    const lesson = unitLessons.find((item) => item.id === lessonId);

    if (!lesson) {
      return;
    }

    setCurrentLesson(lesson.id);
    posthog.capture("lesson_opened", {
      language_code: language.id,
      lesson_id: lesson.id,
      unit_order: unit.order,
    });
    router.push({
      pathname: "/lesson/[lessonId]",
      params: { lessonId },
    });
  };

  const getStatus = (lessonId: string): LessonStatus => {
    if (mockCompletedLessonIds.includes(lessonId)) {
      return "completed";
    }

    if (lessonId === currentLesson.id) {
      return "current";
    }

    return "upcoming";
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
      >
        <View className="h-[88px] flex-row items-center bg-white px-[18px]">
          <TouchableOpacity
            accessibilityLabel="Go back"
            activeOpacity={0.65}
            onPress={goBack}
            style={styles.headerButton}
          >
            <MaterialCommunityIcons
              color={colors.text.primary}
              name="chevron-left"
              size={35}
            />
          </TouchableOpacity>

          <View className="flex-1 px-2">
            <Text
              className="font-poppins-semibold text-[20px] leading-7 text-text-primary"
              numberOfLines={1}
            >
              {currentLesson.title}
            </Text>
            <Text className="mt-1 font-poppins-regular text-[14px] leading-5 text-[#66718F]">
              Unit {unit.order} • {currentLesson.order} / {unitLessons.length} lessons
            </Text>
          </View>

          <TouchableOpacity
            accessibilityLabel={
              isBookmarked ? "Remove lesson bookmark" : "Bookmark lesson"
            }
            activeOpacity={0.7}
            onPress={() => setIsBookmarked((value) => !value)}
            style={styles.headerButton}
          >
            <View className="relative">
              <MaterialCommunityIcons
                color="#566486"
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={33}
              />
              <View className="absolute left-[7px] top-[2px] h-1.5 w-3 rounded-sm bg-[#FF9D17]" />
            </View>
          </TouchableOpacity>
        </View>

        <View
          className="relative h-[214px] items-center justify-center overflow-hidden"
          style={{
            backgroundColor:
              sceneColors[(currentLesson.order - 1) % sceneColors.length],
          }}
        >
          <View className="absolute -left-16 top-10 h-36 w-52 rounded-full bg-white/55" />
          <View className="absolute -right-20 top-4 h-32 w-56 rounded-full bg-white/60" />
          <View className="absolute -bottom-28 -left-20 h-52 w-80 rotate-6 rounded-full bg-[#A9D584]" />
          <View className="absolute -bottom-32 right-[-90px] h-56 w-80 -rotate-6 rounded-full bg-[#7DBE58]" />
          <View className="absolute bottom-0 h-12 w-full bg-[#EBD7B6]/65" />
          <Image
            accessibilityLabel={`${currentLesson.title} lesson illustration`}
            resizeMode="contain"
            source={getLessonCover(currentLesson.order, currentLesson.id)}
            style={styles.heroImage}
          />
        </View>

        <View style={styles.segmentedControl}>
          <TouchableOpacity
            accessibilityRole="tab"
            accessibilityState={{ selected: section === "lessons" }}
            activeOpacity={0.75}
            onPress={() => setSection("lessons")}
            style={styles.segment}
          >
            <Text
              className={`font-poppins-medium text-[16px] leading-6 ${
                section === "lessons"
                  ? "text-[#5439F5]"
                  : "text-[#65708E]"
              }`}
            >
              Lessons
            </Text>
            {section === "lessons" ? <View style={styles.activeLine} /> : null}
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="tab"
            accessibilityState={{ selected: section === "practice" }}
            activeOpacity={0.75}
            onPress={() => setSection("practice")}
            style={styles.segment}
          >
            <Text
              className={`font-poppins-medium text-[16px] leading-6 ${
                section === "practice"
                  ? "text-[#5439F5]"
                  : "text-[#65708E]"
              }`}
            >
              Practice
            </Text>
            {section === "practice" ? <View style={styles.activeLine} /> : null}
          </TouchableOpacity>
        </View>

        {section === "lessons" ? (
          <View className="gap-2 px-[18px] pb-5 pt-[18px]">
            {unitLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onPress={() => openLesson(lesson.id)}
                status={getStatus(lesson.id)}
              />
            ))}
          </View>
        ) : (
          <View className="mx-[18px] mt-[18px] items-center rounded-[18px] border border-[#EEF0F5] bg-[#FCFBFF] px-6 py-10">
            <MaterialCommunityIcons
              color={colors.brand.purple}
              name="headphones"
              size={42}
            />
            <Text className="mt-3 font-poppins-semibold text-[18px] text-text-primary">
              Practice {currentLesson.title}
            </Text>
            <Text className="mt-1 text-center font-poppins-regular text-[14px] leading-6 text-text-secondary">
              Open the lesson to review its vocabulary and speaking activities.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  activeLine: {
    backgroundColor: "#5439F5",
    borderRadius: 999,
    bottom: 0,
    height: 3,
    left: 8,
    position: "absolute",
    right: 8,
  },
  headerButton: {
    alignItems: "center",
    height: 48,
    justifyContent: "center",
    width: 44,
  },
  heroImage: {
    bottom: -8,
    height: 208,
    position: "absolute",
    width: 230,
  },
  safeArea: {
    backgroundColor: colors.neutral.background,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  segment: {
    alignItems: "center",
    flex: 1,
    height: 58,
    justifyContent: "center",
    position: "relative",
  },
  segmentedControl: {
    alignItems: "center",
    backgroundColor: colors.neutral.background,
    borderCurve: "continuous",
    borderRadius: 18,
    boxShadow: "0 8px 28px rgba(36, 43, 72, 0.10)",
    flexDirection: "row",
    height: 58,
    marginHorizontal: 14,
    marginTop: -16,
    position: "relative",
    zIndex: 2,
  },
});
