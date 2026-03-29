import { cn } from '../utils/cn'
import type { Task, TaskStatus } from '../types/task'

interface TaskListProps {
  tasks: Task[]
  activeFilter: string
  setActiveFilter: (value: string) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => Promise<void>
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>
}

const filters = ['all', 'pending', 'in_progress', 'done']

const badgeStyles: Record<TaskStatus, string> = {
  pending: 'bg-amber-400/15 text-amber-200 border-amber-400/20',
  in_progress: 'bg-blue-400/15 text-blue-200 border-blue-400/20',
  done: 'bg-emerald-400/15 text-emerald-200 border-emerald-400/20'
}

const priorityStyles = {
  low: 'text-slate-300',
  medium: 'text-cyan-300',
  high: 'text-rose-300'
}

export default function TaskList({
  tasks,
  activeFilter,
  setActiveFilter,
  onEdit,
  onDelete,
  onStatusChange
}: TaskListProps) {
  async function handleDelete(taskId: string) {
    const confirmed = window.confirm('Delete this task permanently?')
    if (!confirmed) {
      return
    }
    await onDelete(taskId)
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Your tasks</h2>
          <p className="mt-1 text-sm text-slate-400">Filter, edit, update, and delete your own tasks.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide',
                activeFilter === filter
                  ? 'border-cyan-300 bg-cyan-400/15 text-cyan-200'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              )}
            >
              {filter.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-400">
            No tasks found. Create your first task.
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                    <span className={cn('rounded-full border px-3 py-1 text-xs font-medium capitalize', badgeStyles[task.status])}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{task.description || 'No description provided.'}</p>
                  <p className={cn('mt-3 text-xs font-semibold uppercase tracking-wide', priorityStyles[task.priority])}>
                    Priority: {task.priority}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    className="min-w-[150px]"
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <button
                    onClick={() => onEdit(task)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
