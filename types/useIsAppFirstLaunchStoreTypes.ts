export interface AppFirstLaunch {
  firstLaunch: boolean;
  showIntro: boolean;
  email: string | null;
  setFirstLaunch: () => void;
  hideIntro: () => void;
  setEmailAndFirstLaunch: (email: string) => void;
  resetApp: () => void; // for debugging only
}