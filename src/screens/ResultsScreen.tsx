import React from "react";
import { Text, View } from "react-native";
import { CandidateCard } from "../components/CandidateCard";
import { PrimaryButton, SecondaryButton } from "../components/ui";
import { confidenceLabels } from "../mockData";
import { styles } from "../styles/styles";
import { CandidateResult, IdentifyResponse } from "../types";

export function ResultsScreen({
  response,
  error,
  onOpen,
  onRefine,
  onTryAgain,
  onShowNoMatch,
  onShowMockMatches,
}: {
  response: IdentifyResponse;
  error: string | null;
  onOpen: (candidate: CandidateResult) => void;
  onRefine: () => void;
  onTryAgain: () => void;
  onShowNoMatch: () => void;
  onShowMockMatches: () => void;
}) {
  if (error) {
    return (
      <View style={styles.stack}>
        <Text style={styles.sectionTitle}>Search error</Text>
        <Text style={styles.warning}>{error}</Text>
        <PrimaryButton label="Try Another Photo" onPress={onTryAgain} />
        <SecondaryButton label="Refine Search" onPress={onRefine} />
      </View>
    );
  }

  if (response.candidates.length === 0) {
    return (
      <View style={styles.stack}>
        <Text style={styles.sectionTitle}>{confidenceLabels[response.confidenceBand]}</Text>
        {response.retryGuidance.map((item) => (
          <Text key={item} style={styles.bullet}>
            - {item}
          </Text>
        ))}
        <PrimaryButton label="Try Another Photo" onPress={onTryAgain} />
        <SecondaryButton label="Back To Mock Matches" onPress={onShowMockMatches} />
      </View>
    );
  }

  return (
    <View style={styles.stack}>
      <Text style={styles.sectionTitle}>Ranked candidates</Text>
      {response.candidates.map((candidate) => (
        <CandidateCard key={candidate.candidateId} candidate={candidate} onOpen={() => onOpen(candidate)} />
      ))}
      <SecondaryButton label="Refine Search" onPress={onRefine} />
      <SecondaryButton label="Try No-Match State" onPress={onShowNoMatch} />
    </View>
  );
}
