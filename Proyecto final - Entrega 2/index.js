function renderTable(contenedor,encabezados, valores, toFixed=[]) {
  let container = document.getElementById(contenedor);
  container.innerHTML=""
  let tabla = document.createElement("table");
  tabla.className = "table table-bordered"
  // encabezados
  let trh = document.createElement("tr");

  for (const titulo of encabezados){
    let th = document.createElement("th");
    th.innerHTML = titulo
    th.setAttribute("scope","col")
    trh.append(th)
  }
  tabla.append(trh)
  // valores
  console.log(valores)
  for (let renglon of valores) {
    
    let tr = document.createElement("tr");
    let keys = Object.keys(renglon);
    for (let key of keys) {
      let td = document.createElement("td");
      if (toFixed.includes(key)){
        td.innerHTML = renglon[key].toFixed(2)
      }else{
        td.innerHTML = renglon[key]
      }
      tr.append(td)
    }
    tabla.append(tr)
  }
  container.append(tabla)
}



function imprimir(prestamo) {
  // imprimir las tablas
  let encabezados = ["Periodo","Amortización","Intereses","Pago","Saldo"]
  let toFixed = ["amortizacion","interes","pago","saldo"]

  let totalPrestamo = 0;
  let totalIntereses = 0;
  let totalPagos = 0;
  prestamo.forEach((renglon) => {
    // aprovecho el primer bucle para calcular el total de la columna de amortización y luego ponderar a la mitad
    totalPrestamo += renglon.amortizacion;
    totalIntereses += renglon.interes;
    totalPagos += renglon.pago;
  });
  prestamo.push({
    per: "Totales",
    amortizacion: totalPrestamo,
    interes: totalIntereses,
    pago:totalPagos,
    saldo: 0,
  });
  renderTable("tablaPrestamo",encabezados,prestamo,toFixed);
}
function informe(sistema,capital, n, tasa, prestamo) {
  let container_informe = document.getElementById("informe");
  container_informe.innerHTML = "";
  // busqueda para obtener cuota del primer periodo
  const per1 = prestamo.find((c1) => c1.per === 1);
  // busqueda para obtener cuota del último periodo
  const pern = prestamo.find((cn) => cn.per === n);

  // calculos para la mitad del prestamo ------------------------
  const n2 = parseInt(n / 2); // mitad de periodos
  let amortMitad = 0;
  let interesMitad = 0;
  let totalIntereses = 0;
  let totalPagos = 0;
  prestamo.forEach((renglon) => {
    if ( renglon.per <= n2){
      amortMitad += renglon.amortizacion;
      interesMitad += renglon.interes;
    }
    totalPagos += renglon.pago;
    totalIntereses += renglon.interes;
  });
  // porcentaje de amortización a la mitad del prestamo
  let percentMitad = (amortMitad / capital) * 100;

  let informe = document.createElement("div");
  informe.innerHTML = `<h3>Informe</h3
                      <p>La primer cuota será de $ ${per1.pago.toFixed(2)}</p>
                      <p>La última cuota será de $ ${pern.pago.toFixed(2)}</p>
                      <strong><p>Cuando hayas pagado la mitad de las cuotas:</p></strong>
                      <p>Habras pagado un total de $ ${amortMitad.toFixed(2)} en concepto de amortización</p>
                      <p>Habras pagado un total de $ ${interesMitad.toFixed(2)} en concepto de intereses</p>
                      <p>Y habrás cancelado el ${percentMitad.toFixed(2)}% del total del prestamo</p>
                      <button onclick="comparador();" class="btn btn-primary" id="comparar">Comparar</button>`;
                      
  container_informe.append(informe);
  return {
    sistema:sistema,
    capital:capital,
    tasa:tasa,
    periodos:n,
    intereses:totalIntereses,
    pago:totalPagos,
  }
}

