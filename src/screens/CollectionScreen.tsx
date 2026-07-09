import React from "react";
import { Text, View } from "react-native";
import { PrimaryButton, QueryImagePreview } from "../components/ui";
import { styles } from "../styles/styles";
import { SavedItem } from "../types";

export function CollectionScreen({
  lastSavedTitle,
  savedItems,
  onOpenIdentify,
}: {
  lastSavedTitle: string | null;
  savedItems: SavedItem[];
  onOpenIdentify: () => void;
}) {
  if (savedItems.length === 0) {
    return (
      <View style={styles.stack}>
        <Text style={styles.sectionTitle}>No saved pieces yet</Text>
        <Text style={styles.copy}>Saved identifications will appear here as private collection records.</Text>
        <PrimaryButton label="Identify A Piece" onPress={onOpenIdentify} />
      </View>
    );
  }

  return (
    <View style={styles.stack}>
      {lastSavedTitle ? (
        <View style={styles.successBox}>
          <Text style={styles.successTitle}>Saved to collection</Text>
          <Text style={styles.copy}>{lastSavedTitle}</Text>
        </View>
      ) : null}
      {savedItems.map((item) => (
        <View key={item.savedItemId} style={styles.card}>
          <QueryImagePreview label="Your submitted photo" uri={item.privatePhotos[0] ?? null} />
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.meta}>Saved {new Date(item.savedAt).toLocaleDateString()}</Text>
          <Text style={styles.copy}>{item.notes}</Text>
          <Text style={styles.meta}>Private photos: {item.privatePhotos.length}</Text>
          <Text style={styles.meta}>Tags: {item.tags.join(", ")}</Text>
        </View>
      ))}
    </View>
  );
}
