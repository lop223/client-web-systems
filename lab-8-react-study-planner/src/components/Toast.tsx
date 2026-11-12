import useTaskContext from '../hooks/useTaskContext';
import type { ToastMessage } from '../reducers/taskReducer';

interface ToastProps {
  toast: ToastMessage;
}

const Toast = ({ toast }: ToastProps) => {
  const { undoDelete, dismissToast } = useTaskContext();
  const undoTaskId = toast.undoTaskId;

  return (
    <div
      role="status"
      className={`flex items-center justify-between gap-3 rounded-lg border p-3 text-sm shadow-lg ${
        toast.type === 'success'
          ? 'border-emerald-200 bg-white text-emerald-800'
          : 'border-slate-200 bg-white text-slate-800'
      }`}
    >
      <span>{toast.message}</span>
      <div className="flex shrink-0 items-center gap-2">
        {undoTaskId !== undefined && (
          <button
            type="button"
            onClick={() => undoDelete(undoTaskId)}
            className="font-semibold text-blue-600 hover:text-blue-800"
          >
            Undo
          </button>
        )}
        <button
          type="button"
          onClick={() => dismissToast(toast.id)}
          aria-label="Закрити повідомлення"
          className="rounded px-1 text-slate-500 hover:bg-slate-100"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
