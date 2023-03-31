<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Detalle de Compras de {{carrito.userName.toUpperCase()}}</h2>
        <v-row>
          <v-col cols="12" md="6">
            <v-btn block depressed color="info dark" dark elevation="10" @click="hacerCompra">
              <v-icon>mdi-cart</v-icon> Hacer Compra
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="d-flex align-center justify-center">
          <v-col v-for="(carrito, index) in carritos" :key="index" md="4">
            <v-card class="mx-auto" max-width="250" style="border: 5px solid #042c39" elevation="10">
              <v-img :src="imagen" height="200px" />

              <v-col>
                <v-card style="border: 5px solid #2b6760">
                  <v-card-title class="font-weight-bold">Compra #{{ carrito.carritoId
                  }}</v-card-title>
                </v-card>
              </v-col>

              <v-col>
                <v-card class="font-weight-bold" style="border: 5px solid #64d3bb">Fecha de la Compra: <br />{{ (new
                  Date(carrito.fechaCreacionSesion)).toLocaleDateString('es-ES', {
                    day: '2-digit', month: '2-digit',
                    year: 'numeric'
                  }) }} <br /> Compra Hecha Por: {{
    carrito.userName.toUpperCase()
  }}</v-card>
              </v-col>

              <hr />

              <v-col v-for="(producto, index) in carrito.listaDeProductos" :key="index">
                <v-card class="font-weight-bold" style="border: 5px solid #64d3bb">
                  Libro Adquirido: {{ producto.tituloLibro }}
                  <br />
                  Precio: ${{ producto.precio }}
                </v-card>

              </v-col>
              <v-col>
                <v-card
                  class="font-weight-bold text-center mx-auto d-flex align-center d-flex align-center justify-center"
                  style="border: 5px solid #2b6760">
                  Total: ${{ getTotal(carrito).toFixed(2) }}
                </v-card>
              </v-col>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <br />
    <div class="text-center">
      <v-btn depressed color="success dark" dark elevation="10" @click="iniciarSesion">
        <v-icon>mdi-login</v-icon> Iniciar Sesión
      </v-btn>
      ㅤㅤ
      <v-btn depressed color="error dark" dark elevation="10" @click="cerrarSesion">
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
      carritos: [],
      search: "",
      imagen:
        "https://imgs.search.brave.com/SFSzfeW-gCCuXfliFXj44AH1M9FbRRXfUuxEzuSTwmg/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93d3cu/YWRhemluZy5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMTkv/MDIvc3RhY2tlZC1i/b29rLWNsaXBhcnQt/MTEucG5n",
    };
  },
  computed: {
    cartFiltered() {
      return this.cart.filter(
        (carrito) => carrito.carritoId.toString() === this.search
      );
    },
  },
  created() {
    this.mostrarDetalleVenta();
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
    hacerCompra() {
      this.$router.push("/carrito");
    },
    getTotal(carrito) {
      if (carrito.listaDeProductos) {
        return carrito.listaDeProductos.reduce((subtotal, producto) => {
          return subtotal + producto.precio;
        }, 0);
      } else {
        return 0;
      }
    },
    async mostrarDetalleVenta() {
      const response = await fetch("https://localhost:44335/api/CarritoCompras/");
      if (!response.ok) {
        Swal.fire({
          title: "¡Error!",
          text: "No Se Pudo Obtener el Detalle de las Ventas, Intentalo de Nuevo",
          icon: "error",
          confirmButtonClass: "btn-error"
        });
        return;
      }
      const data = await response.json();
      // Obtener la cookie con el nombre "userLogged"
      const tokenUserName = decodeURIComponent(Cookies.get("userLogged"));

      // Decodificar el token para obtener el nombre de usuario
      const decodedToken = JSON.parse(tokenUserName);
      const userNameToken = decodedToken.userName;

      this.carritos = data.filter((carrito) => carrito.userName === userNameToken);
    },
  },
};
</script>
