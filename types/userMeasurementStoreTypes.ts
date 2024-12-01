export interface FingerMeasurements {
  thumb: string;
  index: string;
  middle: string;
  ring: string;
  pinky: string;
}
// Create the Zustand store
export interface UserMeasurementStorage {
  fingerMeasurements: FingerMeasurements;
  wristMeasurement: string;
  fetchMeasurements: (measurements: any) => Promise<void>;
  setFingerMeasurements: (userId: string, measurements: FingerMeasurements) => Promise<void>;
  setWristMeasurement: (userId: string, size: string) => Promise<void>;
  resetMeasurements: () => void;
}