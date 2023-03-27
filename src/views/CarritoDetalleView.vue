<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Detalle de la Compra</h2>
        <v-row>
          <v-col>
            <v-text-field 
              v-model="search"
              label="Buscar por ID de la Compra"
              prepend-inner-icon="mdi-book"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn block depressed color="success" @click="buscarCompra">
              <v-icon>mdi-search</v-icon> Buscar
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="d-flex align-center justify-center">
          <v-col v-for="carrito in cartFiltered" :key="carrito.id" md="6">
            <v-card class="mx-auto" max-width="250" style="border: 5px solid #042c39;" elevation="10">
              <v-img :src="imagen" height="200px" />
              <v-card-title class="font-weight-bold">Compra #{{ carrito.carritoId }}</v-card-title>
              <hr>
              <v-card-text>{{ carrito.listaDeProductos.Titulo }}</v-card-text>
              <v-card-text class="font-weight-bold"
                >Fecha de Compra: {{ carrito.fechaCreacionSesion }}</v-card-text
              >
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <br />
    <div class="text-center">
      <v-btn color="success" @click="iniciarSesion">
        <v-icon>mdi-login</v-icon> Iniciar Sesión
      </v-btn>
      ㅤㅤ
      <v-btn color="error" @click="cerrarSesion">
        <v-icon>mdi-logout</v-icon> Cerrar Sesión
      </v-btn>
    </div>
  </v-container>
</template>
<script>
import auth from "../logic/auth.js";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      cart: [],
      search: "",
      imagen:
        "https://imgs.search.brave.com/SFSzfeW-gCCuXfliFXj44AH1M9FbRRXfUuxEzuSTwmg/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93d3cu/YWRhemluZy5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMTkv/MDIvc3RhY2tlZC1i/b29rLWNsaXBhcnQt/MTEucG5n",
    };
  },
  computed: {
  cartFiltered() {
    return this.cart.filter(carrito => carrito.carritoId.toString() === this.search);
  }
},

  methods: {
    cerrarSesion() {
      auth.deleteUserLogged();
      location.reload();
      this.$router.go(0);
    },
    iniciarSesion() {
      this.$router.push("/");
    },
    async buscarCompra() {
      // Obtener el token de la cookie
      const token = Cookies.get("token");
      // Verificar si el token está presente en la cookie
      if (!token) {
        Swal.fire({
          title: "¡Error!",
          text: "No Tienes Autorización para Buscar esta Compra, Inicia Sesión",
          icon: "error",
          confirmButtonClass: "btn-error"
        });
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:44335/api/CarritoCompras/${this.search}`,
          {
            method: "GET",
            Authorization: `Bearer ${token}`,
          }
        );
        if (!response.ok) {
          Swal.fire({
          icon: "error",
          title: "Error",
          text: "Todavía no se ha Realizado esa Compra",
          confirmButtonClass: "btn-error"
        });
        } else {
          const data = await response.json();
        console.log(data);
        this.cart = Array.isArray(data) ? data : [data];
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Todavia no se ha Realizado esa Compra.",
          confirmButtonClass: "btn-error"
        });
      }
    },

  },
};
</script>
