import type { ImageSourcePropType } from "react-native";

import androidIconBackground from "@/assets/images/android-icon-background.png";
import androidIconForeground from "@/assets/images/android-icon-foreground.png";
import androidIconMonochrome from "@/assets/images/android-icon-monochrome.png";
import audioLessonClassroom from "@/assets/images/audio-lesson-classroom.png";
import audioTeacherAvatar from "@/assets/images/audio-teacher-avatar.png";
import audioTeacherFox from "@/assets/images/audio-teacher-fox.png";
import earth from "@/assets/images/earth.png";
import favicon from "@/assets/images/favicon.png";
import icon from "@/assets/images/icon.png";
import mascotAuth from "@/assets/images/mascot-auth.png";
import mascotLogo from "@/assets/images/mascot-logo.png";
import mascotWelcome from "@/assets/images/mascot-welcome.png";
import palace from "@/assets/images/palace.png";
import partialReactLogo from "@/assets/images/partial-react-logo.png";
import reactLogo from "@/assets/images/react-logo.png";
import splashIcon from "@/assets/images/splash-icon.png";
import streakFire from "@/assets/images/streak-fire.png";
import treasure from "@/assets/images/treasure.png";

const lessonCovers = {
  1: mascotWelcome,
  2: mascotAuth,
  3: palace,
  4: earth,
  5: treasure,
  6: mascotLogo,
} as const;

export function getLessonCover(
  lessonOrder: number,
  lessonId: string,
): ImageSourcePropType {
  const localCover = lessonCovers[lessonOrder as keyof typeof lessonCovers];

  return (
    localCover ?? {
      uri: `https://picsum.photos/seed/${encodeURIComponent(lessonId)}/1200/720`,
    }
  );
}

export const images = {
  aiTeacher: audioTeacherAvatar,
  audioLessonClassroom,
  audioTeacherAvatar,
  audioTeacherFox,
  androidIconBackground,
  androidIconForeground,
  androidIconMonochrome,
  earth,
  favicon,
  icon,
  lessonCovers,
  mascotAuth,
  mascotLogo,
  mascotWelcome,
  palace,
  partialReactLogo,
  reactLogo,
  splashIcon,
  streakFire,
  treasure,
} as const;