function frances(capital, tasa, n) {
  let resultado = [];
  let tasa_p = tasa / 100 / 12;
  let cuota = capital * (tasa_p / (1 - (1 + tasa_p) ** (n * -1)));
  let saldo = capital;
  for (let i = 1; i <= n; i++) {
    let interes_i = saldo * tasa_p;
    let amort = cuota - interes_i;
    saldo = saldo - amort;
    // Agrega un renglon al array con un objeto para cada cuota
    resultado.push({
      per: i,
      pago: cuota,
      amortizacion: amort,
      interes: interes_i,
      saldo: saldo,
    });
  }
  return resultado;
}

function aleman(capital, tasa, n) {
  let resultado = [];
  let tasa_p = tasa / 100 / 12;
  let amort = capital / n;
  let saldo = capital;
  for (let i = 1; i <= n; i++) {
    let interes_i = saldo * tasa_p;
    let cuota = amort + interes_i;
    saldo = saldo - amort;
    // Agrega un renglon al array con un objeto para cada cuota
    resultado.push({
      per: i,
      pago: cuota,
      amortizacion: amort,
      interes: interes_i,
      saldo: saldo,
    });
  }
  return resultado;
}

function directo(capital, tasa, n) {
  let resultado = [];
  let tasa_p = tasa / 100 / 12;
  let interes = capital * tasa_p * n;
  let cuota = (capital + interes) / n;
  let amort = capital / n;
  let saldo = capital;
  for (let i = 1; i <= n; i++) {
    let interes_i = cuota - amort;
    saldo = saldo - amort;
    // Agrega un renglon al array con un objeto para cada cuota
    resultado.push({
      per: i,
      pago: cuota,
      amortizacion: amort,
      interes: interes_i,
      saldo: saldo,
    });
  }
  return resultado;
}

function amortizacion(capital, tasa, n, sistema) {
  switch (sistema) {
    case "frances":
      prestamo = frances(capital, tasa, n);
      break;
    case "aleman":
      prestamo = aleman(capital, tasa, n);
      break;
    case "directo":
      prestamo = directo(capital, tasa, n);
      break;
  }
  return prestamo;
}
const guardarLocal = (clave, valor) => { localStorage.setItem(clave, valor) };


function comparador () {
  
  let nuevoPrestamoLS = localStorage.getItem("nuevoPrestamo");
  
  if (nuevoPrestamoLS) {
    
    // N° de prestamos guardados
    let numPrestamos = parseInt(localStorage.getItem("numPrestamo"));
    if (numPrestamos) {
      numPrestamos += 1;
      guardarLocal("numPrestamo",numPrestamos)
      guardarLocal(`prestamo${numPrestamos}`,nuevoPrestamoLS)
    }else{
      
      guardarLocal("numPrestamo",1)
      guardarLocal(`prestamo1`,nuevoPrestamoLS)
    }
    renderComparador()
  }

}

function renderComparador (){
  let numPrestamos = localStorage.getItem("numPrestamo");
  if (numPrestamos) {
    encabezados = ["Sistema","Capital","Tasa","Periodos","Intereses","Pago"]
    valores = []
    for (let i=1; i<=numPrestamos ;i++){
      
      let prestamo_i =  localStorage.getItem(`prestamo${i}`);
      if (prestamo_i) {
        prestamo_i = JSON.parse(prestamo_i)
      }else{
        localStorage.removeItem(`prestamo${i}`)
      }
      valores.push(prestamo_i)
    }
    toFixed = ["capital","tasa","periodos","intereses","pago"]
    renderTable(
      contenedor="comparador",
      encabezados=encabezados,
      valores=valores,
      toFixed=toFixed
    )

  }
}


function validarFormulario(e) {
  e.preventDefault();
  let sistema = document.getElementById("sistema").value;
  let capital = parseFloat(document.getElementById("capital").value);
  let tasa = parseFloat(document.getElementById("tasa").value);
  let n = parseInt(document.getElementById("periodos").value);
  let prestamo = amortizacion(capital, tasa, n, sistema);

  imprimir(prestamo);
  let comparar = informe(sistema,capital, n, tasa, prestamo);
  // calculos para la comparacion
  // deberia devolver capital tasa n sistema total intereses total pagos
  guardarLocal("nuevoPrestamo", JSON.stringify(comparar));

}

localStorage.clear();
let form = document.getElementById("formulario");
form.addEventListener("submit", validarFormulario);




