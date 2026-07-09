import React from "react";
import { Image, Switch, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/styles";

export function ChipRow({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: string[];
  selected: string[];
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.chips}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.chip, selected.includes(option) && styles.chipActive]}
            onPress={() => onSelect(option)}
          >
            <Text style={[styles.chipText, selected.includes(option) && styles.chipTextActive]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export function ToggleRow({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (value: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

export function InfoBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <View style={styles.infoBlock}>
      <Text style={styles.infoTitle}>{title}</Text>
      {lines.map((line) => (
        <Text key={line} style={styles.bullet}>
          - {line}
        </Text>
      ))}
    </View>
  );
}

export function ProgressStep({ label }: { label: string }) {
  return (
    <View style={styles.progressStep}>
      <View style={styles.progressDot} />
      <Text style={styles.copy}>{label}</Text>
    </View>
  );
}

export function MockImage({ label }: { label: string }) {
  return (
    <View style={styles.mockImage}>
      <Text style={styles.mockImageText}>{label}</Text>
    </View>
  );
}

export function QueryImagePreview({ label, uri }: { label: string; uri: string | null }) {
  if (!uri) {
    return <MockImage label={label} />;
  }

  return (
    <View style={styles.queryImageFrame}>
      <Image source={{ uri }} style={styles.queryImage} resizeMode="cover" />
      <View style={styles.queryImageLabel}>
        <Text style={styles.queryImageLabelText}>{label}</Text>
      </View>
    </View>
  );
}

export function Badge({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

export function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.secondaryButton} onPress={onPress}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}
