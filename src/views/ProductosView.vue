<template>
    <div>
        <navigation />
        <h1>Productos</h1>
        <v-row>
            <v-col cols="12" md="6">
                <v-text-field v-model="searchById" label="Buscar por ID" @input="buscarProductoId"
                    prepend-inner-icon="mdi-book"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field v-model="searchByCategory" label="Buscar por Categoria" @input="buscarProductoCategoria"
                    prepend-inner-icon="mdi-book"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <v-btn block depressed color="info dark" dark elevation="10" @click="nuevoProducto = true"
                    prepend-inner-icon="mdi-add">
                    <v-icon left>mdi-plus</v-icon> Nuevo Producto
                </v-btn>
            </v-col>
        </v-row>
        <v-col>
            <v-row class="d-flex align-center justify-center">
                <v-col v-for="productos in products" :key="productos.id" md="3">
                    <v-card class="mx-auto align-center" max-width="250" style="border: 5px solid #3e7864" elevation="10">
                        <v-img :src="imagen" height="200px" />
                        <v-card-title class="font-weight-bold">{{
                            productos.nombre
                        }}</v-card-title>
                        <hr />
                        <v-card-text class="font-weight-bold">ID: {{ productos.id }}</v-card-text>
                        <v-card-text class="font-weight-bold">Categoría: {{ productos.categoria }}</v-card-text>
                        <v-card-text class="font-weight-bold">Resumen: {{ productos.resumen }}</v-card-text>
                        <v-card-text class="font-weight-bold">Descripción: {{ productos.descripcion }}</v-card-text>
                        <v-card-text class="font-weight-bold">Imagen: {{ productos.imagenArchivo }}</v-card-text>

                        <v-card-text class="font-weight-bold">
                            Precio: ${{ productos.precio.toFixed(2) }}
                        </v-card-text>

                        <!-- Botón de eliminar -->
                        <v-btn @click="eliminarProducto(productos.id)" color="red" dark>
                            Eliminar
                        </v-btn>

                        <!-- Botón de actualizar -->
                        <v-btn @click="abrirDialogo(productos)" color="blue" dark>
                            Actualizar
                        </v-btn>
                    </v-card>
                </v-col>
            </v-row>
            <v-dialog v-model="dialogoAbierto" max-width="500px">
                <v-card>
                    <v-card-title>Actualizar Registro</v-card-title>
                    <v-card-text>
                        <v-form ref="formulario" @submit.prevent="actualizarProducto">
                            <v-text-field v-model="formulario.nombre" label="Nombre"></v-text-field>
                            <v-text-field v-model="formulario.categoria" label="Categoría"></v-text-field>
                            <v-text-field v-model="formulario.resumen" label="Resumen"></v-text-field>
                            <v-text-field v-model="formulario.descripcion" label="Descripción"></v-text-field>
                            <v-text-field v-model="formulario.imagenArchivo" label="Imagen"></v-text-field>
                            <v-text-field v-model="formulario.precio" label="Precio" type="number"
                                step="0.01"></v-text-field>

                            <v-card-actions>
                                <v-btn type="submit" color="green">Guardar</v-btn>
                                <v-btn @click="cerrarDialogo" color="red">Cancelar</v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-col>
        <v-dialog v-model="nuevoProducto">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-form v-model="valid">
                        <v-text-field v-model="nombre" label="Nombre del Producto" required
                            prepend-inner-icon="mdi-book"></v-text-field>
                        <v-text-field v-model="categoria" label="Categoría del Producto" required
                            prepend-inner-icon="mdi-calendar-month"></v-text-field>
                        <v-text-field v-model="resumen" label="Resumen del Producto" required
                            prepend-inner-icon="mdi-currency-usd"></v-text-field>
                        <v-text-field v-model="descripcion" label="Descripción del Producto" required
                            prepend-inner-icon="mdi-currency-usd"></v-text-field>
                        <v-text-field v-model="imagenArchivo" label="Imagen del Producto" required
                            prepend-inner-icon="mdi-currency-usd"></v-text-field>
                        <v-text-field v-model="precio" label="Precio del Producto" required
                            prepend-inner-icon="mdi-currency-usd"></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="nuevoProducto = false">
                        Cancelar
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="guardarProducto">
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
            products: [],
            searchById: "",
            searchByCategory: "",
            nuevoProducto: false,
            formTitle: "",
            valid: false,
            nombre: "",
            categoria: "",
            resumen: "",
            descripcion: "",
            imagenArchivo: "",
            precio: "",
            dialogoAbierto: false,
            formulario: {
                id: '',
                nombre: '',
                categoria: '',
                resumen: '',
                descripcion: '',
                imagenArchivo: '',
                precio: '',
            },
            imagen:
                "https://imgs.search.brave.com/SFSzfeW-gCCuXfliFXj44AH1M9FbRRXfUuxEzuSTwmg/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93d3cu/YWRhemluZy5jb20v/d3AtY29udGVudC91/cGxvYWRzLzIwMTkv/MDIvc3RhY2tlZC1i/b29rLWNsaXBhcnQt/MTEucG5n",
        };
    },
    created() {
        this.mostrarProductos();
    },
    methods: {
        async mostrarProductos() {
            const response = await fetch("http://169.254.135.234:9091/api/Catalog");
            if (!response.ok) {
                Swal.fire({
                    title: "¡Error!",
                    text: "No se Pudo Obtener los Productos, Intentalo de Nuevo",
                    icon: "error",
                    confirmButtonClass: "btn-error",
                });
                return;
            }
            const data = await response.json();
            this.products = data;
        },
        async buscarProductoId() {
            if (this.searchById === "") {
                const response = await fetch("https://localhost:44364/api/Catalog/");
                const data = await response.json();
                this.products = data;
            } else {
                const response = await fetch(
                    `https://localhost:44364/api/Catalog/${this.searchById}`
                );
                if (!response.ok) {
                    return;
                }
                const data = await response.json();
                this.products = [data];
            }
        },
        async buscarProductoCategoria() {
            if (this.searchByCategory === "") {
                const response = await fetch("https://localhost:44364/api/Catalog/");
                const data = await response.json();
                this.products = data;
            } else {
                const response = await fetch(`https://localhost:44364/api/Catalog/GetProductByCategory/${this.searchByCategory}`);
                if (!response.ok) {
                    return;
                }
                const data = await response.json();
                this.products = data; // Asignar directamente el resultado de la búsqueda sin envolverlo en un array
            }
        },

        async eliminarProducto(id) {
            // Obtener el token de la cookie
            const token = Cookies.get("token");
            // Verificar si el token está presente en la cookie
            if (!token) {
                Swal.fire({
                    title: "¡Error!",
                    text: "No Tienes Autorización para Eliminar un Producto, Inicia Sesión",
                    icon: "error",
                    confirmButtonClass: "btn-error",
                });
                return;
            }
            try {
                const response = await fetch(`https://localhost:44364/api/Catalog/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    // Actualizar la lista de productos después de eliminar
                    this.products = this.products.filter((producto) => producto.id !== id);
                    Swal.fire({
                        title: "¡Registro Eliminado!",
                        text: "Se Eliminó el Producto Exitosamente",
                        icon: "success",
                        confirmButtonClass: "btn-success",
                    });
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: "No Se Pudo Eliminar el Producto, Intentalo de Nuevo",
                        icon: "error",
                        confirmButtonClass: "btn-error",
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "¡Error!",
                    text: "No Se Pudo Eliminar el Producto, Intentalo de Nuevo", error,
                    icon: "error",
                    confirmButtonClass: "btn-error",
                });
                console.error('Error al eliminar el producto', error);
            }
        },
        async guardarProducto() {
            // Obtener el token de la cookie
            const token = Cookies.get("token");
            // Verificar si el token está presente en la cookie
            if (!token) {
                Swal.fire({
                    title: "¡Error!",
                    text: "No Tienes Autorización para Registrar un Producto, Inicia Sesión",
                    icon: "error",
                    confirmButtonClass: "btn-error",
                });
                return;
            }

            const precioConvertido = this.convertirPrecio(this.precio);

            const nuevoProducto = {
                nombre: this.nombre,
                categoria: this.categoria,
                resumen: this.resumen,
                descripcion: this.descripcion,
                imagenArchivo: this.imagenArchivo,
                precio: precioConvertido
            };

            const response = await fetch("http://169.254.135.234:9091/api/Catalog/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(nuevoProducto),
            });

            if (!response.ok) {
                Swal.fire({
                    title: "¡Error!",
                    text: "No Se Pudo Registrar el Producto, Intentalo de Nuevo",
                    icon: "error",
                    confirmButtonClass: "btn-error",
                });
                return;
            } else {
                Swal.fire({
                    title: "¡Registro Exitoso!",
                    text: "Se Registró el Producto Exitosamente",
                    icon: "success",
                    confirmButtonClass: "btn-success",
                });
            }

            this.nuevoProducto = false;
            this.nombre = "";
            this.categoria = "";
            this.resumen = "";
            this.descripcion = "";
            this.imagenArchivo = "";
            this.precio = "";
            this.mostrarProductos();
        },
        convertirPrecio(valor) {
            if (!valor) {
                return null;
            }
            return parseFloat(valor);
        },
        abrirDialogo(productos) {
            // Asignar los datos del producto al formulario
            const precioConvertido = parseFloat(productos.precio);

            this.formulario.id = productos.id;
            this.formulario.nombre = productos.nombre;
            this.formulario.categoria = productos.categoria;
            this.formulario.resumen = productos.resumen;
            this.formulario.descripcion = productos.descripcion;
            this.formulario.imagenArchivo = productos.imagenArchivo;
            this.formulario.precio = precioConvertido

            this.dialogoAbierto = true;
        },
        cerrarDialogo() {
            this.dialogoAbierto = false;
            // Reiniciar los datos del formulario
            this.formulario = {
                id: '',
                nombre: '',
                categoria: '',
                resumen: '',
                descripcion: '',
                imagenArchivo: '',
                precio: '',
            };
        },
        async actualizarProducto() {
            try {
                // Convertir el valor de precio a un número decimal
                const precioConvertido = parseFloat(this.formulario.precio);

                // Asignar el valor convertido al formulario
                this.formulario.precio = precioConvertido;

                const response = await fetch(`https://localhost:44364/api/Catalog/${this.formulario.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.formulario),
                });
                if (response.ok) {
                    //this.products = this.products.filter((producto) => producto.id !== id);
                    Swal.fire({
                        title: "¡Registro Actualizado!",
                        text: "Se Actualizó el Producto Exitosamente",
                        icon: "success",
                        confirmButtonClass: "btn-success",
                    });
                    // Actualizar la lista de productos después de actualizar
                    this.mostrarProductos();
                    this.cerrarDialogo();
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: "No Se Pudo Actualizar el Producto, Intentalo de Nuevo",
                        icon: "error",
                        confirmButtonClass: "btn-error",
                    });
                    console.error('Error al actualizar el producto', response);
                }
            } catch (error) {
                Swal.fire({
                    title: "¡Error!",
                    text: "No Se Pudo Actualizar el Producto, Intentalo de Nuevo", error,
                    icon: "error",
                    confirmButtonClass: "btn-error",
                });
                console.error('Error al actualizar el producto', error);
            }
        },

    },
};
</script>
<style>
.border-green {
    border: 2px solid #146b63;
}
</style>  