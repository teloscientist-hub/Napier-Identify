import React from "react";
import { Text, View } from "react-native";
import { appVersion } from "../app/version";
import { AppMode } from "../services/appServices";
import { styles } from "../styles/styles";
import { PrivacySettings } from "../types";
import { ChipRow, SecondaryButton, ToggleRow } from "../components/ui";

export function SettingsScreen({
  privacy,
  apiMode,
  onApiModeChange,
  onChange,
}: {
  privacy: PrivacySettings;
  apiMode: AppMode;
  onApiModeChange: (mode: AppMode) => void;
  onChange: (settings: PrivacySettings) => void;
}) {
  return (
    <View style={styles.stack}>
      <View style={styles.versionBox}>
        <Text style={styles.versionTitle}>App version {appVersion.version}</Text>
        <Text style={styles.meta}>Build {appVersion.buildLabel}</Text>
        <Text style={styles.meta}>
          {appVersion.releaseTrack} - {appVersion.releaseDate}
        </Text>
      </View>
      <Text style={styles.sectionTitle}>Prototype mode</Text>
      <Text style={styles.copy}>Use real mode only when EXPO_PUBLIC_NAPIER_API_BASE_URL points to a test backend.</Text>
      <ChipRow
        title="API mode"
        options={["mock", "real", "failure"]}
        selected={[apiMode]}
        onSelect={(value) => onApiModeChange(value as AppMode)}
      />
      <Text style={styles.sectionTitle}>Privacy</Text>
      <Text style={styles.copy}>
        Search photos are uploaded for identification. EXIF/location metadata should be stripped by default before production use.
      </Text>
      <ToggleRow
        label="Retain uploaded search images"
        value={privacy.retainUploadedImages}
        onValueChange={(value) => onChange({ ...privacy, retainUploadedImages: value })}
      />
      <ToggleRow
        label="Allow model improvement"
        value={privacy.allowModelImprovement}
        onValueChange={(value) => onChange({ ...privacy, allowModelImprovement: value })}
      />
      <ToggleRow
        label="Allow human expert review"
        value={privacy.allowHumanReview}
        onValueChange={(value) => onChange({ ...privacy, allowHumanReview: value })}
      />
      <ToggleRow
        label="Strip EXIF metadata"
        value={privacy.stripExif}
        onValueChange={(value) => onChange({ ...privacy, stripExif: value })}
      />
      <SecondaryButton label="Delete History Placeholder" onPress={() => undefined} />
    </View>
  );
}
