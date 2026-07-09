import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { confidenceLabels } from "../mockData";
import { styles } from "../styles/styles";
import { HistoryEntry } from "../types";

export function HistoryScreen({ history, onOpenResult }: { history: HistoryEntry[]; onOpenResult: () => void }) {
  return (
    <View style={styles.stack}>
      {history.map((entry) => (
        <TouchableOpacity key={entry.queryId} style={styles.card} onPress={onOpenResult}>
          <Text style={styles.cardTitle}>{entry.bestCandidateTitle}</Text>
          <Text style={styles.meta}>{confidenceLabels[entry.confidenceBand]}</Text>
          <Text style={styles.meta}>{entry.savedItemId ? "Saved" : "Not saved"}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
