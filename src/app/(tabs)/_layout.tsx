import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors, tabIcons } from "../../theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.6 }}>
            {tabIcons[route.name] ?? "•"}
          </Text>
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="radio" options={{ title: "Radio" }} />
      <Tabs.Screen name="cases" options={{ title: "Cases" }} />
      <Tabs.Screen name="news" options={{ title: "News" }} />
      <Tabs.Screen name="shows" options={{ title: "Shows" }} />
    </Tabs>
  );
}
