import React from "react";
import { Text, View } from "react-native";
import { PrimaryButton, QueryImagePreview, SecondaryButton } from "../components/ui";
import { styles } from "../styles/styles";
import { LocalQueryImage, PieceDraft } from "../types";

export function CaptureReviewScreen({
  image,
  onUsePhoto,
  pieceDrafts,
  onAddAsNewPiece,
  onAddToPieceDraft,
  onRetake,
  onCrop,
}: {
  image: LocalQueryImage | null;
  onUsePhoto: () => void;
  pieceDrafts: PieceDraft[];
  onAddAsNewPiece: () => void;
  onAddToPieceDraft: (draftId: string) => void;
  onRetake: () => void;
  onCrop: () => void;
}) {
  return (
    <View style={styles.stack}>
      <QueryImagePreview label={image ? `${image.source} image` : "Captured photo placeholder"} uri={image?.localUri ?? null} />
      <Text style={styles.sectionTitle}>Use this photo?</Text>
      <Text style={styles.warning}>This may be hard to identify if the jewelry is small or the background is busy.</Text>
      {image ? (
        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>Image prepared for search</Text>
          <Text style={styles.bullet}>
            - Original: {image.originalWidth} x {image.originalHeight} px
          </Text>
          <Text style={styles.bullet}>
            - Upload: {image.width} x {image.height} px, JPEG quality {Math.round(image.compressionQuality * 100)}%
          </Text>
          <Text style={styles.bullet}>- Source: {image.source}</Text>
        </View>
      ) : null}
      <PrimaryButton label="Use Photo" onPress={onUsePhoto} />
      <SecondaryButton label="Add As New Piece Draft" onPress={onAddAsNewPiece} />
      {pieceDrafts.length > 0 ? (
        <View style={styles.infoBlock}>
          <Text style={styles.infoTitle}>Add to existing piece</Text>
          {pieceDrafts.map((draft) => (
            <SecondaryButton
              key={draft.draftId}
              label={`${draft.title} (${draft.captures.length} photo${draft.captures.length === 1 ? "" : "s"})`}
              onPress={() => onAddToPieceDraft(draft.draftId)}
            />
          ))}
        </View>
      ) : null}
      <SecondaryButton label="Crop / Isolate Object" onPress={onCrop} />
      <SecondaryButton label="Retake" onPress={onRetake} />
    </View>
  );
}
