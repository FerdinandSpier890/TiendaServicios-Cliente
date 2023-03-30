import Cookies from "js-cookie";
import Swal from "sweetalert2";

export default {
  async iniciarSesion(userName, password) {
    const user = { userName, password };
    try {
      const response = await fetch("https://localhost:44321/api/Account/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        Swal.fire({
          title: "¡Error!",
          text: "Error al Iniciar Sesión",
          icon: "error",
          confirmButtonClass: "btn-error",
        });
      } else {
        const data = await response.json();
        Cookies.set('token', data.token);
      }
    } catch (error) {
      console.log(error);
    }
  },
  async getUserLogged () {
    return await Cookies.get('token');
  },
  async deleteUserLogged () {
    await Cookies.remove('token');
    await Cookies.remove('userLogged');
    //Cookies.remove('userLogged')
  },
  async setUserLogged (userLogged) {
    await Cookies.set('userLogged', userLogged);
  },
};
