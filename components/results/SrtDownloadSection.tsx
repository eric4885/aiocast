"use client";

import { useId, useState } from "react";
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

function timestampedName(packId: string): string {
  return `aiocast-pack-${packId.slice(0, 8)}-${Date.now()}.srt`;
}

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

function downloadSrtBlob(srt: string, filename: string) {
  const blob = new Blob([`\uFEFF${srt}`], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function SrtDownloadSection({
  liveSrt,
  packId,
  liveHighlights,
  onCopy,
  copyToast,
}: {
  liveSrt: string;
  packId: string;
  liveHighlights: TranscriptHighlight[];
  onCopy: (text: string, label: string) => void;
  copyToast: string | null;
}) {
  const textareaId = useId();
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [showFullSrt, setShowFullSrt] = useState(false);

  const runDownload = async () => {
    setDownloadError(null);
    if (!liveSrt.trim()) {
      setDownloadError("No SRT content to download.");
      return;
    }

    const filename = timestampedName(packId);
    const saved = await saveSrtWithPicker(liveSrt, filename);
    if (saved) return;

    try {
      downloadSrtBlob(liveSrt, filename);
    } catch {
      setDownloadError("Download failed — expand full SRT below, copy, and save as .srt in Notepad.");
    }
  };

  const srtPreview = liveSrt.split("\n").slice(0, 9).join("\n");

  return (
    <>
      <p className="font-semibold">SRT and highlights</p>
      <p className="text-xs text-muted-foreground">
        Built from your transcript with estimated timestamps. Save and Copy use the same content.
      </p>
      {liveSrt ? (
        <>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => void runDownload()}>
              <Download className="mr-2 h-4 w-4" /> Save SRT file
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onCopy(liveSrt, "SRT")}>
              <Copy className="mr-2 h-4 w-4" />
              {copyToast === "SRT" ? "Copied" : "Copy SRT"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Both buttons use the preview text below. Open the newest timestamped file in Downloads — not an older
            .srt from a previous audio test.
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
                Select all → copy → paste into Notepad → Save as .srt
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
