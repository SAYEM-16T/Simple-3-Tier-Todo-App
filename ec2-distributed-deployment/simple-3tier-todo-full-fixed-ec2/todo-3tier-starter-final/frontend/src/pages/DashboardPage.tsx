import { useEffect, useMemo, useState } from 'react'
import api from '../api/client'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import Topbar from '../components/Topbar'
import type { Task, TaskPayload, TaskStatus } from '../types/task'
import { getApiErrorMessage } from '../utils/apiError'

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchTasks(filter = activeFilter) {
    setIsLoading(true)
    setError('')
    try {
      const response = await api.get<Task[]>('/tasks', {
        params: filter !== 'all' ? { status: filter } : {}
      })
      setTasks(response.data)
    } catch (error) {
      setError(getApiErrorMessage(error, 'Failed to load tasks.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks(activeFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter])

  async function handleSave(payload: TaskPayload) {
    setError('')
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, payload)
        setEditingTask(null)
      } else {
        await api.post('/tasks', payload)
      }
      await fetchTasks(activeFilter)
    } catch (error) {
      setError(getApiErrorMessage(error, 'Failed to save task.'))
      throw error
    }
  }

  async function handleDelete(taskId: string) {
    setError('')
    try {
      await api.delete(`/tasks/${taskId}`)
      if (editingTask?.id === taskId) {
        setEditingTask(null)
      }
      await fetchTasks(activeFilter)
    } catch (error) {
      setError(getApiErrorMessage(error, 'Failed to delete task.'))
    }
  }

  async function handleStatusChange(taskId: string, status: TaskStatus) {
    setError('')
    try {
      await api.patch(`/tasks/${taskId}/status`, { status })
      await fetchTasks(activeFilter)
    } catch (error) {
      setError(getApiErrorMessage(error, 'Failed to update task status.'))
    }
  }

  const stats = useMemo(() => {
    const total = tasks.length
    const pending = tasks.filter((task) => task.status === 'pending').length
    const inProgress = tasks.filter((task) => task.status === 'in_progress').length
    const done = tasks.filter((task) => task.status === 'done').length
    return { total, pending, inProgress, done }
  }, [tasks])

  return (
    <div className="min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Topbar />

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {[
            { label: 'Total Tasks', value: stats.total },
            { label: 'Pending', value: stats.pending },
            { label: 'In Progress', value: stats.inProgress },
            { label: 'Done', value: stats.done }
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-3 text-4xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {error && <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

        <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <TaskForm editingTask={editingTask} onSubmit={handleSave} onCancelEdit={() => setEditingTask(null)} />

          {isLoading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300 shadow-glow">Loading tasks...</div>
          ) : (
            <TaskList
              tasks={tasks}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              onEdit={setEditingTask}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>
    </div>
  )
}
