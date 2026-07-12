import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { defaultLanguageId, languages } from "@/data/languages";
import { colors, fontFamilies } from "@/theme";
import type { LanguageCode } from "@/types/learning";

const learnerCounts: Record<LanguageCode, string> = {
  es: "28.4M learners",
  fr: "19.4M learners",
  ja: "12.7M learners",
  ko: "9.3M learners",
  zh: "7.4M learners",
};

export default function LanguageSelectionScreen() {
  const [query, setQuery] = useState("");
  const [selectedLanguageId, setSelectedLanguageId] =
    useState<LanguageCode>(defaultLanguageId);

  const filteredLanguages = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    if (!normalizedQuery) {
      return languages;
    }

    return languages.filter(
      (language) =>
        language.name.toLocaleLowerCase().includes(normalizedQuery) ||
        language.nativeName.toLocaleLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="screen flex-1 pt-2">
        <View className="px-screen">
          <View className="h-14 flex-row items-center justify-center">
            <TouchableOpacity
              accessibilityLabel="Go back"
              activeOpacity={0.65}
              className="absolute left-0 h-12 w-12 items-start justify-center"
              onPress={() => router.back()}
            >
              <Ionicons
                color={colors.text.primary}
                name="chevron-back"
                size={30}
              />
            </TouchableOpacity>
            <Text className="h3 text-text-primary">Choose a language</Text>
          </View>

          <View className="search-field mt-4">
            <Ionicons color="#64708F" name="search-outline" size={24} />
            <TextInput
              accessibilityLabel="Search language"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setQuery}
              placeholder="Search language"
              placeholderTextColor="#7A849F"
              style={styles.searchInput}
              value={query}
            />
          </View>
        </View>

        <View className="relative flex-1 overflow-hidden">
          <ScrollView
            contentInsetAdjustmentBehavior="never"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.languageList}
          >
            <View className="gap-2.5 px-screen py-8">
              {filteredLanguages.map((language) => {
                const isSelected = language.id === selectedLanguageId;

                return (
                  <TouchableOpacity
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                    activeOpacity={0.78}
                    className={`selection-card ${
                      isSelected ? "selection-card-active" : ""
                    }`}
                    key={language.id}
                    onPress={() => setSelectedLanguageId(language.id)}
                  >
                    <Image
                      className="h-12 w-12 rounded-full border border-border"
                      resizeMode="cover"
                      source={{ uri: language.flagEmoji }}
                    />

                    <View className="flex-1 pl-4">
                      <Text className="h4 text-text-primary">
                        {language.name}
                      </Text>
                      <Text className="body-md mt-0.5 text-text-secondary">
                        {learnerCounts[language.id]}
                      </Text>
                    </View>

                    {isSelected && (
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-purple">
                        <Ionicons color="white" name="checkmark" size={25} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}

              {filteredLanguages.length === 0 ? (
                <View className="items-center py-12">
                  <Text className="h4 text-text-secondary">
                    No languages found
                  </Text>
                </View>
              ) : null}
            </View>
          </ScrollView>

          <View pointerEvents="none" style={styles.topListFade} />
          <View pointerEvents="none" style={styles.bottomListFade} />
        </View>

        <View className="h-64 w-full overflow-hidden">
          <Image
            className="h-96 w-full"
            resizeMode="contain"
            source={images.earth}
          />
        </View>

        <View className="px-screen pb-4">
          <TouchableOpacity
            activeOpacity={0.85}
            className="button-primary mt-1 h-14 w-full"
            onPress={() => router.replace("/")}
          >
            <Text className="h4 text-white">Confirm language</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.neutral.background,
    flex: 1,
  },
  languageList: {
    flex: 1,
  },
  topListFade: {
    experimental_backgroundImage:
      "linear-gradient(to bottom, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
    height: 40,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },
  bottomListFade: {
    bottom: 0,
    experimental_backgroundImage:
      "linear-gradient(to top, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)",
    height: 48,
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 1,
  },
  searchInput: {
    color: colors.text.primary,
    flex: 1,
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 22,
    paddingVertical: 0,
  },
});
