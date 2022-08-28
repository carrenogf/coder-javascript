let get_interest = (monto,dias,tasa,gastos) => {
    // verifica si todos los datos ingresados son númericos
    if (!isNaN(monto) && !isNaN(dias) && !isNaN(tasa) && !isNaN(gastos)){
        //  Calculos para el descuento de cheque con los datos ingresados
        // La formula para este calculo es sencilla C * i * n
        // los gastos es un % directo sobre el importe bruto
        // El monto neto es el valor que queda luego de descontar intereses y gastos
        let monto_interes = monto * tasa / 100 /365 * dias;
        let monto_gastos = monto * gastos / 100;
        let monto_neto = monto - monto_interes - monto_gastos;

        // Acontinuación una simulación del calculo para varios días distintos múltiplo de 30 hasta 360
        // Esto puede servirle al usuario para comparar con otras operaciones
        // O conocer los resultados para distintas fechas

        // Inicializo las variables, 
        // dias_multiplos: acumula el resultado en una cadena
        // interes_dias_multiplos: guarda el calculo de interes para los días que irán avanzando de 30 en 30

        let dias_multiplos = ""
        let interes_dias_multiplos = 0
        // bucle para el calculo y acumulacioón de la simulación
        for (let i = 30;i<=360;i+=30){
            interes_dias_multiplos = monto * tasa / 100 /365 * i
            dias_multiplos += `para ${i} días : $ ${interes_dias_multiplos.toFixed(2)}\n        `
        }
        // resultado de la función
        alert(`
        Resultado para los datos ingresados\n
        Monto Interes: $ ${monto_interes.toFixed(2)}\n
        Monto Gastos: $ ${monto_gastos.toFixed(2)}\n
        Monto neto: $ ${monto_neto.toFixed(2)}
        ----------------------------------
        Simulación Cálculo Interés por día:
        ${dias_multiplos}
        `);
        // agradecimiento final
        alert("Gracias por utilizar nuestros servicios!");
    }else{
        // en el caso de que se hayan ingresa valores invalidos muestra el siguiente mensaje
        alert("Por favor revisa los datos que ingresaste, asegurate de solo ingresar números!")
    }

}

// Inicio
alert("Bienvenido! esta página te ayudará con el calculo de descuento de cheques pulsa aceptar para continuar");
// promts para obtener datos del usuario
let monto = parseFloat(prompt("Por favor ingresa el monto del cheque"));
let dias = parseInt(prompt("Por favor ingresa los días que faltan para el vencimiento"));
let tasa = parseFloat(prompt("Por favor ingresa la tasa de interés anual"));
let gastos = parseFloat(prompt("Por favor ingresa la tasa fija de gastos sobre monto"));
// ejecución de la función get_ineterest
get_interest(monto,dias,tasa,gastos);