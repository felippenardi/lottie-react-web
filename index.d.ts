declare module "lottie-react-web" {
  import * as React from "react";
  import { AnimationConfig } from "lottie-web";

  export interface LottieOptions {
    animationData: any;
    loop?: boolean;
    autoplay?: boolean;
    rendererSettings?: AnimationConfig["rendererSettings"];
  }

  export interface LottieEventListener {
    eventName: string;
    callback: () => void;
  }

  export interface LottileAnimationControl {
    [property: string]: [number, number];
  }

  export interface LottieProps {
    options: LottieOptions;
    animationControl?: LottileAnimationControl;
    height?: string | number;
    width?: string | number;
    isStopped?: boolean;
    isPaused?: boolean;
    speed?: number;
    segments?: number[];
    forceSegments?: boolean;
    direction?: 1 | -1;
    ariaRole?: string;
    ariaLabel?: string;
    title?: string;

    // Not documented
    style?: React.CSSProperties;
    eventListeners?: LottieEventListener[];
  }

  export default class Lottie extends React.Component<LottieProps> {}
}
