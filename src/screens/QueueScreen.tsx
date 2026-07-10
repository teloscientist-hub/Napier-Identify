import React from "react";
import { Image, Text, TextInput, View } from "react-native";
import { DangerButton, PrimaryButton, QueryImagePreview, SecondaryButton } from "../components/ui";
import { styles } from "../styles/styles";
import { PieceDraft } from "../types";

export function QueueScreen({
  drafts,
  onOpenIdentify,
  onAddPhotoToDraft,
  onUpdateDraft,
  onProcessDraft,
  onDeleteDraft,
  onDeleteCapture,
}: {
  drafts: PieceDraft[];
  onOpenIdentify: () => void;
  onAddPhotoToDraft: (draft: PieceDraft) => void;
  onUpdateDraft: (draftId: string, updates: Pick<PieceDraft, "title" | "description">) => void;
  onProcessDraft: (draft: PieceDraft) => void;
  onDeleteDraft: (draftId: string) => void;
  onDeleteCapture: (draftId: string, captureId: string) => void;
}) {
  if (drafts.length === 0) {
    return (
      <View style={styles.stack}>
        <Text style={styles.sectionTitle}>Capture queue is empty</Text>
        <Text style={styles.copy}>Add photos here when you want to photograph first and identify later.</Text>
        <PrimaryButton label="Capture Photos" onPress={onOpenIdentify} />
      </View>
    );
  }

  return (
    <View style={styles.stack}>
      <Text style={styles.sectionTitle}>{drafts.length} piece draft{drafts.length === 1 ? "" : "s"}</Text>
      <PrimaryButton label="Capture New Piece" onPress={onOpenIdentify} />
      {drafts.map((draft) => {
        const primaryCapture = draft.captures.find((capture) => capture.captureId === draft.primaryCaptureId) ?? draft.captures[0];

        return (
          <View key={draft.draftId} style={styles.card}>
            <QueryImagePreview label="Primary photo" uri={primaryCapture?.image.originalUri ?? null} />
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{draft.title}</Text>
              <Text style={styles.statusPill}>{draft.status}</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Piece name</Text>
              <TextInput
                style={styles.input}
                value={draft.title}
                onChangeText={(title) => onUpdateDraft(draft.draftId, { title, description: draft.description })}
                placeholder="Example: gold floral brooch, estate tray 1"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Description / notes</Text>
              <TextInput
                multiline
                style={[styles.input, styles.multilineInput]}
                value={draft.description}
                onChangeText={(description) => onUpdateDraft(draft.draftId, { title: draft.title, description })}
                placeholder="Describe what helps you recognize this piece later."
              />
            </View>
            <Text style={styles.meta}>
              {draft.captures.length} photo{draft.captures.length === 1 ? "" : "s"} attached
            </Text>
            <Text style={styles.meta}>Updated {new Date(draft.updatedAt).toLocaleString()}</Text>
            <View style={styles.photoGrid}>
              {draft.captures.map((capture, index) => (
                <View key={capture.captureId} style={styles.photoThumb}>
                  <Image source={{ uri: capture.image.originalUri }} style={styles.photoThumbImage} resizeMode="cover" />
                  <Text style={styles.photoThumbLabel}>Photo {index + 1}</Text>
                </View>
              ))}
            </View>
            <SecondaryButton
              label={draft.status === "saved" ? "Review Again" : "Identify This Piece"}
              onPress={() => onProcessDraft(draft)}
            />
            <SecondaryButton label="Add Photo To This Piece" onPress={() => onAddPhotoToDraft(draft)} />
            {draft.captures.map((capture, index) => (
              <View key={capture.captureId} style={styles.photoRow}>
                <Text style={styles.meta}>
                  Photo {index + 1}: {capture.angleLabel}
                </Text>
                <DangerButton label="Delete Photo" onPress={() => onDeleteCapture(draft.draftId, capture.captureId)} />
              </View>
            ))}
            <DangerButton label="Delete Piece Draft" onPress={() => onDeleteDraft(draft.draftId)} />
          </View>
        );
      })}
    </View>
  );
}
