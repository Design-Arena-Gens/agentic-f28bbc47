"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ModelViewer from "@/components/ModelViewer";

type Source = {
  label: string;
  url: string;
  iosUrl?: string;
};

const SAMPLE_MODELS: Source[] = [
  {
    label: "Astronaut",
    url: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    iosUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.usdz",
  },
  {
    label: "Vintage Camera",
    url: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    iosUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.usdz",
  },
  {
    label: "Terrarium",
    url: "https://modelviewer.dev/shared-assets/models/ShopifyModels/terrarium/Terrarium.glb",
    iosUrl: "https://modelviewer.dev/shared-assets/models/ShopifyModels/terrarium/Terrarium.usdz",
  },
];

type FileBuffers = {
  glb?: string;
  usdz?: string;
};

const createSource = ({ glb, usdz }: FileBuffers): Source | null => {
  if (!glb && !usdz) return null;
  const label = "Local Upload";
  if (glb) {
    return {
      label,
      url: glb,
      iosUrl: usdz ?? glb,
    };
  }
  return {
    label,
    url: usdz!,
    iosUrl: usdz,
  };
};

export default function HomePage() {
  const [selectedSource, setSelectedSource] = useState<Source | null>(
    SAMPLE_MODELS[0]
  );
  const [modelUrl, setModelUrl] = useState<string>(SAMPLE_MODELS[0].url);
  const [iosUrl, setIosUrl] = useState<string>(SAMPLE_MODELS[0].iosUrl ?? "");
  const [arModes, setArModes] = useState<string>("webxr scene-viewer quick-look");
  const [cameraControls, setCameraControls] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [exposure, setExposure] = useState(1);
  const [shadowIntensity, setShadowIntensity] = useState(1);
  const [fileBuffers, setFileBuffers] = useState<FileBuffers>({});

  const glbInputRef = useRef<HTMLInputElement>(null);
  const usdzInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);

  const currentSource = useMemo(() => {
    if (fileBuffers.glb || fileBuffers.usdz) {
      return createSource(fileBuffers);
    }
    if (selectedSource) {
      return selectedSource;
    }
    if (modelUrl) {
      return {
        label: "Custom URL",
        url: modelUrl,
        iosUrl: iosUrl || modelUrl,
      };
    }
    return null;
  }, [fileBuffers, selectedSource, modelUrl, iosUrl]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleLoadCustom = useCallback(() => {
    if (!modelUrl) return;
    setSelectedSource(null);
    setFileBuffers({});
  }, [modelUrl]);

  const handleSelectSample = useCallback((source: Source) => {
    setSelectedSource(source);
    setModelUrl(source.url);
    setIosUrl(source.iosUrl ?? "");
    setFileBuffers({});
  }, []);

  const handleFile = useCallback(
    async (type: "glb" | "usdz", fileList: FileList | null) => {
      if (!fileList?.length) return;
      const file = fileList[0];
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.push(url);
      setFileBuffers((prev) => {
        const updated = { ...prev, [type]: url };
        if (type === "glb" && !updated.usdz) {
          setIosUrl("");
        }
        return updated;
      });
      setSelectedSource(null);
      setModelUrl("");
    },
    []
  );

  const resetUploads = useCallback(() => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];
    setFileBuffers({});
    if (glbInputRef.current) glbInputRef.current.value = "";
    if (usdzInputRef.current) usdzInputRef.current.value = "";
  }, []);

  return (
    <main>
      <div className="container">
        <div className="badges">
          <span className="badge">AR Ready</span>
          <span className="badge">GLB + USDZ</span>
          <span className="badge">WebXR</span>
        </div>

        <h1>Spatial Viewer for GLB & USDZ</h1>
        <p>
          Load 3D assets via presets, direct URLs, or local uploads and preview
          them instantly in the browser or launch full augmented reality on
          supported devices.
        </p>

        <div className="grid">
          <div className="panel">
            <section className="card">
              <h2>Load a Model</h2>
              <div className="samples">
                {SAMPLE_MODELS.map((sample) => (
                  <button
                    key={sample.label}
                    className="sample-item"
                    onClick={() => handleSelectSample(sample)}
                    type="button"
                  >
                    <span className="sample-thumb">{sample.label[0]}</span>
                    <span>{sample.label}</span>
                  </button>
                ))}
              </div>

              <div className="card">
                <label>
                  Remote GLB / USDZ URL
                  <input
                    type="url"
                    placeholder="https://example.com/model.glb"
                    value={modelUrl}
                    onChange={(event) => setModelUrl(event.target.value)}
                  />
                </label>
                <label>
                  Optional iOS USDZ URL
                  <input
                    type="url"
                    placeholder="https://example.com/model.usdz"
                    value={iosUrl}
                    onChange={(event) => setIosUrl(event.target.value)}
                  />
                </label>
                <div className="url-actions">
                  <button type="button" onClick={handleLoadCustom}>
                    Load from URL
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      setModelUrl("");
                      setIosUrl("");
                      setSelectedSource(null);
                    }}
                  >
                    Clear URL
                  </button>
                </div>
              </div>

              <div className="card">
                <label>
                  Upload GLB
                  <input
                    ref={glbInputRef}
                    type="file"
                    accept=".glb"
                    onChange={(event) => handleFile("glb", event.target.files)}
                  />
                </label>
                <label>
                  Upload USDZ
                  <input
                    ref={usdzInputRef}
                    type="file"
                    accept=".usdz"
                    onChange={(event) => handleFile("usdz", event.target.files)}
                  />
                </label>
                {(fileBuffers.glb || fileBuffers.usdz) && (
                  <button type="button" className="secondary" onClick={resetUploads}>
                    Remove uploads
                  </button>
                )}
              </div>
            </section>

            <section className="card">
              <h2>Viewer Controls</h2>
              <div className="settings-grid">
                <label>
                  AR Modes
                  <input
                    type="text"
                    value={arModes}
                    onChange={(event) => setArModes(event.target.value)}
                  />
                </label>
                <label>
                  Exposure: {exposure.toFixed(2)}
                  <input
                    type="range"
                    min={0.1}
                    max={2.5}
                    step={0.05}
                    value={exposure}
                    onChange={(event) => setExposure(Number(event.target.value))}
                  />
                </label>
                <label>
                  Shadow Intensity: {shadowIntensity.toFixed(2)}
                  <input
                    type="range"
                    min={0}
                    max={2}
                    step={0.05}
                    value={shadowIntensity}
                    onChange={(event) =>
                      setShadowIntensity(Number(event.target.value))
                    }
                  />
                </label>
              </div>
              <div className="checkbox-row">
                <input
                  id="camera-controls"
                  type="checkbox"
                  checked={cameraControls}
                  onChange={(event) => setCameraControls(event.target.checked)}
                />
                <label htmlFor="camera-controls">Enable camera orbit controls</label>
              </div>
              <div className="checkbox-row">
                <input
                  id="auto-rotate"
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(event) => setAutoRotate(event.target.checked)}
                />
                <label htmlFor="auto-rotate">Auto rotate model</label>
              </div>
            </section>
          </div>

          <div className="panel">
            <section className="card">
              <h2>Live Preview</h2>
              <ModelViewer
                source={currentSource}
                poster={undefined}
                arModes={arModes}
                cameraControls={cameraControls}
                autoRotate={autoRotate}
                exposure={exposure}
                shadowIntensity={shadowIntensity}
              />
              <div className="url-actions">
                {currentSource?.url && (
                  <a
                    href={currentSource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="button secondary"
                  >
                    Open GLB
                  </a>
                )}
                {currentSource?.iosUrl && (
                  <a
                    href={currentSource.iosUrl}
                    rel="noreferrer"
                    className="button"
                  >
                    Open in AR
                  </a>
                )}
              </div>
            </section>
            <section className="card">
              <h2>Tips</h2>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", display: "grid", gap: "0.4rem" }}>
                <li>Use Safari on iOS to launch Quick Look with USDZ files.</li>
                <li>
                  On Android, WebXR Scene Viewer opens when using the AR button in
                  the preview.
                </li>
                <li>
                  Provide both GLB and USDZ for best cross-platform AR support.
                </li>
                <li>
                  Adjust exposure and shadows to match your scene lighting
                  conditions.
                </li>
              </ul>
            </section>
          </div>
        </div>

        <footer>
          <span>Powered by &lt;model-viewer&gt; and Next.js</span>
          <a
            href="https://github.com/google/model-viewer"
            target="_blank"
            rel="noreferrer"
          >
            Docs ↗
          </a>
        </footer>
      </div>
    </main>
  );
}
