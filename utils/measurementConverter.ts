import { FingerMeasurements } from "@/types/userMeasurementStoreTypes";

export const convertToUSRingSizeUsingGuide = (mm: number): string => {
  // Start at size 3 with 14 mm, increment by 0.4 mm for each half-size
  const baseSize = 3;
  const baseWidth = 14;
  const incrementPerHalfSize = 0.4;

  // Calculate the approximate size
  const size = (mm - baseWidth) / incrementPerHalfSize / 2 + baseSize;

  // Round to the nearest half size (0.5 increments)
  const roundedSize = Math.round(size * 2) / 2;

  // Valid size range check (sizes 3 to 13.5)
  if (roundedSize < 3 || roundedSize > 13.5) {
    return 'Invalid size';
  }

  return roundedSize.toFixed(1); // Convert to string with one decimal place
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
