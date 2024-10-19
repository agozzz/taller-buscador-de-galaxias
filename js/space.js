document.addEventListener('DOMContentLoaded', function() {
    const btnBuscar = document.getElementById('btnBuscar');
    const inputBuscar = document.getElementById('inputBuscar');
    const contenedor = document.getElementById('contenedor');

    const buscarImagenes = () => {
        const query = inputBuscar.value.trim(); // Obtiene el valor ingresado en el campo de búsqueda y elimina espacios en blanco

        // Verifica que el campo de búsqueda no esté vacío
        if (query) {
            const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`;

             // Realiza la solicitud a la API
             fetch(url)
             .then(response => {
                 // Verifica si la respuesta es válida
                 if (!response.ok) {
                     throw new Error('Error en la solicitud: ' + response.statusText);
                 }
                 return response.json(); // Convierte la respuesta en formato JSON
             })
             .then(data => {
                 // Limpia el contenedor antes de mostrar nuevos resultados
                 contenedor.innerHTML = '';

                 // Verifica que haya resultados
                 if (data.collection.items.length === 0) {
                     contenedor.innerHTML = '<p class="msjSinResultado">Lo lamento :( No hemos encontrado resultados para lo que buscabas.</p>'; // Mensaje si no hay resultados
                     return;
                 }
                    // Procesar cada item y mostrar en tarjetas
                    data.collection.items.forEach(item => {
                        // Desestructuración para obtener links y datos
                        const { links = [], data: dataInfo = [] } = item; 
                        const link = links[0] || null; // Obtiene el primer link
                        const info = dataInfo[0] || null; // Obtiene la primera información

                        // Verifica que existan el link y la información
                        if (link && info) {
                            const imageUrl = link.href; // URL de la imagen
                            const title = info.title; // Título de la imagen
                            const description = info.description || 'Sin descripción'; // Descripción, con valor por defecto
                            const date = info.date_created; // Fecha de creación

                            // Crea una tarjeta para cada imagen
                            const tarjeta = document.createElement('div'); // Crea un nuevo div
                            tarjeta.classList.add('col-md-4', 'mb-3'); // Añade clases para el estilo

                            // Define el contenido HTML de la tarjeta
                            tarjeta.innerHTML = `
                                <div class="card">
                                    <img src="${imageUrl}" class="card-img-top" alt="${title}">
                                    <div class="card-body">
                                        <h5 class="card-title">${title}</h5>
                                        <p class="card-text">${description}</p>
                                        <p class="card-text"><small class="text-muted">Fecha: ${new Date(date).toLocaleDateString()}</small></p>
                                    </div>
                                </div>
                            `;
                            // Añade la tarjeta al contenedor
                            contenedor.appendChild(tarjeta);
                        }
                    });
                })
                .catch(error => {
                    // Manejo de errores en la solicitud
                    console.error('Error al obtener los datos:', error);
                    contenedor.innerHTML = '<p class="msjSinResultado">No hemos podido cargar las imágenes :( ¡Por favor, intentalo otra vez!</p>';
                });
        } else {
            // Alerta si no se ingresa un término de búsqueda
            alert('No has ingresado nada en la búsqueda :( \nHay tanto para explorar... ¡No tengas miedo!');
        }
    };


    // Evento click al botón para buscar
    btnBuscar.addEventListener('click', buscarImagenes);

    // Evento keydown al campo de entrada
    inputBuscar.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            buscarImagenes();
        }
    });
});
