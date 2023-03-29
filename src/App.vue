<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" color="blue-grey darken-4" dark>
      <v-list dense>
        <v-list-item to="/autores" link>
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Autores - SQL Server</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/librerias" link>
          <v-list-item-icon>
            <v-icon>mdi-library</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Librerías - Firebase</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/libros" link>
          <v-list-item-icon>
            <v-icon>mdi-book</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Libros - MySQL</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/carrito" link>
          <v-list-item-icon>
            <v-icon>mdi-cart</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Carrito de Compras - SQL Server</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/carritodetalle" link>
          <v-list-item-icon>
            <v-icon>mdi-store</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Detalle de Compras - SQL Server</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <v-app-bar app color="blue-grey darken-4" dark>
      <div class="d-flex align-center">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Libros Online</v-toolbar-title>
        <v-spacer></v-spacer>
        
        <v-btn text to="/autores"
          ><v-icon left>mdi-account</v-icon>Autores</v-btn
        >
        <v-btn text to="/librerias"
          ><v-icon left>mdi-library</v-icon>Librerías</v-btn
        >
        <v-btn text to="/libros"><v-icon left>mdi-book</v-icon>Libros</v-btn>
        <v-btn text to="/carrito"
          ><v-icon left>mdi-cart</v-icon> Carrito de compras</v-btn
        >
        <v-btn text to="/carritodetalle"
          ><v-icon left>mdi-store</v-icon>Detalle de compras</v-btn
        >
        
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container >
        <router-view />
      </v-container>
    </v-main>

    <br/>

    <v-footer class="blue-grey darken-4">
    <v-container>
      <v-row>
        <v-col cols="12" md="4" class="text-center text-md-left">
          <h4 class="white--text">Sobre nosotros</h4>
          <p class="white--text">Somos una tienda online de libros dedicada a ofrecer los mejores títulos y la mejor experiencia de compra a nuestros clientes.</p>
        </v-col>
        <v-col cols="12" md="4" class="text-center">
          <h4 class="white--text">Redes Sociales</h4>
          <v-btn fab small color="indigo" class="mx-2" href="https://www.facebook.com/Lord.Peacock.890/"><v-icon>mdi-facebook</v-icon></v-btn>
          <v-btn fab small color="indigo" class="mx-2"><v-icon>mdi-twitter</v-icon></v-btn>
          <v-btn fab small color="indigo" class="mx-2" href="https://www.instagram.com/iam_lordp890/"><v-icon>mdi-instagram</v-icon></v-btn>
        </v-col>
        <v-col cols="12" md="4" class="text-center text-md-right">
          <h4 class="white--text">Contacto</h4>
          <p class="white--text">Correo electrónico: 20300019@uttt.edu.mx</p>
          <p class="white--text">Teléfono: +52 (773) 226-5327</p>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data(){
    return{
      drawer: false
    }
  }
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
