import React from "react";
import { Text, View } from "react-native";
import { ProgressStep } from "../components/ui";
import { styles } from "../styles/styles";

export function SearchProgressScreen() {
  return (
    <View style={styles.stack}>
      <Text style={styles.sectionTitle}>Searching Napier reference images</Text>
      <ProgressStep label="Preparing image" />
      <ProgressStep label="Comparing likely matches" />
      <ProgressStep label="Building ranked results" />
    </View>
  );
}
