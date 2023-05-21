<template>
  <div>
    <navigation />
    <h1>Autores</h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="search" label="Buscar por GUID" @input="buscarAutor"
          prepend-inner-icon="mdi-account"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn block depressed color="info dark" dark elevation="10" @click="nuevoAutor = true"
          prepend-inner-icon="mdi-add">
          <v-icon left>mdi-plus</v-icon> Nuevo Autor
        </v-btn>
      </v-col>
    </v-row>
    <v-col>
      <v-row class="d-flex align-center justify-center">
        <v-col v-for="autor in people" :key="autor.id" md="3">
          <v-card class="mx-auto" max-width="250" style="border: 5px solid #b4fbfb" elevation="10">
            <v-img :src="imagen" height="200px" />
            <v-card-title class="font-weight-bold">{{ autor.nombre }} {{ autor.apellido }}</v-card-title>
            <hr />
            <v-card-text class="font-weight-bold">Fecha de Nacimiento: {{ (new
              Date(autor.fechaNacimiento)).toLocaleDateString('es-ES', {
                day: '2-digit', month: '2-digit',
                year: 'numeric'
              }) }}</v-card-text>
            <v-card-text class="font-weight-bold">Código de Autor: {{ autor.autorLibroGuid }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <br />
    <v-dialog v-model="nuevoAutor">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-text-field v-model="nombre" label="Nombre" required prepend-inner-icon="mdi-account"></v-text-field>
            <v-text-field v-model="apellido" label="Apellido" required prepend-inner-icon="mdi-account"></v-text-field>
            <v-text-field v-model="fechaNacimiento" label="Fecha de Nacimiento" required
              prepend-inner-icon="mdi-calendar-month"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="nuevoAutor = false">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="guardarAutor">
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
      people: [],
      search: "",
      nuevoAutor: false,
      formTitle: "",
      valid: false,
      nombre: "",
      apellido: "",
      fechaNacimiento: new Date().toISOString(),
      imagen:
        "https://imgs.search.brave.com/6sMNuKdDwHDuWOkYCNWlHwY6y2W9OzRbDyH_i0vWjGA/rs:fit:1200:1200:1/g:ce/aHR0cDovL3d3dy53/aWtpaG93LmNvbS9p/bWFnZXMvZi9mZi9E/cmF3LWEtQ3V0ZS1D/YXJ0b29uLVBlcnNv/bi1TdGVwLTE0Lmpw/Zw",
    };
  },
  created() {
    this.mostrarAutores();
  },
  methods: {
    async mostrarAutores() {
      const response = await fetch("https://localhost:44320/api/Autor");
      if (!response.ok) {
        Swal.fire({
          title: "¡Error!",
          text: "No Se Pudo Obtener los Autores, Intentalo de Nuevo",
          icon: "error",
          confirmButtonClass: "btn-error",
        });
        return;
      }
      const data = await response.json();
      this.people = data;
    },
    async buscarAutor() {
      if (this.search === "") {
        const response = await fetch("https://localhost:44320/api/Autor");
        const data = await response.json();
        this.people = data;
      } else {
        const response = await fetch(
          `https://localhost:44320/api/Autor/${this.search}`
        );
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        this.people = [data];
      }
    },
    async guardarAutor() {
      // Obtener el token de la cookie
      const token = Cookies.get("token");
      // Verificar si el token está presente en la cookie
      if (!token) {
        Swal.fire({
          title: "¡Error!",
          text: "No Tienes Autorización para Registrar un Autor, Inicia Sesión",
          icon: "error",
          confirmButtonClass: "btn-error",
        });
        return;
      }

      const nuevoAutor = {
        nombre: this.nombre,
        apellido: this.apellido,
        fechaNacimiento: this.fechaNacimiento,
      };

      const response = await fetch("https://localhost:44320/api/Autor/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoAutor),
      });

      if (!response.ok) {
        Swal.fire({
          title: "¡Error!",
          text: "No Se Pudo Registrar el Autor, Intentalo de Nuevo",
          icon: "error",
          confirmButtonClass: "btn-error",
        });
        return;
      } else {
        Swal.fire({
          title: "¡Registro Exitoso!",
          text: "Se Registró el Autor Exitosamente",
          icon: "success",
          confirmButtonClass: "btn-success",
        });
      }

      this.nuevoAutor = false;
      this.nombre = "";
      this.apellido = "";
      this.fechaNacimiento = new Date().toISOString();
      this.mostrarAutores();
    },
  },
};
</script>
