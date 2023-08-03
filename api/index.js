const cheerio = require('cheerio')
const cron = require('node-cron')
const logInfo = require('../utils/logInfo')
const logError = require('../utils/logError')
const { error } = require('console')

// CRON CONFIGURADO PARA EJECUTARSE CADA 5 MINUTOS
cron.schedule('* */5 * * * *', async()=>{
    try {
        console.log('Running Cron')

        const clima = await consultarClima()
        console.log(clima)

        // REGISTRAMOS EL LOG DE INFORMACIÓN
        logInfo.info(`Actualización del clima exitosa - Datos: ${clima.Ciudad} - ${clima.Temperatura}`)
    } catch (err) {
        // REGISTRAMOS EL LOG DE ERROR
        logError.error(`Error`)
    }
})

async function consultarClima(){
    try {
        const response = await fetch('https://www.clima.com/argentina/buenos-aires/buenos-aires')

        const body = await response.text()

        const $ = cheerio.load(body)

        const clima = $('#page > #main > .clima > .wrapper > main > section > section > article').get()

        const $$ = cheerio.load(clima)

        // OBTENEMOS LA CIUDAD
        const ciudad = $$('.-block-1 > p > a').attr('title')

        // OBTENEMOS LA TEMPERATURA
        const temperatura = $$('.-block-3 > section > .c6 > section > span').text()

        // URL DE LA IMAGEN DEL CLIMA
        const imgClima = $$('.-block-3 > section > .c6 > .-block-i-1 > img').attr('src')

        // DESCRIPCION DE LA IMAGEN
        const imgDescripcion = $$('.-block-3 > section > .-block-i-3 > span').text()

        // DESCRIPCION DE LA IMAGEN
        const ultActualizacion = $$('.-block-3 > section > .-block-i-3 > .time > span').text()

        const objResponse = {
            Ciudad: ciudad,
            Temperatura: temperatura,
            ImagenClima: imgClima,
            ImagenDescripcion: imgDescripcion,
            UltimaActualizacion: ultActualizacion
        }

        return objResponse
    } catch (err) {
        console.log(err)      
    }
}

