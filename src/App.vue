<script setup>
import TallerBar from './components/TallerBar.vue'
import { APP_VERSION } from './version.js'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <TallerBar />
    <main class="flex-1">
      <router-view />
    </main>
    <footer class="border-t border-taller-linea px-4 py-6 text-center text-sm text-taller-suave">
      Taller {{ APP_VERSION }} · herramientas del Nido ·
      <router-link to="/creditos" class="underline underline-offset-2 hover:text-taller-tinta">créditos y licencias</router-link>
    </footer>
  </div>
</template>
