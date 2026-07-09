import React from "react";
import { Text, View } from "react-native";
import { PrimaryButton, QueryImagePreview, SecondaryButton } from "../components/ui";
import { styles } from "../styles/styles";
import { LocalQueryImage } from "../types";

export function CaptureReviewScreen({
  image,
  onUsePhoto,
  onRetake,
  onCrop,
}: {
  image: LocalQueryImage | null;
  onUsePhoto: () => void;
  onRetake: () => void;
  onCrop: () => void;
}) {
  return (
    <View style={styles.stack}>
      <QueryImagePreview label={image ? `${image.source} image` : "Captured photo placeholder"} uri={image?.localUri ?? null} />
      <Text style={styles.sectionTitle}>Use this photo?</Text>
      <Text style={styles.warning}>This may be hard to identify if the jewelry is small or the background is busy.</Text>
      {image ? (
        <Text style={styles.meta}>
          {image.width} x {image.height} px | {image.source}
        </Text>
      ) : null}
      <PrimaryButton label="Use Photo" onPress={onUsePhoto} />
      <SecondaryButton label="Crop / Isolate Object" onPress={onCrop} />
      <SecondaryButton label="Retake" onPress={onRetake} />
    </View>
  );
}
