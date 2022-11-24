import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import Colors from "./Colors";

export default function Button({ title, onPress }) {
  return (
    <View>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    backgroundColor: Colors.purple,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    marginVertical:10

  },
  title: {
    color: "white",
  },
  pressed: {
    opacity: 0.75,
  },
});