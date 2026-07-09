import * as ImagePicker from "expo-image-picker";
import { LocalQueryImage } from "../types";

export type MediaSelectionResult =
  | { status: "selected"; image: LocalQueryImage }
  | { status: "canceled" }
  | { status: "denied"; message: string };

export async function takeQueryPhoto(): Promise<MediaSelectionResult> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    return {
      status: "denied",
      message: "Camera access is denied. Enable camera permission in Settings, or import a photo from your library.",
    };
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    exif: false,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.92,
  });

  if (result.canceled) {
    return { status: "canceled" };
  }

  return { status: "selected", image: createLocalQueryImage(result.assets[0], "camera") };
}

export async function importQueryPhoto(): Promise<MediaSelectionResult> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    return {
      status: "denied",
      message: "Photo library access is denied. Enable photo access in Settings, or take a new photo with the camera.",
    };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    exif: false,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.92,
    selectionLimit: 1,
  });

  if (result.canceled) {
    return { status: "canceled" };
  }

  return { status: "selected", image: createLocalQueryImage(result.assets[0], "library") };
}

export function createMockCrop(image: LocalQueryImage): NonNullable<LocalQueryImage["crop"]> {
  return {
    x: Math.round(image.width * 0.19),
    y: Math.round(image.height * 0.16),
    width: Math.round(image.width * 0.62),
    height: Math.round(image.height * 0.66),
  };
}

function createLocalQueryImage(asset: ImagePicker.ImagePickerAsset, source: LocalQueryImage["source"]): LocalQueryImage {
  return {
    localUri: asset.uri,
    width: asset.width ?? 0,
    height: asset.height ?? 0,
    source,
    capturedAt: new Date().toISOString(),
    crop: null,
  };
}
