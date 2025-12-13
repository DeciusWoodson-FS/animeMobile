import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";

const API_BASE = "http://localhost:3000";

export default function Quote() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [values, setValues] = useState({
    character: "",
    anime: "",
    quote: "",
  });

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      getQuotes();
    }
    return () => {
      ignore = true;
    };
  }, []);

  const getQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/quotes`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setQuotes(data);
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch quotes";
      setError(errorMessage);
      console.error("Fetch error:", error);
      Alert.alert(
        "Connection Error",
        `Could not connect to API at ${API_BASE}\n\nMake sure your API server is running.\n\nError: ${errorMessage}`,
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const createQuote = async () => {
    if (!values.character || !values.anime || !values.quote) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/quotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setValues({ character: "", anime: "", quote: "" });
      getQuotes();
    } catch (error) {
      const errorMessage = error.message || "Failed to create quote";
      setError(errorMessage);
      Alert.alert("Error", `Failed to create quote: ${errorMessage}`);
    }
  };

  const updateQuote = async (id) => {
    if (!values.character || !values.anime || !values.quote) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/quotes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setEditingId(null);
      setValues({ character: "", anime: "", quote: "" });
      getQuotes();
    } catch (error) {
      const errorMessage = error.message || "Failed to update quote";
      setError(errorMessage);
      Alert.alert("Error", `Failed to update quote: ${errorMessage}`);
    }
  };

  const deleteQuote = (id) => {
    Alert.alert("Delete Quote", "Are you sure you want to delete this quote?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(`${API_BASE}/quotes/${id}`, {
              method: "DELETE",
            });
            getQuotes();
          } catch (error) {
            setError(error.message || "Unexpected Error");
          }
        },
      },
    ]);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateQuote(editingId);
    } else {
      createQuote();
    }
  };

  const handleChange = (name, text) => {
    setValues((prev) => ({
      ...prev,
      [name]: text,
    }));
  };

  const startEdit = (quote) => {
    setEditingId(quote._id);
    setValues({
      character: quote.character,
      anime: quote.anime,
      quote: quote.quote,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setValues({ character: "", anime: "", quote: "" });
  };

  const renderForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.headerTitle}>
        {editingId ? "Edit Quote" : "Create New Quote"}
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Character:</Text>
        <TextInput
          style={styles.input}
          value={values.character}
          onChangeText={(text) => handleChange("character", text)}
          placeholder="Character Name"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Anime/Game:</Text>
        <TextInput
          style={styles.input}
          value={values.anime}
          onChangeText={(text) => handleChange("anime", text)}
          placeholder="Source Material"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Quote:</Text>
        <TextInput
          style={styles.input}
          value={values.quote}
          onChangeText={(text) => handleChange("quote", text)}
          placeholder="The Quote"
          placeholderTextColor="#666"
          multiline
        />
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.pressed,
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>
            {editingId ? "Update Quote" : "Create Quote"}
          </Text>
        </Pressable>

        {editingId && (
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.pressed,
            ]}
            onPress={cancelEdit}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>All Quotes</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardCharacter}>{item.character}</Text>
      <Text style={styles.cardQuote}>"{item.quote}"</Text>
      <Text style={styles.cardAnime}>From: {item.anime}</Text>

      <View style={styles.cardActions}>
        <Pressable
          style={[styles.actionButton, styles.editButton]}
          onPress={() => startEdit(item)}
        >
          <Text style={styles.actionText}>Edit</Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteQuote(item._id)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );

  if (loading && !quotes.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={100}
      >
        <FlatList
          data={quotes}
          keyExtractor={(item) => item._id || Math.random().toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderForm()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No quotes found. Add some quotes!
            </Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  listContent: {
    padding: 20,
    paddingBottom: 50,
  },
  // Form Styles
  formContainer: {
    marginBottom: 20,
    backgroundColor: "#121212",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6200ee",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ffffff",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "300",
  },
  input: {
    backgroundColor: "#292929",
    color: "#ffffff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#6200ee",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    minWidth: 120,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 20,
  },
  // Card Styles
  card: {
    backgroundColor: "#121212",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardCharacter: {
    color: "#6200ee",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardQuote: {
    color: "#ffffff",
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 10,
    lineHeight: 24,
  },
  cardAnime: {
    color: "#888",
    fontSize: 14,
    marginBottom: 15,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  editButton: {
    borderColor: "#6200ee",
    backgroundColor: "rgba(98, 0, 238, 0.1)",
  },
  deleteButton: {
    borderColor: "#ff4444",
    backgroundColor: "rgba(255, 68, 68, 0.1)",
  },
  actionText: {
    color: "#ffffff",
    fontSize: 14,
  },
  emptyText: {
    color: "#888",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});
