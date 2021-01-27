let seq2 = []
let seq3 = [] 
let chart2 = null
let chart3 = null

function showMatrix(){
    const a = document.querySelector('#inputOne').value
    const b = document.querySelector('#inputTwo').value
    const c = document.querySelector('#inputThree').value
    const d = document.querySelector('#inputFour').value
    const matrix = [
        [a, b],
        [c ,d]
    ]
    return matrix
}

function showVector(){
    const x1 = document.querySelector('#inputVectorOne').value
    const x2 = document.querySelector('#inputVectorTwo').value
    const vector = [x1, x2]
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
const t = document.querySelector('#timeEnd').value
    const transposeMatrix = math.transpose(showMatrix())
    const matrix = math.multiply(transposeMatrix, t - s)
    const matrixExp = math.expm(matrix)
    console.log(math.multiply(matrixExp, psi))
    return math.multiply(matrixExp, psi)
}

function сalculationsOne() {
    let chart2 = null

    const N = document.querySelector('#firstDot').value
    const t = document.querySelector('#timeEnd').value
    const t0 = document.querySelector('#timeStart').value
    const M = 75
    const tx = Math.abs( t - t0) 
    const ds = tx/M 
    for (let i = 1; i < N; i++) {
        const DX = []
        const DY = []
        const psi = [Math.cos((2 * Math.PI * i) / N), Math.sin((2 * Math.PI * i) / N)]
        console.log(psi)
        const D1 = math.multiply(math.expm(math.multiply(showMatrix(),t)),showVector())
        const D2 = [0,0]

        for(let j = 1; j < M; j++){
            const p = math.re(PSI(psi, tx + j * ds))
            const At = math.multiply(showMatrix(), tx - j * ds)
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
    return seq2
}

function plotOne () {
    let seq2 = сalculationsOne()
    var ctx2 = document.getElementById('myChart2').getContext('2d');

    if (chart2 != null){
        chart2.destroy()
    }

    chart2 = new Chart(ctx2, {
        type: 'bubble',
        data: {
            datasets: [{
                data: seq2.map((x) => ({
                    x: x[0],
                    y: x[1]

                })),
                showLine: true,
                fill: false,
                borderColor: '#FF0000',
                }]
        },

        options: {
            legend: {
                display: false
            },
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        stepSize: 1
                    }
                }],
                xAxes: [{
                    ticks: {
                        stepSize: 1
                    }
                }]
            }
        }
    });
}

function plotTwo() {
    let chart3 = null
    let N = document.querySelector('#firstDot').value
    let t = document.querySelector('#timeEnd').value
    let t0 = document.querySelector('#timeStart').value
    let M = 75
    let ds = t/M

    let minX
    let maxX
    let minY
    let maxY

    for (let i = 1; i < N; i++) {
        const psi = [Math.cos((2 * Math.PI * i) / N), Math.sin((2 * Math.PI * i) / N)]
        const D1 = math.multiply(math.multiply(math.expm(math.multiply(showMatrix(),t-t0)),showVector()),psi)
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

        let DX = seq2.map(x => x[0])
        
        minX = DX.reduce((p, n) => {
            if (p > n) {
                p = n
            }
            return p
        }, DX[0]) 

        maxX = DX.reduce((p, n) => {
            if (p < n) {
                p = n
            }
            return p
        }, DX[0]) 

        let DY = seq2.map(x => x[1])
        
        minY = DY.reduce((p, n) => {
            if (p > n) {
                p = n
            }
            return p
        }, DY[0]) 

        maxY = DY.reduce((p, n) => {
            if (p < n) {
                p = n
            }
            return p
        }, DY[0]) 
        
        const plots = []

        for (let x = minX; x < maxX ; x += 2) {
            y = (DC - x * psi[0]) / psi[1]
            plots.push([x,y])
        }

        seq3.push(plots)
    } 

    if (chart3 != null){
        chart3.destroy()
    }
    var ctx = document.getElementById('myChart3').getContext('2d');

    chart3 = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: seq3.map(d => ( {
                data: d.map((x) => ({
                    x: x[0]+1,
                    y: x[1]-1

                })),
                showLine: true,
                fill: false,
                label: 'A',
                borderColor: 'rgb(0, 0, 0)',
                }))
        },

        options: {
            responsive: true,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        max: maxY+2,
                        min: minY-2,
                    }
                }],
                xAxes: [{
                    ticks: {
                        max: maxX+1,
                        min: minX+1,
                    }
                }]
            }
        }
    });
}

