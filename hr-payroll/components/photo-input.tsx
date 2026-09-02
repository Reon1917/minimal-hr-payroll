/* eslint-disable @next/next/no-img-element -- previews include temporary camera blob URLs */
"use client";

import { Camera, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PhotoEditor, type PhotoEditorLabels } from "@/components/photo-editor";

type PhotoInputLabels = PhotoEditorLabels & {
  photo: string;
  upload: string;
  camera: string;
  cancel: string;
  capture: string;
  cameraLoading: string;
  cameraError: string;
  previewAlt: string;
};

export function PhotoInput({ currentUrl, labels }: { currentUrl?: string | null; labels: PhotoInputLabels }) {
  const [preview, setPreview] = useState(currentUrl ?? "");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<{ file: File; camera: boolean } | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [opening, setOpening] = useState(false);
  const request = useRef(0);
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const previewUrl = useRef<string | null>(null);

  function releasePreviewUrl() {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = null;
  }

  function showFilePreview(file: File) {
    releasePreviewUrl();
    previewUrl.current = URL.createObjectURL(file);
    setPreview(previewUrl.current);
  }

  function stopCamera() {
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    setCameraReady(false);
  }

  useEffect(() => () => {
    request.current += 1;
    stream.current?.getTracks().forEach((track) => track.stop());
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
  }, []);

  useEffect(() => {
    if (!cameraOpen || !video.current || !stream.current) return;
    video.current.srcObject = stream.current;
    void video.current.play().catch(() => setError(labels.cameraError));
  }, [cameraOpen, labels.cameraError]);

  async function openCamera() {
    if (opening) return;
    const currentRequest = ++request.current;
    setOpening(true);
    try {
      setError("");
      setCameraReady(false);
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      if (currentRequest !== request.current) {
        media.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = media;
      setCameraOpen(true);
    } catch {
      if (currentRequest !== request.current) return;
      stopCamera();
      setError(labels.cameraError);
    } finally {
      if (currentRequest === request.current) setOpening(false);
    }
  }

  function closeCamera() {
    request.current += 1;
    stopCamera();
    setCameraOpen(false);
    setCapturing(false);
  }

  function capture() {
    const source = video.current;
    const target = canvas.current;
    if (!source || !target || capturing || !cameraReady || !source.videoWidth || !source.videoHeight) return;
    // Preserve the full frame: cropping and mirroring are reversible in the editor.
    target.width = source.videoWidth;
    target.height = source.videoHeight;
    const context = target.getContext("2d");
    if (!context) return;
    context.drawImage(source, 0, 0);
    setCapturing(true);
    const currentRequest = request.current;
    target.toBlob((blob) => {
      if (currentRequest !== request.current) return;
      setCapturing(false);
      if (!blob) { setError(labels.photoError); return; }
      const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
      closeCamera();
      setDraft({ file, camera: true });
    }, "image/jpeg", 0.95);
  }

  function confirmPhoto(file: File) {
    if (!fileInput.current) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    fileInput.current.files = transfer.files;
    showFilePreview(file);
    setDraft(null);
    setError("");
  }

  return (
    <div className="photo-input">
      <div className="photo-preview">
        {preview ? <img src={preview} alt={labels.previewAlt} /> : <Camera size={26} />}
      </div>
      <div>
        <span className="label">{labels.photo}</span>
        <div className="photo-actions">
          <label className="button button-secondary button-small">
            <Upload size={15} />
            {labels.upload}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) { setError(""); setDraft({ file, camera: false }); }
                event.target.value = "";
              }}
            />
          </label>
          <button type="button" className="button button-secondary button-small" disabled={opening} onClick={openCamera}>
            <Camera size={15} />
            {opening ? labels.cameraLoading : labels.camera}
          </button>
        </div>
        {error ? <div className="field-error" role="alert">{error}</div> : null}
      </div>
      {/* Only a confirmed, edited image is ever submitted with the employee form. */}
      <input ref={fileInput} name="photo" type="file" hidden />
      <canvas ref={canvas} hidden />
      {draft ? <PhotoEditor file={draft.file} mirrored={draft.camera} labels={labels} onConfirm={confirmPhoto} onCancel={() => setDraft(null)} onRetake={draft.camera ? () => { setDraft(null); void openCamera(); } : undefined} /> : null}
      {cameraOpen ? (
        <div className="dialog-backdrop">
          <div className="dialog camera-dialog" role="dialog" aria-modal="true" aria-label={labels.camera}>
            <div className="dialog-header">
              <h2 className="section-title">{labels.camera}</h2>
              <button type="button" className="icon-button" onClick={closeCamera} aria-label={labels.cancel}>
                <X size={18} />
              </button>
            </div>
            <div className="camera-viewport">
              <video ref={video} muted playsInline onCanPlay={() => setCameraReady(true)} />
              {!cameraReady ? <span>{labels.cameraLoading}</span> : null}
            </div>
            <div className="dialog-actions">
              <button type="button" className="button button-secondary" onClick={closeCamera}>{labels.cancel}</button>
              <button type="button" className="button button-primary" onClick={capture} disabled={!cameraReady || capturing}>
                <Camera size={16} />
                {labels.capture}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
