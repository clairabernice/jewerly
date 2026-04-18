import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useNiceStore = defineStore('nice', {
  state: () => ({
    mostrarDiv: false,
    productos: [],
    cargando: false,
    filtrosAbiertos: false
  }),
  
  actions: {
    toggleDiv() {
      this.mostrarDiv = !this.mostrarDiv;
    },
    async cargarProductos() {      
      if (this.productos.length > 0) return; // No recargar si ya existen      
      this.cargando = true;
      try {
       const response = await api.get('/data/data-p-n.json');
        this.productos = response.data;
      } catch (error) {
        console.error('Error al leer el JSON:', error);
      } finally {
        this.cargando = false;
      }
    }
  }
});