import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { LocalQueryImage } from "../types";

const maxUploadDimension = 1600;
const uploadCompressionQuality = 0.82;

export type MediaSelectionResult =
  | { status: "selected"; image: LocalQueryImage }
  | { status: "canceled"; message: string }
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
    return { status: "canceled", message: "Camera was closed before a photo was selected." };
  }

  return { status: "selected", image: await createLocalQueryImage(result.assets[0], "camera") };
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
    return { status: "canceled", message: "Photo import was canceled before an image was selected." };
  }

  return { status: "selected", image: await createLocalQueryImage(result.assets[0], "library") };
}

export function createMockCrop(image: LocalQueryImage): NonNullable<LocalQueryImage["crop"]> {
  return {
    x: Math.round(image.width * 0.19),
    y: Math.round(image.height * 0.16),
    width: Math.round(image.width * 0.62),
    height: Math.round(image.height * 0.66),
  };
}

async function createLocalQueryImage(asset: ImagePicker.ImagePickerAsset, source: LocalQueryImage["source"]): Promise<LocalQueryImage> {
  const originalWidth = asset.width ?? 0;
  const originalHeight = asset.height ?? 0;
  const resizeAction = createResizeAction(originalWidth, originalHeight);
  const uploadAsset = await ImageManipulator.manipulateAsync(asset.uri, resizeAction ? [resizeAction] : [], {
    compress: uploadCompressionQuality,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  return {
    localUri: uploadAsset.uri,
    originalUri: asset.uri,
    width: uploadAsset.width,
    height: uploadAsset.height,
    originalWidth,
    originalHeight,
    compressionQuality: uploadCompressionQuality,
    resizedForUpload: Boolean(resizeAction),
    source,
    capturedAt: new Date().toISOString(),
    crop: null,
  };
}

function createResizeAction(width: number, height: number): ImageManipulator.ActionResize | null {
  if (!width || !height || Math.max(width, height) <= maxUploadDimension) {
    return null;
  }

  if (width >= height) {
    return { resize: { width: maxUploadDimension } };
  }

  return { resize: { height: maxUploadDimension } };
}
