const gameWin = document.querySelector("#gameWin");
const divBola = document.querySelector("#bola");
const barraPlayerDiv = document.querySelector("#barraPlayerDiv");
const startGameBtn = document.querySelector("#startGameBtn");

const posInici = {
    bolaX: (gameWin.clientWidth - divBola.clientWidth) / 2,
    bolaY: parseFloat(getComputedStyle(divBola).top),
    barraX:(gameWin.clientWidth - barraPlayerDiv.clientWidth) / 2,
}

console.log(posInici);

const bola = {
    posX: posInici.bolaX,
    posY: posInici.bolaY,
    veloX: 10,
    veloY: 10,
}

const barraPlayer = {
    posX: posInici.barraX,
    posY: parseFloat(getComputedStyle(barraPlayerDiv).top),
    velo: 30,
}

barraPlayerDiv.style.left = barraPlayer.posX + "px";

divBola.style.left = bola.posX + "px";
divBola.style.top = bola.posY + "px";

startGameBtn.addEventListener("click", function() {
    startGameBtn.disabled=true;
    startTimer(30);


    gameWin.addEventListener("mousemove", movBarra);

});

function movBarra(e) {
    const rect = gameWin.getBoundingClientRect();

    let mouseX = e.clientX - rect.left;

    barraPlayer.posX = mouseX - barraPlayerDiv.offsetWidth / 2;

    const max = gameWin.clientWidth - barraPlayerDiv.offsetWidth-20;

    if (barraPlayer.posX < 0) {
        barraPlayer.posX = 20;
    }

    if (barraPlayer.posX > max) {
        barraPlayer.posX = max;
    }

    barraPlayerDiv.style.left = barraPlayer.posX + "px";
}

function comprobarColision() {
    const bolaAncho = divBola.offsetWidth;
    const bolaAlto = divBola.offsetHeight;

    const barraAncho = barraPlayerDiv.offsetWidth;
    const barraAlto = barraPlayerDiv.offsetHeight;

    const colision =
        bola.posX + bolaAncho > barraPlayer.posX &&
        bola.posX < barraPlayer.posX + barraAncho &&
        bola.posY + bolaAlto > barraPlayer.posY &&
        bola.posY < barraPlayer.posY + barraAlto;

    // Solo rebotar cuando la bola está bajando
    if (colision && bola.veloY > 0) {

        // Centro de la bola respecto al ancho de la barra
        const bolaCentroX = bola.posX + bolaAncho / 2;

        // Posición relativa al centro de la barra: entre -1 y 1
        let impacto = (bolaCentroX - barraPlayer.posX - barraAncho / 2) / (barraAncho / 2);

        // Evitar valores fuera de los extremos
        impacto = Math.max(-1, Math.min(1, impacto));

        // Calcular la velocidad horizontal
        bola.veloX = impacto * 20;

        // Calcular la velocidad vertical
        bola.veloY = -20 * (1 - Math.abs(impacto));

        // Evitar que la bola se quede moviéndose solo horizontalmente
        bola.veloY = Math.min(-4, bola.veloY);

        // Colocar la bola justo encima de la barra
        bola.posY = barraPlayer.posY - bolaAlto;
    }
}


function startTimer(time) {
    const timer = setInterval(() => {
        const maxX = gameWin.clientWidth - divBola.offsetWidth;
        const maxY = gameWin.clientHeight - divBola.offsetHeight;

        bola.posX += bola.veloX;
        bola.posY += bola.veloY;

        if (bola.posX >= maxX) {
            bola.posX = maxX;
            bola.veloX *= -1;
        }

        if (bola.posX <= 0) {
            bola.posX = 0;
            bola.veloX *= -1;
        }

        if (bola.posY <= 0) {
            bola.posY = 0;
            bola.veloY *= -1;
        }

        comprobarColision();

        if (bola.posY >= maxY) {
            clearInterval(timer);
            bola.posX= posInici.bolaX;
            bola.posY= posInici.bolaY;
            barraPlayer.posX= posInici.barraX;

            barraPlayerDiv.style.left = barraPlayer.posX + "px";

            divBola.style.left = bola.posX + "px";
            divBola.style.top = bola.posY + "px";

            gameWin.removeEventListener("mousemove", movBarra);

            startGameBtn.disabled=false;

        }

        divBola.style.left = bola.posX + "px";
        divBola.style.top = bola.posY + "px";
    }, time);
}
