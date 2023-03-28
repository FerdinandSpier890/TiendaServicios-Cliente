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
            <v-card
              class="mx-auto"
              max-width="250"
              style="border: 5px solid #042c39"
              elevation="10"
            >
              <v-img :src="imagen" height="200px" />

              <v-card-title class="font-weight-bold"
                >Compra #{{ carrito.carritoId }}</v-card-title
              >
              <v-card-text class="font-weight-bold"
                >Fecha de la Compra #{{
                  carrito.fechaCreacionSesion
                }}</v-card-text
              >
              <hr />

              <v-col
                v-for="producto in carrito.listaDeProductos"
                :key="producto.id"
              >
                <v-card class="font-weight-bold">
                  Libro Adquirido: {{ producto.tituloLibro }}
                </v-card>

                <v-card class="font-weight-bold">
                  Precio: ${{ producto.precio }}
                </v-card>
              </v-col>
              <v-card
                class="font-weight-bold text-center mx-auto d-flex align-center d-flex align-center justify-center"
              >
              Total: ${{ getTotal(carrito).toFixed(2) }}
              </v-card>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="d-flex align-center justify-center">
          <v-col v-for="(carrito, index) in carritos" :key="index" md="4">
            <v-card
              class="mx-auto"
              max-width="250"
              style="border: 5px solid #042c39"
              elevation="10"
            >
              <v-img :src="imagen" height="200px" />
             

              <v-card-title class="font-weight-bold"
                >Compra #{{ carrito.carritoId }}</v-card-title
              >
              <v-card-text class="font-weight-bold"
                >Fecha de la Compra #{{
                  carrito.fechaCreacionSesion
                }}</v-card-text
              >
              <hr />

              <v-col
              v-for="(producto, index) in carrito.listaDeProductos" :key="index"
              >
                <v-card class="font-weight-bold" style="border: 5px solid #64d3bb">
                  Libro Adquirido: {{ producto.tituloLibro }}
                  <br/>
                  Precio: ${{ producto.precio }}
                </v-card>

              </v-col>
              <v-card
                class="font-weight-bold text-center mx-auto d-flex align-center d-flex align-center justify-center"
              >
                Total: ${{ getTotal(carrito).toFixed(2) }}
              </v-card>
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
  mounted() {
    this.fetchProducts();
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
    getTotal(carrito) {
      if (carrito.listaDeProductos) {
        return carrito.listaDeProductos.reduce((subtotal, producto) => {
          return subtotal + producto.precio;
        }, 0);
      } else {
        return 0;
      }
    },
    async fetchProducts() {
      try {
        const response = await fetch(
          "https://localhost:44335/api/CarritoCompras"
        );
        if (!response.ok) {
          Swal.fire({
            title: "¡Error!",
            text: "No Se Puede Obtener las Compras",
            icon: "error",
            confirmButtonClass: "btn-error",
          });
        }
        const data = await response.json();
        console.log(data);
        this.carritos = data;
      } catch (error) {
        Swal.fire({
          title: "¡Error!",
          text: error,
          icon: "error",
          confirmButtonClass: "btn-error",
        });
      }
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
          confirmButtonClass: "btn-error",
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
            confirmButtonClass: "btn-error",
          });
        } else {
          const data = await response.json();
          //console.log(data);
          this.cart = Array.isArray(data) ? data : [data];
        }
      } catch (error) {
        //console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Todavia no se ha Realizado esa Compra.",
          confirmButtonClass: "btn-error",
        });
      }
    },
  },
};
</script>
