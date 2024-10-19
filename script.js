let cargas = []; // Lista para almacenar las cargas
let punto; // Punto donde se calculará el campo eléctrico total
let arrastrandoPunto = false; // Controla si se está arrastrando el punto
let arrastrandoIndiceCarga = -1; // Controla qué carga se está arrastrando

// Constante de Coulomb
const k = 8.99e9; // N·m²/C²

function setup() {
    createCanvas(windowWidth, windowHeight); // Hacer que el canvas ocupe toda la pantalla
    punto = createVector(windowWidth / 2 + 100, windowHeight / 2); // Definir el punto de referencia para el campo eléctrico
}

function draw() {
       background(255); // Fondo blanco
        
        // Dibujar la cuadrícula con un espaciado de 50 píxeles (puedes ajustar esto)
        dibujarCuadricula(50);
    
        // Mostrar todas las cargas
        for (let i = 0; i < cargas.length; i++) {
            cargas[i].mostrar(); // Dibujar cada carga en el canvas
        }
    
        // Mostrar el punto de referencia
        fill(0);
        ellipse(punto.x, punto.y, 10, 10); // Dibujar el punto de referencia
    
        // Calcular la sumatoria de todos los campos eléctricos en el punto de referencia
        let campoTotal = createVector(0, 0); // El campo total empieza en (0,0)
        for (let i = 0; i < cargas.length; i++) {
            let E = cargas[i].campoElectricoEn(punto); // Campo eléctrico de la carga 'i' en el punto
            campoTotal.add(E); // Sumar el campo al campo total
        }
    
        // Dibujar el vector resultante del campo eléctrico total
        dibujarVectorCampoElectrico(punto, campoTotal);
    
        // Control de arrastre del punto
        if (arrastrandoPunto) {
            punto.set(mouseX, mouseY); // Actualizar la posición del punto de referencia
        }
    
        // Control de arrastre de las cargas
        if (arrastrandoIndiceCarga > -1) {
            cargas[arrastrandoIndiceCarga].pos.set(mouseX, mouseY); // Mover la carga arrastrada
        }
    
}

// Detectar cuando se presiona el mouse sobre una carga o el punto de referencia
function mousePressed() {
    // Verificar si se hizo clic sobre una carga
    for (let i = 0; i < cargas.length; i++) {
        if (dist(mouseX, mouseY, cargas[i].pos.x, cargas[i].pos.y) < 15) {
            arrastrandoIndiceCarga = i; // Comienza a arrastrar la carga
            return;
        }
    }

    // Verificar si se hizo clic sobre el punto de referencia
    if (dist(mouseX, mouseY, punto.x, punto.y) < 5) {
        arrastrandoPunto = true; // Comienza a arrastrar el punto
    }
}

// Detectar cuando se suelta el mouse
function mouseReleased() {
    arrastrandoIndiceCarga = -1; // Deja de arrastrar la carga
    arrastrandoPunto = false; // Deja de arrastrar el punto
}

// Función para añadir una nueva carga
function añadirCarga() {
    let valorCarga = parseFloat(document.getElementById("valorCarga").value);
    if (!isNaN(valorCarga)) {
        // Añadir una nueva carga en una posición aleatoria
        let nuevaCarga = new Carga(random(width), random(height), valorCarga);
        cargas.push(nuevaCarga);
    } else {
        alert("Por favor ingresa un valor de carga válido.");
    }
}

// Clase para la Carga
class Carga {
    constructor(x, y, q) {
        this.pos = createVector(x, y);
        this.q = q; // Carga en coulombs
    }

    mostrar() {
        fill(this.q > 0 ? 'red' : 'blue'); // Carga positiva = rojo, negativa = azul
        ellipse(this.pos.x, this.pos.y, 30, 30); // Dibujar la carga como un círculo
        fill(0);
        text(`${nf(this.q, 1, 2)} C`, this.pos.x + 15, this.pos.y - 15); // Mostrar el valor de la carga
    }

    // Método para calcular el campo eléctrico en un punto dado
    campoElectricoEn(punto) {
        let r = dist(this.pos.x, this.pos.y, punto.x, punto.y); // Distancia entre la carga y el punto
        let rVec = p5.Vector.sub(punto, this.pos); // Vector desde la carga al punto
        rVec.normalize(); // Normalizar el vector (solo dirección)
        let E = (k * abs(this.q)) / (r * r); // Magnitud del campo eléctrico
        return rVec.mult(this.q > 0 ? E : -E); // El campo apunta hacia/desde la carga
    }
}

// Función para dibujar el vector del campo eléctrico
function dibujarVectorCampoElectrico(punto, E) {
    let escala = 1e-7; // Escalar el campo para hacerlo visible
    stroke(0);
    line(punto.x, punto.y, punto.x + E.x * escala, punto.y + E.y * escala); // Dibujar la línea del vector
    fill(0);
    text(`Campo Total: ${nf(E.mag(), 0, 2)} N/C`, punto.x + 10, punto.y - 10); // Mostrar la magnitud del campo

    // Dibujar la flecha al final del vector
    dibujarFlecha(punto, createVector(punto.x + E.x * escala, punto.y + E.y * escala), 10);
}

// Función para dibujar una flecha en la punta del vector
function dibujarFlecha(base, vec, tamanoFlecha) {
    push();
    stroke(0);
    fill(0);
    translate(vec.x, vec.y);
    let angulo = atan2(vec.y - base.y, vec.x - base.x);
    rotate(angulo);
    line(0, 0, -tamanoFlecha, -tamanoFlecha / 2);
    line(0, 0, -tamanoFlecha, tamanoFlecha / 2);
    pop();
}

// Ajustar el tamaño del canvas cuando se redimensiona la ventana
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


function dibujarCuadricula(espaciado) {
    stroke(200); // Color de las líneas de la cuadrícula (gris claro)
    strokeWeight(1); // Grosor de las líneas
    
    // Dibujar las líneas verticales
    for (let x = 0; x < width; x += espaciado) {
        line(x, 0, x, height);
    }

    // Dibujar las líneas horizontales
    for (let y = 0; y < height; y += espaciado) {
        line(0, y, width, y);
    }
}