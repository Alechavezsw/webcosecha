"use client"

import { ExternalLink, X } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type PdfViewerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  pdfSrc: string
  title: string
}

/** Pista para el visor PDF integrado de Chromium (ajuste al ancho del panel). */
function viewerUrl(src: string): string {
  const hashIdx = src.indexOf("#")
  const base = hashIdx >= 0 ? src.slice(0, hashIdx) : src
  return `${base}#view=FitH`
}

export function PdfViewerDialog({ open, onOpenChange, pdfSrc, title }: PdfViewerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "grid h-[min(92dvh,920px)] max-h-[min(92dvh,920px)] w-[min(100vw-1rem,72rem)] max-w-none translate-x-[-50%] translate-y-[-50%]",
          "grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden border border-border/70 bg-background p-0 shadow-2xl",
          "rounded-xl sm:rounded-2xl",
        )}
      >
        <DialogTitle className="sr-only">PDF — {title}</DialogTitle>

        <div className="flex min-h-12 shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-muted/40 px-4 py-3 sm:px-5">
          <p className="min-w-0 truncate text-sm font-medium text-foreground">{title}</p>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={pdfSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background px-2.5 py-1.5 text-xs font-medium text-foreground/90 transition-colors hover:bg-muted"
            >
              Abrir en pestaña
              <ExternalLink className="size-3.5 opacity-70" aria-hidden />
            </a>
            <DialogClose className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border/80 bg-background text-foreground transition-colors hover:bg-muted">
              <span className="sr-only">Cerrar</span>
              <X className="size-4" aria-hidden />
            </DialogClose>
          </div>
        </div>

        <div className="relative min-h-0 overflow-hidden bg-[#525659]">
          <iframe
            title={title}
            src={viewerUrl(pdfSrc)}
            className="absolute inset-0 block h-full w-full border-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
