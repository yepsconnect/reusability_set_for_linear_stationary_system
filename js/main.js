var chart = null
let N = document.querySelector('#firstDot').value
const t = Math.PI
const t0 = 0
const M = 75
const ds = t/M

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

function showVector(){
    let f = document.querySelector('#inputVectorOne').value
    let g = document.querySelector('#inputVectorTwo').value
    let vector = [g, f]
    return vector
}

function c_analit(psi1, psi2){
    if(psi1 >= 0 && psi2 >= -psi1/2){
        return psi1 + psi2
    }

    if(psi1 < 0 && psi2 >= psi1/2){
        return psi2 - psi1
    }

    return -Math.pow(psi1,2)/(4*psi2)
}

function C_analit_grad (psi1, psi2){
    if(psi1 >= 0 && psi2 >= -psi1/2){
        return [1,1]
    }

    if(psi1 < 0 && psi2 >= psi1/2){
        return [-1,1]
    }

    return [-psi1/(2*psi2),Math.pow(psi1,2)/(4*Math.pow(psi2,2))]
}

function PSI(psi, s){
    const transposeMatrix = math.transpose(showMatrix())
    const matrix = math.multiply(transposeMatrix, t - s)
    const matrixExp = math.expm(matrix)
    return math.multiply(matrixExp, psi)
}

let seq2 = []

function plot2() { 

    for (let i = 1; i < N; i++) {
        const DX = []
        const DY = []
        const psi = [Math.cos((2 * Math.PI * i) / N), Math.sin((2 * Math.PI * i) / N)]
        const D1 = math.multiply(math.expm(math.multiply(showMatrix(),t-t0)),showVector())
        const D2 = [0,0]

        for(let j = 1; j < M; j++){
            const p = math.re(PSI(psi, t0 + j * ds))
            const At = math.multiply(showMatrix(), t - (t0 + j * ds))
            const exp = math.expm(At)
            const re = math.re(exp)
            const grad = C_analit_grad(p._data[0], p._data[1]) 
            const gradDS = math.multiply(math.matrix(grad), ds)
            const mulDs = math.multiply(re, gradDS)

            D2[0] = D2[0] + mulDs._data[0]
            D2[1] = D2[1] + mulDs._data[1]

        }

        DX[i] = D1._data[0] + D2[0]
        DY[i] = D1._data[1] + D2[1]
        P2 = [DX[i],DY[i]]
        
        seq2.push(P2)
    } 

    if (chart)
    chart.clear()
    var ctx2 = document.getElementById('myChart2').getContext('2d');

    chart = new Chart(ctx2, {
        type: 'scatter',
        data: {
            datasets: [{
                data: seq2.map((x, y) => ({
                    x: x[0],
                    y: x[1]

                })),
                showLine: true,
                label: 'A',
                borderColor: 'rgb(0, 0, 0)',
                }]
        },

        options: {
            responsive: true,
        }
    });
}



function plot3() {
    const seq3 = [] 

    for (let i = 1; i < N; i++) {
        const psi = [Math.cos((2 * Math.PI * i) / N), Math.sin((2 * Math.PI * i) / N)]
        //console.log(psi)
        const D1 = math.multiply(math.multiply(math.expm(math.multiply(showMatrix(),t-t0)),showVector()),psi)
        //console.log(D1)

        let D2 = 0

        for(let j = 1; j < M; j++){
            
            const trans = math.transpose(showMatrix())
            const mul1 = math.multiply(trans, t-t0-ds*j) 
            const exp = math.expm(mul1)
            const mul2 = math.multiply(exp, psi)
            const preRe1 = mul2._data[0]
            const preRe2 = mul2._data[1]
            const re1 = math.re(preRe1)
            const re2 = math.re(preRe2)
            const func = c_analit(re1, re2)
            const mulDs = func * ds
            D2 = D2 + mulDs
        }

        DC = D1 + D2

        const DX = seq2.map(x => x[0])
        
        const minX = DX.reduce((p, n) => {
            if (p > n) {
                p = n
            }
            return p
        }, DX[0]) - 10

        const maxX = DX.reduce((p, n) => {
            if (p < n) {
                p = n
            }
            return p
        }, DX[0]) + 10

        const DY = seq2.map(x => x[1])

        const minY = DY.reduce((p, n) => {
            if (p > n) {
                p = n
            }
            return p
        }, DY[0]) - 10

        const maxY = DY.reduce((p, n) => {
            if (p < n) {
                p = n
            }
            return p
        }, DY[0]) + 10
        
        const plots = []

        for (let x = minX; x < maxX ; x += 0.9) {
            y = (DC - x * psi[0]) / psi[1]
            plots.push([x, y])
        }

        seq3.push(plots)
        
    } 

    if (chart)
    chart.clear()
    var ctx = document.getElementById('myChart3').getContext('2d');

    // console.log(seq2.map(x => x[0]))
    // console.log(seq2.map(y => y[0]))

    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: seq3.map(d => ( {
                data: d.map((x, y) => ({
                    x: x[0],
                    y: x[1]

                })),
                showLine: true,
                label: 'A',
                borderColor: 'rgb(0, 0, 0)',
                }))
        },

        options: {
            responsive: true,

            scales: {
                yAxes: [{
                    ticks: {
                        max: 20,
                        min: 0,
                        stepSize: 2
                    }
                }]
            }
        }
    });
}

plot3()
