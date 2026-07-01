import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useSignIn } from "@clerk/expo";
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
import { colors, spacing, typography } from "@/theme";

export default function SignInScreen() {
  const { fetchStatus, signIn } = useSignIn();
  const googleAuth = useGoogleAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verificationVisible, setVerificationVisible] = useState(false);
  const isSubmitting = fetchStatus === "fetching";

  const handleSignIn = async () => {
    if (!email.trim()) {
      return;
    }

    setError(null);

    try {
      const result = await signIn.emailCode.sendCode({
        emailAddress: email.trim(),
      });

      if (result.error) {
        setError(getClerkErrorMessage(result.error));
        return;
      }

      setVerificationVisible(true);
    } catch (caughtError) {
      setError(getClerkErrorMessage(caughtError));
    }
  };

  const handleVerification = async (code: string) => {
    setError(null);

    try {
      const result = await signIn.emailCode.verifyCode({ code });

      if (result.error) {
        setError(getClerkErrorMessage(result.error));
        return;
      }

      if (signIn.status !== "complete") {
        throw new Error("Additional verification is required.");
      }

      const finalizeResult = await signIn.finalize();
      if (finalizeResult.error) {
        setError(getClerkErrorMessage(finalizeResult.error));
        return;
      }

      router.replace("/");
    } catch (caughtError) {
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
          <Text className="h2 text-text-primary">Welcome back</Text>
          <Text className="body-lg text-text-secondary">
            Continue your language journey ✨
          </Text>
        </View>

        <View className="mt-card h-54 items-center justify-center">
          <Image
            contentFit="contain"
            source={images.mascotAuth}
            style={{ height: 216, width: 216 }}
          />
        </View>

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

        <TouchableOpacity
          activeOpacity={0.86}
          className="button-primary mt-card"
          disabled={isSubmitting}
          onPress={handleSignIn}
        >
          {isSubmitting && !verificationVisible ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="h3 text-white">Sign In</Text>
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
          disabled={googleAuth.isLoading}
          onPress={googleAuth.continueWithGoogle}
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
            Don’t have an account?
          </Text>
          <TouchableOpacity
            activeOpacity={0.65}
            onPress={() => router.dismissTo("/sign-up")}
          >
            <Text className="h4 text-brand-purple">Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <VerificationModal
        email={email}
        error={error}
        isSubmitting={isSubmitting}
        onComplete={handleVerification}
        onRequestClose={() => {
          void signIn.reset();
          setError(null);
          setVerificationVisible(false);
        }}
        visible={verificationVisible}
      />
    </SafeAreaView>
  );
}
