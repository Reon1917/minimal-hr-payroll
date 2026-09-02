"use client";

import { FlipHorizontal2, FlipVertical2, RotateCw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { drawPhotoCrop, type PhotoTransform } from "@/lib/photo-crop";

export type PhotoEditorLabels = {
  editPhoto: string;
  cropHelp: string;
  zoom: string;
  horizontalPosition: string;
  verticalPosition: string;
  rotate: string;
  flipHorizontal: string;
  flipVertical: string;
  resetPhoto: string;
  usePhoto: string;
  retake: string;
  photoError: string;
  photoLoading: string;
  photoSaving: string;
  cancel: string;
  previewAlt: string;
};

export function PhotoEditor({ file, mirrored, labels, onConfirm, onCancel, onRetake }: {
  file: File;
  mirrored: boolean;
  labels: PhotoEditorLabels;
  onConfirm: (file: File) => void;
  onCancel: () => void;
  onRetake?: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const avatar = useRef<HTMLCanvasElement>(null);
  const alive = useRef(true);
  const [source, setSource] = useState<HTMLImageElement | null>(null);
  const initial: PhotoTransform = { zoom: 1, x: 0, y: 0, rotation: 0, flipX: mirrored, flipY: false };
  const [transform, setTransform] = useState(initial);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    alive.current = true;
    return () => { alive.current = false; element?.close(); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { if (!cancelled) setSource(image); };
    image.onerror = () => { if (!cancelled) setError(true); };
    image.src = url;
    return () => { cancelled = true; URL.revokeObjectURL(url); };
  }, [file]);

  useEffect(() => {
    if (!source || !canvas.current || !avatar.current) return;
    drawPhotoCrop(canvas.current, source, transform);
    drawPhotoCrop(avatar.current, source, transform);
  }, [source, transform]);

  function confirm() {
    if (!source || !canvas.current || saving) return;
    setSaving(true);
    setError(false);
    try {
      drawPhotoCrop(canvas.current, source, transform);
      canvas.current.toBlob((blob) => {
        if (!alive.current) return;
        try {
          if (!blob) throw new Error("Unable to encode photo");
          onConfirm(new File([blob], "employee-photo.jpg", { type: "image/jpeg" }));
        } catch {
          setError(true);
        } finally {
          if (alive.current) setSaving(false);
        }
      }, "image/jpeg", 0.9);
    } catch {
      setError(true);
      setSaving(false);
    }
  }

  return (
    <dialog ref={dialog} className="dialog photo-editor" aria-label={labels.editPhoto} onCancel={(event) => {
      event.preventDefault();
      if (!saving) onCancel();
    }}>
      <div className="dialog-header">
        <h2 className="section-title">{labels.editPhoto}</h2>
        <button type="button" className="icon-button" onClick={onCancel} disabled={saving} aria-label={labels.cancel}><X size={18} /></button>
      </div>
      <div className="photo-editor-body">
        <p className="subtle">{labels.cropHelp}</p>
        <div className="photo-editor-previews">
          <div className="photo-crop-frame">
            <canvas ref={canvas} width={640} height={640} role="img" aria-label={labels.editPhoto} />
            {!source && !error ? <span className="photo-loading" role="status">{labels.photoLoading}</span> : null}
          </div>
          <div className="photo-avatar-preview">
            <canvas ref={avatar} width={160} height={160} role="img" aria-label={labels.previewAlt} />
            <span>{labels.previewAlt}</span>
          </div>
        </div>
        <fieldset className="photo-editor-controls" disabled={!source || saving}>
          <div className="photo-transform-buttons">
            <button type="button" className="button button-secondary button-small" onClick={() => setTransform((value) => ({ ...value, rotation: (value.rotation + (value.flipX !== value.flipY ? 270 : 90)) % 360, x: 0, y: 0 }))}><RotateCw size={16} />{labels.rotate}</button>
            <button type="button" className="button button-secondary button-small" aria-pressed={transform.flipX} onClick={() => setTransform((value) => ({ ...value, flipX: !value.flipX, x: -value.x }))}><FlipHorizontal2 size={16} />{labels.flipHorizontal}</button>
            <button type="button" className="button button-secondary button-small" aria-pressed={transform.flipY} onClick={() => setTransform((value) => ({ ...value, flipY: !value.flipY, y: -value.y }))}><FlipVertical2 size={16} />{labels.flipVertical}</button>
          </div>
          <label className="photo-adjustment"><span>{labels.zoom}</span><input type="range" min="1" max="3" step="0.01" value={transform.zoom} onChange={(event) => setTransform((value) => ({ ...value, zoom: Number(event.target.value) }))} /></label>
          <label className="photo-adjustment"><span>{labels.horizontalPosition}</span><input type="range" min="-100" max="100" step="1" value={transform.x} onChange={(event) => setTransform((value) => ({ ...value, x: Number(event.target.value) }))} /></label>
          <label className="photo-adjustment"><span>{labels.verticalPosition}</span><input type="range" min="-100" max="100" step="1" value={transform.y} onChange={(event) => setTransform((value) => ({ ...value, y: Number(event.target.value) }))} /></label>
          <button type="button" className="button button-ghost button-small" onClick={() => setTransform(initial)}>{labels.resetPhoto}</button>
        </fieldset>
        {error ? <p className="field-error" role="alert">{labels.photoError}</p> : null}
      </div>
      <div className="dialog-actions">
        {onRetake ? <button type="button" className="button button-secondary" disabled={saving} onClick={onRetake}>{labels.retake}</button> : null}
        <button type="button" className="button button-secondary" disabled={saving} onClick={onCancel}>{labels.cancel}</button>
        <button type="button" className="button button-primary" disabled={!source || saving} onClick={confirm}>{saving ? labels.photoSaving : labels.usePhoto}</button>
      </div>
    </dialog>
  );
}
