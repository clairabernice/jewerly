<template>
  <q-dialog v-model="isOpen" position="right" full-height>
    <q-card class="column full-height" style="width: 400px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">TU CARRITO</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator q-mt-sm />

      <q-card-section class="col scroll q-py-none">
        <q-list v-if="store.carrito.length > 0" separator>
          <q-item v-for="item in store.carrito" :key="item.id" class="q-py-md">
            <q-item-section avatar>
              <q-img :src="item.imagen" class="rounded-borders" style="width: 60px; height: 60px" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium">{{ item.nombre }}</q-item-label>
              <q-item-label caption class="text-gold">
                ${{ item.precio.toLocaleString() }} MXN
              </q-item-label>
              
              <div class="row items-center q-mt-sm">
                <q-btn outline round size="xs" icon="remove" @click="store.decrementarCantidad(item.id)" />
                <span class="q-mx-md">{{ item.cantidad }}</span>
                <q-btn outline round size="xs" icon="add" @click="store.incrementarCantidad(item.id)" />
              </div>
            </q-item-section>

            <q-item-section side>
              <q-btn flat round color="grey-7" icon="delete" size="sm" @click="store.eliminarDelCarrito(item.id)" />
            </q-item-section>
          </q-item>
        </q-list>

        <div v-else class="column flex-center q-pa-xl text-grey-6 text-center">
          <q-icon name="shopping_bag" size="80px" />
          <p class="q-mt-md">Tu carrito está vacío</p>
          <q-btn label="Ir a comprar" color="black" v-close-popup />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="store.carrito.length > 0" class="q-pa-md">
        <div class="row justify-between text-subtitle1 q-mb-md">
          <span class="text-weight-bold">Total:</span>
          <span class="text-gold text-weight-bolder">${{ store.totalCarrito.toLocaleString() }} MXN</span>
        </div>
        <q-btn 
          color="black" 
          class="full-width q-py-sm" 
          label="FINALIZAR Y ENVIAR" 
          icon="picture_as_pdf"
          @click="handleFinalizarCompra"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { useJoyeriaStore } from 'src/stores/joyeria';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoJoyeria from 'src/assets/logo-claira-nice-transparent.png';

const $q = useQuasar();
const store = useJoyeriaStore();
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

// Sincronización del v-model
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const getBase64ImageFromURL = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = (error) => reject(error);
    img.src = url;
  });
};

// Función Principal: PDF + WhatsApp
const handleFinalizarCompra = async () => {
  $q.loading.show({ message: 'Generando pedido...' }); // Feedback visual

  try {
    const doc = new jsPDF();
    
    // 1. Obtener el logo (puedes usar la ruta de tu logo local o web)
    // Ejemplo: require('assets/logo-negro.png') o una URL directa
    const logoBase64 = await getBase64ImageFromURL(logoJoyeria);

    // 2. Insertar Logo (x: 15, y: 10, ancho: 25, alto: 25)
    doc.addImage(logoBase64, 'PNG', 15, 10, 50, 25);

    
    doc.setFontSize(10);
    doc.setTextColor(100);

    /*doc.text(`Pedido ID: ${Date.now()}`, 15, 40);*/
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 150, 40);

    // 4. Tabla de Productos
    const columnas = ['Producto', 'Precio Unit.', 'Cant.', 'Subtotal'];
    const filas = store.carrito.map(item => [
      item.nombre,
      `$${item.precio.toLocaleString()}`,
      item.cantidad,
      `$${(item.precio * item.cantidad).toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 42,
      head: [columnas],
      body: filas,
      theme: 'striped',
      headStyles: { fillColor: [212, 175, 55], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 3 }
    });

    // 5. Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`TOTAL A PAGAR: $${store.totalCarrito.toLocaleString()} MXN`, 15, finalY);

    // 6. Guardar y Enviar
    doc.save(`Pedido_Joyeria.pdf`);
    enviarWhatsApp();

  } catch (error) {
    console.error('Error al generar PDF:', error);
    $q.notify({ color: 'negative', message: 'No se pudo cargar el logo para el PDF' });
  } finally {
    $q.loading.hide();
  }
};

const enviarWhatsApp = () => {
  const telefono = '526671234567'; // Reemplaza con tu número real
  let mensaje = `*NUEVO PEDIDO`;
  mensaje += `--------------------------%0A`;
  
  store.carrito.forEach(item => {
    mensaje += `*${item.nombre}*%0A`;
    mensaje += `Cant: ${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}%0A%0A`;
  });

  mensaje += `--------------------------%0A`;
  mensaje += `*TOTAL: $${store.totalCarrito.toLocaleString()} MXN*%0A%0A`;
  mensaje += `_He generado mi PDF de pedido. Por favor, confírmenme para proceder._`;

  window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
};
</script>

<style scoped>
.text-gold {
  color: #d4af37;
}
</style>