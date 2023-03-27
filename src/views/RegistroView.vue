<template>
  <v-app>
    <div class="background"></div>
    <v-main class="d-flex justify-center align-center">
      <v-col cols="10" lg="4" class="mx-auto">
        <v-card class="pa-4">
          <div class="text-center">
            <v-avatar size="100" color="indigo lighten-4">
              <v-icon size="40" color="indigo">mdi-account</v-icon>
            </v-avatar>
            <h2 class="indigo--text">Crear Cuenta</h2>
          </div>
          <v-form @submit.prevent="submitHandler" ref="form">
            <v-card-text>
              <v-text-field
                v-model="userName"
                :rules="usernameRules"
                type="text"
                label="Nombre de Usuario"
                placeholder="Nombre de Usuario"
                prepend-inner-icon="mdi-account"
                required
              />
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :type="passwordShow ? 'text' : 'password'"
                label="Contraseña"
                placeholder="Contraseña"
                prepend-inner-icon="mdi-key"
                :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="passwordShow = !passwordShow"
                required
              />
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn :loading="loading" type="submit" color="indigo">
                <span class="white--text"><v-icon>mdi-account-box</v-icon> Registrarse</span>
              </v-btn>
              ㅤㅤ
              <div>
                <v-btn color="primary" to="/"><v-icon>mdi-login</v-icon> Iniciar Sesion</v-btn>
              </div>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      loading: false,
      snackbar: false,
      snackbarText: "",
      snackbarColor: "",
      passwordShow: false,
      userName: "",
      usernameRules: [(v) => !!v || "El Nombre de Usuario es Requerido"],
      password: "",
      passwordRules: [
        (v) => !!v || "La Contraseña es Requerida",
        (v) =>
          (v && v.length >= 6) ||
          "La Contraseña debe de tener 6 o mas Caracteres",
      ],
    };
  },

  methods: {
    async submitHandler() {
      if (this.$refs.form.validate()) {
        try {
          const response = await fetch(
            "https://localhost:44321/api/Account/Register",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userName: this.userName,
                password: this.password,
              }),
            }
          );
          if (!response.ok) {
            this.loading = true;
            setTimeout(() => {
              Swal.fire({
                title: "¡Error!",
                text: "Por el Momento no Puedes Crear una Cuenta, Intentalo Mas Tarde",
                icon: "error",
                confirmButtonClass: "btn-error",
              });
              this.loading = false;
              setTimeout(() => {
                this.$router.push("/");
              }, 4000);
            }, 5000);
          } else {
            this.loading = true;
            setTimeout(() => {
              Swal.fire({
                title: "¡Felicidades!",
                text: "Ya Tienes una Cuenta :D",
                icon: "success",
                confirmButtonClass: "btn-success",
              });
              this.loading = false;
              setTimeout(() => {
                this.$router.push("/");
              }, 4000);
            }, 5000);
          }
        } catch (errorCatch) {
          this.loading = true;
          setTimeout(() => {
            Swal.fire({
                title: "¡Error!",
                text: "Por el Momento no Puedes Crear una Cuenta, Intentalo Mas Tarde",
                icon: "error",
                confirmButtonClass: "btn-error",
              });
            this.loading = false;
          }, 4000);
        }
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
</style>
