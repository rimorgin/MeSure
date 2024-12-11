export interface AppFirstLaunch {
  firstLaunch: boolean;
  showIntro: boolean;
  showCameraIntro: boolean;
  email: string | null;
  setFirstLaunch: () => void;
  hideIntro: () => void;
  hideCameraIntro: () => void;
  setEmailAndFirstLaunch: (email: string) => void;
  resetApp: () => void; // for debugging only
}