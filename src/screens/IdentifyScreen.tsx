import React from "react";
import { Text, View } from "react-native";
import { MockImage, PrimaryButton, SecondaryButton } from "../components/ui";
import { styles } from "../styles/styles";

export function IdentifyScreen({
  captureContext,
  mediaError,
  onImportPhoto,
  onNoMatch,
  onTakePhoto,
}: {
  captureContext: string | null;
  mediaError: string | null;
  onImportPhoto: () => void;
  onNoMatch: () => void;
  onTakePhoto: () => void;
}) {
  return (
    <View style={styles.stack}>
      <MockImage label="Camera preview placeholder" />
      <Text style={styles.sectionTitle}>Identify a Napier piece</Text>
      <Text style={styles.copy}>
        {captureContext ?? "Take a photo or import an existing image. The first prototype uses mock results."}
      </Text>
      {mediaError ? <Text style={styles.warning}>{mediaError}</Text> : null}
      <PrimaryButton label="Take Photo" onPress={onTakePhoto} />
      <SecondaryButton label="Import Photo" onPress={onImportPhoto} />
      <SecondaryButton label="Preview No-Match State" onPress={onNoMatch} />
      <Text style={styles.privacyNote}>Photos will be uploaded for identification only after you choose to search.</Text>
    </View>
  );
}
