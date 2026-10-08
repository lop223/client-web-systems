<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') emit('close')
}

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      document.addEventListener('keydown', onKeydown)
    } else {
      document.removeEventListener('keydown', onKeydown)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-backdrop-custom" @click.self="emit('close')">
        <div class="modal-dialog-custom card" role="dialog" aria-modal="true">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div class="fw-semibold">
              <slot name="header">Modal</slot>
            </div>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="emit('close')"
            ></button>
          </div>
          <div class="card-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="card-footer d-flex justify-content-end gap-2">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal-dialog-custom {
  background-color: rgb(255, 255, 255);
  padding: 20px;
  border: 1px solid rgb(62, 62, 62);
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
  margin: 1rem;
}

// CSS-переходи
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;

  .modal-dialog-custom {
    transition: transform 0.25s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-dialog-custom {
    transform: translateY(-30px);
  }
}
</style>
