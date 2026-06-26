import type { FontSource } from "expo-font";

import poppinsBold from "@/assets/fonts/Poppins-Bold.ttf";
import poppinsMedium from "@/assets/fonts/Poppins-Medium.ttf";
import poppinsRegular from "@/assets/fonts/Poppins-Regular.ttf";
import poppinsSemiBold from "@/assets/fonts/Poppins-SemiBold.ttf";

export const fontFamilies = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semiBold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export const fontAssets = {
  [fontFamilies.regular]: poppinsRegular,
  [fontFamilies.medium]: poppinsMedium,
  [fontFamilies.semiBold]: poppinsSemiBold,
  [fontFamilies.bold]: poppinsBold,
} satisfies Record<string, FontSource>;
