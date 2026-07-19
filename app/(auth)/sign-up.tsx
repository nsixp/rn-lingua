import { useSignUp } from "@clerk/expo";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { VerificationModal } from "@/components/verification-modal";
import { images } from "@/constants/images";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { getClerkErrorMessage } from "@/lib/clerk";
import { posthog } from "@/lib/posthog";
import { colors, spacing, typography } from "@/theme";

export default function SignUpScreen() {
  const { fetchStatus, signUp } = useSignUp();
  const googleAuth = useGoogleAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [verificationVisible, setVerificationVisible] = useState(false);
  const isSubmitting = fetchStatus === "fetching";
  const isAuthInProgress = isSubmitting || googleAuth.isLoading;

  const handleSignUp = async () => {
    if (isAuthInProgress || !email.trim() || !password) {
      return;
    }

    setError(null);

    try {
      const signUpResult = await signUp.password({
        emailAddress: email.trim(),
        password,
      });

      if (signUpResult.error) {
        setError(getClerkErrorMessage(signUpResult.error));
        return;
      }

      const verificationResult = await signUp.verifications.sendEmailCode();
      if (verificationResult.error) {
        setError(getClerkErrorMessage(verificationResult.error));
        return;
      }

      setVerificationVisible(true);
    } catch (caughtError) {
      setError(getClerkErrorMessage(caughtError));
    }
  };

  const handleGoogleAuth = async () => {
    if (isAuthInProgress) {
      return;
    }

    await googleAuth.continueWithGoogle();
  };

  const handleVerificationClose = async () => {
    if (isAuthInProgress) {
      return;
    }

    try {
      await signUp.reset();
    } catch {
      return;
    }

    setError(null);
    setVerificationVisible(false);
  };

  const handleVerification = async (code: string) => {
    setError(null);

    try {
      const result = await signUp.verifications.verifyEmailCode({ code });

      if (result.error) {
        setError(getClerkErrorMessage(result.error));
        return;
      }

      if (signUp.status !== "complete") {
        throw new Error("Please complete the remaining account requirements.");
      }

      const finalizeResult = await signUp.finalize();
      if (finalizeResult.error) {
        setError(getClerkErrorMessage(finalizeResult.error));
        return;
      }

      posthog.capture("authentication_completed", {
        authentication_method: "email_password",
        authentication_flow: "sign_up",
      });
      router.replace("/");
    } catch (caughtError) {
      posthog.captureException(caughtError, { authentication_flow: "sign_up" });
      setError(getClerkErrorMessage(caughtError));
    }
  };

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
          disabled={isAuthInProgress}
          onPress={handleSignUp}
        >
          {isSubmitting && !verificationVisible ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="h3 text-white">Sign Up</Text>
          )}
        </TouchableOpacity>

        {error && !verificationVisible ? (
          <Text className="body-sm mt-3 text-center text-error" selectable>
            {error}
          </Text>
        ) : null}

        <View className="my-card flex-row items-center gap-4">
          <View className="h-px flex-1 bg-border" />
          <Text className="body-md text-text-secondary">or continue with</Text>
          <View className="h-px flex-1 bg-border" />
        </View>

        <TouchableOpacity
          accessibilityLabel="Continue with Google"
          activeOpacity={0.7}
          className="button-secondary relative flex-row"
          disabled={isAuthInProgress}
          onPress={handleGoogleAuth}
        >
          <FontAwesome5
            className="left-8 absolute"
            color="#4285F4"
            name="google"
            size={28}
          />
          {googleAuth.isLoading ? (
            <ActivityIndicator color={colors.brand.purple} />
          ) : (
            <Text className="h4 text-text-primary">Continue with Google</Text>
          )}
        </TouchableOpacity>

        {googleAuth.error ? (
          <Text className="body-sm mt-3 text-center text-error" selectable>
            {googleAuth.error}
          </Text>
        ) : null}

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

        <View nativeID="clerk-captcha" />
      </ScrollView>

      <VerificationModal
        email={email}
        error={error}
        isSubmitting={isSubmitting}
        onComplete={handleVerification}
        onRequestClose={handleVerificationClose}
        visible={verificationVisible}
      />
    </SafeAreaView>
  );
}
