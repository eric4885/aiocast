"use client";

import { useEffect, useId, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TranscriptHighlight } from "@/lib/transcript-segments";

type SavePickerWindow = Window &
  typeof globalThis & {
    showSaveFilePicker?: (options: {
      suggestedName?: string;
      types?: Array<{ description?: string; accept: Record<string, string[]> }>;
    }) => Promise<{ createWritable: () => Promise<{ write: (data: string) => Promise<void>; close: () => Promise<void> }> }>;
  };

async function saveSrtWithPicker(srt: string, suggestedName: string): Promise<boolean> {
  const win = window as SavePickerWindow;
  if (!win.showSaveFilePicker) return false;
  try {
    const handle = await win.showSaveFilePicker({
      suggestedName,
      types: [{ description: "SubRip subtitles", accept: { "text/plain": [".srt"] } }],
    });
    const writable = await handle.createWritable();
    await writable.write(`\uFEFF${srt}`);
    await writable.close();
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return true;
    return false;
  }
}

export function SrtDownloadSection({
  liveSrt,
  packId,
  token,
  liveHighlights,
  onCopy,
  copyToast,
}: {
  liveSrt: string;
  packId: string;
  token: string | null;
  liveHighlights: TranscriptHighlight[];
  onCopy: (text: string, label: string) => void;
  copyToast: string | null;
}) {
  const textareaId = useId();
  const [srtBlobUrl, setSrtBlobUrl] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [showFullSrt, setShowFullSrt] = useState(false);
  const filename = `aiocast-pack-${packId.slice(0, 8)}.srt`;
  const serverHref =
    token != null
      ? `/api/pack-srt?id=${encodeURIComponent(packId)}&token=${encodeURIComponent(token)}&t=${Date.now()}`
      : null;

  useEffect(() => {
    if (!liveSrt.trim()) {
      setSrtBlobUrl(null);
      return;
    }
    const blob = new Blob([`\uFEFF${liveSrt}`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    setSrtBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [liveSrt]);

  const runDownload = async () => {
    setDownloadError(null);
    if (!liveSrt.trim()) {
      setDownloadError("No SRT content to download.");
      return;
    }

    const saved = await saveSrtWithPicker(liveSrt, filename);
    if (saved) return;

    if (srtBlobUrl) {
      const anchor = document.createElement("a");
      anchor.href = srtBlobUrl;
      anchor.download = filename;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      return;
    }

    setDownloadError("Download failed — expand full SRT below, copy, and save as .srt in Notepad.");
  };

  const srtPreview = liveSrt.split("\n").slice(0, 9).join("\n");

  return (
    <>
      <p className="font-semibold">SRT and highlights</p>
      <p className="text-xs text-muted-foreground">
        Built from your transcript with estimated timestamps. Use Save / Download below — the file matches Copy SRT.
      </p>
      {liveSrt ? (
        <>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => void runDownload()}>
              <Download className="mr-2 h-4 w-4" /> Save SRT file
            </Button>
            {srtBlobUrl ? (
              <Button variant="secondary" asChild>
                <a href={srtBlobUrl} download={filename} rel="noopener">
                  <Download className="mr-2 h-4 w-4" /> Direct download link
                </a>
              </Button>
            ) : null}
            {serverHref ? (
              <Button size="sm" variant="secondary" asChild>
                <a href={serverHref} download={filename} rel="noopener noreferrer">
                  Server file
                </a>
              </Button>
            ) : null}
            <Button size="sm" variant="secondary" onClick={() => onCopy(liveSrt, "SRT")}>
              <Copy className="mr-2 h-4 w-4" />
              {copyToast === "SRT" ? "Copied" : "Copy SRT"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Tip: On Chrome/Edge, &quot;Save SRT file&quot; opens a Save dialog so you pick the folder. If Windows keeps
            opening an old subtitle, save with a new name or use the full SRT box below.
          </p>
          {downloadError && (
            <p className="text-sm text-rose-300" role="alert">
              {downloadError}
            </p>
          )}
          <pre className="max-h-32 overflow-auto rounded-lg border border-border bg-background/40 p-3 text-xs text-muted-foreground whitespace-pre-wrap">
            {srtPreview}
            {liveSrt.length > srtPreview.length ? "\n…" : ""}
          </pre>
          <button
            type="button"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            onClick={() => setShowFullSrt((v) => !v)}
          >
            {showFullSrt ? "Hide full SRT" : "Show full SRT (manual save)"}
          </button>
          {showFullSrt && (
            <div className="space-y-2">
              <label htmlFor={textareaId} className="text-xs text-muted-foreground">
                Select all → copy → paste into Notepad → Save as <strong>{filename}</strong>
              </label>
              <textarea
                id={textareaId}
                readOnly
                value={liveSrt}
                className="min-h-48 w-full rounded-lg border border-border bg-background/40 p-3 font-mono text-xs text-muted-foreground"
              />
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">No SRT — transcript too short to segment.</p>
      )}
      {liveHighlights.length > 0 ? (
        liveHighlights.map((h, index) => (
          <p key={`${h.title}-${index}`} className="text-sm text-muted-foreground">
            {h.title}: {h.start}-{h.end} ({h.note})
          </p>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No highlights — add more transcript text to extract clips.</p>
      )}
    </>
  );
}
