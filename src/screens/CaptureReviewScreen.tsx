import React from "react";
import { Text, View } from "react-native";
import { PrimaryButton, QueryImagePreview, SecondaryButton } from "../components/ui";
import { styles } from "../styles/styles";
import { LocalQueryImage, PieceDraft } from "../types";

export function CaptureReviewScreen({
  image,
  targetPieceDraft,
  onUsePhoto,
  pieceDrafts,
  onAddAsNewPiece,
  onAddToPieceDraft,
  onRetake,
  onCrop,
}: {
  image: LocalQueryImage | null;
  targetPieceDraft: PieceDraft | null;
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
      {targetPieceDraft ? (
        <View style={styles.successBox}>
          <Text style={styles.successTitle}>Adding photo to {targetPieceDraft.title}</Text>
          <Text style={styles.copy}>Use this when this is another view of the same physical piece.</Text>
        </View>
      ) : null}
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
      {targetPieceDraft ? (
        <PrimaryButton label={`Add To ${targetPieceDraft.title}`} onPress={() => onAddToPieceDraft(targetPieceDraft.draftId)} />
      ) : (
        <PrimaryButton label="Use Photo" onPress={onUsePhoto} />
      )}
      {targetPieceDraft ? (
        <SecondaryButton label="Use Photo For Search Instead" onPress={onUsePhoto} />
      ) : null}
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
