const {createLogger, format, transports} = require('winston')
const moment = require('moment-timezone')

module.exports = createLogger({
    format: format.combine(
        format.simple(),
        format.timestamp(),
        format.printf(
            (info) =>
            `[${moment().tz('America/Argentina/Cordoba')
            .format('YYYY-MM-DD HH:mm:ss')}] [${info.level}] [${info.message}]`
        )
    ),
    transports: [
        new transports.File({
            maxsize: 5120000,
            maxFiles: 5,
            filename: './logs/log-errorClima'
        })
    ]
})