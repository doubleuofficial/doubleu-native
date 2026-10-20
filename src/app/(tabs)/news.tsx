import { FlatList, StyleSheet, Text, View } from "react-native";
import { news } from "../../data/news";
import { colors } from "../../theme";

export default function NewsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📰 News</Text>
      <FlatList
        data={news}
        keyExtractor={(n) => n.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text
                style={[
                  styles.tag,
                  item.tag === "upcoming" ? styles.tagUpcoming : styles.tagNews,
                ]}
              >
                {item.tag === "upcoming" ? "UPCOMING" : "NEWS"}
              </Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, paddingTop: 60 },
  heading: { color: colors.text, fontSize: 24, fontWeight: "bold", paddingHorizontal: 20 },
  list: { padding: 20 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tag: { fontSize: 10, fontWeight: "bold", letterSpacing: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  tagNews: { backgroundColor: colors.cyan, color: "#000" },
  tagUpcoming: { backgroundColor: colors.yellow, color: "#000" },
  date: { color: colors.muted, fontSize: 12 },
  title: { color: colors.text, fontSize: 17, fontWeight: "bold", marginTop: 10 },
  body: { color: colors.muted, fontSize: 14, marginTop: 6, lineHeight: 20 },
});
