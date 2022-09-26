function renderTable(contenedor, encabezados, valores, Fixed = []) {
  let container = document.getElementById(contenedor);
  container.innerHTML = "";
  let tabla = document.createElement("table");
  tabla.className = "table table-bordered";
  // encabezados
  let trh = document.createElement("tr");

  for (const titulo of encabezados) {
    let th = document.createElement("th");
    th.innerHTML = titulo;
    th.setAttribute("scope", "col");
    trh.append(th);
  }
  tabla.append(trh);
  // valores
  for (let renglon of valores) {
    let tr = document.createElement("tr");
    let keys = Object.keys(renglon);
    for (let key of keys) {
      let td = document.createElement("td");
      Fixed.includes(key) ? td.innerHTML = renglon[key].toFixed(2) : td.innerHTML = renglon[key];
      tr.append(td);
    }
    tabla.append(tr);
  }
  container.append(tabla);
}

function imprimir(prestamo) {
  // imprimir las tablas
  let encabezados = ["Periodo", "Pago","Amortización", "Intereses", "Saldo"];
  let Fixed = ["amortizacion", "interes", "pago", "saldo"];

  let totalPrestamo = prestamo.reduce((acum, k,) => acum + parseFloat(k.amortizacion),0);
  let totalIntereses = prestamo.reduce((acum, k,) => acum + parseFloat(k.interes),0);
  let totalPagos = prestamo.reduce((acum, k,) => acum + parseFloat(k.pago),0);

  prestamo.push({
    per: "Totales",
    pago: totalPagos,
    amortizacion: totalPrestamo,
    interes: totalIntereses,
    saldo: 0,
  });

  renderTable("tablaPrestamo", encabezados, prestamo, Fixed);
}
function informe(sistema, capital, n, tasa, prestamo) {
  let container_informe = document.getElementById("informe");
  container_informe.innerHTML = "";
  // busqueda para obtener cuota del primer periodo

  const {pago} = prestamo[0];
  // busqueda para obtener cuota del último periodo
  const pern = prestamo.find((cn) => cn.per === n);

  // calculos para la mitad del prestamo ------------------------
  const n2 = parseInt(n / 2); // mitad de periodos
  let amortMitad = prestamo.reduce((acum, k,) => (k.per<=n2) ? acum + k.amortizacion:acum,0);
  let interesMitad = prestamo.reduce((acum, k,) => (k.per<=n2) ? acum + k.interes:acum,0);
  let totalIntereses = prestamo.reduce((acum, k,) => acum + parseFloat(k.interes),0);
  let totalPagos = prestamo.reduce((acum, k,) => acum + parseFloat(k.pago),0);
  // porcentaje de amortización a la mitad del prestamo
  let percentMitad = (amortMitad / capital) * 100;
  let arrayIntereses = []
  prestamo.filter(k => k.per!="Totales").forEach(k => {arrayIntereses.push(k.interes)});

  let maxInteres = Math.max(...arrayIntereses)

  let informe = document.createElement("div");
  informe.innerHTML = `<h3>Informe</h3
                      <p>La primer cuota será de $ ${pago.toFixed(2)}</p>
                      <p>La última cuota será de $ ${pern.pago.toFixed(2)}</p>
                      <p>Lo máximo que pagaras de interes será $ ${maxInteres.toFixed(2)}</p>
                      <strong><p>Cuando hayas pagado la mitad de las cuotas:</p></strong>
                      <p>Habras pagado un total de $ ${amortMitad.toFixed(
                        2
                      )} en concepto de amortización</p>
                      <p>Habras pagado un total de $ ${interesMitad.toFixed(
                        2
                      )} en concepto de intereses</p>
                      <p>Y habrás cancelado el ${percentMitad.toFixed(
                        2
                      )}% del total del prestamo</p>
                      <button onclick="comparador();" class="btn btn-primary" id="comparar">Comparar</button>`;

  container_informe.append(informe);
  return {
    sistema: sistema,
    capital: capital,
    tasa: tasa,
    periodos: n,
    intereses: totalIntereses,
    pago: totalPagos,
  };
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
const guardarLocal = (clave, valor) => {
  localStorage.setItem(clave, valor);
};

function comparador() {
  let nuevoPrestamoLS = localStorage.getItem("nuevoPrestamo");

  if (nuevoPrestamoLS) {
    // N° de prestamos guardados
    let numPrestamos = parseInt(localStorage.getItem("numPrestamo"));
    if (numPrestamos) {
      numPrestamos++;
      guardarLocal("numPrestamo", numPrestamos);
      guardarLocal(`prestamo${numPrestamos}`, nuevoPrestamoLS);
    } else {
      guardarLocal("numPrestamo", 1);
      guardarLocal(`prestamo1`, nuevoPrestamoLS);
    }
    renderComparador();
  }
}

function renderComparador() {
  let numPrestamos = localStorage.getItem("numPrestamo");
  if (numPrestamos) {
    encabezados = ["Sistema","Capital","Tasa","Periodos","Intereses","Pago"];
    valores = [];
    for (let i = 1; i <= numPrestamos; i++) {
      let prestamo_i = localStorage.getItem(`prestamo${i}`);
      prestamo_i ? prestamo_i = JSON.parse(prestamo_i) : localStorage.removeItem(`prestamo${i}`);
      valores.push(prestamo_i);
    }
    Fixed = ["capital", "tasa", "periodos", "intereses", "pago"];
    renderTable(
      (contenedor = "comparador"),
      (encabezados = encabezados),
      (valores = valores),
      (Fixed = Fixed)
    );
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
  let comparar = informe(sistema, capital, n, tasa, prestamo);
  // calculos para la comparacion
  // deberia devolver capital tasa n sistema total intereses total pagos
  guardarLocal("nuevoPrestamo", JSON.stringify(comparar));
}

localStorage.clear();
let form = document.getElementById("formulario");
form.addEventListener("submit", validarFormulario);
