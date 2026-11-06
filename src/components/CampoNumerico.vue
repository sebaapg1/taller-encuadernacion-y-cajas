<script setup>
import InputNumber from 'primevue/inputnumber'
import InfoTip from './InfoTip.vue'

const props = defineProps({
  id: { type: String, required: true },
  etiqueta: { type: String, required: true },
  modelValue: { type: Number, required: true },
  color: { type: String, default: 'bg-taller-suave' },
  ayuda: { type: String, default: '' },
  unidad: { type: String, default: 'mm' },
})
const emit = defineEmits(['update:modelValue'])

// Un campo vacío cuenta como 0, igual que en la calculadora original.
function alCambiar(valor) {
  emit('update:modelValue', valor ?? 0)
}
</script>

<template>
  <div class="flex items-center gap-3">
    <span class="h-2.5 w-2.5 flex-shrink-0 rounded-full" :class="color" />
    <label :for="id" class="flex w-36 flex-shrink-0 items-center text-sm font-medium text-taller-suave">
      {{ etiqueta }}
      <InfoTip v-if="ayuda" :texto="ayuda" />
    </label>
    <InputNumber
      :inputId="id"
      :name="id"
      :modelValue="modelValue"
      :minFractionDigits="0"
      :maxFractionDigits="2"
      locale="es-CL"
      class="w-full"
      inputClass="w-full"
      @update:modelValue="alCambiar"
    />
    <span class="w-8 flex-shrink-0 text-xs text-taller-suave">{{ unidad }}</span>
  </div>
</template>
