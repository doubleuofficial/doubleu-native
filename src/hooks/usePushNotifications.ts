import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";

// expo-notifications' native modules (push token, topic subscription) are not
// in Expo Go — importing the package at all crashes startup there. So in Expo
// Go we skip notifications entirely; everything lights up in a dev build.
const isExpoGo = Constants.appOwnership === "expo";

type NotificationsModule = typeof import("expo-notifications");
let cached: NotificationsModule | null = null;

async function getNotifications(): Promise<NotificationsModule | null> {
  if (isExpoGo) return null;
  if (cached) return cached;
  try {
    const mod = await import("expo-notifications");
    const { AndroidImportance } = mod;
    mod.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    if (Platform.OS === "android") {
      await mod.setNotificationChannelAsync("drops", {
        name: "Drops & shows",
        importance: AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      });
    }
    cached = mod;
    return mod;
  } catch {
    return null;
  }
}

export function usePushNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    (async () => {
      const N = await getNotifications();
      if (!N) return;

      const { status: existing } = await N.getPermissionsAsync();
      let finalStatus = existing;
      if (existing !== "granted") {
        const { status } = await N.requestPermissionsAsync();
        finalStatus = status;
      }
      setGranted(finalStatus === "granted");
      if (finalStatus !== "granted") return;

      try {
        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ??
          Constants.easConfig?.projectId;
        if (projectId) {
          const t = await N.getExpoPushTokenAsync({ projectId });
          setToken(t.data);
          // TODO: POST token to your backend so you can send drops/shows alerts
          // await fetch("https://www.doubleuofficial.online/api/push/subscribe", {
          //   method: "POST",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify({ token: t.data, platform: Platform.OS }),
          // });
        }
      } catch {
        /* push token unavailable */
      }
    })();
  }, []);

  return { token, granted };
}

// Fire a local notification immediately (dev builds only; no-op in Expo Go)
export async function notifyLocal(title: string, body: string) {
  const N = await getNotifications();
  if (!N) return;
  await N.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: null,
  });
}

// Whether notification features are available in this build
export const notificationsAvailable = !isExpoGo;
