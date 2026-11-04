
const gameWin = document.querySelector("#gameWin");
const divBola = document.querySelector("#bola");
const barraPlayerDiv = document.querySelector("#barraPlayerDiv");
const startGameBtn = document.querySelector("#startGameBtn");
const divBloques = document.querySelector("#divBloques");

const vidasDiv = document.querySelectorAll(".vida");

let vidas = 3;
let partidaTerminada = false;
let timer = null;

const posInici = {
    bolaX: (gameWin.clientWidth - divBola.clientWidth) / 2,
    bolaY: parseFloat(getComputedStyle(divBola).top),
    barraX: (gameWin.clientWidth - barraPlayerDiv.clientWidth) / 2,
};

const bola = {
    posX: posInici.bolaX,
    posY: posInici.bolaY,
    veloX: 10,
    veloY: 10,
};

const barraPlayer = {
    posX: posInici.barraX,
    posY: parseFloat(getComputedStyle(barraPlayerDiv).top),
    velo: 30,
};

barraPlayerDiv.style.left = barraPlayer.posX + "px";

divBola.style.left = bola.posX + "px";
divBola.style.top = bola.posY + "px";


// INICIAR PARTIDA

startGameBtn.addEventListener("click", function() {

    if (partidaTerminada) {
        reiniciarPartida();
    }

    startGameBtn.disabled = true;

    startTimer(30);

    gameWin.addEventListener("mousemove", movBarra);
});


// MOVER BARRA

function movBarra(e) {
    const rect = gameWin.getBoundingClientRect();

    let mouseX = e.clientX - rect.left;

    barraPlayer.posX = mouseX - barraPlayerDiv.offsetWidth / 2;

    const max = gameWin.clientWidth - barraPlayerDiv.offsetWidth - 20;

    if (barraPlayer.posX < 0) {
        barraPlayer.posX = 20;
    }

    if (barraPlayer.posX > max) {
        barraPlayer.posX = max;
    }

    barraPlayerDiv.style.left = barraPlayer.posX + "px";
}


// COMPROBAR COLISIONES

function comprobarColision() {

    const bolaAncho = divBola.offsetWidth;
    const bolaAlto = divBola.offsetHeight;

    const barraAncho = barraPlayerDiv.offsetWidth;
    const barraAlto = barraPlayerDiv.offsetHeight;

    const containerBloquesAncho = divBloques.offsetWidth;
    const containerBloquesAlto = divBloques.offsetHeight;

    const bloquesX = divBloques.offsetLeft;
    const bloquesY = divBloques.offsetTop;

    // Colisión con la barra

    const colisionBarra =
        bola.posX + bolaAncho > barraPlayer.posX &&
        bola.posX < barraPlayer.posX + barraAncho &&
        bola.posY + bolaAlto > barraPlayer.posY &&
        bola.posY < barraPlayer.posY + barraAlto;

    // Colisión con el contenedor de bloques

    const colisionBloque =
        bola.posX + bolaAncho > bloquesX &&
        bola.posX < bloquesX + containerBloquesAncho &&
        bola.posY + bolaAlto > bloquesY &&
        bola.posY < bloquesY + containerBloquesAlto;

    // Rebote en la barra

    if (colisionBarra && bola.veloY > 0) {

        const bolaCentroX = bola.posX + bolaAncho / 2;

        let impacto = (bolaCentroX - barraPlayer.posX - barraAncho / 2) / (barraAncho / 2);

        impacto = Math.max(-1, Math.min(1, impacto));

        bola.veloX = impacto * 20;

        bola.veloY = -20 * (1 - Math.abs(impacto));

        bola.veloY = Math.min(-4, bola.veloY);

        bola.posY = barraPlayer.posY - bolaAlto;
    }

    // Colisión con los bloques

    if (colisionBloque) {

        const bloques = document.querySelectorAll(".bloque");

        for (const bloque of bloques) {

            if (bloque.classList.contains("hidden")) {
                continue;
            }

            const bloqueX = bloque.offsetLeft + divBloques.offsetLeft;
            const bloqueY = bloque.offsetTop + divBloques.offsetTop;

            const bloqueAncho = bloque.offsetWidth;
            const bloqueAlto = bloque.offsetHeight;

            const colision =
                bola.posX + bolaAncho > bloqueX &&
                bola.posX < bloqueX + bloqueAncho &&
                bola.posY + bolaAlto > bloqueY &&
                bola.posY < bloqueY + bloqueAlto;

            if (colision) {

                bloque.classList.add("hidden");

                const bolaCentroX = bola.posX + bolaAncho / 2;
                const bolaCentroY = bola.posY + bolaAlto / 2;

                const bloqueCentroX = bloqueX + bloqueAncho / 2;
                const bloqueCentroY = bloqueY + bloqueAlto / 2;

                const dx = bolaCentroX - bloqueCentroX;
                const dy = bolaCentroY - bloqueCentroY;

                const solapamientoX =
                    (bolaAncho + bloqueAncho) / 2 - Math.abs(dx);

                const solapamientoY =
                    (bolaAlto + bloqueAlto) / 2 - Math.abs(dy);

                if (solapamientoX < solapamientoY) {

                    bola.veloX *= -1;

                    if (dx > 0) {
                        bola.posX = bloqueX + bloqueAncho;
                    } else {
                        bola.posX = bloqueX - bolaAncho;
                    }

                } else {

                    bola.veloY *= -1;

                    if (dy > 0) {
                        bola.posY = bloqueY + bloqueAlto;
                    } else {
                        bola.posY = bloqueY - bolaAlto;
                    }
                }

                if (contarBloques(bloques)) {

                    partidaTerminada = true;

                    clearInterval(timer);

                    startGameBtn.textContent = "Felicidades has ganado";
                    startGameBtn.disabled = false;

                }

                break;
            }
        }
    }
}

