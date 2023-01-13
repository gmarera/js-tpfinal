fetch("./libros.json")
    .then(resp => resp.json())
    .then(libros => {

        let carrito = JSON.parse(localStorage.getItem('carrito')) || []
        
        const contenedor = document.querySelector('#contenedor')
        const carritoContenedor = document.querySelector('#carritoContenedor')
        const vaciarCarrito = document.querySelector('#vaciarCarrito')
        const precioTotal = document.querySelector('#precioTotal')
        const comprarCarrito = document.querySelector('#comprarCarrito')
        
        mostrarCarrito()
        
        document.addEventListener('DOMContentLoaded', () => {
            carrito = JSON.parse(localStorage.getItem('carrito')) || []
            mostrarCarrito()
        })

        const buscador = document.getElementById("searchByText")
        buscador.addEventListener("input", renderizarLibrosFiltrados)

        renderizarLibros(libros)

        function guardarStorage() {
            localStorage.setItem("carrito", JSON.stringify(carrito))
        }

        function renderizarLibros(libros) {
            contenedor.innerHTML = ""
            libros.forEach((libro) => {
                const { id, titulo, autor, paginas, img, precio, editorial, cantidad, categoria } = libro
                contenedor.innerHTML += `
                <div class="card m-1" style="width: 18rem;">
                    <img class="card-img-top mt-2" src="${img}" title="Páginas ${paginas} - ISBN: ${id}">
                    <div class="card-body">
                        <h5 class="card-title">${titulo}</h5>
                        <p class="card-text">Autor: ${autor}</p>
                        <p class="card-text">Editorial: ${editorial}</p>
                        <p class="card-text">Categoría: ${categoria}</p>
                        <p class="card-text">Precio: <strong>$ ${precio}</strong></p>
                        <button onclick="agregarProducto(${id})" class="btn btn-primary">Agregar al Carrito</button>
                    </div>
                </div>`
            })
        }

        eliminarLibro = function (id) {
            const libroId = id
            carrito = carrito.filter((libro) => libro.id !== libroId)
            mostrarDeleteCart()
            mostrarCarrito()
        }

        function renderizarLibrosFiltrados(e) {
            const librosFiltrados = libros.filter(o => { return (o.titulo.toLowerCase().includes(buscador.value.toLowerCase()) || o.categoria.toLowerCase().includes(buscador.value.toLowerCase()) || o.editorial.toLowerCase().includes(buscador.value.toLowerCase())) })
            renderizarLibros(librosFiltrados)
        }

        function mostrarCarrito() {
            const modalBody = document.querySelector('.modal .modal-body')
            modalBody.innerHTML = ""
            carrito.forEach((libro) => {
                const { id, titulo, autor, paginas, img, precio, editorial, cantidad, categoria } = libro
                modalBody.innerHTML += `
                <div class="modal-contenedor">
                    <div>
                        <img class="img-fluid img-carrito" src="${img}"/>
                    </div>
                    <div>
                        <p>Título: ${titulo}</p>
                        <p>Precio: $ ${precio}</p>
                        <p>Cantidad: ${cantidad}</p>
                        <button onclick="eliminarLibro(${id})" class="btn btn-danger">Eliminar Libro</button>

                    </div>
                <div>
                `
            })
            if (carrito.length === 0) {
                modalBody.innerHTML += `
                <p class="text-center text-primary">No hay libros en el carrito</p>`
            }
            carritoContenedor.textContent = carrito.length
            precioTotal.textContent = carrito.reduce((acc, libro) => acc + libro.cantidad * libro.precio, 0)
            guardarStorage()
        }

        agregarProducto = function (id) {
            const existe = carrito.some(libro => libro.id === id)
            if (existe) {
                const libro = carrito.map(libro => {
                    if (libro.id === id) {
                        libro.cantidad++
                    }
                })
            } else {
                const libro = libros.find((libro) => libro.id === id)
                carrito.push(libro)
            }
            localStorage.setItem("carrito", JSON.stringify(carrito))
            mostrarAddCart()
            mostrarCarrito()
        }

        vaciarCarrito.addEventListener('click', () => {
            carrito.length = []
            localStorage.clear()
            mostrarCarrito()
            carritoVaciado()
        })

        comprarCarrito.addEventListener('click', () => {
            carrito.length = []
            localStorage.clear()
            mostrarCarrito()
            compraOk()
        })

        function carritoVaciado() {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Su carrito ahora se encuentra vacío',
                showConfirmButton: false,
                timer: 2500
            })
        }

        function compraOk() {
            Swal.fire({
                position: 'center',
                icon: 'info',
                title: 'Gracias por realizar su compra. Nos pondremos en contacto a la brevedad.',
                showConfirmButton: false,
                timer: 4000
            })
        }

        function mostrarAddCart() {
            Toastify({
                text: "Libro agregado al carrito",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #0c990c , #0dca0d)",
                },
            }).showToast();
        }

        function mostrarDeleteCart() {
            Toastify({
                text: "Libro eliminado del carrito",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #ff0000 , #f1474f)",
                },
            }).showToast();
        }
    })