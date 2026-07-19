# PostHog post-wizard report

The wizard completed a PostHog integration for the Expo application. It installed the React Native SDK and required Expo dependencies, configured public PostHog environment variables, initialized a shared client at the application entry point, enabled touch autocapture, and added manual Expo Router screen tracking. Authenticated Clerk users are identified with their Clerk user ID. Error capture was added around completed email authentication flows without sending email addresses or verification codes as event properties.

| Event name | Description | File |
| --- | --- | --- |
| `onboarding_started` | Captures when a visitor begins account creation from the onboarding screen. | `app/onboarding.tsx` |
| `authentication_completed` | Captures successful email-code sign-in with authentication method and flow metadata. | `app/(auth)/sign-in.tsx` |
| `authentication_completed` | Captures successful email-and-password sign-up with authentication method and flow metadata. | `app/(auth)/sign-up.tsx` |
| `language_selected` | Captures confirmation of the learner's selected target language. | `app/language-selection.tsx` |
| `learning_continued` | Captures a learner continuing the current lesson from the dashboard. | `components/home-dashboard.tsx` |

## Next steps

We've built an [Analytics basics (wizard) dashboard](https://us.posthog.com/project/519220/dashboard/1871794) for the newly instrumented mobile analytics.

No saved insights were added yet because the new custom events have not arrived in the project schema. After launching the updated app and completing the instrumented flows, create trends and a funnel from `onboarding_started`, `authentication_completed`, `language_selected`, and `learning_continued`.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in this project. This context can be used for further agent development with Claude Code and helps keep PostHog integration approaches current.
