<template>
  <!--<q-footer class="bg-black text-white q-py-lg">-->
    <q-footer class="bg-grey-10 text-white q-pa-md" style="border-top: 6px solid #D4AF37">
      <div class="container-footer">

      <div class="row justify-between q-pb-md">
        <div class="col-12 col-md-4">
          <q-img src="~assets/logo-claira-nice-horizontal-transparent.png" style="width: 300px" class="q-mb-md" />
        </div>

        <div class="col-12 col-md-4 text-left ">
          <p class="text-h6">CONTACTO</p>
          <p>6670 00000</p>          
          <a href="mailto:info@maestrosjoyeros.com">claira.be.r.nice@gmail.com</a>
        </div>

        <div class="col-12 col-md-4 text-left ">
          <br>
          <a href="#">Términos y condiciones</a>
          <br>
          <a href="#">Políticas de privacidad</a>
        </div>
      </div>
      <q-separator color="grey-8" />
      <div class="row justify-between q-pt-md">
        <div class="col-12 col-md-4 text-left ">
          <div class="social-icons">
            <q-btn flat round icon="fab fa-facebook-f" />
            <q-btn flat round icon="fab fa-instagram" />
            <q-btn flat round icon="fab fa-tiktok" />
          </div>
        </div>
        <div class="col-12 col-md-8 text-rigth copyright-text">
          <p>&copy; 2026 Claira Be r Nice. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  </q-footer>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const email = ref('')
    return { email }
  }
}
</script>

<style scoped>
.container-footer {
  max-width: 100%;
  margin: 0 auto;
}

.text-serif { font-family: 'Playfair Display', serif; }


a {
  color: white;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.subscribe-input {
  max-width: 250px;
}

.subscribe-btn {
  border: 1px solid white;
}

.currency-dropdown {
  color: white;
}

.social-icons {
  display: inline-flex;
}

.social-icons .q-btn {
  margin: 0 5px;
}

.copyright-text p {
  margin: 0;
}
</style>