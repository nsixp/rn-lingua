import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import type { ComponentProps } from "react";
import { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { useLearningProgressStore } from "@/store/learning-progress-store";
import { colors } from "@/theme";
import type { Lesson } from "@/types/learning";

type AudioLessonScreenProps = {
  lesson: Lesson;
};

const feedback = [
  { color: "#18C934", label: "Speaking", value: "Excellent" },
  { color: "#1677FF", label: "Pronunciation", value: "Great" },
  { color: "#563BFF", label: "Grammar", value: "Good" },
] as const;

export function AudioLessonScreen({ lesson }: AudioLessonScreenProps) {
  const { height } = useWindowDimensions();
  const isCompact = height < 830;
  const [isMicOn, setIsMicOn] = useState(true);
  const [areSubtitlesVisible, setAreSubtitlesVisible] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isContextVisible, setIsContextVisible] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const completeLesson = useLearningProgressStore(
    (state) => state.completeLesson,
  );

  const language = languages.find((item) => item.id === lesson.languageId);
  const phrase = lesson.phrases[phraseIndex] ?? {
    id: "lesson-intro",
    text: language?.greeting ?? "Hello!",
    translation: lesson.subtitle,
  };
  const primaryGoal = lesson.goals[0];
  const teacherContext = useMemo(
    () => lesson.aiTeacherPrompt.replace(/^You are Lingua's /, ""),
    [lesson.aiTeacherPrompt],
  );
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)/lesson");
  };

  const showNextPhrase = () => {
    if (lesson.phrases.length > 1) {
      setPhraseIndex((current) => (current + 1) % lesson.phrases.length);
    }
    setAreSubtitlesVisible(true);
  };

  const endLesson = () => {
    completeLesson(lesson.id);
    router.replace("/(tabs)/lesson");
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View
        className={`flex-row items-center bg-white px-3.5 ${
          isCompact ? "h-18" : "h-21"
        }`}
      >
        <TouchableOpacity
          accessibilityLabel="Back to lessons"
          activeOpacity={0.65}
          className="h-12 w-11 items-center justify-center"
          onPress={goBack}
        >
          <MaterialCommunityIcons
            color={colors.text.primary}
            name="chevron-left"
            size={32}
          />
        </TouchableOpacity>

        <View className="flex-1 pl-1">
          <Text className="h3 text-text-primary" numberOfLines={1}>
            AI Teacher
          </Text>
          <View className="flex-row items-center">
            <View className="h-2 w-2 rounded-full bg-success" />
            <Text
              className="body-sm ml-2 flex-1 text-text-secondary"
              numberOfLines={1}
            >
              Online · {language?.name ?? lesson.languageId}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-2">
          <HeaderButton
            accessibilityLabel={
              isSpeakerOn ? "Mute teacher audio" : "Unmute teacher audio"
            }
            icon={isSpeakerOn ? "volume-high" : "volume-off"}
            onPress={() => setIsSpeakerOn((value) => !value)}
          />
          <View
            className="h-11 w-11 items-center justify-center rounded-full border border-border bg-white"
            style={styles.continuousCurve}
          >
            <Text className="h4 text-text-primary">
              {lesson.estimatedMinutes}
            </Text>
          </View>
          <HeaderButton
            accessibilityLabel="Show AI teacher context"
            icon="information-outline"
            onPress={() => setIsContextVisible((value) => !value)}
          />
        </View>
      </View>

      <View
        className="relative m-2 flex-1 overflow-hidden rounded-t-3xl rounded-b-[52px]"
        style={styles.continuousCurve}
      >
        <View className="absolute inset-0">
          <Image
            accessibilityLabel="Warm classroom"
            contentFit="cover"
            contentPosition="center"
            source={images.audioLessonClassroom}
            style={StyleSheet.absoluteFill}
          />
        </View>
        <View
          className="absolute bottom-0 left-0 right-0 top-1/3"
          style={styles.sceneGradient}
        />

        <View
          className="absolute left-4 top-4 rounded-2xl bg-text-primary/65 px-4 py-3"
          style={styles.continuousCurve}
        >
          <Text
            className="font-poppins-semibold text-sm leading-5 text-white"
            numberOfLines={1}
          >
            {language?.name} · {lesson.title}
          </Text>
          {primaryGoal ? (
            <Text className="caption mt-1 text-white/90" numberOfLines={1}>
              Goal: {primaryGoal.title}
            </Text>
          ) : null}
        </View>

        <View
          className={
            isCompact
              ? "absolute inset-x-0 top-11 items-center"
              : "absolute inset-x-0 top-14 items-center"
          }
        >
          <View className={isCompact ? "h-66 w-66" : "h-128 w-lg"}>
            <Image
              accessibilityLabel="Friendly fox AI teacher"
              contentFit="contain"
              source={images.mascotWelcome}
              style={StyleSheet.absoluteFill}
            />
          </View>
        </View>

        {isContextVisible ? (
          <View
            className="absolute inset-x-4 top-26 rounded-control bg-white/95 px-4 py-3"
            style={styles.continuousCurve}
          >
            <Text className="font-poppins-semibold text-xs leading-4 text-text-primary">
              Teacher context
            </Text>
            <Text
              className="caption mt-1 text-text-secondary"
              numberOfLines={4}
            >
              {teacherContext}
            </Text>
          </View>
        ) : null}

        {areSubtitlesVisible ? (
          <View
            className={
              isCompact
                ? "absolute inset-x-10 top-64 min-h-20 flex-row items-center rounded-control bg-white px-4 py-2.5"
                : "absolute left-15 right-14 top-116 min-h-21 flex-row items-center rounded-control bg-white px-4 py-3.5"
            }
            style={styles.continuousCurve}
          >
            <View className="flex-1 pr-3">
              <Text className="h4 text-text-primary" numberOfLines={1}>
                {phrase.text}
              </Text>
              <Text
                className="body-md mt-1 text-text-primary"
                numberOfLines={1}
              >
                {phrase.translation} 👏
              </Text>
            </View>
            <TouchableOpacity
              accessibilityLabel="Hear the next lesson phrase"
              activeOpacity={0.65}
              className="h-11 w-10 items-center justify-center"
              onPress={showNextPhrase}
            >
              <MaterialCommunityIcons
                color={colors.brand.purple}
                name="volume-high"
                size={28}
              />
            </TouchableOpacity>
            <View style={styles.bubbleTail} />
          </View>
        ) : null}

        <View
          className={isCompact ? "mt-auto px-3.5 pb-2.5" : "mt-auto px-5 pb-5"}
        >
          <View className="flex-row items-start justify-between">
            <LessonControl
              active={false}
              accessibilityLabel="Visual teacher preview only"
              compact={isCompact}
              icon="video-outline"
              label="Preview"
              onPress={() => setIsContextVisible((value) => !value)}
            />
            <LessonControl
              active={isMicOn}
              accessibilityLabel={
                isMicOn ? "Mute lesson microphone" : "Unmute lesson microphone"
              }
              compact={isCompact}
              icon={isMicOn ? "microphone" : "microphone-off"}
              label={isMicOn ? "Mic" : "Muted"}
              onPress={() => setIsMicOn((value) => !value)}
            />
            <LessonControl
              active={areSubtitlesVisible}
              accessibilityLabel="Toggle lesson subtitles"
              compact={isCompact}
              icon="translate"
              label="Subtitles"
              onPress={() => {
                if (areSubtitlesVisible) {
                  setAreSubtitlesVisible(false);
                } else {
                  showNextPhrase();
                }
              }}
            />
            <LessonControl
              active
              accessibilityLabel="End audio lesson"
              compact={isCompact}
              destructive
              icon="phone-hangup"
              label="End Call"
              onPress={endLesson}
            />
          </View>

          <View
            className={
              isCompact
                ? "mt-2.5 min-h-19 flex-row rounded-control bg-white/95 py-2.5"
                : "mt-6 min-h-18 flex-row rounded-control bg-white/95 py-3"
            }
            style={styles.continuousCurve}
          >
            {feedback.map((item, index) => (
              <View
                className={`flex-1 items-center justify-center px-1 ${
                  index > 0 ? "border-l border-border" : ""
                }`}
                key={item.label}
              >
                <Text
                  className="font-poppins-medium text-xs leading-5 text-text-primary"
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
                <Text
                  className="body-sm mt-2 font-poppins-medium"
                  style={{ color: item.color }}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          <View className="mt-3 flex-row items-center justify-center">
            <View
              className={`h-2 w-2 rounded-full ${
                isMicOn ? "bg-success" : "bg-warning"
              }`}
            />
            <Text className="caption ml-2 font-poppins-medium text-white">
              {isMicOn
                ? `Listening · phrase ${phraseIndex + 1} of ${Math.max(
                    lesson.phrases.length,
                    1,
                  )}`
                : "Microphone paused"}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

type HeaderButtonProps = {
  accessibilityLabel: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  onPress: () => void;
};

function HeaderButton({
  accessibilityLabel,
  icon,
  onPress,
}: HeaderButtonProps) {
  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      activeOpacity={0.7}
      className="h-11 w-11 items-center justify-center rounded-full border border-border bg-white"
      onPress={onPress}
      style={styles.continuousCurve}
    >
      <MaterialCommunityIcons
        color={colors.text.primary}
        name={icon}
        size={24}
      />
    </TouchableOpacity>
  );
}

type LessonControlProps = {
  accessibilityLabel: string;
  active: boolean;
  compact: boolean;
  destructive?: boolean;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  onPress: () => void;
};

function LessonControl({
  accessibilityLabel,
  active,
  compact,
  destructive = false,
  icon,
  label,
  onPress,
}: LessonControlProps) {
  const buttonClassName = [
    "items-center justify-center rounded-full",
    compact ? "h-12 w-12" : "h-14 w-14",
    destructive
      ? "border border-error bg-error"
      : active
        ? "border border-border bg-white"
        : "bg-white/95",
  ].join(" ");

  return (
    <View className="w-1/4 items-center">
      <TouchableOpacity
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        activeOpacity={0.75}
        className={buttonClassName}
        onPress={onPress}
        style={[styles.continuousCurve, destructive && styles.endButtonShadow]}
      >
        <MaterialCommunityIcons
          color={destructive ? "#FFFFFF" : colors.text.primary}
          name={icon}
          size={compact ? 24 : 28}
        />
      </TouchableOpacity>
      <Text
        className="caption mt-2 font-poppins-medium text-white"
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleTail: {
    borderLeftColor: "transparent",
    borderLeftWidth: 18,
    borderTopColor: colors.neutral.background,
    borderTopWidth: 18,
    bottom: -16,
    height: 0,
    position: "absolute",
    right: 30,
    width: 0,
  },
  continuousCurve: {
    borderCurve: "continuous",
  },
  endButtonShadow: {
    boxShadow: "0 6px 14px rgba(255, 77, 79, 0.28)",
  },
  safeArea: {
    backgroundColor: colors.neutral.background,
    flex: 1,
  },
  sceneGradient: {
    experimental_backgroundImage:
      "linear-gradient(to bottom, transparent 0%, rgba(13, 19, 43, 0) 38%, rgba(13, 19, 43, 0.72) 100%)",
  },
});
