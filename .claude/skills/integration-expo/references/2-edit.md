---
title: PostHog Setup - Edit
description: Implement PostHog event tracking in the identified files, following best practices and the example project
---

For each of the files and events noted in .posthog-events.json, make edits to capture events using PostHog. Make sure to set up any helper files needed. Carefully examine the included example project code: your implementation should match it as closely as possible. Do not spawn subagents.

Use environment variables for PostHog keys. Do not hardcode PostHog keys.

If a file already has existing integration code for other tools or services, don't overwrite or remove that code. Place PostHog code below it.

For each event, add useful properties, and use your access to the PostHog source code to ensure correctness. You also have access to documentation about creating new events with PostHog. Consider this documentation carefully and follow it closely before adding events. Your integration should be based on documented best practices. Carefully consider how the user project's framework version may impact the correct PostHog integration approach.

Remember that you can find the source code for any dependency in the node_modules directory. This may be necessary to properly populate property names. There are also example project code files available via the PostHog MCP; use these for reference.

Where possible, call PostHog's identify() function on the client only after login or signup succeeds and a stable authenticated user ID, such as the existing `userId`, is available. Use that stable ID as the PostHog distinct ID; never use raw login or signup form values. Never pass credentials, passwords, verification codes, email addresses, phone numbers, or other unnecessary PII to `identify()` or analytics event properties.

Add server-side identification and matching distinct IDs only when the Expo project already contains instrumentable server routes or actions. In those existing server surfaces, derive the stable user ID from the server-verified authentication context, and do not forward form payloads, authentication credentials, session tokens, verification codes, or unnecessary PII to analytics. If the project has no instrumentable server routes or actions, limit the changes to client-side login and signup identification; do not create or direct the creation of server architecture solely for PostHog.

You should also add PostHog exception capture error tracking to these files where relevant.

Remember: Do not alter the fundamental architecture of existing files. Make your additions minimal and targeted.

Remember the documentation and example project resources you were provided at the beginning. Read them now.

## Status

Status to report in this phase:

- Inserting PostHog capture code
- A status message for each file whose edits you are planning, including a high level summary of changes
- A status message for each file you have edited

---

**Upon completion, continue with:** [3-revise.md](3-revise.md)
