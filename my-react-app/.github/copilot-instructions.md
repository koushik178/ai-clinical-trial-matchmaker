## Copilot instructions for ai-clinical-trial-matchmaker

These instructions help AI coding agents be productive immediately in this React + Vite frontend.

1. Project overview
- **Type:** React (JSX) app bootstrapped for Vite; see `package.json` scripts: `dev`, `build`, `preview`.
- **Routing:** Uses `react-router-dom` (v7). App routing and auth gating live in `src/App.jsx`.
- **Auth flow:** Login/Signup store `access_token` and user info in `localStorage` (see `src/components/Login.jsx` and `src/components/Signup.jsx`). Many routes check `localStorage.getItem('access_token')` to gate access.

2. API & integration patterns
- **Base backend:** Components call `https://ai-clinical-trial-matchmaker.onrender.com` endpoints directly (examples in `Login.jsx`, `Signup.jsx`, `Chatbot.jsx`, `Profile.jsx`).
- **Auth header:** Use `Authorization: Bearer ${token}` where `token` is from `localStorage.getItem('access_token')`.
- **HTTP usage:** Codebase mixes `fetch` (used for auth and chatbot) and `axios` (used in `src/components/Profile.jsx`). Follow existing patterns when adding new calls — keep headers and JSON body consistent with nearby code.

3. UI & component conventions
- **Per-component CSS:** Each component has its own CSS file alongside the `.jsx` (e.g., `Profile.jsx` + `Profile.css`). Follow this convention for new components.
- **Shared components:** `Sidebar`, `Chatbot`, and several page components live under `src/components/` and are composed in `App.jsx`.
- **Chatbot behavior:** Chat visibility is controlled in `App.jsx` via `ChatbotWrapper` which hides it on public routes (`/`, `/login`, `/signup`) and when unauthenticated. Use that pattern to add/remove global UI.

4. Developer workflows & commands
- Start dev server: `npm run dev` (uses Vite with HMR).
- Build production: `npm run build`.
- Preview production build: `npm run preview`.
- Linting: `npm run lint` (ESLint configured; keep changes consistent with project's style).

5. Patterns to follow when editing
- **Auth-preserving changes:** If adding API calls that require auth, read token from `localStorage` and include the `Authorization` header.
- **Routing changes:** Update `src/App.jsx` routes and respect `isAuthenticated()` helper for guarded routes.
- **State handling:** Components use React `useState` and simple handlers (see `Profile.jsx` for form handling and derived state example — BMI auto-calculation).
- **Error handling:** Follow the pattern of catching errors and providing a user-facing `alert()` or inline `error` message (see `Login.jsx` and `Profile.jsx`). Do not change global error UX unexpectedly.

6. Files to consult when making changes (quick map)
- App entry & routing: `src/App.jsx`, `src/main.jsx`
- Auth UI: `src/components/Login.jsx`, `src/components/Signup.jsx`
- Profile & API examples: `src/components/Profile.jsx`
- Chatbot: `src/components/Chatbot.jsx` (shows how to call `/chatbot/ask`)
- Styles: `src/components/*.css`

7. Small examples
- Add an authenticated fetch:
  - const token = localStorage.getItem('access_token');
  - fetch(url, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

8. What not to change without coordination
- Do not replace the mixed `fetch`/`axios` usage across the whole codebase without a PR describing the migration — small feature changes should follow local file conventions.
- Avoid changing the routing semantics in `App.jsx` (guard checks and `Navigate` behavior) without tests or manual verification.

If anything in these notes is unclear or you want additional examples (API wrapper, centralized auth helper, or tests), tell me which pieces to expand and I will update this file.
