import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useBeRNiceStore = defineStore('bernice', {
  state: () => ({
    paginaActual:'',
    filtroActual: 'Todos',
    carrito: [],
    productosBerNice: [],
    productosNice: [],
    cargando: false,               
  }),

  getters: {
    totalCarrito: (state) => {
      return state.carrito.reduce((total, item) => total + (item.pn * item.cantidad), 0);
    },
    cantidadTotalArticulos: (state) => {
      return state.carrito.reduce((total, item) => total + item.cantidad, 0);
    }
  },
  actions: { 

    setFiltro(nuevaCategoria) {
      this.filtroActual = nuevaCategoria;
    },
    
    agregarAlCarrito(producto) {
      const existe = this.carrito.find(i => i.cn === producto.cn);
      if (existe) {
        existe.cantidad++;
      } else {
        // Agregamos el producto con cantidad inicial de 1
        this.carrito.push({ ...producto, cantidad: 1 });
      }
    },

    incrementarCantidad(prod) {
      const item = this.carrito.find(i => i.cn === prod.cn);
      if (item) item.cantidad++;
    },

    decrementarCantidad(prod) {
      const item = this.carrito.find(i => i.cn === prod.cn);
      if (item && item.cantidad > 1) {
        item.cantidad--;
      } else {
        this.eliminarDelCarrito(id);
      }
    },

    eliminarDelCarrito(prod) {
      this.carrito = this.carrito.filter(i => i.cn !== prod.cn);
    },  

    async getProductosNice() {      
      if (this.productosNice.length > 0) return; // No recargar si ya existen      
      this.cargando = true;
      try {
       const response = await api.get('/data/data-p-n.json');
        this.productosNice = response.data;
      } catch (error) {
        console.error('Error al leer el JSON:', error);
      } finally {
        this.cargando = false;
      }
    },  

    async getProductosBeRNice() {      
      if (this.productosBerNice.length > 0) return; // No recargar si ya existen      
      this.cargando = true;
      try {
       const response = await api.get('/data/data-p.json');
        this.productosBerNice = response.data;        
      } catch (error) {
        console.error('Error al leer el JSON:', error);
      } finally {
        this.cargando = false;
      }
    }      
  }
});