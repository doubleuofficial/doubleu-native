import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "../theme";
import { usePushNotifications } from "../hooks/usePushNotifications";

export default function RootLayout() {
  usePushNotifications();

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
    </>
  );
}
