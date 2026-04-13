<template>
    <q-drawer v-model="drawerState" bordered class="bg-grey-10 text-white shadow-2 border-bottom-gold">
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-gold text-weight-bold">CATEGORÍAS</q-item-label>
          <q-item 
            v-for="cat in props.categorias" 
            :key="cat.nombre"
            clickable 
            v-ripple 
            @click="handleClickCategoria(cat.nombre)"
            :active="store.filtroActual === cat.nombre"
            active-class="bg-amber-1 text-gold text-weight-bold"
            to="/"
          >
            <q-item-section avatar>
              <q-icon :name="cat.icono" :color="store.filtroActual === cat.nombre ? 'gold' : 'grey-7'" />
            </q-item-section>
            <q-item-section>
              {{ cat.nombre }}
            </q-item-section>
          </q-item>     
        </q-list>
      </q-scroll-area>
    </q-drawer>
</template>

<script setup>
import { computed, ref  } from 'vue';
import { useBeRNiceStore } from 'src/stores/bernice-store';

const store = useBeRNiceStore();
const leftDrawerOpen = ref(false);

const props = defineProps(['categorias','modelValue']);
const emit = defineEmits(['catselected', 'update:modelValue'])

const drawerState = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const handleClickCategoria = (categoria) => {
    emit('catselected', categoria);
};
</script>

<style scoped>
</style>