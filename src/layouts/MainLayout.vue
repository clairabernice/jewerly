<template>
  <q-layout view="lHh Lpr lff">
    <q-header class="bg-grey-10 text-white shadow-2 border-bottom-gold">
      <q-toolbar class="q-py-xs">
        <q-btn flat no-caps padding="none" to="/" @click="store.setFiltro('Todos')">
          <q-img src="~assets/logo-claira-nice-horizontal-transparent.png" style="width: 250px; height: 80px" fit="contain" />
        </q-btn>         
        <q-space />
        <div class="row justify-center q-py-sm gt-sm">
          <q-btn v-for="cat in categorias.filter(c => c.dd == false)" :key="cat.nombre" 
            flat no-caps :label="cat.nombre.toUpperCase()" 
            @click="store.setFiltro(cat.nombre)"
            to="/"
            :class="[store.filtroActual === cat.nombre ? 'text-gold active-link' : 'text-grey-4 hover-gold']" 
          />  
          <q-btn-dropdown
            flat
            no-caps
            label="JOYERIA"
            class="jewelry-dropdown"
            :class="store.filtroActual !== 'todos' ? 'text-gold' : 'text-grey-4'"
            dropdown-icon="expand_more">
            <q-list class="bg-dark text-white shadow-24" style="min-width: 220px; border: 1px solid #333;">          
              <q-item 
                v-for="cat in categorias.filter(c => c.dd == true)" 
                :key="cat.nombre"
                clickable 
                v-close-popup 
                @click="store.setFiltro(cat.nombre)"
                to="/"
                :active="store.filtroActual === cat.nombre"
                class="q-py-md">
                <q-item-section class="text-weight-light">
                  {{ cat.nombre.toUpperCase() }}
                </q-item-section>                
                <q-item-section side v-if="store.filtroActual === cat.nombre">
                  <q-icon name="check" color="gold" size="xs" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>         
        <q-space />    
        <div class="row no-wrap items-center q-gutter-x-sm">  
          <q-btn flat round size="md" color="gold-metallic" icon="diamond" to="/coleccion_nice" >
            <q-tooltip :delay="200" :hide-delay="0">
                Coleccion Nice
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
        <CarruselImagenes />
        <router-view />
      </q-page>      
    </q-page-container>
    <Footer></Footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useBeRNiceStore } from 'src/stores/bernice-store';

import Menu from 'src/components/Menu.vue';
import CarruselImagenes from 'src/components/CarruselImagenes.vue';
import Footer from 'src/components/Footer.vue';
import Carrito from 'src/components/Carrito.vue';

const store = useBeRNiceStore();
const leftDrawerOpen = ref(false);
const carritoOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
};

// Lista maestra de categorías para evitar repetir código
const categorias = [
  { nombre: 'Todos', icono: 'apps', dd: false },
  { nombre: 'Novedades', icono: 'auto_awesome', dd: false },
  { nombre: 'Collares', icono: 'straighten', dd: true }, // O 'straighten' si no tienes mdi
  { nombre: 'Aretes', icono: 'blur_on', dd: true },
  { nombre: 'Anillos', icono: 'panorama_fish_eye', dd: true },
  { nombre: 'Pulseras', icono: 'watch', dd: true },
  { nombre: 'Piercing', icono: 'adjust', dd: true },  
  { nombre: 'Promociones', icono: 'local_offer', dd: false },  
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

/*
.text-gold {
  color: #d4af37 !important; 
}

.categories-dropdown {
  font-weight: 500;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}


.q-list {
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.hover-gold:hover {
  color: #d4af37 !important;
  background: rgba(212, 175, 55, 0.1);
}
*/

</style>