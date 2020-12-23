// Чтение матрицы
function showMatrix(){
    let a = document.querySelector('#inputOne').value
    let b = document.querySelector('#inputTwo').value
    let c = document.querySelector('#inputThree').value
    let d = document.querySelector('#inputFour').value
    let matrix = [
        [a, b],
        [c ,d]
    ]
    return matrix
}

// showMatrix()

// Чтение вектора
function showVector(){
    let f = document.querySelector('#inputVectorOne').value
    let g = document.querySelector('#inputVectorTwo').value
    let vector = [g, f]

    console.log(vector)
}

// showVector()

// Чтение точки
function showDot(){
    let x = document.querySelector('#firstDotX').value
    let y = document.querySelector('#firstDotY').value

    console.log(x)
    console.log(y)
}

// showDot()

function c_analit(psi1, psi2){
    if(psi1 >= 0 && psi2 >= -psi1/2){
        return psi1 + psi2
    }

    if(psi1 < 0 && psi2 >= psi1/2){
        return psi2 - psi1
    }

    return -Math.pow(psi1,2)/(4*psi2)
}

// console.log( c_analit(1,2) )

function C_analit_grad (psi1, psi2){
    if(psi1 >= 0 && psi2 >= -psi1/2){
        return [1,1]
    }

    if(psi1 < 0 && psi2 >= psi1/2){
        return [-1,1]
    }

    return [-psi1/(2*psi2),Math.pow(psi1,2)/(4*Math.pow(psi2,2))]
}

var chart = null
let N = document.querySelector('#firstDot').value


// Строим параболу
function pointplot(){
    N = document.querySelector('#firstDot').value
    const seq = [] 

    for(let i = 1; i < N; i++){
        const psi1 = Math.cos((2*Math.PI*i)/N)
        const psi2 = Math.sin((2*Math.PI*i)/N)

        seq.push(C_analit_grad(psi1, psi2)) 
    }

    if (chart)
        chart.clear()
    var ctx = document.getElementById('myChart').getContext('2d');
    
    console.log(seq.map(x => x[0]))
    console.log(seq.map(x => x[1]))

    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'scatter',

        // The data for our dataset
        data: {
            //labels: x.map(x => x.toFixed(2)),
            datasets: [{
                data: seq.map(x => ({
                    x: x[0],
                    y: x[1]
                })),
                showLine: true,
                label: 'A',
                borderColor: 'rgb(0, 0, 0)',
              }]
        },

        // Configuration options go here
        options: {
            responsive: true,
            
        }
    });

}

// pointplot()

// Транспонирование матрицы (нашел библиотеку, которая умеет это делать)

// function transposeArray(array, arrayLength){
//     var newArray = [];
//     for(var i = 0; i < array.length; i++){
//         newArray.push([]);
//     };

//     for(var i = 0; i < array.length; i++){
//         for(var j = 0; j < arrayLength; j++){
//             newArray[j].push(array[i][j]);
//         };
//     };

//     return newArray;
// }


// Сравниваю результаты моей функции и библиотеки
// console.log(transposeArray(showMatrix(),2))
// console.log(math.transpose(showMatrix()))

const t = Math.PI
const t0 = 0
const M = 75
const ds = t/M

function PSI(psi, s){
    const transposeMatrix = math.transpose(showMatrix())
    const matrix = math.multiply(transposeMatrix, t - s)
    const matrixExp = math.expm(matrix)
    return math.multiply(matrixExp, psi)
}

for (let i = 1; i < N; i++) {
    const psi = [Math.cos(((2 * Math.PI * i) / N) + 0.01), Math.sin(((2 * Math.PI * i) / N) + 0.01)]
    // const D1 = math.multiply(math.expm(showMatrix(),t - t0), showVector())
    
    for(let j = 1; j < N; j++){
        const p = math.re(PSI(psi, t0 + j * ds))
        const At = math.multiply(showMatrix(), t - (t0 + j * ds))
        
        const exp = math.expm(At)
        
        const re = math.re(exp)
        
        const grad = C_analit_grad(p._data[0], p._data[1]) 
        const gradDS = math.multiply(math.matrix(grad), ds)
        const mulDs = math.multiply(re, gradDS)

        console.log(mulDs) 
    }

    // const D2 = 
}

// console.log(math.expm())
