import { Event } from 'electron';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: <T>(channel: string, args: T) => void;
        receive: (
          channel: string,
          listener: <
            T extends {
              minimize: boolean;
              name: string;
              windowSize: { width: number; height: number };
              settings: {
                autoStart: boolean;
                onTop: boolean;
                videoNotice: boolean;
              };
            }
          >(
            event: Event,
            args: T
          ) => void
        ) => void;
        invoke: <T>(channel: string, args: T) => void;
        removeListener: (
          channel: string,
          func: <
            T extends {
              minimize: boolean;
              name: string;
              windowSize: { width: number; height: number };
            }
          >(
            args: T
          ) => void
        ) => void;
      };
    };
  }
}

export {};
