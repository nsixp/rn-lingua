import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { VerificationModal } from "@/components/verification-modal";
import { images } from "@/constants/images";
import { colors, spacing, typography } from "@/theme";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [verificationVisible, setVerificationVisible] = useState(false);

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.neutral.background, flex: 1 }}
    >
      <ScrollView
        automaticallyAdjustKeyboardInsets
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: spacing.screen,
          paddingHorizontal: spacing.screen,
        }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode={
          process.env.EXPO_OS === "ios" ? "interactive" : "on-drag"
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          accessibilityLabel="Go back"
          activeOpacity={0.65}
          className="h-11 w-11 items-start justify-center"
          onPress={() => router.back()}
        >
          <Ionicons color={colors.text.primary} name="chevron-back" size={31} />
        </TouchableOpacity>

        <View className="pt-card">
          <Text className="h2 text-text-primary">Create your account</Text>
          <Text className="body-lg text-text-secondary">
            Start your language journey today ✨
          </Text>
        </View>

        <View className="mt-card h-54 items-center justify-center">
          <Image
            contentFit="contain"
            source={images.mascotAuth}
            style={{ height: 216, width: 216 }}
          />
        </View>

        <View className="gap-3">
          <View className="field">
            <Text className="body-sm font-poppins-medium text-text-secondary">
              Email
            </Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="alex@gmail.com"
              placeholderTextColor={colors.text.secondary}
              selectionColor={colors.brand.purple}
              style={{
                ...typography.bodyLarge,
                color: colors.text.primary,
                height: 30,
                padding: 0,
              }}
              value={email}
            />
          </View>

          <View className="field flex-row items-center">
            <View className="flex-1 justify-center">
              <Text className="body-sm font-poppins-medium text-text-secondary">
                Password
              </Text>
              <TextInput
                autoCapitalize="none"
                autoComplete="new-password"
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.text.secondary}
                secureTextEntry={!passwordVisible}
                selectionColor={colors.brand.purple}
                style={{
                  ...typography.bodyLarge,
                  color: colors.text.primary,
                  height: 30,
                  padding: 0,
                }}
                value={password}
              />
            </View>
            <TouchableOpacity
              accessibilityLabel={
                passwordVisible ? "Hide password" : "Show password"
              }
              activeOpacity={0.65}
              className="h-12 w-12 items-end justify-center"
              onPress={() => setPasswordVisible((visible) => !visible)}
            >
              <Ionicons
                color={colors.text.secondary}
                name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                size={25}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.86}
          className="button-primary mt-card"
          onPress={() => {
            if (email.trim() && password.trim()) {
              setVerificationVisible(true);
            }
          }}
        >
          <Text className="h3 text-white">Sign Up</Text>
        </TouchableOpacity>

        <View className="my-card flex-row items-center gap-4">
          <View className="h-px flex-1 bg-border" />
          <Text className="body-md text-text-secondary">or continue with</Text>
          <View className="h-px flex-1 bg-border" />
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            accessibilityLabel="Continue with Google"
            activeOpacity={0.7}
            className="button-secondary flex-1"
          >
            <FontAwesome5 color="#4285F4" name="google" size={30} />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Continue with Facebook"
            activeOpacity={0.7}
            className="button-secondary flex-1"
          >
            <FontAwesome5 color="#1877F2" name="facebook" size={32} />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Continue with Apple"
            activeOpacity={0.7}
            className="button-secondary flex-1"
          >
            <FontAwesome5 color={colors.text.primary} name="apple" size={32} />
          </TouchableOpacity>
        </View>

        <View className="mt-auto flex-row justify-center gap-1 pt-card">
          <Text className="body-lg text-text-secondary">
            Already have an account?
          </Text>
          <TouchableOpacity
            activeOpacity={0.65}
            onPress={() => router.push("/sign-in")}
          >
            <Text className="h4 text-brand-purple">Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <VerificationModal
        email={email}
        onComplete={(code) => router.replace("/")}
        onRequestClose={() => setVerificationVisible(false)}
        visible={verificationVisible}
      />
    </SafeAreaView>
  );
}
