"use client"

import { useState } from "react"
import {
  CheckCircle2,
  Circle,
  CircleAlert,
  CircleDotDashed,
  CircleX,
} from "lucide-react"
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion"

interface Subtask {
  id: string
  title: string
  description: string
  status: string
  priority: string
  tools?: string[]
}

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  level: number
  dependencies: string[]
  subtasks: Subtask[]
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Captación y primer contacto",
    description:
      "El agente recibe consultas, clasifica intención y responde con el tono de tu marca las 24 h.",
    status: "in-progress",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [
      {
        id: "1.1",
        title: "Saludo y triage de leads",
        description: "Filtra spammers, detecta urgencia y deriva a humanos solo cuando hace falta.",
        status: "completed",
        priority: "high",
        tools: ["WhatsApp Business", "Formulario web"],
      },
      {
        id: "1.2",
        title: "Respuestas con contexto",
        description: "Usa precios, stock y FAQs sincronizados para no inventar datos.",
        status: "in-progress",
        priority: "medium",
        tools: ["Base de conocimiento", "Hoja de precios"],
      },
      {
        id: "1.3",
        title: "Agenda y seguimiento",
        description: "Propone turnos, envía recordatorios y deja el historial en el CRM.",
        status: "need-help",
        priority: "medium",
        tools: ["Calendario", "CRM"],
      },
    ],
  },
  {
    id: "2",
    title: "Backoffice sin trabajo repetido",
    description: "Tareas que antes copiabas entre sistemas: ahora las ejecuta el agente con reglas claras.",
    status: "in-progress",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [
      {
        id: "2.1",
        title: "Sincronizar pedidos y clientes",
        description: "Lee pedidos, actualiza estados y notifica al equipo por el canal que elijas.",
        status: "pending",
        priority: "high",
        tools: ["Email", "Planilla / ERP"],
      },
      {
        id: "2.2",
        title: "Alertas y informes cortos",
        description: "Resume métricas diarias y avisa anomalías antes de que exploten.",
        status: "pending",
        priority: "medium",
        tools: ["Dashboard", "Notificaciones"],
      },
      {
        id: "2.3",
        title: "Políticas y cumplimiento",
        description: "Respeta roles, datos sensibles y límites que definimos en el diseño del flujo.",
        status: "pending",
        priority: "high",
        tools: ["Reglas de negocio", "Logs auditables"],
      },
    ],
  },
  {
    id: "3",
    title: "Despliegue y mejora continua",
    description: "Cuando encajan las dependencias, el agente pasa a producción y aprende del feedback real.",
    status: "pending",
    priority: "medium",
    level: 1,
    dependencies: ["1", "2"],
    subtasks: [
      {
        id: "3.1",
        title: "Pruebas con tu equipo",
        description: "Simulamos escenarios reales hasta que confías en el flujo automático.",
        status: "pending",
        priority: "medium",
        tools: ["Entorno de staging", "Checklist"],
      },
      {
        id: "3.2",
        title: "Go-live y monitoreo",
        description: "Medimos tiempos de respuesta, cortes y satisfacción en los primeros días.",
        status: "pending",
        priority: "high",
        tools: ["Métricas", "Panel de incidentes"],
      },
      {
        id: "3.3",
        title: "Iteración mensual",
        description: "Ajustamos prompts, integraciones y escalación según lo que muestran los datos.",
        status: "pending",
        priority: "medium",
        tools: ["Revisiones", "Roadmap IA"],
      },
    ],
  },
]

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    completed: "Completado",
    "in-progress": "En curso",
    pending: "Pendiente",
    "need-help": "Revisión",
    failed: "Error",
  }
  return map[status] ?? status
}

const STATUSES_ORDER = ["completed", "in-progress", "pending", "need-help", "failed"] as const

