<template>
  <q-layout view="lHh Lpr lff">
    <q-header class="bg-grey-10 text-white shadow-2 border-bottom-gold">
      <q-toolbar class="q-py-xs">
        <q-btn flat no-caps padding="none" to="/" @click="store.setFiltro('Todos')">
          <q-img src="~assets/logo-claira-nice-horizontal-transparent.png" style="width: 250px; height: 80px" fit="contain" />
        </q-btn>         
        <q-space />
        <div class="row justify-center q-py-sm gt-sm categories-bar">
          <q-btn v-for="cat in categorias" :key="cat.nombre" 
            flat no-caps :label="cat.nombre.toUpperCase()" 
            @click="store.setFiltro(cat.nombre)"
            :class="[store.filtroActual === cat.nombre ? 'text-gold active-link' : 'text-grey-4 hover-gold']" 
          />
        </div>
        <q-space />    
        <div class="row no-wrap items-center q-gutter-x-sm">
          <!--<q-btn flat round size="md" color="white" icon="search"></q-btn>-->
          <q-btn flat round size="md" color="blue" icon="diamond" @click="handleNiceClick">
            <q-tooltip :delay="200" :hide-delay="0">
                Productos Nice
            </q-tooltip>            
          </q-btn>          
          <q-btn flat round size="md" color="white" icon="shopping_bag" @click="carritoOpen = true">
            <q-badge color="gold-gradient" floating v-if="store.cantidadTotalArticulos > 0">
              {{ store.cantidadTotalArticulos }}
            </q-badge>
            <q-tooltip :delay="200" :hide-delay="0">
                Carrito
            </q-tooltip>              
          </q-btn>
          <q-btn flat dense round icon="menu" color="white" @click="toggleLeftDrawer" class="lt-md" />
        </div>
      </q-toolbar>
    </q-header>
    <Carrito v-model="carritoOpen" />
    <Menu v-model="leftDrawerOpen" :categorias="categorias" @catselected="seleccionarCategoria"></Menu>
    <q-page-container>
      <q-page class="q-pa-md">
        <router-view />
      </q-page>      
    </q-page-container>
    <Footer></Footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useJoyeriaStore } from 'src/stores/joyeria';
import { useNiceStore } from 'src/stores/nice-store';
import Footer from 'src/components/Footer.vue';
import Menu from 'src/components/Menu.vue';
import Carrito from 'src/components/Carrito.vue';

const store = useJoyeriaStore();
const niceStore = useNiceStore();

const leftDrawerOpen = ref(false);
const carritoOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
};

const handleNiceClick = () => {
  niceStore.toggleDiv();
  niceStore.cargarProductos(); // Cargamos los datos al hacer clic
};

// Lista maestra de categorías para evitar repetir código
const categorias = [
  { nombre: 'Todos', icono: 'apps' },
  { nombre: 'Novedades', icono: 'auto_awesome' },
  { nombre: 'Collares', icono: 'straighten' }, // O 'straighten' si no tienes mdi
  { nombre: 'Aretes', icono: 'blur_on' },
  { nombre: 'Anillos', icono: 'panorama_fish_eye' },
  { nombre: 'Pulseras', icono: 'watch' },
  { nombre: 'Piercing', icono: 'adjust' },
  { nombre: 'Promociones', icono: 'adjust' }
]

const seleccionarCategoria = (nombre) => {
  store.setFiltro(nombre)
  if (leftDrawerOpen.value) leftDrawerOpen.value = false // Cierra el menú al elegir
}
</script>

<style lang="scss" scoped>
.text-gold { color: #D4AF37; }
.bg-amber-1 { background-color: #fffbef; }

.border-bottom-light {
  border-bottom: 1px solid rgba(0,0,0,0.08);
}

.main-logo-static {
  width: 280px; 
  @media (max-width: 600px) { width: 280px; }
}

.categories-bar .q-btn { font-size: 0.85rem; letter-spacing: 1px; }
.hover-gold:hover { color: #D4AF37 !important; }

.custom-search {
  width: 150px;
  @media (min-width: 600px) { width: 100px; }
  :deep(.q-field__control) { border-radius: 5px !important; }
}

.border-top {
  border-top: 1px solid #e0e0e0;
}
/* Estilo opcional para quitar el padding de los items en el footer */
.q-item {
  min-height: 25px;
}
</style>