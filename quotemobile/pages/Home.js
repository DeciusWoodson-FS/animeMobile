import React from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

function Home() {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("Quote");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.title}>Anime and Game Quotes</Text>
        <Text style={styles.subtitle}>
          Add your favorite Anime and Game quotes!
        </Text>
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={styles.buttonText}>Your Quotes</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    color: "#6200ee",
    fontWeight: "600",
    fontSize: 40,
    marginBottom: 32,
    textAlign: "center",
  },
  subtitle: {
    color: "#6200ee",
    fontWeight: "400",
    fontSize: 20.8,
  },
  button: {
    backgroundColor: "#121212",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 16,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#6200ee",
    fontWeight: "400",
    fontSize: 20.8,
  },
});

export default Home;
