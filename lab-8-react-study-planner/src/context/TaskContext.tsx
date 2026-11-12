import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { data } from '../data/data';
import useLocalStorage from '../hooks/useLocalStorage';
import { TaskContext, type NewTask, type TaskContextValue } from './taskContextDefinition';
import taskReducer, { type ToastMessage } from '../reducers/taskReducer';
import type { Task, TaskFilter } from '../types/task';

const STORAGE_KEY = 'study-planner-tasks';
const DELETE_UNDO_DELAY = 5000;
const TOAST_DURATION = 3000;

export const TaskProvider = ({ children }: PropsWithChildren) => {
  const [storedTasks, setStoredTasks] = useLocalStorage<Task[]>(STORAGE_KEY, data);
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: storedTasks,
    filter: 'all',
    pendingDeletes: [],
    toasts: [],
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const toastId = useRef(0);
  const deleteTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const toastTimers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const createToast = useCallback(
    (type: ToastMessage['type'], message: string, undoTaskId?: number): ToastMessage => ({
      id: ++toastId.current,
      type,
      message,
      ...(undoTaskId === undefined ? {} : { undoTaskId }),
    }),
    []
  );

  useEffect(() => {
    setStoredTasks(state.tasks);
  }, [setStoredTasks, state.tasks]);

  useEffect(() => {
    const pendingIds = new Set(state.pendingDeletes.map(({ task }) => task.id));

    for (const [id, timer] of deleteTimers.current) {
      if (!pendingIds.has(id)) {
        clearTimeout(timer);
        deleteTimers.current.delete(id);
      }
    }

    for (const { task } of state.pendingDeletes) {
      if (!deleteTimers.current.has(task.id)) {
        const timer = setTimeout(() => {
          deleteTimers.current.delete(task.id);
          dispatch({ type: 'confirmDelete', id: task.id });
        }, DELETE_UNDO_DELAY);
        deleteTimers.current.set(task.id, timer);
      }
    }
  }, [state.pendingDeletes]);

  useEffect(() => {
    const toastIds = new Set(state.toasts.map(({ id }) => id));

    for (const [id, timer] of toastTimers.current) {
      if (!toastIds.has(id)) {
        clearTimeout(timer);
        toastTimers.current.delete(id);
      }
    }

    for (const toast of state.toasts) {
      if (toast.undoTaskId === undefined && !toastTimers.current.has(toast.id)) {
        const timer = setTimeout(() => {
          toastTimers.current.delete(toast.id);
          dispatch({ type: 'dismissToast', id: toast.id });
        }, TOAST_DURATION);
        toastTimers.current.set(toast.id, timer);
      }
    }
  }, [state.toasts]);

  useEffect(
    () => () => {
      for (const timer of deleteTimers.current.values()) clearTimeout(timer);
      for (const timer of toastTimers.current.values()) clearTimeout(timer);
      deleteTimers.current.clear();
      toastTimers.current.clear();
    },
    []
  );

  useEffect(() => {
    const activeCount = state.tasks.filter((task) => !task.completed).length;
    document.title = `Study Planner — ${activeCount} active tasks`;
  }, [state.tasks]);

  const addTask = useCallback(
    (task: NewTask) => {
      const id =
        [
          ...state.tasks,
          ...state.pendingDeletes.map(({ task: pendingTask }) => pendingTask),
        ].reduce((maxId, current) => Math.max(maxId, current.id), 0) + 1;
      dispatch({
        type: 'add',
        task: { ...task, id, completed: false },
        toast: createToast('success', 'Завдання додано'),
      });
    },
    [createToast, state.pendingDeletes, state.tasks]
  );

  const updateTask = useCallback(
    (task: Task) => {
      dispatch({ type: 'update', task, toast: createToast('success', 'Завдання оновлено') });
      setEditingTask(null);
    },
    [createToast]
  );

  const toggleTask = useCallback((id: number) => dispatch({ type: 'toggle', id }), []);
  const requestDelete = useCallback(
    (id: number) => {
      const task = state.tasks.find((item) => item.id === id);
      if (task) {
        dispatch({
          type: 'requestDelete',
          id,
          toast: createToast('info', `«${task.title}» видалено`, id),
        });
      }
    },
    [createToast, state.tasks]
  );
  const undoDelete = useCallback(
    (id: number) =>
      dispatch({
        type: 'undoDelete',
        id,
        toast: createToast('success', 'Видалення скасовано'),
      }),
    [createToast]
  );
  const clearCompleted = useCallback(
    () =>
      dispatch({
        type: 'clearCompleted',
        toast: createToast('success', 'Виконані завдання очищено'),
      }),
    [createToast]
  );
  const resetTasks = useCallback(
    () =>
      dispatch({ type: 'reset', tasks: data, toast: createToast('success', 'Список відновлено') }),
    [createToast]
  );
  const setFilter = useCallback(
    (filter: TaskFilter) => dispatch({ type: 'setFilter', filter }),
    []
  );
  const dismissToast = useCallback((id: number) => dispatch({ type: 'dismissToast', id }), []);
  const value = useMemo<TaskContextValue>(
    () => ({
      ...state,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      resetTasks,
      setFilter,
      dismissToast,
      editingTask,
      setEditingTask,
    }),
    [
      state,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      resetTasks,
      setFilter,
      dismissToast,
      editingTask,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
