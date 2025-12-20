import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform, // Checks if on Web or Mobile
} from "react-native";
import * as SecureStore from "expo-secure-store";

// ----- API Config
const getApiUrl = () => {
  if (Platform.OS === "web") {
    return "http://localhost:3000";
  }
  // For iOS Simulator, use your IP address below before the :3000
  return "http://:3000"; // <-- Put IP here
};

const API_BASE = "https://anime-api-tau-five.vercel.app";

// ---------------------------------------------------------

export default function Auth({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const saveToken = async (token) => {
    if (Platform.OS === "web") {
      localStorage.setItem("user_token", token);
    } else {
      await SecureStore.setItemAsync("user_token", token);
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      if (Platform.OS === "web") {
        window.alert("Please fill in all fields");
      } else {
        Alert.alert("Error", "Please fill in all fields");
      }
      return;
    }

    setLoading(true);
    const endpoint = isLogin ? "/auth/signin" : "/auth";

    try {
      console.log(`Connecting to: ${API_BASE}${endpoint}`); // Debug Log

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Save token securely based on platform
      await saveToken(data.token);

      // Handle Navigation
      if (Platform.OS === "web") {
        navigation.replace("Quote");
      } else {
        Alert.alert("Success", `Welcome!`, [
          { text: "OK", onPress: () => navigation.replace("Quote") },
        ]);
      }
    } catch (error) {
      console.error("Auth Error:", error);
      const msg = error.message || "Network request failed";

      if (Platform.OS === "web") {
        window.alert(msg);
      } else {
        Alert.alert("Error", msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setIsLogin(!isLogin)}
          style={styles.switchButton}
        >
          <Text style={styles.switchText}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#121212",
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#292929",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 10,
  },
  pressed: { opacity: 0.8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  switchButton: { marginTop: 20, alignItems: "center" },
  switchText: { color: "#888", fontSize: 14 },
});
