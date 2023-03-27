import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";

import RegistroView from '../views/RegistroView.vue';
import AutoresView from "../views/AutoresView.vue";
import LibreriasView from "../views/LibreriasView.vue";
import LibrosView from "../views/LibrosView.vue";
import CarritoView from "../views/CarritoView.vue";
import CarritoDetalleView from "../views/CarritoDetalleView.vue";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

Vue.use(VueRouter);

function isAuthenticated() {
  const token = Cookies.get("token");
  return token && token !== "undefined";
}

const requireAuth = (to, from, next) => {
  if (!isAuthenticated()) {
    Swal.fire("¡Error!", "Recuerda que Primero Debes Iniciar Sesión", "error");
    next("/");
  } else {
    next();
  }
};

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/registro",
    name: "registro",
    component: RegistroView
  },
  {
    path: "/autores",
    name: "autores",
    component: AutoresView,
    beforeEnter: requireAuth
  },
  {
    path: "/librerias",
    name: "librerias",
    component: LibreriasView,
    beforeEnter: requireAuth
  },
  {
    path: "/libros",
    name: "libros",
    component: LibrosView,
    beforeEnter: requireAuth
  },
  {
    path: "/carrito",
    name: "carrito",
    component: CarritoView,
    beforeEnter: requireAuth
  },
  {
    path: "/carritodetalle",
    name: "carritodetalle",
    component: CarritoDetalleView,
    beforeEnter: requireAuth
  },
];

const router = new VueRouter({
  routes,
});

export default router;
