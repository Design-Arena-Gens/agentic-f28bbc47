"use client";

import { useEffect, useRef } from "react";

type Source = {
  label: string;
  url: string;
  iosUrl?: string;
};

export interface ModelViewerProps {
  source: Source | null;
  poster?: string;
  arModes: string;
  cameraControls: boolean;
  autoRotate: boolean;
  exposure: number;
  shadowIntensity: number;
}

const ModelViewer = ({
  source,
  poster,
  arModes,
  cameraControls,
  autoRotate,
  exposure,
  shadowIntensity,
}: ModelViewerProps) => {
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    const load = async () => {
      await import("@google/model-viewer");
    };
    load();
  }, []);

  useEffect(() => {
    if (!viewerRef.current) return;
    const viewer = viewerRef.current as HTMLElement & {
      exposure?: number;
      shadowIntensity?: number;
    };
    viewer.exposure = exposure;
    viewer.shadowIntensity = shadowIntensity;
  }, [exposure, shadowIntensity, source]);

  return (
    <div className="model-stage">
      {source ? (
        <model-viewer
          key={source.url}
          ref={viewerRef}
          ar
          ar-modes={arModes}
          src={source.url}
          ios-src={source.iosUrl ?? source.url}
          alt={`${source.label} model`}
          camera-controls={cameraControls ? "" : undefined}
          auto-rotate={autoRotate ? "" : undefined}
          rotation-per-second="180deg"
          interaction-prompt-threshold="2500"
          poster={poster}
          exposure={String(exposure)}
          shadow-intensity={String(shadowIntensity)}
          style={{ width: "100%", height: "100%" }}
        >
          <div slot="progress-bar" className="progress">
            <div className="progress-bar" />
          </div>
        </model-viewer>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            color: "#94a3b8",
            padding: "1.5rem",
            textAlign: "center",
            fontSize: "0.95rem",
          }}
        >
          Load a GLB or USDZ file to preview it here.
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
