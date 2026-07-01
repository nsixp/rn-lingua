import { useSSO } from "@clerk/expo";
import { router } from "expo-router";
import { useState } from "react";

import { getClerkErrorMessage } from "@/lib/clerk";

export function useGoogleAuth() {
  const { startSSOFlow } = useSSO();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const continueWithGoogle = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      if (!createdSessionId || !setActive) {
        return;
      }

      await setActive({ session: createdSessionId });
      router.replace("/");
    } catch (caughtError) {
      setError(getClerkErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  };

  return { continueWithGoogle, error, isLoading };
}
