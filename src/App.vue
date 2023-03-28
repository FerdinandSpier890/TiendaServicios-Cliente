<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <div id="nav">
        <router-link to="/autores" style="text-decoration: none;"><v-icon>mdi-account</v-icon> Autores</router-link> |
        <router-link to="/librerias" style="text-decoration: none;"><v-icon>mdi-library</v-icon> Librerias</router-link> |
        <router-link to="/libros" style="text-decoration: none;"><v-icon>mdi-book</v-icon> Libros</router-link> |
        <router-link to="/carrito" style="text-decoration: none;"><v-icon>mdi-cart</v-icon> Carrito de Compras</router-link> |
        <router-link to="/carritodetalle" style="text-decoration: none;"><v-icon>mdi-cart-plus</v-icon> Detalle de las Compras</router-link> |
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
<style>
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
