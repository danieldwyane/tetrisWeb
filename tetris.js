const canvas = document.getElementById('tetris');//para obtener el elemento (canvas)
const context = canvas.getContext('2d');//para obtener el contexto 2d del elemento canvas

context.scale(20, 20);//se aumenta la escala para aumentar tamaño de las piezas

/**funcion para eliminar piezas cuando se logra el encaje entre las piezas(anotar) y sumar puntos */
function arenaSweep(){
    // console.log(arena);
    let rowCount = 1;
    outer: for(let y = arena.length - 1; y > 0; --y){//recorremos el eje y de la matriz (arena, longitud 20 elements), comenzando desde el ultimo elemento, es decir desde abajo
        for (let x = 0; x < arena[y].length; ++x){//recorremos el eje x de la matriz (longitud 12 elements), comenzando desde el primer elemento, de izquierda a derecha
            if (arena[y][x] === 0){//si es igual a 0, saltamos a la siguiente iteracion del primer for (eje y), y si no seguira evaluando los siguientes elementos
                continue outer;
            }
        }
        /**Si se llega aqui es que ningun elemento del eje x fue igual a 0, entonces se procedera a subir el puntaje */
        const row = arena.splice(y, 1)[0].fill(0);//el splice elimina el elemento de la posicion (y) del array (es decir, elimina toda la fila (eje x), el fill cambia los valores a 0 de todo el arreglo eliminado y devuelto por el splice
        // console.log('splice:');
        // console.log(row);
        arena.unshift(row);//agregamos el arreglo (row) al inicio de (arena)
        ++y;

        player.score += rowCount * 10;//player.score es igual a rowCount x 10
        rowCount *= 2;//rowCount es igual a rowCount * 2
    }
}

const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
];

function collide(arena, player) {
    // console.log(player);
    // console.log(player.pos);
    // console.log(player.pos.y + " - " + player.pos.x);
    const [m , o] = [player.matrix, player.pos];//matrix es la pieza
    // console.log(m.length);
    for (let y = 0; y < m.length; ++y){//se recorre la matriz de la pieza(m)
        for (let x = 0; x < m[y].length; ++x){
            // console.log(y + " - " + o.y);
            // console.log(y + o.y);
            // console.log(arena[y + o.y]);
            // console.log(m[y][x]);
            // console.log(arena[y + o.y][x + o.x]);
            // console.log(arena[y + o.y] && arena[y + o.y][x + o.x]);
            if(m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0){//m[y][x] se refiere a la ubicacion en la matriz de la pieza y cuando no sea igual a 0 (cuando la posicion en la matriz represente a la posicion ocupada por la pieza)
                    // console.log(arena[y + o.y] && arena[y + o.y][x + o.x] !== 0);
                    if((arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== undefined){
                        console.log(o.y +" - "+ o.x);
                        console.log(y +" - "+ x);
                        console.log(x + o.x +" - "+ y + o.y);
                        console.log(arena[y + o.y]);
                        console.log(arena[y + o.y][x + o.x]);
                    }
                    console.log(arena[y + o.y] && arena[y + o.y][x + o.x]);
                    // console.log(m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0);
                    // console.log(arena[y + o.y] && arena[y + o.y][x + o.x] !== 0);
                    // console.log("es true");
                    return true;
            }
        }
    }
    return false;
}

/**funcion para crear la matrix, es decir la zona por la donde se puede mover la pieza, el cual es un array de arrays(matriz)*/
function createMatrix(w, h){
    const matrix = [];
    while(h--){
        matrix.push(new Array(w).fill(0));//creamos un array, lo llenamos de (0) y lo agregamos a la variable matrix
    }
    return matrix;
}

function createPiece(type){
    if(type === 'T'){
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
    } else if (type === 'O') {
        return [
            [2, 2],
            [2, 2],
        ];
    } else if (type === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    } else if (type === 'J') {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];
    } else if (type === 'I') {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    }
}

function draw() {
    context.fillStyle =  '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, 
                                 y + offset.y, 
                                 1, 1);
            }
        });
    });
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop(){
    player.pos.y++;//se le suma 1 para que la pieza baje una posicion
    if(collide(arena, player)){
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(dir){
    player.pos.x += dir;
    if(collide(arena, player)){
        player.pos.x -= dir;
    }
}

function playerReset(){
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                    (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore;
    }
}

function playerRotate(dir){
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while(collide(arena, player)){
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if(offset > player.matrix[0].length){
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix, dir){
    for(let y = 0; y < matrix.length; ++y){
        for(let x = 0; x < y; ++x){
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    if(dir > 0){
        matrix.forEach(row => row.reverse());
    }else{
        matrix.reverse();
    }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0){
    // console.log('time: ' + time);
    // console.log('lastTime: ' + lastTime);
    const deltaTime = time - lastTime;//se le resta al tiempo(time) el ultimo tiempo guardado(lastTime) y el resultado es el tiempo transcurrido
    // console.log('deltaTime: ' + deltaTime);
    lastTime = time;

    dropCounter += deltaTime;
    // console.log('dropCounter: ' + dropCounter);
    if (dropCounter > dropInterval) {//si el tiempo transcurrido a mayor al intervalo de 1 segundo
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

function updateScore(){
    document.getElementById('score').innerText = player.score;
}

const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
]

const arena = createMatrix(12, 20);

const player = {
    pos: {x: 0, y: 0},//posicion de la pieza en la matriz arena
    matrix: null,//matriz que representa a la pieza en juego
    score: 0,//puntuacion
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        playerMove(-1);
    }else if(event.keyCode === 39){
        playerMove(1);
    }else if(event.keyCode === 40){
        playerDrop();
    }else if(event.keyCode === 81){
        playerRotate(-1);
    }else if(event.keyCode === 87){
        playerRotate(1);
    }
});

playerReset();
updateScore();
update();