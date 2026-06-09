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

function timestampedName(packId: string, ext: "srt" | "txt") {
  return `aiocast-pack-${packId.slice(0, 8)}-${Date.now()}.${ext}`;
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

function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([`\uFEFF${content}`], { type: "text/plain;charset=utf-8" });
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

function downloadSrtBlob(srt: string, filename: string) {
  downloadTextFile(srt, filename);
}

function firstCueLine(srt: string): string {
  const lines = srt.split("\n").map((l) => l.trim());
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("-->") && lines[i + 1]) return lines[i + 1];
  }
  return "";
}

function usageReadme(packId: string, firstLine: string): string {
  return `AioCast subtitle file — pack ${packId.slice(0, 8)}

IMPORTANT: .srt files contain TEXT and TIMESTAMPS only. They do NOT contain audio.

If double-clicking .srt on Windows opens VLC or a media player, the player may show
subtitles from a DIFFERENT file you opened earlier. That is normal player behavior,
not a bad download.

VERIFY TEXT (always works)
1. Right-click the .srt file → Open with → Notepad
2. First subtitle line should start with:
   ${firstLine || "(see your pack preview on AioCast)"}

USE WITH YOUR PODCAST AUDIO (VLC)
1. Open VLC → Media → Open File → select YOUR episode audio/video
2. Subtitle → Add Subtitle File → pick this .srt
3. You should see captions from this pack, synced to your media

USE IN AN EDITOR (CapCut, Premiere, DaVinci)
1. Import your episode audio/video
2. Import this .srt as a subtitle/caption track (do not double-click from Explorer)

WINDOWS DEFAULT (optional)
Settings → Apps → Default apps → choose defaults by file type → .srt → Notepad
(so double-click shows text, not a media player)

Timestamps are estimated when you paste show notes. Upload audio on AioCast for
transcription-based timing on future packs.
`;
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
  const [showAudioGuide, setShowAudioGuide] = useState(false);

  const runDownload = async (ext: "srt" | "txt") => {
    setDownloadError(null);
    if (!liveSrt.trim()) {
      setDownloadError("No SRT content to download.");
      return;
    }

    const filename = timestampedName(packId, ext);
    if (ext === "srt") {
      const saved = await saveSrtWithPicker(liveSrt, filename);
      if (saved) return;
    }

    try {
      downloadSrtBlob(liveSrt, filename);
    } catch {
      setDownloadError("Download failed — expand full SRT below, copy, and save in Notepad.");
    }
  };

  const srtPreview = liveSrt.split("\n").slice(0, 9).join("\n");
  const cueOne = firstCueLine(liveSrt);

  return (
    <>
      <p className="font-semibold">SRT and highlights</p>
      <p className="text-xs text-muted-foreground">
        Built from your transcript with estimated timestamps. Save and Copy use the same content.
      </p>
      {liveSrt ? (
        <>
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs text-sky-100">
            <p className="font-medium">SRT is text only — no audio inside the file</p>
            <p className="mt-1 text-sky-100/90">
              Double-clicking <strong>.srt</strong> on Windows often opens a media player. The player then shows
              captions from <strong>whatever audio/video you last played</strong>, not text stored inside an old
              test file. Your download is fine if Notepad / Copy SRT / the preview below match.
            </p>
            {cueOne && (
              <p className="mt-2 text-sky-100/90">
                <span className="font-medium">Notepad check:</span> first caption line should be{" "}
                <span className="italic">&quot;{cueOne.length > 72 ? `${cueOne.slice(0, 69)}…` : cueOne}&quot;</span>
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => void runDownload("srt")}>
              <Download className="mr-2 h-4 w-4" /> Save SRT file
            </Button>
            <Button size="sm" variant="secondary" onClick={() => void runDownload("txt")}>
              <Download className="mr-2 h-4 w-4" /> Save as .txt
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                downloadTextFile(
                  usageReadme(packId, cueOne),
                  `aiocast-subtitle-guide-${packId.slice(0, 8)}.txt`,
                )
              }
            >
              <Download className="mr-2 h-4 w-4" /> Usage guide
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onCopy(liveSrt, "SRT")}>
              <Copy className="mr-2 h-4 w-4" />
              {copyToast === "SRT" ? "Copied" : "Copy SRT"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            To verify: use <strong>Save as .txt</strong> or Notepad. To use with your episode: load{" "}
            <strong>your audio first</strong>, then attach this subtitle file (see guide).
          </p>
          <button
            type="button"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            onClick={() => setShowAudioGuide((v) => !v)}
          >
            {showAudioGuide ? "Hide" : "Show"} how to open SRT with your podcast audio
          </button>
          {showAudioGuide && (
            <ol className="list-decimal space-y-1 pl-5 text-xs text-muted-foreground">
              <li>
                <strong>VLC:</strong> Media → Open File (your episode) → Subtitle → Add Subtitle File → pick this
                .srt
              </li>
              <li>
                <strong>CapCut / Premiere / DaVinci:</strong> import your audio/video, then import subtitles from file
                — do not rely on double-click in Downloads
              </li>
              <li>
                <strong>Windows default (optional):</strong> Settings → Apps → Default apps → .srt → Notepad
              </li>
              <li>
                Timestamps are <strong>estimated</strong> for pasted notes. Upload audio on the tool page for
                transcription-based timing.
              </li>
            </ol>
          )}
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
