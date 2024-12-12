import { FingerMeasurements } from "@/types/userMeasurementStoreTypes";

export const convertToUSRingSizeUsingGuide = (mm: number): string => {
  const minus = mm - 0.5
  const baseSize = 3;
  const baseWidth = 14;
  const incrementPerHalfSize = 0.4;

  const size = (minus - baseWidth) / incrementPerHalfSize / 2 + baseSize;
  const roundedSize = Math.round(size * 2) / 2;

  if (roundedSize < 3 && roundedSize > 13.5) {
    return 'invalid';
  }

  return roundedSize.toFixed(1);
};


export const convertAllToUSRingSizesUsingGuide = (measurements: FingerMeasurements): FingerMeasurements => {
  // Convert each finger measurement to its US size
  return {
    thumb: convertToUSRingSizeUsingGuide(parseFloat(measurements.thumb)),
    index: convertToUSRingSizeUsingGuide(parseFloat(measurements.index)),
    middle: convertToUSRingSizeUsingGuide(parseFloat(measurements.middle)),
    ring: convertToUSRingSizeUsingGuide(parseFloat(measurements.ring)),
    pinky: convertToUSRingSizeUsingGuide(parseFloat(measurements.pinky)),
  };
};
