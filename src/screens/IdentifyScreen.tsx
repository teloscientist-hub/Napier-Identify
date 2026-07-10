import React from "react";
import { Text, View } from "react-native";
import { MockImage, PrimaryButton, SecondaryButton } from "../components/ui";
import { styles } from "../styles/styles";

export function IdentifyScreen({
  captureContext,
  companionPieceTitle,
  mediaError,
  onCancelCompanionPhoto,
  onImportPhoto,
  onNoMatch,
  onTakePhoto,
}: {
  captureContext: string | null;
  companionPieceTitle: string | null;
  mediaError: string | null;
  onCancelCompanionPhoto: () => void;
  onImportPhoto: () => void;
  onNoMatch: () => void;
  onTakePhoto: () => void;
}) {
  const isCompanionMode = Boolean(companionPieceTitle);

  return (
    <View style={styles.stack}>
      <MockImage label={isCompanionMode ? "Companion photo preview" : "Camera preview placeholder"} />
      <Text style={styles.sectionTitle}>{isCompanionMode ? "Add photo to piece" : "Identify a Napier piece"}</Text>
      {companionPieceTitle ? (
        <View style={styles.successBox}>
          <Text style={styles.successTitle}>{companionPieceTitle}</Text>
          <Text style={styles.copy}>You are adding another view to this existing piece draft.</Text>
        </View>
      ) : null}
      <Text style={styles.copy}>
        {captureContext ?? "Take a photo or import an existing image. The first prototype uses mock results."}
      </Text>
      {mediaError ? <Text style={styles.warning}>{mediaError}</Text> : null}
      <PrimaryButton label={isCompanionMode ? "Take Companion Photo" : "Take Photo"} onPress={onTakePhoto} />
      <SecondaryButton label={isCompanionMode ? "Import Companion Photo" : "Import Photo"} onPress={onImportPhoto} />
      {isCompanionMode ? <SecondaryButton label="Cancel And Return To Queue" onPress={onCancelCompanionPhoto} /> : null}
      {!isCompanionMode ? <SecondaryButton label="Preview No-Match State" onPress={onNoMatch} /> : null}
      <Text style={styles.privacyNote}>
        {isCompanionMode
          ? "This photo will be attached to the selected piece draft after you approve it."
          : "Photos will be uploaded for identification only after you choose to search."}
      </Text>
    </View>
  );
}
