function imprimir(tabla) {
  // imprimir por consola las tablas
  console.log("Per", "Amort", "Int", "Pago", "Saldo");
  tabla.forEach((renglon) => {
    console.log(
      renglon.per,
      renglon.amortizacion.toFixed(2),
      renglon.interes.toFixed(2),
      renglon.pago.toFixed(2),
      renglon.saldo.toFixed(2)
    );
  });
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
  let sistema = parseInt(
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
  calular_sistema(capital, tasa, n);
}
alert("Gracias por utilizar nuestro sitio!");
