<template>
    <q-carousel
      v-model="slide"
      animated
      arrows
      navigation
      infinite
      height="400px" 
      class="rounded-borders shadow-2"
      :autoplay="4000"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = 4000"
    >
      <q-carousel-slide 
        v-for="item in listaImagenes" 
        :key="item.id" 
        :name="item.id" 
        :img-src="item.url"
      >
        <div class="absolute-bottom custom-caption q-pt-md q-px-md q-pb-xl text-center">
          <div class="text-h4 text-serif">{{ item.titulo }}</div>
          <div class="text-subtitle1">{{ item.descripcion }}</div>         
        </div>
      </q-carousel-slide>
    </q-carousel>
</template>

<script setup>
import { ref } from 'vue';
const slide = ref(1);
const getImageUrl = (name) => {
  return new URL(`../assets/bg/${name}`, import.meta.url).href;
};
const listaImagenes = ref([
  { id: 1, url: getImageUrl('bg-1.avif'), titulo: 'Elegancia Atemporal', descripcion: 'Nueva colección de diamantes' },
  { id: 2, url: getImageUrl('bg-2.avif'), titulo: 'Diseños Exclusivos', descripcion: 'Hechos a mano para ti' },
  { id: 3, url: getImageUrl('bg-3.avif'), titulo: 'Momentos Especiales', descripcion: 'Anillos de compromiso' },
  { id: 4, url: getImageUrl('bg-4.avif'), titulo: 'Artesanía Fina', descripcion: 'Calidad certificada' },  
]);
</script>

<style scoped> </style>