<template>
  <q-dialog 
    :model-value="modelValue" 
    @update:model-value="val => $emit('update:modelValue', val)"
    @hide="$emit('update:modelValue', false)"
    position="right"
  >
    <q-card style="width: 350px; max-width: 80vw;" class="column">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-anthracite">FILTROS</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="col q-gutter-y-lg scroll">
        <q-input 
          :model-value="filtrosActuales.nombre"
          @update:model-value="val => actualizarFiltro('nombre', val)"
          label="Nombre del producto" 
          outlined dense color="anthracite"
        />

        <q-input 
          :model-value="filtrosActuales.codigo"
          @update:model-value="val => actualizarFiltro('codigo', val)"
          label="Código numérico" 
          outlined dense type="number" color="anthracite"
        />

        <q-select 
          :model-value="filtrosActuales.categoria" 
          :options="categoriasDisponibles" 
          @update:model-value="val => actualizarFiltro('categoria', val)"
          label="Categoría" 
          outlined dense clearable color="anthracite"
        />

        <div class="q-px-sm">
          <div class="text-caption text-weight-bold q-mb-md">
            Rango de Precio: {{ filtrosActuales.precio.min }} - {{ filtrosActuales.precio.max }}
          </div>
          <q-range
            :model-value="filtrosActuales.precio"
            @update:model-value="val => actualizarFiltro('precio', val)"
            :min="limitesPrecio.min"
            :max="limitesPrecio.max"
            label-always
            color="gold-metallic"
          />
        </div>            
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Limpiar" color="negative" @click="limpiarFiltros" />
        <!--
        <q-btn unelevated label="Aplicar" color="blue" v-close-popup />
      -->
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  filtrosActuales: Object,
  productosBase: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue', 'update:filtrosActuales']);

// Categorías dinámicas usando tu campo "ct"
const categoriasDisponibles = computed(() => {
  const cats = props.productosBase.map(i => i.ct).filter(Boolean);
  return [...new Set(cats)].sort();
});

// Límites de precio usando tu campo "pv"
const limitesPrecio = computed(() => {
  if (props.productosBase.length === 0) return { min: 0, max: 3000 };
  const precios = props.productosBase.map(p => p.pv);
  return {
    min: Math.floor(Math.min(...precios)),
    max: Math.ceil(Math.max(...precios))
  };
});

// Función para actualizar cualquier filtro
const actualizarFiltro = (campo, valor) => {
  emit('update:filtrosActuales', { 
    ...props.filtrosActuales, 
    [campo]: valor 
  });
};

// LIMPIAR: Emitimos el objeto inicial al padre
const limpiarFiltros = () => {
  emit('update:filtrosActuales', {
    nombre: '',
    codigo: '',
    categoria: '',
    precio: { 
      min: limitesPrecio.value.min, 
      max: limitesPrecio.value.max 
    }
  });
};
</script>

<style scoped>
</style>