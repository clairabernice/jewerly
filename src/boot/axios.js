import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Creamos una instancia personalizada
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://clairabernice.github.io/jewerly'
    : 'http://localhost:9000'
})


export default boot(({ app }) => {
  // Para usar dentro de archivos .vue (Options API) vía this.$axios y this.$api
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

// Exportamos la instancia para usarla en Pinia o Composition API
export { api }