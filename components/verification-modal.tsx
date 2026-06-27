import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, radii, spacing, typography } from "@/theme";

const CODE_LENGTH = 6;

type VerificationModalProps = {
  email: string;
  onComplete: (code: string) => void;
  onRequestClose: () => void;
  visible: boolean;
};

export function VerificationModal({
  email,
  onComplete,
  onRequestClose,
  visible,
}: VerificationModalProps) {
  const [code, setCode] = useState(() => Array(CODE_LENGTH).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      setCode(Array(CODE_LENGTH).fill(""));
    }
  }, [visible]);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextCode = [...code];
    nextCode[index] = digit;
    setCode(nextCode);

    if (!digit) {
      return;
    }

    const fullCode = nextCode.join("");
    if (fullCode.length === CODE_LENGTH) {
      onComplete(fullCode);
      return;
    }

    if (index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Modal
      animationType="none"
      onRequestClose={onRequestClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={process.env.EXPO_OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-end">
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(160)}
            pointerEvents="none"
            style={styles.backdrop}
          />

          <Animated.View
            entering={SlideInDown.duration(280)}
            exiting={SlideOutDown.duration(220)}
          >
            <View
              className="w-full rounded-t-card bg-background px-card pt-3"
              style={{ paddingBottom: Math.max(insets.bottom, spacing.xl) }}
            >
              <View className="mb-5 h-1.5 w-12 self-center rounded-full bg-border" />
              <Text className="h2 text-center text-text-primary">
                Check your email
              </Text>
              <Text className="body-md mt-2 text-center text-text-secondary">
                We sent a verification code to{"\n"}
                <Text className="font-poppins-semibold text-text-primary">
                  {email || "your email address"}
                </Text>
              </Text>

              <View className="mt-7 flex-row justify-between gap-2">
                {code.map((digit, index) => (
                  <TextInput
                    accessibilityLabel={`Verification digit ${index + 1}`}
                    autoFocus={index === 0}
                    caretHidden
                    key={index}
                    keyboardType="number-pad"
                    maxLength={1}
                    onChangeText={(value) => handleChange(value, index)}
                    onKeyPress={({ nativeEvent }) =>
                      handleKeyPress(nativeEvent.key, index)
                    }
                    ref={(input) => {
                      inputRefs.current[index] = input;
                    }}
                    selectionColor={colors.brand.purple}
                    style={{
                      ...typography.h3,
                      borderColor: digit
                        ? colors.brand.purple
                        : colors.neutral.border,
                      borderRadius: radii.md,
                      borderWidth: digit ? 2 : 1,
                      color: colors.text.primary,
                      height: 54,
                      padding: 0,
                      textAlign: "center",
                      width: 44,
                    }}
                    value={digit}
                  />
                ))}
              </View>

              <Text className="body-sm mt-5 text-center text-text-secondary">
                Enter the 6-digit code to continue
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                className="mt-4 self-center px-4 py-2"
                onPress={onRequestClose}
              >
                <Text className="h4 text-brand-deep-purple">
                  Use another email
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.neutral.overlay,
  },
});
