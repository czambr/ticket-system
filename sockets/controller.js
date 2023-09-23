const TicketControl = require("../models/ticket-control")


const ticketControl = new TicketControl();

const socketScontroller = (socket) => {

    // ===> Se envia el último ticket
    socket.emit('utlimo-ticket', ticketControl.ultimo)


    // ===> Se notifica el estado actual de los 4 ultimos tickets
    socket.emit('estado-actual', ticketControl.ultimos4)


    // ===> Se envia la cola los tickets pendientes
    socket.emit('tickets-pendientes', ticketControl.tickets.length)


    // ===> Se escucha añade un nuevo ticket a la cola
    socket.on('siguiente-ticket', (payload, callback) => {
        const siguiente = ticketControl.siguiente()
        callback(siguiente)
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)
    })


    // ===> Se atiende un ticket de todo el pool
    socket.on('atender-ticket', ({ escritorio }, callback) => {
        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'Escritorio es obligatorio'
            })
        }

        const ticket = ticketControl.atenderTicket(escritorio)

        socket.broadcast.emit('estado-actual', ticketControl.ultimos4)
        socket.emit('tickets-pendientes', ticketControl.tickets.length)
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)

        if (!ticket) {
            callback({
                ok: false,
                msg: "Ya no hay tickets pendientes"
            })
        } else {
            callback({
                ok: true,
                ticket
            })
        }
    })
}

module.exports = {
    socketScontroller
}