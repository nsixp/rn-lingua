import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getLessonCover } from "@/constants/images";
import { useLearningProgressStore } from "@/store/learning-progress-store";
import { colors } from "@/theme";
import type { Lesson } from "@/types/learning";

type LessonOverviewProps = {
  lesson: Lesson;
};

export function LessonOverview({ lesson }: LessonOverviewProps) {
  const completedLessonIds = useLearningProgressStore(
    (state) => state.completedLessonIds,
  );
  const completeLesson = useLearningProgressStore(
    (state) => state.completeLesson,
  );
  const isCompleted = completedLessonIds.includes(lesson.id);

  const finishLesson = () => {
    completeLesson(lesson.id);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
      >
        <View className="h-14 flex-row items-center px-[18px]">
          <TouchableOpacity
            accessibilityLabel="Back to lessons"
            activeOpacity={0.65}
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <MaterialCommunityIcons
              color={colors.text.primary}
              name="chevron-left"
              size={35}
            />
          </TouchableOpacity>
          <Text className="flex-1 text-center font-poppins-semibold text-[18px] text-text-primary">
            Lesson {lesson.order}
          </Text>
          <View className="w-11" />
        </View>

        <View className="mx-[18px] mt-2 h-[250px] items-center justify-center overflow-hidden rounded-[24px] bg-[#EAF7FF]">
          <View className="absolute -bottom-28 h-48 w-[440px] rounded-full bg-[#92CE70]" />
          <Image
            accessibilityLabel={`${lesson.title} illustration`}
            resizeMode="contain"
            source={getLessonCover(lesson.order, lesson.id)}
            style={styles.heroImage}
          />
        </View>

        <View className="px-[22px] pt-6">
          <Text className="font-poppins-semibold text-[26px] leading-9 text-text-primary">
            {lesson.title}
          </Text>
          <Text className="mt-1 font-poppins-regular text-[15px] leading-6 text-text-secondary">
            {lesson.subtitle}
          </Text>

          <View className="mt-5 flex-row gap-2">
            <View className="chip bg-[#F1EEFF]">
              <MaterialCommunityIcons
                color={colors.brand.purple}
                name="clock-outline"
                size={18}
              />
              <Text className="font-poppins-medium text-[13px] text-brand-purple">
                {lesson.estimatedMinutes} min
              </Text>
            </View>
            <View className="chip bg-[#FFF4DE]">
              <MaterialCommunityIcons
                color="#FF8A00"
                name="star-outline"
                size={19}
              />
              <Text className="font-poppins-medium text-[13px] text-[#D66A00]">
                {lesson.xpReward} XP
              </Text>
            </View>
          </View>

          <Text className="mt-7 font-poppins-semibold text-[18px] leading-6 text-text-primary">
            What you&apos;ll learn
          </Text>
          <View className="mt-3 gap-3">
            {lesson.goals.map((goal) => (
              <View className="flex-row" key={goal.id}>
                <View className="mt-0.5 h-7 w-7 items-center justify-center rounded-full bg-[#EDE9FF]">
                  <MaterialCommunityIcons
                    color={colors.brand.purple}
                    name="check"
                    size={18}
                  />
                </View>
                <View className="flex-1 pl-3">
                  <Text className="font-poppins-medium text-[15px] leading-5 text-text-primary">
                    {goal.title}
                  </Text>
                  <Text className="mt-0.5 font-poppins-regular text-[13px] leading-5 text-text-secondary">
                    {goal.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            disabled={isCompleted}
            onPress={finishLesson}
            style={[styles.completeButton, isCompleted && styles.completedButton]}
          >
            <Text className="font-poppins-semibold text-[16px] text-white">
              {isCompleted ? "Lesson completed" : "Complete lesson"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  completeButton: {
    alignItems: "center",
    backgroundColor: colors.brand.purple,
    borderCurve: "continuous",
    borderRadius: 18,
    boxShadow: "0 8px 18px rgba(108, 78, 245, 0.24)",
    height: 56,
    justifyContent: "center",
    marginTop: 30,
  },
  completedButton: {
    backgroundColor: colors.semantic.success,
  },
  content: {
    paddingBottom: 30,
  },
  headerButton: {
    alignItems: "center",
    height: 48,
    justifyContent: "center",
    width: 44,
  },
  heroImage: {
    height: 230,
    width: 250,
  },
  safeArea: {
    backgroundColor: colors.neutral.background,
    flex: 1,
  },
});
