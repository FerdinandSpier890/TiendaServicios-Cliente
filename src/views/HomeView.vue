<template>
  <v-app class="app">
    <div class="background"></div>
    <v-main class="d-flex justify-center align-center">
      <v-col cols="10" lg="4" class="mx-auto">
        <v-card class="pa-4">
          <div class="text-center">
            <v-avatar size="100" color="indigo lighten-4">
              <v-icon size="40" color="indigo">mdi-account</v-icon>
            </v-avatar>
            <h2 class="indigo--text">Iniciar Sesion</h2>
          </div>
          <v-form @submit.prevent="submitHandler" ref="form">
            <v-card-text>
              <v-text-field v-model="userName" :rules="usernameRules" type="text" label="Nombre de Usuario"
                placeholder="Nombre de Usuario" prepend-inner-icon="mdi-account" required />
              <v-text-field v-model="password" :rules="passwordRules" :type="passwordShow ? 'text' : 'password'"
                label="Contraseña" placeholder="Contraseña" prepend-inner-icon="mdi-key"
                :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'" @click:append="passwordShow = !passwordShow"
                required />
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn :loading="loading" type="submit" color="indigo">
                <span class="white--text"><v-icon>mdi-login</v-icon> Iniciar Sesión</span>
              </v-btn>
              ㅤㅤ
              <div>
                <v-btn color="primary" to="/registro"><v-icon>mdi-account-box</v-icon> Crear Cuenta</v-btn>
              </div>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-main>
  </v-app>
</template>
<script>
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import auth from '../logic/auth.js'
export default {
  name: "App",

  data: () => ({
    loading: false,
    snackbar: false,
    passwordShow: false,
    userName: "",
    usernameRules: [(v) => !!v || "El Nombre de Usuario es Requerido"],
    password: "",
    passwordRules: [
      (v) => !!v || "La Contraseña es Requerida",
      (v) =>
        (v && v.length >= 6) || "La Contraseña Debe Tener 6 o Más Caracteres",
    ],
    snackbarColor: "",
    snackbarText: "",
  }),
  methods: {
    async submitHandler() {
      if (this.$refs.form.validate()) {
        try {
          const user = {
            userName: this.userName,
            password: this.password,
          };
          const response = await fetch(
            "https://localhost:44321/api/Account/Login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(user),
            }
          );
          if (!response.ok) {
            this.loading = true;
            setTimeout(() => {
              Swal.fire({
                title: "¡Error!",
                text: "Error al Iniciar Sesión, Intentalo Mas Tarde",
                icon: "error",
                confirmButtonClass: "btn-error",
              });
              this.loading = false;
            });
          } else {
            const data = await response.json();
            this.loading = true;
            setTimeout(() => {
              Swal.fire({
                title: "¡Bienvenido!",
                text: ":D",
                icon: "success",
                confirmButtonClass: "btn-success",
              });
              Cookies.set("token", data.token);
              auth.setUserLogged(JSON.stringify(user))
              this.loading = false;
              setTimeout(() => {
                this.$router.push("/autores");
              }, 3000);
            }, 5000);
          }
        } catch (error) {
          this.loading = true;
          setTimeout(() => {
            Swal.fire({
              title: "¡Error!",
              text: "Error la Iniciar Sesión, Intentalo Mas Tarde",
              icon: "error",
              confirmButtonClass: "btn-success",
            });
            console.log(error);
            this.loading = false;
          }, 5000);
        }
      } else {
        Swal.fire({
          title: "¡Error!",
          text: "Error al Iniciar Sesión, Intentalo Mas Tarde",
          icon: "error",
          confirmButtonClass: "btn-error",
        });
      }
    },
  },
};
</script>
<style>
.background {
  height: 300px;
  width: 100%;
  display: block;
  position: absolute;
  top: 0;
  background-size: cover;
}

.app {
  margin-top: auto;
}
</style>
