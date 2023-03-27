<template>
  <div>
    <navigation />
    <h1>Librerias</h1>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Buscar por GUID"
          @input="buscarLibreria"
          prepend-inner-icon="mdi-book"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn
          block
          depressed
          color="success"
          @click="nuevaLibreria = true"
          prepend-inner-icon="mdi-add"
        >
          <v-icon left>mdi-plus</v-icon> Nueva Libreria
        </v-btn>
      </v-col>
    </v-row>
    <v-col>
      <v-row class="d-flex align-center justify-center">
        <v-col v-for="librerias in library" :key="librerias.id" md="3">
          <v-card
            class="mx-auto"
            max-width="250"
            style="border: 5px solid #8c242c"
            elevation="10"
          >
            <v-img :src="imagen" height="200px" />
            <v-card-title class="font-weight-bold"
              >{{ librerias.libreriaId }} {{ librerias.nombre }}</v-card-title
            >
            <hr />
            <v-card-text class="font-weight-bold"
              >Contacto: {{ librerias.correoContacto }}</v-card-text
            >
            <v-card-text class="font-weight-bold"
              >Direccion: {{ librerias.direccion }}</v-card-text
            >
            <v-card-text class="font-weight-bold"
              >Telefono: {{ librerias.telefono }}</v-card-text
            >
            <v-card-text class="font-weight-bold"
              >Código de Libreria: {{ librerias.libreriaGuid }}</v-card-text
            >
          </v-card>
        </v-col>
      </v-row>
    </v-col>
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
    <v-dialog v-model="nuevaLibreria">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-text-field
              v-model="libreriaId"
              label="Id de la Libreria"
              required
              prepend-inner-icon="mdi-book"
            ></v-text-field>
            <v-text-field
              v-model="nombre"
              label="Nombre de la Libreria"
              required
              prepend-inner-icon="mdi-book"
            ></v-text-field>
            <v-text-field
              v-model="correoContacto"
              label="Correo de Contacto"
              required
              prepend-inner-icon="mdi-email"
            ></v-text-field>
            <v-text-field
              v-model="direccion"
              label="Dirección de la Libreria"
              required
              prepend-inner-icon="mdi-map-marker"
            ></v-text-field>
            <v-text-field
              v-model="telefono"
              label="Telefono de la Libreria"
              required
              prepend-inner-icon="mdi-phone"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="nuevaLibreria = false">
            Cancelar
          </v-btn>
          <v-btn color="blue darken-1" text @click="guardarLibreria">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import auth from "../logic/auth.js";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      library: [],
      search: "",
      nuevaLibreria: false,
      formTitle: "",
      valid: false,
      libreriaId: "",
      nombre: "",
      correoContacto: "",
      direccion: "",
      telefono: "",
      imagen:
        "https://imgs.search.brave.com/_bF3Ux63OrX4xMIb9bRY5MCKn-LTj33kb7uJjMcTEck/rs:fit:612:496:1/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vdmVjdG9y/cy9yZWQtbGlicmFy/eS1jYXJ0b29uLWJ1/aWxkaW5nLWljb24t/dmVjdG9yLWlkNjk1/OTI0MDE4P2s9NiZt/PTY5NTkyNDAxOCZz/PTYxMng2MTImdz0w/Jmg9dTZxQ3Jpbllp/ZVNuY3lSd3F0RmNo/VUkzZUo0VFJoamVI/dEZwZEE5cDhFTT0",
      //libreriaGuid: VueUUID.v1(),
    };
  },
  created() {
    this.mostrarLibrerias();
  },
  methods: {
    async mostrarLibrerias() {
      const response = await fetch("https://localhost:44327/api/Librerias");
      if (!response.ok) {
        Swal.fire({
          title: "¡Error!",
          text: "No Se Pudo Obtener las Librerias, Intentalo de Nuevo",
          icon: "error",
          confirmButtonClass: "btn-error"
        });
        return;
      }
      const data = await response.json();
      this.library = data;
    },

    async buscarLibreria() {
      if (this.search === "") {
        const response = await fetch("https://localhost:44327/api/Librerias");
        const data = await response.json();
        this.library = data;
      } else {
        const response = await fetch(
          `https://localhost:44327/api/Librerias/${this.search}`
        );
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        this.library = [data];
      }
    },

    async guardarLibreria() {
      const libreriaUUID = uuidv4();
      // Obtener el token de la cookie
      const token = Cookies.get("token");
      // Verificar si el token está presente en la cookie
      if (!token) {
        Swal.fire({
          title: "¡Error!",
          text: "No Tienes Autorización para Registrar una Libreria, Inicia Sesión",
          icon: "error",
          confirmButtonClass: "btn-error"
        });
        return;
      }
      const nuevaLibreria = {
        libreriaId: this.libreriaId,
        nombre: this.nombre,
        correoContacto: this.correoContacto,
        direccion: this.direccion,
        telefono: this.telefono,
        libreriaGuid: libreriaUUID,
      };

      const response = await fetch("https://localhost:44327/api/Librerias/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaLibreria),
      });

      if (!response.ok) {
        Swal.fire({
          title: "¡Error!",
          text: "No Se Pudo Registrar la Libreria, Intentalo de Nuevo",
          icon: "error",
          confirmButtonClass: "btn-error"
        });
        return;
      } else {
        Swal.fire({
          title: "¡Registro Exitoso!",
          text: "Se Registró la Libreria Exitosamente",
          icon: "success",
          confirmButtonClass: "btn-success"
        });
      }

      this.nuevaLibreria = false;
      this.libreriaId = "";
      this.nombre = "";
      this.correoContacto = "";
      this.direccion = "";
      this.telefono = "";
      this.mostrarLibrerias();
    },
    cerrarSesion() {
      auth.deleteUserLogged();
      location.reload();
      this.$router.go(0);
    },
    iniciarSesion() {
      this.$router.push("/");
    },
  },
};
</script>