function contarBloques(bloques) {
    let ret = true;
    for (const bloc of bloques) {
        if (!bloc.classList.contains("hidden")) {
            ret=false;
            return ret;
        }
    }
    return ret;
}

// TEMPORIZADOR Y MOVIMIENTO

function startTimer(time) {

    timer = setInterval(() => {

        const maxX = gameWin.clientWidth - divBola.offsetWidth;
        const maxY = gameWin.clientHeight - divBola.offsetHeight;

        bola.posX += bola.veloX;
        bola.posY += bola.veloY;

        // Pared derecha

        if (bola.posX >= maxX) {
            bola.posX = maxX;
            bola.veloX *= -1;
        }

        // Pared izquierda

        if (bola.posX <= 0) {
            bola.posX = 0;
            bola.veloX *= -1;
        }

        // Pared superior

        if (bola.posY <= 0) {
            bola.posY = 0;
            bola.veloY *= -1;
        }

        comprobarColision();

        // La bola cae

        if (bola.posY >= maxY) {

            clearInterval(timer);

            perderVida();

            return;
        }

        divBola.style.left = bola.posX + "px";
        divBola.style.top = bola.posY + "px";

    }, time);
}


// PERDER UNA VIDA

function perderVida() {

    vidas--;

    // Cambiar círculo rojo por gris

    vidasDiv[vidas].classList.remove("alive");
    vidasDiv[vidas].classList.add("ded");

    // Detener movimiento y quitar control del ratón

    gameWin.removeEventListener("mousemove", movBarra);

    // Comprobar si quedan vidas

    if (vidas == 0) {

        partidaTerminada = true;

        startGameBtn.textContent = "Game Over - Reiniciar";
        startGameBtn.disabled = false;

    } else {

        // Recolocar bola y barra

        bola.posX = posInici.bolaX;
        bola.posY = posInici.bolaY;

        bola.veloX = 10;
        bola.veloY = 10;

        barraPlayer.posX = posInici.barraX;

        barraPlayerDiv.style.left = barraPlayer.posX + "px";

        divBola.style.left = bola.posX + "px";
        divBola.style.top = bola.posY + "px";

        startGameBtn.disabled = false;
    }
}


// REINICIAR PARTIDA

function reiniciarPartida() {

    vidas = 3;

    partidaTerminada = false;

    // Recuperar los círculos rojos

    vidasDiv.forEach(vida => {
        vida.classList.remove("ded");
        vida.classList.add("alive");
    });

    // Recuperar bloques

    setBloques();

    // Recuperar posiciones

    bola.posX = posInici.bolaX;
    bola.posY = posInici.bolaY;

    bola.veloX = 10;
    bola.veloY = 10;

    barraPlayer.posX = posInici.barraX;

    barraPlayerDiv.style.left = barraPlayer.posX + "px";

    divBola.style.left = bola.posX + "px";
    divBola.style.top = bola.posY + "px";

    startGameBtn.textContent = "Empezar";
}


// CREAR BLOQUES

function setBloques() {

    divBloques.innerHTML = `
        <div class="fila red">
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
        </div>

        <div class="fila green">
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
        </div>

        <div class="fila blue">
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
            <div class="bloque"></div>
        </div>
    `;
}


// GENERAR BLOQUES AL CARGAR LA PÁGINA

setBloques();
