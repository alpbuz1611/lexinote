#!/usr/bin/env bash
set -e

echo "=================================================="
echo "📱 LexiNote Android APK Paketleme Betiği (v0.1.0)"
echo "=================================================="

# 1. Web dağıtımını derle
echo "1. Production Web Bundle Derleniyor..."
npm run build

# 2. Capacitor Android Senkronizasyonu
if [ -d "android" ]; then
  echo "2. Mevcut Android projesi senkronize ediliyor..."
  npx cap sync android
else
  echo "2. Yeni Android projesi oluşturuluyor..."
  npm install @capacitor/core @capacitor/cli @capacitor/android --save-dev || true
  npx cap add android || true
  npx cap sync android || true
fi

# 3. Gradle ile APK derleme (Eğer Java & Android SDK kuruluysa)
if command -v ./android/gradlew &> /dev/null; then
  echo "3. Gradle ile Debug APK derleniyor..."
  cd android && ./gradlew assembleDebug
  echo "✅ APK Hazır: android/app/build/outputs/apk/debug/app-debug.apk"
else
  echo "ℹ️  Yerel sistemde Java/Android SDK bulunamadı."
  echo "💡 Tavsiye Edilen 2 Yöntem:"
  echo "   A) Bu depoyu GitHub'a 'git push' yaptığınızda GitHub Actions otomatik olarak APK'yı derler."
  echo "   B) Android Studio ile 'android' klasörünü açıp 'Build > Build APK' seçebilirsiniz."
fi
