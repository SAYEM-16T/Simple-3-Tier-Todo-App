import { useEffect, useState } from 'react'
import type { Task, TaskPayload } from '../types/task'

const defaultValues: TaskPayload = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium'
}

interface TaskFormProps {
  editingTask: Task | null
  onSubmit: (payload: TaskPayload) => Promise<void>
  onCancelEdit: () => void
}

export default function TaskForm({ editingTask, onSubmit, onCancelEdit }: TaskFormProps) {
  const [form, setForm] = useState<TaskPayload>({ ...defaultValues })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description ?? '',
        status: editingTask.status,
        priority: editingTask.priority
      })
    } else {
      setForm({ ...defaultValues })
    }
  }, [editingTask])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsSaving(true)
    try {
      await onSubmit(form)
      setForm({ ...defaultValues })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">{editingTask ? 'Edit task' : 'Create a new task'}</h2>
          <p className="mt-1 text-sm text-slate-400">Keep it minimal, clean, and user-focused.</p>
        </div>
        {editingTask && (
          <button type="button" onClick={onCancelEdit} className="text-sm text-slate-300 hover:text-white">
            Cancel edit
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Enter task title"
            required
            minLength={1}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Optional description"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Status</label>
            <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as TaskPayload['status'] }))}>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Priority</label>
            <select value={form.priority} onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as TaskPayload['priority'] }))}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="mt-6 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? 'Saving...' : editingTask ? 'Update task' : 'Create task'}
      </button>
    </form>
  )
}
