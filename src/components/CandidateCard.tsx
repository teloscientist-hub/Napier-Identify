import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { confidenceLabels } from "../mockData";
import { styles } from "../styles/styles";
import { CandidateResult } from "../types";
import { Badge } from "./ui";

export function CandidateCard({ candidate, onOpen }: { candidate: CandidateResult; onOpen: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onOpen}>
      <View style={styles.cardHeader}>
        <Text style={styles.rank}>#{candidate.rank}</Text>
        <Badge label={confidenceLabels[candidate.confidenceBand]} />
      </View>
      <Text style={styles.cardTitle}>{candidate.title}</Text>
      <Text style={styles.meta}>
        {candidate.itemType} | {candidate.dateLabel}
      </Text>
      <Text style={styles.copy}>{candidate.evidence[0]}</Text>
    </TouchableOpacity>
  );
}
