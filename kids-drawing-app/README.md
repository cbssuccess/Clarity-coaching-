# Doodle Kids 🎨

A self-contained drawing & coloring app for kids, built with Expo (React Native).
Runs on **Android** and **iPhone**. No internet required after install. No ads. No accounts.

## Features

- **Free Draw** — finger painting on a blank canvas
- **Coloring Pages** — 6 pre-drawn line-art pages (sun, star, flower, butterfly, house, cat)
- **20-color palette** — bright, kid-friendly colors
- **3 brush sizes** — thin, medium, thick
- **Eraser**
- **Undo / Clear**
- **Save to Photos** — saves the drawing to the device photo library

## Getting Started (Development)

```bash
cd kids-drawing-app
npm install
npm start          # opens Expo DevTools
```

Scan the QR code with the **Expo Go** app on your phone to test it instantly.

---

## How to Get It on the Child's iPhone

### Option A — TestFlight (Recommended for personal use, FREE to test)

This is the best way to put a custom app on a child's restricted iPhone.
The **TestFlight** app is rated **4+** on the App Store, so it's allowed on
Screen Time-restricted phones.

**What you need:**
- An Apple Developer account — [developer.apple.com](https://developer.apple.com) ($99/year)
- A Mac computer (required for iOS builds)

**Steps:**
1. Install Expo EAS CLI: `npm install -g eas-cli`
2. Log in: `eas login`
3. Configure build: `eas build:configure`
4. Build for iOS: `eas build --platform ios`
5. Submit to TestFlight: `eas submit --platform ios`
6. In App Store Connect, add the child's Apple ID as a TestFlight tester
7. The child opens the **TestFlight** app on her iPhone and installs "Doodle Kids"

> **Screen Time note:** You may need to add TestFlight to the list of allowed apps
> in Screen Time → Content & Privacy → Allowed Apps.

### Option B — Android (Simpler, no Apple account needed)

If the child has an Android device instead:

1. Build the APK: `eas build --platform android --profile preview`
2. Download the `.apk` file
3. Transfer to the Android device and install (enable "Install unknown apps" once)

### Option C — App Store (Public release)

For a polished release with a 4+ age rating:
1. Follow the same TestFlight steps above to build
2. Submit for App Store review with age rating **4+**
3. The app will be available to anyone — or just shared via link

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Expo (React Native) |
| Drawing | react-native-svg + PanResponder |
| Save to Photos | expo-media-library |
| Canvas capture | react-native-view-shot |
| Language | TypeScript |

## Project Structure

```
src/
  screens/
    HomeScreen.tsx        — welcome screen with two big buttons
    DrawingScreen.tsx     — main drawing canvas with tools
    ColoringPagesScreen.tsx — gallery of coloring pages
  components/
    DrawingCanvas.tsx     — SVG canvas with touch tracking
    ColorPalette.tsx      — scrollable color swatches
  data/
    coloringPages.ts      — embedded SVG outlines for coloring pages
```

## Adding More Coloring Pages

Open `src/data/coloringPages.ts` and add a new entry to the `COLORING_PAGES` array.
Each page is an SVG fragment (inner content only, viewBox 0 0 300 300).
