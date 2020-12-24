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


function plot2() {
    N = document.querySelector('#firstDot').value
    const seq2 = [] 

    for (let i = 1; i < N; i++) {
        const DX = []
        const DY = []
        const psi = [Math.cos(((2 * Math.PI * i) / N) + 0.01), Math.sin(((2 * Math.PI * i) / N) + 0.01)]
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
        const P2 = [DX[i],DY[i]]
        
        seq2.push(P2)
    } 

    if (chart)
    chart.clear()
    var ctx2 = document.getElementById('myChart2').getContext('2d');

    console.log(seq2.map(x => x[0]))
    console.log(seq2.map(y => y[0]))

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
