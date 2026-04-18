<template>
    <q-card class="product-card bg-grey-4" bordered>
        <q-img :srcset="props.item.ui" :ratio="1">
            <q-badge v-if="props.item?.q == 0" floating color="negative" class="q-ma-sm">AGOTADO</q-badge>
            <q-badge v-else="props.item.novedad" floating class="q-ma-sm bg-gold-metallic">NUEVO</q-badge>
            <q-badge v-if="props.item.promocion" floating color="negative" class="q-ma-sm">OFERTA</q-badge>
        </q-img>
        <q-card-section class="text-center q-pb-none">
            <div class="product-name text-serif text-anthracite">{{ props.item.n }}</div>
            <div class="product-price text-h6 text-gold text-weight-bolder">
            ${{ props.item.pn.toLocaleString() }} MXN
            </div>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-md q-pt-sm">
            <!--<q-btn flat round color="positive" icon="mdi-whatsapp" @click="consultarWhatsapp(props.item)" />-->
            <q-btn flat round color="grey-9" icon="add_shopping_cart" @click="agregarAlCarrito(props.item)" />
        </q-card-actions>
    </q-card> 
</template>
<script setup>
import { ref  } from 'vue';
const props = defineProps(['item']);
const emit = defineEmits(['add', 'whts'])

const consultarWhatsapp = (item) => {
    emit('whts', item);
};

const agregarAlCarrito = (item) => {
    emit('add', item);
};

</script>
<style scoped>
.bg-gold-metallic {
  background: linear-gradient(to bottom, #fdfdfd 0%, #dbb462 30%, #b8860b 100%);  
  color: white; /* Texto blanco encima */
}
</style>