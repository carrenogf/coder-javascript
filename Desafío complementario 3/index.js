function imprimir(prestamo) {
  // imprimir las tablas
  let tabla = document.getElementById("tabla")
  tabla.innerHTML = `<thead id="encabezado" class="bg-dark text-white"></thead>`
  // Encabezados de la tabla -----------------------------
  let encabezado = document.getElementById("encabezado")
  
  let tr_head = document.createElement("tr");
  
  let titulos = ["Periodo", "Amortización", "Intereses", "Pago", "Saldo"];
  titulos.forEach( (titulo)  => {
    let th = document.createElement("th")
    th.innerHTML = titulo;
    th.setAttribute("scope","col");
    tr_head.append(th);
  });
  // agrega los titulos al html
  encabezado.append(tr_head)


  // elementos de la tabla -------------------------------
  let tbody = document.createElement("tbody");
  let totalPrestamo = 0;
  let totalIntereses = 0;
  let totalPagos = 0;
  prestamo.forEach((renglon) => {
    let tr = document.createElement("tr")
    tr.innerHTML = `<td>${renglon.per}</td>
                    <td>${renglon.amortizacion.toFixed(2)}</td>
                    <td>${renglon.interes.toFixed(2)}</td>
                    <td>${renglon.pago.toFixed(2)}</td>
                    <td>${renglon.saldo.toFixed(2)}</td>`;
    tbody.append(tr)
    // aprovecho el primer bucle para calcular el total de la columna de amortización y luego ponderar a la mitad
    totalPrestamo += renglon.amortizacion;
    totalIntereses += renglon.interes;
    totalPagos += renglon.pago;
  });
  let tr_totales = document.createElement("tr")
  tr_totales.innerHTML = `<td>Totales</td>
                          <td>${totalPrestamo.toFixed(2)}</td>
                          <td>${totalIntereses.toFixed(2)}</td>
                          <td>${totalPagos.toFixed(2)}</td>
                          <td>.-</td>`
  tbody.append(tr_totales);
  tabla.append(tbody);

  // INFORME -----------------------------------------------
  let container_informe = document.getElementById("informe");
  container_informe.innerHTML = ""
  // cantidad de periodos
  const n = prestamo.length;
  // busqueda para obtener cuota del primer periodo
  const per1 = prestamo.find((c1) => c1.per === 1);
  // busqueda para obtener cuota del último periodo
  const pern = prestamo.find((cn) => cn.per === n);
  // calculos para la mitad del prestamo
  // la idea es que informe cuanto se va pagando de intereses y amortización a la mitad del prestamo
  // mitad de periodos
  const n2 = parseInt(n / 2);
  // filtro para obtener los objetos de la tabla que corresponden a la mitad del prestamo
  const mitad = prestamo.filter((i) => i.per <= n2);
  // variables para acumular los valores en el siguiente bucle
  let amortMitad = 0;
  let interesMitad = 0;
  mitad.forEach((renglon) => {
    amortMitad += renglon.amortizacion;
    interesMitad += renglon.interes;
  });
  // porcentaje de amortización a la mitad del prestamo
  let percentMitad = (amortMitad / totalPrestamo) * 100;

  let informe = document.createElement("div")
  informe.innerHTML = `<h3>Informe</h3
                      <p>La primer cuota será de $ ${per1.pago.toFixed(2)}</p>
                      <p>La última cuota será de $ ${pern.pago.toFixed(2)}</p>
                      <p>Cuando hayas pagado la mitad de las cuotas:</p>
                      <p>Habras pagado un total de $ ${amortMitad.toFixed(2)} en concepto de amortización</p>
                      <p>Habras pagado un total de $ ${interesMitad.toFixed(2)} en concepto de intereses</p>
                      <p>Y habrás cancelado el ${percentMitad.toFixed(2)}% del total del prestamo</p>`
   container_informe.append(informe)
}

function amortizacion(sistema) {
  if (sistema === "frances") {
    return (capital, tasa, n) => {
      let resultado = [];
      let tasa_p = tasa / 100 / 12;
      let cuota = capital * (tasa_p / (1 - (1 + tasa_p) ** (n * -1)));
      let saldo = capital;
      for (let i = 1; i <= n; i++) {
        interes_i = saldo * tasa_p;
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
      imprimir(resultado);
    };
  }


  if (sistema === "aleman") {
    return (capital, tasa, n) => {
      let resultado = [];
      let tasa_p = tasa / 100 / 12;
      let amort = capital / n;
      let saldo = capital;
      for (let i = 1; i <= n; i++) {
        interes_i = saldo * tasa_p;
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
      imprimir(resultado);
    };
  }
  if (sistema === "directo") {
    return (capital, tasa, n) => {
      let resultado = [];
      let tasa_p = tasa / 100 / 12;
      let interes = capital * tasa_p * n;
      let cuota = (capital + interes) / n;
      let amort = capital / n;
      let saldo = capital;
      for (let i = 1; i <= n; i++) {
        interes_i = cuota - amort;
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
      imprimir(resultado);
    };
  }
}

let form = document.getElementById("formulario");
form.addEventListener("submit", validarFormulario);

function validarFormulario(e){
    e.preventDefault();
    let formulario = e.target;
    let sistema = document.getElementById("sistema").value
    let capital = document.getElementById("capital").value
    let tasa = document.getElementById("tasa").value
    let n = document.getElementById("periodos").value
    let calular_sistema = amortizacion(sistema);
    calular_sistema(capital, tasa, n);
}


