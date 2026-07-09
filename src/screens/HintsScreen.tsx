import React from "react";
import { Text, TextInput, View } from "react-native";
import { ChipRow, PrimaryButton, SecondaryButton } from "../components/ui";
import { styles } from "../styles/styles";
import { SearchHint } from "../types";

export function HintsScreen({
  hints,
  onChange,
  onSkip,
  onSearch,
}: {
  hints: SearchHint;
  onChange: (hints: SearchHint) => void;
  onSkip: () => void;
  onSearch: () => void;
}) {
  return (
    <View style={styles.stack}>
      <Text style={styles.sectionTitle}>Add collector clues</Text>
      <Text style={styles.copy}>Optional hints can help rerank candidates. You can skip this step.</Text>
      <ChipRow
        title="Type"
        options={["brooch", "necklace", "bracelet", "earrings", "unknown"]}
        selected={[hints.jewelryType]}
        onSelect={(value) => onChange({ ...hints, jewelryType: value })}
      />
      <ChipRow
        title="Signed Napier"
        options={["yes", "no", "unknown"]}
        selected={[hints.signedNapier]}
        onSelect={(value) => onChange({ ...hints, signedNapier: value as SearchHint["signedNapier"] })}
      />
      <ChipRow
        title="Finish / color"
        options={["gold tone", "silver tone", "rhinestone", "pearl", "enamel"]}
        selected={hints.finishOrColor}
        onSelect={(value) => onChange({ ...hints, finishOrColor: [value] })}
      />
      <TextInput
        style={styles.input}
        value={hints.approximateDecade}
        onChangeText={(value) => onChange({ ...hints, approximateDecade: value })}
        placeholder="Approximate decade"
      />
      <PrimaryButton label="Search" onPress={onSearch} />
      <SecondaryButton label="Skip Hints" onPress={onSkip} />
    </View>
  );
}
