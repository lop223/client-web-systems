import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

export function useAppToast() {
  const toast = useToast()

  return {
    success(detail: string) {
      toast.add({
        severity: 'success',
        summary: 'Успішно',
        detail,
        life: 3000,
      })
    },
    error(detail: string) {
      toast.add({
        severity: 'error',
        summary: 'Помилка',
        detail,
        life: 5000,
      })
    },
  }
}

export function useAppConfirm() {
  const confirm = useConfirm()

  return function confirmAction(
    message: string,
    onAccept: () => void | Promise<void>,
  ): void {
    confirm.require({
      group: 'app',
      header: 'Підтвердження',
      message,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Підтвердити',
      rejectLabel: 'Скасувати',
      accept: onAccept,
    })
  }
}