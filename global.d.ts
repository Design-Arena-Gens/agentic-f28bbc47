declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      src?: string;
      poster?: string;
      "ios-src"?: string;
      ar?: boolean | "true" | "false";
      "ar-modes"?: string;
      "camera-controls"?: boolean | "true" | "false" | string;
      "auto-rotate"?: boolean | "true" | "false" | string;
      alt?: string;
      exposure?: number | string;
      "shadow-intensity"?: number | string;
      "rotation-per-second"?: string;
      "interaction-prompt-threshold"?: string;
      style?: React.CSSProperties;
    };
  }
}
