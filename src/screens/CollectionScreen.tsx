import React, { useState } from "react";
import { Text, View } from "react-native";
import { PrimaryButton, QueryImagePreview, SecondaryButton } from "../components/ui";
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
  const [photoIndexes, setPhotoIndexes] = useState<Record<string, number>>({});

  function selectPhoto(item: SavedItem, direction: -1 | 1) {
    const photoCount = item.privatePhotos.length;
    if (photoCount <= 1) {
      return;
    }

    setPhotoIndexes((indexes) => {
      const currentIndex = indexes[item.savedItemId] ?? 0;
      const nextIndex = (currentIndex + direction + photoCount) % photoCount;
      return { ...indexes, [item.savedItemId]: nextIndex };
    });
  }

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
      {savedItems.map((item) => {
        const photoCount = item.privatePhotos.length;
        const selectedIndex = Math.min(photoIndexes[item.savedItemId] ?? 0, Math.max(photoCount - 1, 0));
        const selectedPhotoUri = item.privatePhotos[selectedIndex] ?? null;

        return (
          <View key={item.savedItemId} style={styles.card}>
            <QueryImagePreview
              label={photoCount > 1 ? `Photo ${selectedIndex + 1} of ${photoCount}` : "Your submitted photo"}
              uri={selectedPhotoUri}
            />
            {photoCount > 1 ? (
              <View style={styles.carouselControls}>
                <SecondaryButton label="Previous" onPress={() => selectPhoto(item, -1)} />
                <SecondaryButton label="Next" onPress={() => selectPhoto(item, 1)} />
              </View>
            ) : null}
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.meta}>Saved {new Date(item.savedAt).toLocaleDateString()}</Text>
            <Text style={styles.copy}>{item.notes}</Text>
            <Text style={styles.meta}>Private photos: {photoCount}</Text>
            <Text style={styles.meta}>Tags: {item.tags.join(", ")}</Text>
          </View>
        );
      })}
    </View>
  );
}
