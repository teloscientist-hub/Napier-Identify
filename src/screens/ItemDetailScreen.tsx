import React from "react";
import { Text, View } from "react-native";
import { Badge, InfoBlock, MockImage, PrimaryButton, SecondaryButton } from "../components/ui";
import { confidenceLabels } from "../mockData";
import { styles } from "../styles/styles";
import { CandidateResult, ItemDetail } from "../types";

export function ItemDetailScreen({
  candidate,
  error,
  item,
  loading,
  onBack,
  onSave,
}: {
  candidate: CandidateResult;
  error: string | null;
  item: ItemDetail | null;
  loading: boolean;
  onBack: () => void;
  onSave: () => void;
}) {
  const detail = item ?? createFallbackItemDetail(candidate);

  return (
    <View style={styles.stack}>
      <SecondaryButton label="Back To Results" onPress={onBack} />
      <MockImage label="Reference gallery placeholder" />
      <Text style={styles.sectionTitle}>{candidate.title}</Text>
      <Badge label={confidenceLabels[candidate.confidenceBand]} />
      {loading ? <Text style={styles.copy}>Loading reference detail...</Text> : null}
      {error ? <Text style={styles.warning}>{error}</Text> : null}
      <InfoBlock title="Why this appeared" lines={candidate.evidence} />
      <InfoBlock
        title="Napier Reference"
        lines={[
          `${detail.itemType}, ${detail.dateLabel}`,
          detail.designFamily || "Design family not yet available",
          `Materials: ${detail.materials.length > 0 ? detail.materials.join(", ") : "not yet entered"}`,
          `Source: ${detail.sourceCitation.title}, ${detail.sourceCitation.page}`,
        ]}
      />
      <InfoBlock title="Variants" lines={detail.variants.map((variant) => `${variant.title}: ${variant.note}`)} />
      <InfoBlock title="Related pieces" lines={detail.relatedPieces.map((related) => `${related.title} (${related.itemType})`)} />
      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>My Notes</Text>
        <Text style={styles.copy}>Private notes stay separate from authoritative Napier reference facts.</Text>
      </View>
      <PrimaryButton label="Save To Collection" onPress={onSave} />
    </View>
  );
}

function createFallbackItemDetail(candidate: CandidateResult): ItemDetail {
  return {
    itemId: candidate.itemId,
    canonicalTitle: candidate.title,
    itemType: candidate.itemType,
    dateLabel: candidate.dateLabel,
    dateStart: null,
    dateEnd: null,
    collectionName: candidate.collectionName,
    designFamily: candidate.designFamily,
    description: "",
    referenceImages: candidate.referenceImageUri
      ? [{ imageId: `${candidate.itemId}_image`, uri: candidate.referenceImageUri, caption: "Reference image" }]
      : [],
    materials: [],
    measurements: [],
    variants: [],
    relatedPieces: [],
    sourceCitation: {
      sourceType: "book",
      title: "The Napier Co.: Defining 20th Century American Costume Jewelry",
      page: "page unknown",
      caption: "",
      confidence: "contextual",
    },
    referenceNotes: [],
  };
}
