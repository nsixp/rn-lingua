import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { ComponentProps } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { images } from "@/constants/images";
import { defaultLanguageId, languages } from "@/data/languages";
import { lessons } from "@/data/lessons";
import { units } from "@/data/units";
import { useLanguageStore } from "@/store/language-store";
import { useLearningProgressStore } from "@/store/learning-progress-store";
import { colors, spacing } from "@/theme";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type PlanItemProps = {
  completed?: boolean;
  description: string;
  icon: IconName;
  iconClassName: string;
  title: string;
};

const levelLabels = {
  beginner: "A1",
  elementary: "A2",
  intermediate: "B1",
} as const;

function PlanItem({
  completed = false,
  description,
  icon,
  iconClassName,
  title,
}: PlanItemProps) {
  return (
    <View className="h-16 flex-row items-center">
      <View
        className={`h-10 w-10 items-center justify-center rounded-xl ${iconClassName}`}
      >
        <MaterialCommunityIcons color="#FFFFFF" name={icon} size={24} />
      </View>

      <View className="flex-1 pl-4">
        <Text className="h4 text-text-primary" numberOfLines={1}>
          {title}
        </Text>
        <Text className="body-sm mt-0.5 text-text-secondary" numberOfLines={1}>
          {description}
        </Text>
      </View>

      {completed ? (
        <View className="h-6 w-6 items-center justify-center rounded-full bg-brand-purple">
          <MaterialCommunityIcons color="#FFFFFF" name="check" size={16} />
        </View>
      ) : (
        <View className="h-6 w-6 rounded-full border-2 border-text-secondary" />
      )}
    </View>
  );
}

export function HomeDashboard() {
  const selectedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId,
  );
  const completedLessonIds = useLearningProgressStore(
    (state) => state.completedLessonIds,
  );
  const currentLessonId = useLearningProgressStore(
    (state) => state.currentLessonId,
  );
  const streakDays = useLearningProgressStore((state) => state.streakDays);
  const xp = useLearningProgressStore((state) => state.xp);

  const language =
    languages.find(
      (item) => item.id === (selectedLanguageId ?? defaultLanguageId),
    ) ?? languages[0];
  const languageLessons = lessons
    .filter((lesson) => lesson.languageId === language.id)
    .sort((first, second) => first.order - second.order);
  const currentLesson =
    languageLessons.find((lesson) => lesson.id === currentLessonId) ??
    languageLessons.find(
      (lesson) => !completedLessonIds.includes(lesson.id),
    ) ??
    languageLessons[0] ??
    lessons[0];
  const unit =
    units.find((item) => item.id === currentLesson.unitId) ??
    units.find((item) => item.id === language.starterUnitId) ??
    units[0];

  const dailyGoal = currentLesson.xpReward;
  const dailyProgress = Math.min((xp / dailyGoal) * 100, 100);
  const isCurrentLessonCompleted = completedLessonIds.includes(
    currentLesson.id,
  );
  const conversationPrompt =
    currentLesson.goals[1]?.title ?? currentLesson.goals[0]?.title;

  const openLearnTab = () => router.push("/(tabs)/learn");

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={[styles.content]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="h-12 flex-row items-center">
        <View className="h-10 w-10 overflow-hidden rounded-full border border-border">
          <Image
            accessibilityLabel={`${language.name} flag`}
            className="h-full w-full"
            resizeMode="cover"
            source={{ uri: language.flagEmoji }}
          />
        </View>

        <Text
          className="ml-3 flex-1 h3 leading-6 text-text-primary"
          numberOfLines={1}
        >
          {language.greeting}! 👋
        </Text>

        <View className="ml-2 flex-row items-center gap-1.5">
          <Image
            accessibilityLabel="Learning streak"
            className="h-8 w-8"
            resizeMode="contain"
            source={images.streakFire}
          />
          <Text className="font-poppins-medium text-xl leading-6 text-amber-500">
            {streakDays}
          </Text>
        </View>

        <TouchableOpacity
          accessibilityLabel="Notifications"
          activeOpacity={0.65}
          className="ml-4 h-10 w-8 items-end justify-center"
          onPress={() => {}}
        >
          <MaterialCommunityIcons
            color={colors.text.primary}
            name="bell-outline"
            size={27}
          />
        </TouchableOpacity>
      </View>

      <View className="h-34 flex-row items-center overflow-hidden rounded-control bg-orange-50 pl-5 pr-3">
        <View className="flex-1">
          <Text className="body-lg font-poppins-medium text-text-primary">
            Daily goal
          </Text>
          <View className="mt-2 flex-row items-baseline">
            <Text className="font-poppins-semibold text-2xl leading-8 text-text-primary">
              {xp}
            </Text>
            <Text className="ml-2 font-poppins-medium text-base leading-6 text-text-secondary">
              / {dailyGoal} XP
            </Text>
          </View>
          <View className="mt-4 h-2 overflow-hidden rounded-full bg-orange-100">
            <View
              className="h-full rounded-full bg-orange-500"
              style={{ width: `${dailyProgress}%` }}
            />
          </View>
        </View>

        <View className="ml-5 h-24 w-24">
          <Image
            accessibilityLabel="Daily goal treasure"
            className="h-full w-full"
            resizeMode="contain"
            source={images.treasure}
          />
        </View>
      </View>

      <View
        className="relative h-44 overflow-hidden rounded-control px-5 py-4"
        style={styles.learningCard}
      >
        <View className="absolute -right-8 -top-12 h-44 w-44 rotate-12 rounded-card bg-white/5" />
        <View className="absolute -bottom-20 left-28 h-44 w-44 rotate-45 rounded-card bg-brand-deep-purple/30" />

        <View className="absolute -bottom-5 -right-5 h-44 w-44">
          <Image
            accessibilityLabel={`${language.name} lesson illustration`}
            className="h-full w-full"
            resizeMode="contain"
            source={images.palace}
          />
        </View>

        <View className="z-10 w-3/5">
          <Text className="font-poppins-medium text-base leading-5 text-white/90">
            Continue learning
          </Text>
          <Text className="h2 mt-2 text-white" numberOfLines={1}>
            {language.name}
          </Text>
          <Text className="mt-1 font-poppins-medium text-base leading-5 text-white/90">
            {levelLabels[currentLesson.level]} · Unit {unit.order}
          </Text>

          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.85}
            className="mt-3 h-10 w-28 items-center justify-center rounded-xl bg-white"
            onPress={openLearnTab}
          >
            <Text className="font-poppins-semibold text-sm leading-5 text-brand-purple">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="font-poppins-semibold text-lg leading-6 text-text-primary">
            Today&apos;s plan
          </Text>
          <TouchableOpacity activeOpacity={0.65} onPress={openLearnTab}>
            <Text className="font-poppins-semibold text-sm leading-5 text-brand-purple">
              View all
            </Text>
          </TouchableOpacity>
        </View>

        <PlanItem
          completed={isCurrentLessonCompleted}
          description={currentLesson.title}
          icon="book-open-page-variant"
          iconClassName="bg-brand-purple"
          title="Lesson"
        />
        <PlanItem
          description={conversationPrompt}
          icon="headphones"
          iconClassName="bg-brand-purple"
          title="AI Conversation"
        />
        <PlanItem
          description={`${currentLesson.vocabulary.length} words`}
          icon="message-processing"
          iconClassName="bg-error"
          title="New words"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    paddingBottom: spacing.screen,
    paddingHorizontal: spacing.screen,
  },
  learningCard: {
    experimental_backgroundImage:
      "linear-gradient(120deg, #5938F5 0%, #6845F5 48%, #8058F5 100%)",
  },
});
