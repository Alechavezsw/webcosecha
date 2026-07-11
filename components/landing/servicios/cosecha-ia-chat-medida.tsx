"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react"
import {
  ArrowUpIcon,
  CircleUserRound,
  Database,
  FileUp,
  MessageCircle,
  MonitorIcon,
  Paperclip,
  PlusIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface UseAutoResizeTextareaProps {
  minHeight: number
  maxHeight?: number
}

function useAutoResizeTextarea({ minHeight, maxHeight }: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current
      if (!textarea) return

      if (reset) {
        textarea.style.height = `${minHeight}px`
        return
      }

      textarea.style.height = `${minHeight}px`
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      )
      textarea.style.height = `${newHeight}px`
    },
    [minHeight, maxHeight]
  )

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = `${minHeight}px`
    }
  }, [minHeight])

  useEffect(() => {
    const handleResize = () => adjustHeight()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [adjustHeight])

  return { textareaRef, adjustHeight }
}

export function CosechaIaChatMedida() {
  const [value, setValue] = useState("")
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  })

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) {
        setValue("")
        adjustHeight(true)
      }
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-8 p-4">
      <div className="text-center">
        <h2 className="font-display text-3xl font-semibold leading-tight text-white md:text-4xl">
          Chats a medida para tu negocio
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-white/55 md:text-lg">
          Contanos canal, tipo de consultas y herramientas que ya usás. Diseñamos asistentes alineados a tu marca: WhatsApp,
          web, bases de conocimiento y derivación a tu equipo.
        </p>
      </div>

      <div className="w-full">
        <div className="relative rounded-xl border border-white/10 bg-neutral-900/90">
          <div className="overflow-y-auto">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                adjustHeight()
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ej.: bot en WhatsApp con precios y horarios, widget en la web, FAQs desde tu manual interno…"
              rows={1}
              className={cn(
                "min-h-[60px] w-full resize-none border-none bg-transparent px-4 py-3 text-sm text-white",
                "placeholder:text-sm placeholder:text-neutral-500",
                "focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              )}
              style={{ overflow: "hidden" }}
            />
          </div>

          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="group flex items-center gap-1 rounded-lg p-2 transition-colors hover:bg-neutral-800"
              >
                <Paperclip className="size-4 text-white" aria-hidden />
                <span className="hidden text-xs text-zinc-400 transition-opacity group-hover:inline">Adjuntar</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center justify-between gap-1 rounded-lg border border-dashed border-zinc-700 px-2 py-1 text-sm text-zinc-400 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
              >
                <PlusIcon className="size-4" aria-hidden />
                Brief
              </button>
              <button
                type="button"
                className={cn(
                  "flex items-center justify-between gap-1 rounded-lg border border-zinc-700 px-1.5 py-1.5 text-sm transition-colors hover:border-zinc-600 hover:bg-zinc-800",
                  value.trim() ? "bg-white text-black" : "text-zinc-400"
                )}
              >
                <ArrowUpIcon
                  className={cn("size-4", value.trim() ? "text-black" : "text-zinc-400")}
                  aria-hidden
                />
                <span className="sr-only">Enviar</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:gap-3">
          <ActionButton icon={<MessageCircle className="size-4" />} label="Canal WhatsApp" />
          <ActionButton icon={<MonitorIcon className="size-4" />} label="Chat en tu web" />
          <ActionButton icon={<FileUp className="size-4" />} label="Docs y brief" />
          <ActionButton icon={<Database className="size-4" />} label="Base de conocimiento" />
          <ActionButton icon={<CircleUserRound className="size-4" />} label="Derivación a equipo" />
        </div>
      </div>
    </div>
  )
}

interface ActionButtonProps {
  icon: ReactNode
  label: string
}

function ActionButton({ icon, label }: ActionButtonProps) {
  return (
    <button
      type="button"
      className="flex shrink-0 items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white md:px-4 md:text-sm"
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
