<template>
  <v-container>
    <v-row>
      <v-col md="6">
        <h2>Libros Disponibles</h2>
        <v-row>
          <v-col v-for="product in products" :key="product.id" md="6">
            <v-card class="mx-auto" max-width="350" style="border: 5px solid #3e7864" elevation="10">
              <v-img :src="imagen" height="200px" />
              <v-card-title class="font-weight-bold">{{
                product.titulo
              }}</v-card-title>
              <hr />
              <v-card-text class="text-center font-weight-bold" style="font-size: 20px !important">${{
                product.precio.toFixed(2) }}</v-card-text>
              <v-card-actions>
                <v-btn class="mx-auto d-flex align-center" depressed color="primary dark" dark elevation="10"
                  @click="addToCart(product); cartCount++"
  style="transition: all 0.5s ease;">
                  <v-icon>mdi-cart-plus</v-icon> Agregar al carrito
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col md="6">
        <h2>Carrito de Compras</h2>
        <br />
        <v-row>
          <v-col v-for="(item, index) in cart" :key="index" md="6">
            <v-card ref="cart" class="mx-auto" max-width="350" style="border: 5px solid #3e7864" elevation="10">
              <v-img :src="imagen" height="200px" />
              <v-card-title class="font-weight-bold">{{
                item.titulo
              }}</v-card-title>
              <hr />
              <v-card-text class="font-weight-bold">ISBN: {{ item.libreriaMateriaId }}</v-card-text>
              <v-card-text class="font-weight-bold">Fecha de Publicacion: {{ (new
                Date(item.fechaPublicacion)).toLocaleDateString('es-ES', {
                  day: '2-digit', month: '2-digit',
                  year: 'numeric'
                }) }}</v-card-text>
              <v-card-text class="font-weight-bold">Código de Autor: {{ item.autorLibro }}</v-card-text>
              <v-card-title class="font-weight-bold" style="font-size: 25px !important">Precio: ${{ item.precio.toFixed(2)
              }}</v-card-title>
              <v-card-actions>
                <v-btn class="mx-auto d-flex align-center" depressed color="error dark" dark elevation="10"
                  @click="removeFromCart(index)">
                  <v-icon>mdi-cart-remove</v-icon> Eliminar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-card class="mt-3" style="border: 5px solid #3e7864" elevation="10">
          <v-card-title
            class="text-center font-weight-bold mx-auto d-flex align-center d-flex align-center justify-center"
            style="font-size: 25px !important">
            Total a Pagar: ${{ getTotal.toFixed(2) }}
          </v-card-title>

          <v-card-actions>
            <v-btn class="mx-auto d-flex align-center" depressed color="success dark" dark elevation="10"
              @click="checkout()">
              <v-icon>mdi-credit-card</v-icon> Comprar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import auth from "../logic/auth.js";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      cart: [],
      products: [],
      imagen:
        "https://imgs.search.brave.com/SFSzfeW-gCCuXfliFXj44AH1M9FbRRXfUuxEzuSTwmg/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93d3cu/YWRhemluZy5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMTkv/MDIvc3RhY2tlZC1i/b29rLWNsaXBhcnQt/MTEucG5n",
      fechaCreacionSesion: new Date().toISOString(),
      productoLista: [],
      libreriaMateriaId: "",
      cartCount: 0, // Nueva propiedad
    };
  },
  computed: {
    getTotal() {
      return this.cart.reduce((total, item) => total + item.precio, 0);
    },
  },
  methods: {
    addToCart(product) {
      const cartItem = {
        titulo: product.titulo,
        libreriaMateriaId: product.libreriaMateriaId,
        fechaPublicacion: product.fechaPublicacion,
        precio: product.precio,
        autorLibro: product.autorLibro,
      };
      this.cart.push(cartItem);
      // Guardar carrito en localStorage
      localStorage.setItem("cart", JSON.stringify(this.cart));

      const button = event.currentTarget;
  button.style.transform = "translate(0, -50px)";
  button.style.opacity = 0;
  setTimeout(() => {
    button.style.transform = "none";
    button.style.opacity = 1;
  }, 1000);
    },
    removeFromCart(index) {
      this.cart.splice(index, 1);
      // Guardar carrito en localStorage
      localStorage.setItem("cart", JSON.stringify(this.cart));

      // Agregar animación al carrito
      const cartEl = this.$refs.cart;
      cartEl.classList.add("animate__animated", "animate__bounceIn");
      setTimeout(() => {
        cartEl.classList.remove("animate__animated", "animate__bounceIn");
      }, 1000);
    },
    async checkout() {
      // Verificar si hay productos en el carrito
      if (this.cart.length === 0) {
        Swal.fire({
          title: "¡Error!",
          text: "No Se Puede Procesar la Compra, No Hay Libros en el Carrito",
          icon: "error",
          confirmButtonClass: "btn-error",
        });
        return;
      }

      // Obtener el token de la cookie
      const token = Cookies.get("token");
      // Verificar si el token está presente en la cookie
      if (!token) {
        Swal.fire({
          title: "¡Error!",
          text: "No Tienes Autorización para Hacer una Compra, Inicia Sesión",
          icon: "error",
          confirmButtonClass: "btn-error",
        });
        //this.cart = [];
        return;
      }
      // Obtener la cookie con el nombre "userLogged"
      const tokenUserName = decodeURIComponent(Cookies.get("userLogged"));

      // Decodificar el token para obtener el nombre de usuario
      const decodedToken = JSON.parse(tokenUserName);
      const userName = decodedToken.userName;

      // Mostrar un SweetAlert de confirmación antes de realizar la compra
      const confirmationResult = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres confirmar la compra?",
        icon: "question",
        confirmButtonClass: "btn-success",
        cancelButtonClass: "btn-error",
        showCancelButton: true,
        confirmButtonText: "Sí, comprar",
        cancelButtonText: "No, cancelar",
      });

      // Verificar si el usuario confirmó la compra
      if (confirmationResult.isConfirmed) {
        const nuevaCompra = {
          fechaCreacionSesion: this.fechaCreacionSesion,
          userName: userName,
          productoLista: this.cart.map((producto) => producto.libreriaMateriaId),
        };
        const response = await fetch(
          "https://localhost:44335/api/CarritoCompras",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(nuevaCompra),
          }
        );

        if (!response.ok) {
          Swal.fire({
            title: "¡Error!",
            text: "No Se Pudo Realizar la Compra, Intentalo de Nuevo",
            icon: "error",
            confirmButtonClass: "btn-error",
          });
          return;
        } else {
          const total = this.getTotal.toFixed(2);
          Swal.fire({
            title: "¡Compra Exitosa!",
            text: `Se Realizó la Compra Exitosamente,\nPagaste un Total de $${total}`,
            icon: "success",
            confirmButtonClass: "btn-success",
          });

          localStorage.clear();
          this.$router.push("/carritodetalle");
        }
        this.cart = [];
      }
    },

    async fetchProducts() {
      try {
        const response = await fetch("https://localhost:44398/api/Libros");
        if (!response.ok) {
          Swal.fire({
            title: "¡Error!",
            text: "No Se Puede Obtener los Libros",
            icon: "error",
            confirmButtonClass: "btn-error",
          });
        }
        const data = await response.json();
        this.products = data;
      } catch (error) {
        Swal.fire({
          title: "¡Error!",
          text: error,
          icon: "error",
          confirmButtonClass: "btn-error",
        });
      }
    },
  },
  mounted() {
    this.fetchProducts();

    // Recuperar carrito de localStorage
    const cart = localStorage.getItem("cart");
    if (cart) {
      this.cart = JSON.parse(cart);
    }
  },
};
</script>