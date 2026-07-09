import React from "react";
import { Text, View } from "react-native";
import { PrimaryButton, QueryImagePreview, SecondaryButton } from "../components/ui";
import { styles } from "../styles/styles";
import { LocalQueryImage } from "../types";

export function CropScreen({
  image,
  onConfirm,
  onReset,
}: {
  image: LocalQueryImage | null;
  onConfirm: () => void;
  onReset: () => void;
}) {
  return (
    <View style={styles.stack}>
      <View style={styles.cropFrame}>
        <QueryImagePreview label={image ? "Crop target" : "Crop target placeholder"} uri={image?.localUri ?? null} />
        <View style={styles.cropBox} />
      </View>
      <Text style={styles.sectionTitle}>Isolate the jewelry</Text>
      <Text style={styles.copy}>Mock crop coordinates will be attached to the search request.</Text>
      <PrimaryButton label="Confirm Crop" onPress={onConfirm} />
      <SecondaryButton label="Reset" onPress={onReset} />
    </View>
  );
}
