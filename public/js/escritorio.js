
// Referencias HTML
const lblEscritorio = document.querySelector('h1')
const btnAtender = document.querySelector('button')
const ticketAtendido = document.querySelector('small')
const alerta = document.querySelector('.alert')
const ticketsCola = document.querySelector('#lblPendientes')



// Parametros de la URL
const searParams = new URLSearchParams(window.location.search);
if (!searParams.has('escritorio')) {
    window.location = 'index.html'
    throw new Error('El escritorio es obligatorio')
}

const escritorio = searParams.get('escritorio');
lblEscritorio.innerText = escritorio
alerta.style.display = 'none'


const socket = io();



socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('tickets-pendientes', (ticketsPendientes) => {
    if (ticketsPendientes === 0) {
        ticketsCola.style.display = 'none'
    } else {
        ticketsCola.style.display = ''
        ticketsCola.innerText = ticketsPendientes
    }
})


btnAtender.addEventListener('click', () => {

    socket.emit('atender-ticket', { escritorio }, (payload) => {
        const { ok, msg, ticket } = payload;
        if (!ok) {
            ticketAtendido.innerText = 'nadie'
            alerta.style.display = ''
            alerta.innerText = msg
            return;
        }

        ticketAtendido.innerText = 'Ticket ' + ticket.numero
    })


});
