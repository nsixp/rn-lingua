import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { getLessonCover } from "@/constants/images";
import { colors } from "@/theme";
import type { Lesson } from "@/types/learning";

export type LessonStatus = "completed" | "current" | "upcoming";

type LessonCardProps = {
  lesson: Lesson;
  onPress: () => void;
  status: LessonStatus;
};

export function LessonCard({ lesson, onPress, status }: LessonCardProps) {
  const isCurrent = status === "current";

  return (
    <TouchableOpacity
      accessibilityHint="Opens this lesson"
      accessibilityLabel={`Lesson ${lesson.order}, ${lesson.title}`}
      accessibilityRole="button"
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, isCurrent && styles.currentCard]}
    >
      <View className="flex-1 justify-center pr-3">
        <Text
          className={
            isCurrent
              ? "font-poppins-medium text-[13px] leading-5 text-brand-purple"
              : "font-poppins-medium text-[13px] leading-5 text-[#7C86A0]"
          }
        >
          Lesson {lesson.order}
        </Text>
        <Text
          className="mt-1 font-poppins-medium text-[16px] leading-6 text-text-primary"
          numberOfLines={1}
        >
          {lesson.title}
        </Text>

        {status === "current" ? (
          <Text className="mt-0.5 font-poppins-medium text-[13px] leading-5 text-brand-purple">
            In progress
          </Text>
        ) : null}

        {status === "upcoming" ? (
          <Text className="mt-0.5 font-poppins-regular text-[13px] leading-5 text-[#7C86A0]">
            0 / {lesson.activities.length} activities
          </Text>
        ) : null}
      </View>

      {status === "completed" ? (
        <View className="h-7 w-7 items-center justify-center rounded-full bg-[#22C919]">
          <MaterialCommunityIcons color="#FFFFFF" name="check" size={20} />
        </View>
      ) : null}

      {status === "current" ? (
        <Image
          accessibilityLabel={`${lesson.title} illustration`}
          resizeMode="contain"
          source={getLessonCover(lesson.order, lesson.id)}
          style={styles.lessonImage}
        />
      ) : null}

      {status === "upcoming" ? (
        <MaterialCommunityIcons
          color="#61708E"
          name="lock-outline"
          size={27}
        />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: colors.neutral.background,
    borderColor: "#EEF0F5",
    borderCurve: "continuous",
    borderRadius: 18,
    borderWidth: 1,
    boxShadow: "0 2px 6px rgba(30, 38, 68, 0.04)",
    flexDirection: "row",
    minHeight: 82,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  currentCard: {
    backgroundColor: "#FCFBFF",
    borderColor: "#8B72FF",
    borderWidth: 2,
    minHeight: 98,
  },
  lessonImage: {
    height: 54,
    width: 54,
  },
});
