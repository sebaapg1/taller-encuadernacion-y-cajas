<script setup>
// Icono "i" con una explicación breve. Sirve para dar el detalle técnico
// sin llenar la pantalla de jerga.
defineProps({ texto: { type: String, required: true } })
</script>

<template>
  <span class="group relative ml-1 inline-flex align-middle">
    <button
      type="button"
      class="flex h-4 w-4 items-center justify-center rounded-full border border-taller-suave/50 text-[10px] font-semibold text-taller-suave hover:border-taller-acento hover:text-taller-acento focus:outline-none focus:ring-2 focus:ring-taller-acento/40"
      :aria-label="texto"
    >
      i
    </button>
    <span
      role="tooltip"
      class="pointer-events-none invisible absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-md bg-taller-tinta px-3 py-2 text-xs leading-snug text-taller-fondo opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
    >
      {{ texto }}
    </span>
  </span>
</template>
