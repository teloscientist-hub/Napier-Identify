import React from "react";
import { Text, View } from "react-native";
import { DangerButton, PrimaryButton, QueryImagePreview, SecondaryButton } from "../components/ui";
import { styles } from "../styles/styles";
import { QueuedCapture } from "../types";

export function QueueScreen({
  captures,
  onOpenIdentify,
  onProcessCapture,
  onDeleteCapture,
}: {
  captures: QueuedCapture[];
  onOpenIdentify: () => void;
  onProcessCapture: (capture: QueuedCapture) => void;
  onDeleteCapture: (captureId: string) => void;
}) {
  if (captures.length === 0) {
    return (
      <View style={styles.stack}>
        <Text style={styles.sectionTitle}>Capture queue is empty</Text>
        <Text style={styles.copy}>Add photos here when you want to photograph first and identify later.</Text>
        <PrimaryButton label="Capture Photos" onPress={onOpenIdentify} />
      </View>
    );
  }

  return (
    <View style={styles.stack}>
      <Text style={styles.sectionTitle}>{captures.length} queued capture{captures.length === 1 ? "" : "s"}</Text>
      {captures.map((capture) => (
        <View key={capture.captureId} style={styles.card}>
          <QueryImagePreview label="Queued photo" uri={capture.image.originalUri} />
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{capture.label}</Text>
            <Text style={styles.statusPill}>{capture.status}</Text>
          </View>
          <Text style={styles.meta}>Captured {new Date(capture.createdAt).toLocaleString()}</Text>
          <Text style={styles.meta}>
            Upload image: {capture.image.width} x {capture.image.height} px
          </Text>
          <SecondaryButton
            label={capture.status === "saved" ? "Review Again" : "Identify This Capture"}
            onPress={() => onProcessCapture(capture)}
          />
          <DangerButton label="Delete From Queue" onPress={() => onDeleteCapture(capture.captureId)} />
        </View>
      ))}
    </View>
  );
}
