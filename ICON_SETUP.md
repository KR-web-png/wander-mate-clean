# Travel Buddy - Icon Setup Guide

## App Configuration Complete ✓

The following updates have been made:

### 1. App Name Changed to "Travel Buddy"
- ✅ Capacitor config updated
- ✅ Android strings.xml updated
- ✅ index.html updated
- ✅ App ID changed to: `com.travelbuddy.app`

### 2. Splash Screen Configured
- ✅ Web splash screen component created
- ✅ 3-second splash screen with logo and app name
- ✅ Auto-redirect to login page
- ✅ Capacitor SplashScreen plugin installed
- ✅ Native splash screen configured

---

## 📱 Next Steps: Setting Up the App Icon

### Step 1: Save Your Logo Image

1. Save your logo image (the Sri Lanka travel logo) to:
   - `public/logo.png` - For web splash screen
   - `src/assets/logo.png` - For backup

### Step 2: Generate Android Icons

You need to create different sized icons for Android. Use one of these methods:

#### **Option A: Using Android Studio (Recommended)**

1. Open Android Studio
2. Open the project at: `c:\TravelApp\wander-mate-clean\android`
3. Right-click on `app` → New → Image Asset
4. Select "Launcher Icons (Adaptive and Legacy)"
5. Upload your logo image
6. Click "Next" then "Finish"

#### **Option B: Using Online Tool (icon.kitchen)**

1. Go to https://icon.kitchen/
2. Upload your logo image
3. Adjust the padding and background
4. Download the icon pack
5. Extract and replace files in these folders:

```
android/app/src/main/res/mipmap-mdpi/ic_launcher.png (48x48)
android/app/src/main/res/mipmap-hdpi/ic_launcher.png (72x72)
android/app/src/main/res/mipmap-xhdpi/ic_launcher.png (96x96)
android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png (144x144)
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png (192x192)
```

Also create round variants:
```
android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png
```

### Step 3: Create Splash Screen Images for Android (Optional)

For native Android splash screen, create PNG files:

```
android/app/src/main/res/drawable-port-mdpi/splash.png (320x480)
android/app/src/main/res/drawable-port-hdpi/splash.png (480x800)
android/app/src/main/res/drawable-port-xhdpi/splash.png (720x1280)
android/app/src/main/res/drawable-port-xxhdpi/splash.png (1080x1920)
android/app/src/main/res/drawable-port-xxxhdpi/splash.png (1440x2560)
```

### Step 4: Build and Test

After setting up the icons:

```bash
# Sync Capacitor changes
npx cap sync android

# Build the Android app
cd android
./gradlew assembleDebug

# Or open in Android Studio to run on device/emulator
npx cap open android
```

---

## 🎨 Quick Setup Script (Manual Steps)

1. **Save the logo:**
   - Copy your logo to `public/logo.png`

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the app in browser to test splash screen:**
   ```bash
   npm run dev
   ```

4. **Generate Android icons** using one of the methods above

5. **Build and test on Android:**
   ```bash
   npx cap sync android
   npx cap open android
   ```

---

## 📋 What You'll See

### On App Launch:
1. **Splash Screen (3 seconds)**
   - Travel Buddy logo centered
   - "Travel Buddy" text below logo
   - "Your Travel Companion" subtitle
   - Loading animation

2. **Then Auto-Redirect to:**
   - Login/Sign-in page

### On Device Home Screen:
- App icon: Your Sri Lanka travel logo
- App name: "Travel Buddy"

---

## 🔧 Troubleshooting

**Splash screen not showing?**
- Make sure `logo.png` exists in the `public` folder
- Check browser console for errors
- Clear cache and reload

**Icon not updating on device?**
- Uninstall the old app completely
- Rebuild with `./gradlew clean assembleDebug`
- Reinstall

**App name not changing?**
- Run `npx cap sync android`
- Rebuild the app

---

## ✅ Summary

All code changes are complete! You just need to:
1. Save your logo image to `public/logo.png`
2. Generate and add Android icon files
3. Build and test

The app is now configured as "Travel Buddy" with a splash screen that displays for 3 seconds before showing the login page.
