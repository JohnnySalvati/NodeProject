const [verb, endpoint, title, price, category, ...left] = process.argv.slice(2);

// solo estan habilitados GET, POST y DELETE. no se considera valido que el usuario ingrese estos verbos en minusculas.
const validVerbs = ["GET", "POST", "DELETE"];
let id;

//
// esta porcion del codigo chequea la validez de los argumentos
//  y setea la variable 'id'
//  en caso de que los argumentos sean validos
//
if (left.length!=0){
    console.log(`❌ Error: Demasiados argumentos ${left}`);         // chequea si se proporcionaron argumentos de mas
    process.exit(1);
}
if ( ! validVerbs.includes(verb)){                               // chequea que el verbo sea valido
    console.log(`❌ Error: Accion invalida ${verb}`);
    process.exit(1);
}
if (typeof endpoint === 'undefined'){                         // chequea que exista un endpoint
    console.log("❌ Error: Argumentos insuficientes");
    process.exit(1);
}else if (endpoint==='products'){                               // endpoint sin ID
    if (verb==='GET'){                                        
        if (title){
            console.log("❌ Error: Demasiados argumentos");   // si es un GET para todos los productos no debe poseer mas argumentos
            process.exit(1);
        }else{
            id = 0                                          // **************** Correcto GET para TODOS
        }
    }else if (verb==="POST"){
        if (title===undefined || price===undefined || category===undefined ){
            console.log("❌ Error: Argumentos insuficientes");     // Para el POST se necesitan todos los datos
            process.exit(1);
        } else{
            id = 0                                          // **************** Correcto POST con todos los datos
        }
    }
}else if (endpoint.slice(0,9)==='products/'){
    id = endpoint.slice(9)                                 // Almacena el ID, luego seguimos chequeando
    if (id.length==0){
        console.log("❌ Error: ID requerido");     // si se especifica product/ debe haber un ID
        process.exit(1);
    }
    if (title){
        console.log("❌ Error: Demasiados argumentos");   // si se especifica product/ no debe haber mas argumentos
        process.exit(1);
    }
}

//
// si el flujo de ejecucion llega a este punto
// el verbo, endpoint y argumentos son validos
// y se procede a ejecutar la solicitud
//
switch(verb){
    case "GET":
        if (id === 0){
            fetch('https://fakestoreapi.com/products') //TODOS
                .then(response => response.json())
                .then(data => console.log(data));
        }else{
            fetch(`https://fakestoreapi.com/products/${id}`) // Un ID
                .then(response => response.json())
                .then(data => console.log(data));
        }
        break;
    case "POST":
        const product = { title: title, price: price, category: category };
        fetch('https://fakestoreapi.com/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
            })
            .then(response => response.json())
            .then(data => console.log(data));
            break;
    case "DELETE":
        fetch(`https://fakestoreapi.com/products/${id}`, {
            method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => console.log(data));
        break;
}

