function imprimir(tabla) {
  // imprimir por consola las tablas
  console.log("Per", "Amort", "Int", "Pago", "Saldo");
  let totalTabla = 0;
  tabla.forEach((renglon) => {
    console.log(
      renglon.per,
      renglon.amortizacion.toFixed(2),
      renglon.interes.toFixed(2),
      renglon.pago.toFixed(2),
      renglon.saldo.toFixed(2)
    );
    // aprovecho el primer bucle para calcular el total de la columna de amortización y luego ponderar a la mitad
    totalTabla += renglon.amortizacion;
  });
  // cantidad de periodos
  const n = tabla.length;
  // busqueda para obtener cuota del primer periodo
  const per1 = tabla.find((c1) => c1.per === 1);
  console.log(`La primer cuota será de $ ${per1.pago.toFixed(2)}`);
  // busqueda para obtener cuota del último periodo
  const pern = tabla.find((cn) => cn.per === n);
  console.log(`La última cuota será de $ ${pern.pago.toFixed(2)}`);
  // calculos para la mitad del prestamo
  // la idea es que informe cuanto se va pagando de intereses y amortización a la mitad del prestamo
  // mitad de periodos
  const n2 = parseInt(n / 2);
  // filtro para obtener los objetos de la tabla que corresponden a la mitad del prestamo
  const mitad = tabla.filter((i) => i.per <= n2);
  // variables para acumular los valores en el siguiente bucle
  let amortMitad = 0;
  let interesMitad = 0;
  mitad.forEach((renglon) => {
    amortMitad += renglon.amortizacion;
    interesMitad += renglon.interes;
  });
  // porcentaje de amortización a la mitad del prestamo
  let percentMitad = (amortMitad / totalTabla) * 100;
  // impresiones de los calculas a la mitad del prestamo
  console.log("Cuando hayas pagado la mitad de las cuotas:");
  console.log(`Habras pagado un total de $ ${amortMitad.toFixed(2)} en concepto de amortización`);
  console.log(`Habras pagado un total de $ ${interesMitad.toFixed(2)} en concepto de intereses`);
  console.log(`Y habrás cancelado el ${percentMitad.toFixed(2)}% del total del prestamo`);
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

alert("Bienvenido a nuestro sistema de simulación de prestamos");
let sistema = parseInt(
  prompt(
    "Ingresar el sistema para calcular:\n0 - para sistema frances\n1 - para sistema aleman\n2 - para sistema directo"
  )
);
while (sistema != 0 && sistema != 1 && sistema != 2 && sistema != "salir") {
  sistema = parseInt(
    prompt(
      "Ingresar el sistema para calcular:\n0 - para sistema frances\n1 - para sistema aleman\n2 - para sistema directo"
    )
  );
}
if (sistema != "salir") {
  let capital = parseFloat(prompt("Por favor ingresa el monto del capital"));
  let tasa = parseFloat(
    prompt("Por favor ingresa el monto de la tasa anual por ejemplo: 50.20")
  );
  let n = parseFloat(
    prompt("Por favor ingresa la cantidad de periodos mensuales")
  );
  let sistemas = ["frances", "aleman", "directo"];
  let calular_sistema = amortizacion(sistemas[sistema]);
  alert(
    `Calculo para sistema ${sistemas[sistema]} solicitado, porfavor revisar la consola!`
  );
  console.log(`Calculo para sistema ${sistemas[sistema]}:`);
  calular_sistema(capital, tasa, n);
}
alert("Gracias por utilizar nuestro sitio!");
