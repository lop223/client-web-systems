import { describe, expect, it } from 'vitest';
import { data } from '../data/data';
import taskReducer, { type TaskState } from '../reducers/taskReducer';

const initialState: TaskState = {
  tasks: data,
  filter: 'all',
  pendingDeletes: [],
  toasts: [],
};

describe('taskReducer', () => {
  it('adds, toggles, and updates tasks without side effects', () => {
    const added = {
      ...data[0]!,
      id: 4,
      title: 'New task',
      completed: false,
    };
    const withAdded = taskReducer(initialState, {
      type: 'add',
      task: added,
      toast: { id: 1, type: 'success', message: 'Added' },
    });
    const toggled = taskReducer(withAdded, { type: 'toggle', id: 4 });
    const updated = taskReducer(toggled, {
      type: 'update',
      task: { ...added, title: 'Updated task', completed: true },
      toast: { id: 2, type: 'success', message: 'Updated' },
    });

    expect(initialState.tasks).toHaveLength(3);
    expect(updated.tasks[0]?.title).toBe('Updated task');
    expect(updated.tasks[0]?.completed).toBe(true);
  });

  it('keeps a requested deletion pending until it is undone or confirmed', () => {
    const deleted = taskReducer(initialState, {
      type: 'requestDelete',
      id: 2,
      toast: { id: 1, type: 'info', message: 'Deleted', undoTaskId: 2 },
    });
    expect(deleted.tasks.map((task) => task.id)).toEqual([1, 3]);
    expect(deleted.pendingDeletes).toHaveLength(1);

    const undone = taskReducer(deleted, {
      type: 'undoDelete',
      id: 2,
      toast: { id: 2, type: 'success', message: 'Undone' },
    });
    expect(undone.tasks.map((task) => task.id)).toEqual([1, 2, 3]);
    expect(undone.pendingDeletes).toHaveLength(0);

    const confirmed = taskReducer(deleted, { type: 'confirmDelete', id: 2 });
    expect(confirmed.pendingDeletes).toHaveLength(0);
    expect(confirmed.toasts).toHaveLength(0);
  });

  it('clears completed tasks and resets the filter and task list', () => {
    const filtered = taskReducer(initialState, { type: 'setFilter', filter: 'completed' });
    const cleared = taskReducer(filtered, {
      type: 'clearCompleted',
      toast: { id: 1, type: 'success', message: 'Cleared' },
    });
    expect(cleared.tasks.every((task) => !task.completed)).toBe(true);

    const reset = taskReducer(cleared, {
      type: 'reset',
      tasks: data,
      toast: { id: 2, type: 'success', message: 'Reset' },
    });
    expect(reset.tasks).toEqual(data);
    expect(reset.filter).toBe('all');
  });
});
