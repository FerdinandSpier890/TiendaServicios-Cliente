<template>
  <div>
    <navigation />
    <h1>Libros</h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Buscar por GUID"
          @input="buscarLibro"
          prepend-inner-icon="mdi-book"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn
          block
          depressed
          color="info dark"
          dark
          elevation="10"
          @click="nuevoLibro = true"
          prepend-inner-icon="mdi-add"
        >
          <v-icon left>mdi-plus</v-icon> Nuevo Libro
        </v-btn>
      </v-col>
    </v-row>
    <v-col>
      <v-row class="d-flex align-center justify-center">
        <v-col v-for="libros in books" :key="libros.id" md="3">
          <v-card
            class="mx-auto align-center"
            max-width="250"
            style="border: 5px solid #3e7864"
            elevation="10"
          >
            <v-img :src="imagen" height="200px" />
            <v-card-title class="font-weight-bold">{{
              libros.titulo
            }}</v-card-title>
            <hr />
            <v-card-text class="font-weight-bold"
              >ISBN: {{ libros.libreriaMateriaId }}</v-card-text
            >
            <v-card-text class="font-weight-bold"
              >Fecha de Publicación: {{ (new
                    Date(libros.fechaPublicacion)).toLocaleDateString('es-ES', {
                      day: '2-digit', month: '2-digit',
                      year: 'numeric'
                    }) }}</v-card-text
            >
            <v-card-text class="font-weight-bold"
              >Precio: ${{ libros.precio }}</v-card-text
            >
            <v-card-text class="font-weight-bold"
              >Código de Autor: {{ libros.autorLibro }}</v-card-text
            >
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-dialog v-model="nuevoLibro">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-text-field
              v-model="titulo"
              label="Titulo del Libro"
              required
              prepend-inner-icon="mdi-book"
            ></v-text-field>
            <v-text-field
              v-model="fechaPublicacion"
              label="Fecha de Publicacion"
              required
              prepend-inner-icon="mdi-calendar-month"
            ></v-text-field>
            <v-text-field
              v-model="precio"
              label="Precio del Libro"
              required
              prepend-inner-icon="mdi-currency-usd"
            ></v-text-field>
            <v-select
              v-model="autores"
              :items="autor"
              label="Autor del Libro"
              prepend-inner-icon="mdi-account"
              required
              item-text="nombre"
              item-value="autorLibroGuid"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="nuevoLibro = false">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="guardarLibro">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import auth from "../logic/auth.js";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      books: [],
      search: "",
      nuevoLibro: false,
      formTitle: "",
      valid: false,
      titulo: "",
      fechaPublicacion: new Date().toISOString(),
      precio: "",
      autores: null,
      autor: [],
      imagen:
        "https://imgs.search.brave.com/SFSzfeW-gCCuXfliFXj44AH1M9FbRRXfUuxEzuSTwmg/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93d3cu/YWRhemluZy5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMTkv/MDIvc3RhY2tlZC1i/b29rLWNsaXBhcnQt/MTEucG5n",
    };
  },
  created() {
    this.mostrarLibros();
    this.listaAutores();
  },
  methods: {
    async listaAutores() {
      const response = await fetch("https://localhost:44320/api/Autor");
      if (!response.ok) {
        Swal.fire({
          title: "¡Error!",
          text: "No se Pudo Obtener los Autores, Intentalo de Nuevo",
          icon: "error",
          confirmButtonClass: "btn-error",
        });
        return;
      }
      const data = await response.json();
      this.autor = data; // data.map((autorLibro) => autorLibro.autorLibroGuid);
    },
    async mostrarLibros() {
      const response = await fetch("https://localhost:44398/api/Libros");
      if (!response.ok) {
        Swal.fire({
          title: "¡Error!",
          text: "No se Pudo Obtener los Libros, Intentalo de Nuevo",
          icon: "error",
          confirmButtonClass: "btn-error",
        });
        return;
      }
      const data = await response.json();
      this.books = data;
    },
    async buscarLibro() {
      if (this.search === "") {
        const response = await fetch("https://localhost:44398/api/Libros");
        const data = await response.json();
        this.books = data;
      } else {
        const response = await fetch(
          `https://localhost:44398/api/Libros/${this.search}`
        );
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        this.books = [data];
      }
    },
    async guardarLibro() {
      // Obtener el token de la cookie
      const token = Cookies.get("token");
      // Verificar si el token está presente en la cookie
      if (!token) {
        Swal.fire({
          title: "¡Error!",
          text: "No Tienes Autorización para Registrar un Libro, Inicia Sesión",
          icon: "error",
          confirmButtonClass: "btn-error",
        });
        return;
      }

      const precioConvertido = this.convertirPrecio(this.precio);

      const nuevoLibro = {
        titulo: this.titulo,
        fechaPublicacion: this.fechaPublicacion,
        precio: precioConvertido,
        autorLibro: this.autores,
      };

      const response = await fetch("https://localhost:44398/api/Libros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoLibro),
      });

      if (!response.ok) {
        Swal.fire({
          title: "¡Error!",
          text: "No Se Pudo Registrar el Libro, Intentalo de Nuevo",
          icon: "error",
          confirmButtonClass: "btn-error",
        });
        return;
      } else {
        Swal.fire({
          title: "¡Registro Exitoso!",
          text: "Se Registró el Libro Exitosamente",
          icon: "success",
          confirmButtonClass: "btn-success",
        });
      }

      this.nuevoLibro = false;
      this.titulo = "";
      this.fechaPublicacion = "";
      this.precio = "";
      this.mostrarLibros();
    },
    convertirPrecio(valor) {
      if (!valor) {
        return null;
      }
      return parseFloat(valor);
    },
  },
};
</script>
<style>
.border-green {
  border: 2px solid #146b63;
}
</style>
