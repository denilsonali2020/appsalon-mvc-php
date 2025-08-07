document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
})

function iniciarApp(){
    ocultarAlert();
};


function ocultarAlert() {
    const alerta = document.querySelector("p.alerta");
    if(alerta){
        setTimeout(() => {
           alerta.style.display = 'none';
        }, 2000);
    }
}