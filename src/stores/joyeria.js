import { defineStore } from 'pinia';

export const useJoyeriaStore = defineStore('joyeria', {
  state: () => ({
    filtroActual: 'Todos',
    search: '',
    carrito: []
    // Eliminamos carritoCount manual porque usaremos el largo del array carrito
  }),

  getters: {
    // Calcula el total de dinero en el carrito
    totalCarrito: (state) => {
      return state.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    },
    // Calcula cuántos productos hay en total (sumando cantidades)
    cantidadTotalArticulos: (state) => {
      return state.carrito.reduce((total, item) => total + item.cantidad, 0);
    }
  },

  actions: { 
    // ESTA ES LA FUNCIÓN QUE CORRIGE TU ERROR
    setFiltro(nuevaCategoria) {
      this.filtroActual = nuevaCategoria;
    },

    setSearch(texto) {
      this.search = texto;
    },

    agregarAlCarrito(producto) {
      const existe = this.carrito.find(i => i.id === producto.id);
      if (existe) {
        existe.cantidad++;
      } else {
        // Agregamos el producto con cantidad inicial de 1
        this.carrito.push({ ...producto, cantidad: 1 });
      }
    },

    incrementarCantidad(id) {
      const item = this.carrito.find(i => i.id === id);
      if (item) item.cantidad++;
    },

    decrementarCantidad(id) {
      const item = this.carrito.find(i => i.id === id);
      if (item && item.cantidad > 1) {
        item.cantidad--;
      } else {
        this.eliminarDelCarrito(id);
      }
    },

    eliminarDelCarrito(id) {
      this.carrito = this.carrito.filter(i => i.id !== id);
    }
  }
});