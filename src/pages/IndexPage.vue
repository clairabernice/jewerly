<template>
  <q-page padding class="bg-gallery-white">
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

    <div class="q-py-lg" v-if="niceStore.mostrarDiv">
      <h2 class="text-h4 text-weight-thin text-center text-anthracite q-mb-xl text-uppercase letter-spacing-2">
        Coleccion Nice
      </h2>

      <div class="row q-col-gutter-xl justify-start q-pa-md">
        <div 
          v-for="item in niceStore.productos" 
          :key="item.id" 
          class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
        >
          <ProductCard 
            :item="item" 
            @add="handleAgregarCarrito" 
            @whts="consultarWhatsapp"
          />
        </div>
      </div>
      <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
        <q-btn fab icon="keyboard_arrow_up" class="bg-gold-metallic" />
      </q-page-scroller>            
    </div>


    <div class="q-py-lg" v-if="!niceStore.mostrarDiv">
      <h2 class="text-h4 text-weight-thin text-center text-anthracite q-mb-xl text-uppercase letter-spacing-2">
        {{ store.filtroActual === 'Todos' ? 'Nuestra Colección' : store.filtroActual }}
      </h2>

      <div class="row q-col-gutter-xl justify-start q-pa-md">
        <div 
          v-for="item in productosFiltrados" 
          :key="item.id" 
          class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
        >
          <ProductCard 
            :item="item" 
            @add="handleAgregarCarrito" 
            @whts="consultarWhatsapp"
          />
        </div>
      </div>
      <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
        <q-btn fab icon="keyboard_arrow_up" class="bg-gold-metallic" />
      </q-page-scroller>            
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useJoyeriaStore } from 'src/stores/joyeria';
import { useNiceStore } from 'src/stores/nice-store';

import ProductCard from 'src/components/ProductCard.vue';
import { api } from 'boot/axios';

const store = useJoyeriaStore();
const niceStore = useNiceStore();

const $q = useQuasar();
const slide = ref(1);
const productos = ref([]);

// Carga de productos desde el JSON
const cargarBRProductos = async () => {
  try {    
    const response = await api.get('/data/data-p.json');
    productos.value = response.data;
  } catch (error) {
    console.error('Error al leer el JSON:', error);
    $q.notify({ message: 'Error al cargar productos', color: 'negative' });
  }
};

// Helper para rutas de imágenes locales
const getImageUrl = (name) => {
  return new URL(`../assets/bg/${name}`, import.meta.url).href;
};

const listaImagenes = ref([
  { id: 1, url: getImageUrl('bg-1.avif'), titulo: 'Elegancia Atemporal', descripcion: 'Nueva colección de diamantes' },
  { id: 2, url: getImageUrl('bg-2.avif'), titulo: 'Diseños Exclusivos', descripcion: 'Hechos a mano para ti' },
  { id: 3, url: getImageUrl('bg-3.avif'), titulo: 'Momentos Especiales', descripcion: 'Anillos de compromiso' },
  { id: 4, url: getImageUrl('bg-4.avif'), titulo: 'Artesanía Fina', descripcion: 'Calidad certificada' },  
]);

// Lógica de Filtrado (Computed)
const productosFiltrados = computed(() => {
  let lista = productos.value;

  if (store.filtroActual === 'Novedades') {
    lista = lista.filter(p => p.novedad !== false);
  } else if (store.filtroActual === 'Promociones') {
    lista = lista.filter(p => p.promocion === true);
  } else if (store.filtroActual !== 'Todos') {
    lista = lista.filter(p => p.categoria === store.filtroActual);
  }
  
  if (store.search) {
    const s = store.search.toLowerCase();
    lista = lista.filter(p => p.nombre.toLowerCase().includes(s));
  }
  return lista;
});

// ACCIÓN: Agregar al carrito real (Pinia)
const handleAgregarCarrito = (producto) => {
  store.agregarAlCarrito(producto);
  
  $q.notify({ 
    message: `${producto.nombre} añadido al carrito`, 
    color: 'blue', // Color elegante
    textColor: 'gold-1',
    icon: 'shopping_bag',
    position: 'top', 
    timeout: 1200 
  });
};

// ACCIÓN: Contacto por WhatsApp
const consultarWhatsapp = (producto) => {
  const mensaje = encodeURIComponent(`Hola, me interesa información sobre: ${producto.nombre}`);
  window.open(`https://wa.me/52667XXXXXXX?text=${mensaje}`, '_blank');
};

onMounted(async () => {
  await cargarBRProductos();
});
</script>

<style lang="scss" scoped>
.bg-gallery-white { background-color: #FDFDFD; }
.text-anthracite { color: #2D3436; }
.text-serif { font-family: 'Playfair Display', serif; }
.letter-spacing-2 { letter-spacing: 2.5px; }

.custom-caption {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  color: white;
}

.bg-gold-metallic {
  background: linear-gradient(135deg, #dbb462 0%, #b8860b 100%);
  color: white;
}

.product-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
  }
}

.mi-descripcion {
  position: absolute;
  bottom: 50px; /* Lo subimos 50px para saltar los puntos */
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 15px;
  text-align: center;
  z-index: 10; /* Asegura que flote sobre los controles */
}
</style>