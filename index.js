const express = require('express');
const app=(express());
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//servir archivos estaticos desde public 
app.use(express.static(__dirname + '/public'));


app.get('/ventas', (req, res) => {
    res.render('ventas'); // No necesita pasar productos porque se obtienen por JS
});
 

//Middleware para extraer informacion en formato json de las solicitudes|
app.use(express.json());
let productos = [
    
    { id:1,
    nombre:"Base de Maquillaje",
    precio:1500,
    stock: 10
    },
    {id:2,
    nombre:" Polvo translucido",
    precio:250,
    stock: 20
    },
    { id:3,
    nombre:"labiales",
    precio:800,
    stock: 15
    },
    {
    id:4,
    nombre:"rimel",
    precio:500,
    stock: 25
    },
    {
    id:5,
    nombre:"blush",
    precio:250,
    stock: 30},
    {
        id:6,
        nombre:"delineador",    
        precio:300,
        stock: 18
    },
    {
        id:7,
        nombre:"brochas",
        precio:1200,
        stock: 12
    }
];
//obtener productos del get  
app.get('/productos', (req, res) => {
    res.json({
        success:true,//indica exito
        const: productos.length, //cantidad de total de productos
        data: productos //array completo
    })
    
});

/*
//
app.get('/productos', (req, res) => {
    //convertir el parametro id en un numero entero 
    const id = parseInt(req.params.id);
    //validar que el id sea un numero valido
    if(isNaN(id)) {
        return res.status(400).json({
            // http 400: bad request 
            success: false,
            message: 'ID invalido'
        });
    }

});*/

//segundo endpoint para obtener producto por id
app.get('/productos/:id', (req, res) => {
 try {
    //convertir el parametro id en un numero entero 
    const id = parseInt(req.params.id);
    
    //validar que el id sea un numero valido
    if(isNaN(id)) {
        return res.status(400).json({
            // http 400: bad request 
            success: false,
            message: 'ID invalido'
        });
    }
         //buscar producto por id
        const producto = productos.find(p => p.id === id);
    if(!producto) {
        return res.status(404).json({
            success: false,
            message: `Producto con id : ${id} no encontrado`
        });
    }else {
        //si el producto existe, devolverlo 
        res.json({
        success: true,
        data: producto
        });
    }
    } catch (error) {
        res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
        })
    }
});

app.post('/inventario', (req, res) => {
    const { productoId, cantidad } = req.body;
    const id = parseInt(productoId);
    const qty = parseInt(cantidad);

    if (isNaN(id) || isNaN(qty) || qty <= 0) {
        return res.status(400).json({ success: false, message: "Datos inválidos" });
    }

    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    if (producto.stock < qty) {
        return res.status(400).json({ success: false, message: "Stock insuficiente" });
    }

    // Descontar del stock
    producto.stock -= qty;

    const total = producto.precio * qty;

    res.json({
        success: true,
        message: `Venta realizada de ${qty} ${producto.nombre}`,
        total,
        stockRestante: producto.stock
    });
});


//crear tercer endpoint crear un producto
app.post('/productos',(req,res) => {
    try{
        const {nombre, precio} = req.body;
        //validacion 
        if(!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Nombre es requerido y debe ser una cadena no vacia'
            });
        }
        //validacion
        if(precio ===undefined|| isNaN(precio) || precio <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Precio es requerido y debe ser un numero positivo'
            });
        }
        //generer un id 
        const nuevoid=productos.length>0
        ?Math.max(...productos.map(p=>p.id))+1
        :1;

        //crear el nuevo producto
        const nuevoproducto={
            id: nuevoid,
            nombre:nombre.trim(),
            precio:Number(precio)//asegurando que sea tipo numero
        };
        //agregar el nueno producto push
        productos.push(nuevoproducto);
        //respuesta exitosa
        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: nuevoproducto
        });



    }catch(error){
        //manejo de error de la creacion del producto
        res.status(500).json({
            success: false,
            message: 'Error al crear el producto'
        })
    }
       
    

});

 

app.use((req, res) => {
    //cualquier ruta no manejada 
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });

});






app.listen(PORT,() => {
    console.log(`servidor corriendo en http://localhost:${PORT}`);
});


