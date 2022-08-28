let get_interest = (monto,dias,tasa,gastos) => {
    if (!isNaN(monto) && !isNaN(dias) && !isNaN(tasa) && !isNaN(gastos)){
        let monto_interes = monto * tasa / 100 /365 * dias;
        let monto_gastos = monto * gastos / 100;
        let monto_neto = monto - monto_interes - monto_gastos;

        let dias_multiplos = ""
        let interes_dias_multiplos = 0
        for (let i = 1;i<=360;i++){
            if((i%30)==0){
                interes_dias_multiplos = monto * tasa / 100 /365 * i
                dias_multiplos += `para ${i} días : $ ${interes_dias_multiplos.toFixed(2)}\n        `
            }
        }
        alert(`
        Resultado\n
        Monto Interes: $ ${monto_interes.toFixed(2)}\n
        Monto Gastos: $ ${monto_gastos.toFixed(2)}\n
        Monto neto: $ ${monto_neto.toFixed(2)}
        ----------------------------------
        Interes calculado por días:
        ${dias_multiplos}
        `);
        alert("Gracias por utilizar nuestros servicios!");
    }else{
        alert("Por favor revisa los datos que ingresaste, asegurate de solo ingresar números!")
    }

}

alert("Bienvenido! esta página te ayudará con el calculo de descuento de cheques pulsa aceptar para continuar");
let monto = parseFloat(prompt("Por favor ingresa el monto del cheque"));
let dias = parseInt(prompt("Por favor ingresa los días que faltan para el vencimiento"));
let tasa = parseFloat(prompt("Por favor ingresa la tasa de interés anual"));
let gastos = parseFloat(prompt("Por favor ingresa la tasa fija de gastos sobre monto"));
get_interest(monto,dias,tasa,gastos)