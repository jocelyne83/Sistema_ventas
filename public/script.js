document.addEventListener("DOMContentLoaded", () => {
    const productoSelect = document.getElementById("producto");
    const form = document.getElementById("ventaForm");
    const resultadoDiv = document.getElementById("resultado");

    //  GET /productos
    fetch("/productos")
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                
                data.data.forEach(p => {
                    const option = document.createElement("option");
                    option.value = p.id;
                    option.textContent = `${p.nombre} - $${p.precio}`;
                    productoSelect.appendChild(option);
                });
            } else {
                productoSelect.innerHTML = "<option>Error al cargar productos</option>";
            }
        })
        .catch(() => {
            productoSelect.innerHTML = "<option>Error de red</option>";
        });

      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const productoId = productoSelect.value;
        const cantidad = parseInt(document.getElementById("cantidad").value);

        if (!productoId || isNaN(cantidad) || cantidad <= 0) {
            resultadoDiv.textContent = "Selecciona un producto y una cantidad válida.";
            return;
        }
        

    //inventario de los productos
     fetch('/inventario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoId, cantidad })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            resultadoDiv.textContent = ` Total: $${data.total} - Stock restante: ${data.stockRestante}`;
        } else {
            resultadoDiv.textContent = ` ${data.message}`;
        }
    })
    .catch(() => {
        resultadoDiv.textContent = "Error al procesar la venta.";
    });
    });

});
