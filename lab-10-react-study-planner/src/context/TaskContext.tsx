import { useCallback, useEffect, useReducer, type ReactNode } from 'react';
import { taskRepository } from '../repositories/TaskRepository';
import type { Task, TaskInput, TaskPage, TaskUpdate } from '../types/task';
import { TaskContext, type TaskContextValue, type TaskState } from './taskContextDefinition';

type TaskAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: TaskPage }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'SELECT_START' }
  | { type: 'SELECT_SUCCESS'; payload: Task }
  | { type: 'SELECT_ERROR'; payload: string }
  | { type: 'CREATE_SUCCESS'; payload: Task }
  | { type: 'UPDATE_SUCCESS'; payload: Task }
  | { type: 'DELETE_SUCCESS'; payload: number }
  | { type: 'MUTATION_ERROR'; payload: string };

const initialState: TaskState = {
  tasks: [],
  total: 0,
  skip: 0,
  limit: 10,
  status: 'idle',
  error: null,
  selectedTask: null,
  selectedTaskStatus: 'idle',
  selectedTaskError: null,
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Сталася невідома помилка';
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        status: 'loading',
        error: null,
      };

    case 'LOAD_SUCCESS':
      return {
        ...state,
        tasks: action.payload.tasks,
        total: action.payload.total,
        skip: action.payload.skip,
        limit: action.payload.limit,
        status: 'success',
        error: null,
      };

    case 'LOAD_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      };

    case 'SELECT_START':
      return {
        ...state,
        selectedTaskStatus: 'loading',
        selectedTaskError: null,
      };

    case 'SELECT_SUCCESS':
      return {
        ...state,
        selectedTask: action.payload,
        selectedTaskStatus: 'success',
        selectedTaskError: null,
      };

    case 'SELECT_ERROR':
      return {
        ...state,
        selectedTaskStatus: 'error',
        selectedTaskError: action.payload,
      };

    case 'CREATE_SUCCESS':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        total: state.total + 1,
        status: 'success',
        error: null,
      };

    case 'UPDATE_SUCCESS':
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.payload.id ? action.payload : task)),
        selectedTask:
          state.selectedTask?.id === action.payload.id ? action.payload : state.selectedTask,
        status: 'success',
        error: null,
      };

    case 'DELETE_SUCCESS':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        total: Math.max(0, state.total - 1),
        selectedTask: state.selectedTask?.id === action.payload ? null : state.selectedTask,
        status: 'success',
        error: null,
      };

    case 'MUTATION_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.payload,
      };

    default:
      return state;
  }
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const loadTasks = useCallback(
    async ({ limit = 10, skip = 0 }: { limit?: number; skip?: number } = {}) => {
      dispatch({ type: 'LOAD_START' });

      try {
        const page = await taskRepository.getAll({ limit, skip });
        dispatch({ type: 'LOAD_SUCCESS', payload: page });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        dispatch({
          type: 'LOAD_ERROR',
          payload: getErrorMessage(error),
        });
      }
    },
    []
  );

  const getTaskById = useCallback(async (id: number): Promise<Task | null> => {
    dispatch({ type: 'SELECT_START' });

    try {
      const task = await taskRepository.getById(id);
      dispatch({ type: 'SELECT_SUCCESS', payload: task });
      return task;
    } catch (error) {
      dispatch({
        type: 'SELECT_ERROR',
        payload: getErrorMessage(error),
      });
      return null;
    }
  }, []);

  const createTask = useCallback(async (task: TaskInput): Promise<Task | null> => {
    try {
      const createdTask = await taskRepository.create(task);
      dispatch({ type: 'CREATE_SUCCESS', payload: createdTask });
      return createdTask;
    } catch (error) {
      dispatch({
        type: 'MUTATION_ERROR',
        payload: getErrorMessage(error),
      });
      return null;
    }
  }, []);

  const updateTask = useCallback(async (id: number, task: TaskUpdate): Promise<Task | null> => {
    try {
      const updatedTask = await taskRepository.update(id, task);
      dispatch({ type: 'UPDATE_SUCCESS', payload: updatedTask });
      return updatedTask;
    } catch (error) {
      dispatch({
        type: 'MUTATION_ERROR',
        payload: getErrorMessage(error),
      });
      return null;
    }
  }, []);

  const deleteTask = useCallback(async (id: number): Promise<boolean> => {
    try {
      await taskRepository.delete(id);
      dispatch({ type: 'DELETE_SUCCESS', payload: id });
      return true;
    } catch (error) {
      dispatch({
        type: 'MUTATION_ERROR',
        payload: getErrorMessage(error),
      });
      return false;
    }
  }, []);

  const toggleTask = useCallback(
    async (id: number): Promise<Task | null> => {
      const task = state.tasks.find((item) => item.id === id);

      if (!task) {
        dispatch({
          type: 'MUTATION_ERROR',
          payload: `Завдання з id ${id} не знайдено`,
        });

        return null;
      }

      return updateTask(id, {
        title: task.title,
        description: task.description,
        completed: !task.completed,
        priority: task.priority,
        category: task.category,
      });
    },
    [state.tasks, updateTask]
  );

  useEffect(() => {
    const controller = new AbortController();

    dispatch({ type: 'LOAD_START' });

    taskRepository
      .getAll({ limit: initialState.limit, skip: initialState.skip, signal: controller.signal })
      .then((page) => {
        dispatch({ type: 'LOAD_SUCCESS', payload: page });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        dispatch({
          type: 'LOAD_ERROR',
          payload: getErrorMessage(error),
        });
      });

    return () => controller.abort();
  }, []);

  const value: TaskContextValue = {
    state,
    loadTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
