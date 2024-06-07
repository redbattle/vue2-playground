import Bus from '@/utils/eventBus'
export const notifyRb = msg => {
  Bus.$emit('showNotify', msg)
}