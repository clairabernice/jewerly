<template>
  <q-page padding class="bg-gallery-white">
    <div class="q-py-lg" >
      <h2 class="text-h4 text-weight-thin text-center text-anthracite q-mb-xl text-uppercase letter-spacing-2">
        Coleccion Nice
      </h2>    
      <q-btn fab color="gold-metallic" icon="search" @click="showFiltros = true" v-if="!seHaDesplazado"></q-btn>                   
      <div class="row q-col-gutter-xl justify-start q-pa-md">      
        <div 
          v-for="item in productosFiltrados" 
          :key="item.id" 
          class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
          <ProductCard 
            :item="item" 
            @add="handleAgregarCarrito" 
            @whts="consultarWhatsapp"
          />
        </div>
        <div ref="scrollObserver" style="height: 10px;"></div>
      </div>  
      <q-scroll-observer @scroll="alScroll" />
      <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">        
        <q-btn fab icon="keyboard_arrow_up" class="bg-gold-metallic" />
      </q-page-scroller>   
      
      <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 80]">
      <q-btn 
        fab 
        icon="search" 
        class="bg-gold-metallic"
        @click="showFiltros = true"
      >
        <q-badge v-if="filtrosActivosConteo > 0" color="red" floating>
          {{ filtrosActivosConteo }}
        </q-badge>
      </q-btn>
    </q-page-scroller>      
    </div>  
    <Filtros 
      v-model="showFiltros" 
      v-model:filtrosActuales="misFiltros"
      :productosBase="productosNice" 
    />
  </q-page>
</template>

<script setup>

import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';

import ProductCard from 'src/components/ProductCard.vue';
import Filtros from 'src/components/Filtros.vue';
import { useBeRNiceStore } from 'src/stores/bernice-store';

const scrollObserver = ref(null);
const cantidadAMostrar = ref(50);

const store = useBeRNiceStore();
const $q = useQuasar();
const showFiltros = ref(false);
const { productosNice } = storeToRefs(store);

const misFiltros = ref({ 
  nombre: '', 
  codigo: '', 
  categoria: '', 
  precio: {
    min: 99,
    max: 2999
  } 
});

const seHaDesplazado = ref(false);

// Función que detecta el scroll
const alScroll = (info) => {
  // Si ha bajado más de 400px, cambiamos el botón
  seHaDesplazado.value = info.position.top > 400;
};

const productosFiltrados = computed(() => {
  return itemsFiltrados.value.slice(0, cantidadAMostrar.value);
});

const cargarMas = () => {
  if (cantidadAMostrar.value < itemsFiltrados.value.length) {
    cantidadAMostrar.value += 50;
  }
};

// ESTA ES LA LÓGICA QUE DEBE ESTAR AQUÍ
const itemsFiltrados = computed(() => {
  return productosNice.value.filter(item => {
    const f = misFiltros.value;

    const cumpleNombre = !f.nombre || 
      item.n.toLowerCase().includes(f.nombre.toLowerCase());

    const cumpleCodigo = !f.codigo || 
      item.cn.toString().toLowerCase().includes(f.codigo.toLowerCase());

    const cumpleCategoria = !f.categoria || 
      item.ct === f.categoria;

    const cumplePrecio = item.pn >= f.precio.min && item.pn <= f.precio.max;

    return cumpleNombre && cumpleCodigo && cumpleCategoria && cumplePrecio;
  });
});

// ACCIÓN: Agregar al carrito real (Pinia)
const handleAgregarCarrito = (producto) => {
  store.agregarAlCarrito(producto);  
  $q.notify({ 
    message: `${producto.n} añadido al carrito`, 
    color: 'blue', // Color elegante
    textColor: 'gold-1',
    icon: 'shopping_bag',
    position: 'top', 
    timeout: 1200 
  });
};

// ACCIÓN: Contacto por WhatsApp
const consultarWhatsapp = (producto) => {
  const mensaje = encodeURIComponent(`Hola, me interesa información sobre: ${producto.n}`);
  window.open(`https://wa.me/526673527666?text=${mensaje}`, '_blank');
};

let observer;

onMounted(async() => {
  await store.getProductosNice();
  store.paginaActual = "nice";
  observer = new IntersectionObserver((entries) => {
    // Si el centinela entra en pantalla
    if (entries[0].isIntersecting) {
      cargarMas();
    }
  }, { threshold: 1.0 });

  if (scrollObserver.value) {
    observer.observe(scrollObserver.value);
  }
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});

watch(misFiltros, () => {
  cantidadAMostrar.value = 50;
  window.scrollTo(0, 0); // Opcional: vuelve arriba al filtrar
}, { deep: true });
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