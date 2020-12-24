// Транспонирование матрицы (нашел библиотеку, которая умеет это делать)

function transposeArray(array, arrayLength){
    var newArray = [];
    for(var i = 0; i < array.length; i++){
        newArray.push([]);
    };
    for(var i = 0; i < array.length; i++){
        for(var j = 0; j < arrayLength; j++){
            newArray[j].push(array[i][j]);
        };
    };
    return newArray;
}
// Сравниваю результаты моей функции и библиотеки
console.log(transposeArray(showMatrix(),2))
console.log(math.transpose(showMatrix()))


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
    
    // console.log(seq.map(x => x[0]))
    // console.log(seq.map(x => x[1]))

    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
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

        options: {
            responsive: true,
        }
    });
}