export function CosechaIaAgentPlan() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [expandedTasks, setExpandedTasks] = useState<string[]>(["1"])
  const [expandedSubtasks, setExpandedSubtasks] = useState<Record<string, boolean>>({})
  const prefersReducedMotion = useReducedMotion()

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    )
  }

  const toggleSubtaskExpansion = (taskId: string, subtaskId: string) => {
    const key = `${taskId}-${subtaskId}`
    setExpandedSubtasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task
        const idx = STATUSES_ORDER.indexOf(task.status as (typeof STATUSES_ORDER)[number])
        const next = STATUSES_ORDER[(idx === -1 ? 0 : idx + 1) % STATUSES_ORDER.length]
        const updatedSubtasks = task.subtasks.map((subtask) => ({
          ...subtask,
          status: next === "completed" ? "completed" : subtask.status,
        }))
        return {
          ...task,
          status: next,
          subtasks: updatedSubtasks,
        }
      })
    )
  }

  const toggleSubtaskStatus = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task
        const updatedSubtasks = task.subtasks.map((subtask) => {
          if (subtask.id !== subtaskId) return subtask
          const newStatus = subtask.status === "completed" ? "pending" : "completed"
          return { ...subtask, status: newStatus }
        })
        const allSubtasksCompleted = updatedSubtasks.every((s) => s.status === "completed")
        return {
          ...task,
          subtasks: updatedSubtasks,
          status: allSubtasksCompleted ? "completed" : task.status,
        }
      })
    )
  }

  const taskVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -5,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: prefersReducedMotion ? "tween" : "spring",
        stiffness: 500,
        damping: 30,
        duration: prefersReducedMotion ? 0.2 : undefined,
      },
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -5,
      transition: { duration: 0.15 },
    },
  }

  const subtaskListVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      overflow: "hidden" as const,
    },
    visible: {
      height: "auto",
      opacity: 1,
      overflow: "visible" as const,
      transition: {
        duration: 0.25,
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
        when: "beforeChildren" as const,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      overflow: "hidden" as const,
      transition: {
        duration: 0.2,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  }

  const subtaskVariants = {
    hidden: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : -10,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: prefersReducedMotion ? "tween" : "spring",
        stiffness: 500,
        damping: 25,
        duration: prefersReducedMotion ? 0.2 : undefined,
      },
    },
    exit: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : -10,
      transition: { duration: 0.15 },
    },
  }

  const subtaskDetailsVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      overflow: "hidden" as const,
    },
    visible: {
      opacity: 1,
      height: "auto",
      overflow: "visible" as const,
      transition: {
        duration: 0.25,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  }

  const statusBadgeVariants = {
    initial: { scale: 1 },
    animate: {
      scale: prefersReducedMotion ? 1 : [1, 1.08, 1],
      transition: {
        duration: 0.35,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  }

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/15 text-emerald-300"
      case "in-progress":
        return "bg-sky-500/15 text-sky-300"
      case "need-help":
        return "bg-amber-500/15 text-amber-300"
      case "failed":
        return "bg-red-500/15 text-red-300"
      default:
        return "bg-white/10 text-white/55"
    }
  }

  return (
    <div className="h-full overflow-auto p-1 text-white">
      <motion.div
        className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-lg shadow-black/40"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: [0.2, 0.65, 0.3, 0.9],
          },
        }}
      >
        <LayoutGroup>
          <div className="overflow-hidden p-3 md:p-4">
            <ul className="space-y-1 overflow-hidden">
              {tasks.map((task, index) => {
                const isExpanded = expandedTasks.includes(task.id)
                const isCompleted = task.status === "completed"

                return (
                  <motion.li
                    key={task.id}
                    className={index !== 0 ? "mt-1 pt-2" : ""}
                    initial="hidden"
                    animate="visible"
                    variants={taskVariants}
                  >
                    <motion.div
                      className="group flex items-center rounded-md px-2 py-1.5 md:px-3"
                      whileHover={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <motion.div
                        className="mr-2 shrink-0 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleTaskStatus(task.id)
                        }}
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={task.status}
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                            transition={{
                              duration: 0.2,
                              ease: [0.2, 0.65, 0.3, 0.9],
                            }}
                          >
                            {task.status === "completed" ? (
                              <CheckCircle2 className="size-[18px] text-emerald-400" />
                            ) : task.status === "in-progress" ? (
                              <CircleDotDashed className="size-[18px] text-sky-400" />
                            ) : task.status === "need-help" ? (
                              <CircleAlert className="size-[18px] text-amber-400" />
                            ) : task.status === "failed" ? (
                              <CircleX className="size-[18px] text-red-400" />
                            ) : (
                              <Circle className="size-[18px] text-white/45" />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>

                      <motion.div
                        className="flex min-w-0 flex-1 cursor-pointer items-center justify-between"
                        onClick={() => toggleTaskExpansion(task.id)}
                      >
                        <div className="mr-2 min-w-0 flex-1 truncate">
                          <span
                            className={
                              isCompleted ? "text-white/45 line-through" : "text-white/95"
                            }
                          >
                            {task.title}
                          </span>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 text-xs">
                          {task.dependencies.length > 0 && (
                            <div className="mr-1 flex items-center">
                              <div className="flex flex-wrap gap-1">
                                {task.dependencies.map((dep, idx) => (
                                  <motion.span
                                    key={dep}
                                    className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/70 shadow-sm"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                      duration: 0.2,
                                      delay: idx * 0.05,
                                    }}
                                    whileHover={{
                                      y: -1,
                                      backgroundColor: "rgba(255,255,255,0.14)",
                                      transition: { duration: 0.2 },
                                    }}
                                  >
                                    {dep}
                                  </motion.span>
                                ))}
                              </div>
                            </div>
                          )}

                          <motion.span
                            className={`rounded px-1.5 py-0.5 ${statusBadgeClass(task.status)}`}
                            variants={statusBadgeVariants}
                            initial="initial"
                            animate="animate"
                            key={task.status}
                          >
                            {statusLabel(task.status)}
                          </motion.span>
                        </div>
                      </motion.div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                      {isExpanded && task.subtasks.length > 0 && (
                        <motion.div
                          className="relative overflow-hidden"
                          variants={subtaskListVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          layout
                        >
                          <div className="absolute top-0 bottom-0 left-[19px] border-l-2 border-dashed border-white/20" />
                          <ul className="mt-1 mr-1 mb-1.5 ml-2 space-y-0.5 border-white/10 md:mr-2 md:ml-3">
                            {task.subtasks.map((subtask) => {
                              const subtaskKey = `${task.id}-${subtask.id}`
                              const isSubtaskExpanded = expandedSubtasks[subtaskKey]

                              return (
                                <motion.li
                                  key={subtask.id}
                                  className="group flex flex-col py-0.5 pl-5 md:pl-6"
                                  onClick={() => toggleSubtaskExpansion(task.id, subtask.id)}
                                  variants={subtaskVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  layout
                                >
                                  <motion.div
                                    className="flex flex-1 items-center rounded-md p-1"
                                    whileHover={{
                                      backgroundColor: "rgba(255,255,255,0.05)",
                                      transition: { duration: 0.2 },
                                    }}
                                    layout
                                  >
                                    <motion.div
                                      className="mr-2 shrink-0 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleSubtaskStatus(task.id, subtask.id)
                                      }}
                                      whileTap={{ scale: 0.9 }}
                                      whileHover={{ scale: 1.1 }}
                                      layout
                                    >
                                      <AnimatePresence mode="wait">
                                        <motion.div
                                          key={subtask.status}
                                          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                          exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                                          transition={{
                                            duration: 0.2,
                                            ease: [0.2, 0.65, 0.3, 0.9],
                                          }}
                                        >
                                          {subtask.status === "completed" ? (
                                            <CheckCircle2 className="size-3.5 text-emerald-400" />
                                          ) : subtask.status === "in-progress" ? (
                                            <CircleDotDashed className="size-3.5 text-sky-400" />
                                          ) : subtask.status === "need-help" ? (
                                            <CircleAlert className="size-3.5 text-amber-400" />
                                          ) : subtask.status === "failed" ? (
                                            <CircleX className="size-3.5 text-red-400" />
                                          ) : (
                                            <Circle className="size-3.5 text-white/45" />
                                          )}
                                        </motion.div>
                                      </AnimatePresence>
                                    </motion.div>

                                    <span
                                      className={`cursor-pointer text-sm ${
                                        subtask.status === "completed"
                                          ? "text-white/45 line-through"
                                          : "text-white/85"
                                      }`}
                                    >
                                      {subtask.title}
                                    </span>
                                  </motion.div>

                                  <AnimatePresence mode="wait">
                                    {isSubtaskExpanded && (
                                      <motion.div
                                        className="mt-1 ml-1.5 overflow-hidden border-l border-dashed border-white/20 pl-4 text-xs text-white/55"
                                        variants={subtaskDetailsVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        layout
                                      >
                                        <p className="py-1">{subtask.description}</p>
                                        {subtask.tools && subtask.tools.length > 0 && (
                                          <div className="mb-1 mt-0.5 flex flex-wrap items-center gap-1.5">
                                            <span className="font-medium text-white/45">
                                              Integraciones:
                                            </span>
                                            <div className="flex flex-wrap gap-1">
                                              {subtask.tools.map((tool) => (
                                                <motion.span
                                                  key={tool}
                                                  className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/75 shadow-sm"
                                                  initial={{ opacity: 0, y: -5 }}
                                                  animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    transition: { duration: 0.2 },
                                                  }}
                                                  whileHover={{
                                                    y: -1,
                                                    backgroundColor: "rgba(255,255,255,0.14)",
                                                    transition: { duration: 0.2 },
                                                  }}
                                                >
                                                  {tool}
                                                </motion.span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.li>
                              )
                            })}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                )
              })}
            </ul>
          </div>
        </LayoutGroup>
      </motion.div>
    </div>
  )
}
