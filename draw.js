TASEPobj = {
    position: [],
    speed: [],
    cars: 0,
    columns: 100,
    rows: 10,
    MCsteps: 100000, // total = columns*rows*MCsteps
    Vmax: 100,
    responseInstinct: 0,
    results: {
        flow: 0,
        rho: 0,
        averageSpeed: 0,
    }
}

function createChart(){

if(document.getElementById('myChart')!=null){
    document.getElementById('myChart').remove();
}

myPlot = document.createElement("canvas");
myPlot.setAttribute("id", "myChart");
document.getElementById('insidePlot').setAttribute("style", "width: 1200px; height: 300px")
myPlot.setAttribute("width", 1200);
myPlot.setAttribute("height", 300);

document.getElementById("insidePlot").appendChild(myPlot);

var chartjs = myPlot.getContext('2d');
var myChart = new Chart(myPlot, {
    type: 'line',

    data: {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        datasets: [{
            // label: false,
            data: [0.1, 1, 0.9, 0.5, 0.1, 0.2, 0.1, 1, 0.9, 0.5, 0.1, 0.2, 0.1, 1, 0.9, 0.5, 0.1, 0.2],
            lineTension: 0,
            borderWidth: 1,
            borderColor: 'black',
            fill: false,
            borderDash: [5, 5],
        }]
    },
    options: {
        // spanGaps: false,
        responsive: true,
        maintainAspectRatio: false,
        title: {
            text: "Model Flow",
            display: true,
        },
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                display: false,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            }],
            yAxes: [{
                display: true,
                ticks: {
                    max: 1,
                    min: 0,
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Flow'
                }
            }]
        },
    }

});
};




$("#stopModel").on("click", function (event) {
    location.reload();
});

$("#runModel").on("click", function (event) {
    event.preventDefault();

    count = 0;
    TASEPobj.cars = $('#cars').val();
    TASEPobj.columns = $('#columns').val();
    TASEPobj.rows = $('#rows').val();

    if ($('#Vmax').val() == "L") {
        TASEPobj.Vmax = TASEPobj.columns;
    } else {
        TASEPobj.Vmax = $('#Vmax').val();
    }

    createChart();
    startModelRun();
});

// for (i = 0; i < TASEPobj.position.length; i++) {
//     for (j = 0; j < TASEPobj.position[0].length; j++) {
//         TASEPobj.position[i][j] = Math.floor(Math.random() * 2);
//     }
// }

// code

// setCars(TASEPobj);
// setCars(TASEPobj2);
// code end



// function - grid
function drawGrid(obj) {
    linesize = 1;
    step = 1200 / obj.columns;
    w = obj.columns * step + linesize * 2;
    h = obj.rows * step + linesize * 2;


    mycanvas = document.createElement("canvas");
    mycanvas.setAttribute("id", "canvas");
    mycanvas.setAttribute("width", w);
    mycanvas.setAttribute("height", h);

    // var c = document.getElementById("canvas");
    var ctx = mycanvas.getContext("2d");
    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);

    ctx.strokeStyle = 'gray';
    ctx.lineWidth = linesize;

    for (i = 1; i < w; i += step) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
    }

    for (j = 1; j < h; j = j += step) {
        ctx.moveTo(0, j);
        ctx.lineTo(w, j);
        ctx.stroke();
    }

    drawCars(obj);

    document.getElementById("insideCanvas").appendChild(mycanvas);
}
// function - grid end

//function - run
function startModelRun() {

    if (document.getElementById("canvas") != null) {
        clearInterval(move);
        document.getElementById("canvas").remove();
    };

    make_zeros(TASEPobj);
    populate(TASEPobj);
    drawGrid(TASEPobj);

    move = setInterval(function () {


        move_dinamics(TASEPobj);
        // console.log(TASEPobj.position);
        document.getElementById("canvas").remove();
        move_dinamics(TASEPobj);
        count++;
        document.getElementById("flowdata").textContent = (TASEPobj.results.flow / count);
        // console.log(TASEPobj.position)
        drawGrid(TASEPobj);
        // console.log(TASEPobj_in.position);


    }, 50);
}
// function - run end

// function - cars
function drawCars(obj) {
    peice = obj.position;
    var ctx = mycanvas.getContext("2d");
    for (i = 0; i < peice.length; i++) {
        for (j = 0; j < peice[0].length; j++) {
            if (peice[i][j] == 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(j * step + linesize * 2, i * step + linesize * 2, step - linesize * 2, step - linesize * 2);
            }
        }
    }
}
// function - cars end


// populate function
function populate(obj) {
    car = obj.cars;
    obj.results.flow = 0;
    obj.results.rho = car / obj.rows / obj.columns;
    array = obj.position;
    while (car > 0) {
        if (car > array.length * array[0].length) {
            return console.log("error: car > ext_array.length*int_array.length")
        }
        var x = Math.floor(Math.random() * array.length);
        var y = Math.floor(Math.random() * array[0].length);
        if (array[x][y] == 0) {
            array[x][y] = 1;
            car--;
        }
    }
    obj.position = array;
    return obj;
}
// populate function end


//dinamics - basic move
function move_dinamics(obj) {
    var ext_array = obj.position;
    var v = obj.speed;
    var r = ext_array.length;
    var L = ext_array[0].length;
    var x = Math.floor(Math.random() * r);
    var y = Math.floor(Math.random() * L);

    var movecount = 0;
    var vmaxcount = 0;

    // speed_check=1;
    if (obj.Vmax - 1 == vmaxcount) {
        vmaxcount = vmaxcount - 1;
    }

    var move = true;
    // console.log(obj.position);
    if (ext_array[x][y] == 1) {
        while (vmaxcount < obj.Vmax - 1 && move == true) { //loop to keep moving
            // console.log(obj.position);
            if (ext_array[x][y] == 1) {
                // v[x][y]=Math.min(obj.Vmax,v[x][y]+1);
                // speed_check = Math.min(obj.Vmax, v[x][y]+1,ext_array[0].length);
                move = false;

                var y_next = y + 1;

                if (y_next >= L) {
                    y_next = y + 1 - L;
                }

                var x_top = x + 1;
                if (x_top >= r) {
                    x_top = x + 1 - r;
                }

                var x_bot = x - 1;
                if (x_bot < 0) {
                    x_bot = x - 1 + r;
                }


                if (ext_array[x][y_next] == 0) {
                    ext_array[x][y] = 0;
                    v[x][y_next] = v[x][y];
                    v[x][y] = 0;
                    ext_array[x][y_next] = 1;
                    move = true;
                    y = y_next;
                    if (y_next == 0) { obj.results.flow++; }
                }
                else {

                    topFirst = Math.floor(Math.random() * 2);

                    if (topFirst == 1) {
                        if (ext_array[x_bot][y_next] == 0 && ext_array[x_bot][y] == 0) {
                            ext_array[x][y] = 0;
                            v[x_bot][y_next] = v[x][y];
                            v[x][y] = 0;
                            ext_array[x_bot][y_next] = 1;
                            move = true;
                            y = y_next;
                            x = x_bot;
                            if (y_next == 0) { obj.results.flow++; }
                        }
                        else if (ext_array[x_top][y_next] == 0 && ext_array[x_top][y] == 0) {
                            ext_array[x][y] = 0;
                            v[x_top][y_next] = v[x][y];
                            v[x][y] = 0;
                            ext_array[x_top][y_next] = 1;
                            move = true;
                            y = y_next;
                            x = x_top;
                            if (y_next == 0) { obj.results.flow++; }
                        }
                    }
                    else {
                        if (ext_array[x_top][y_next] == 0 && ext_array[x_top][y] == 0) {
                            ext_array[x][y] = 0;
                            v[x_top][y_next] = v[x][y];
                            v[x][y] = 0;
                            ext_array[x_top][y_next] = 1;
                            move = true;
                            y = y_next;
                            x = x_top;
                            if (y_next == 0) { obj.results.flow++; }
                        }
                        else if (ext_array[x_bot][y_next] == 0 && ext_array[x_bot][y] == 0) {
                            ext_array[x][y] = 0;
                            v[x_bot][y_next] = v[x][y];
                            v[x][y] = 0;
                            ext_array[x_bot][y_next] = 1;
                            move = true;
                            y = y_next;
                            x = x_bot;
                            if (y_next == 0) { obj.results.flow++; }
                        }
                    }

                }

                if (move == true) {
                    movecount++;
                }

                var res_array = ext_array;
                obj.position = res_array;


            }

            vmaxcount++;
        }
    }

    return obj;
}

//make zeros
function make_zeros(obj) {
    row = obj.rows;
    column = obj.columns;
    var ext_array1 = [];
    var ext_array2 = [];

    for (var i = 0; i < row; i++) { //row
        var int_array1 = [];
        var int_array2 = [];

        for (var j = 0; j < column; j++) { //column
            int_array1[j] = 0;
            int_array2[j] = 0;
        }
        ext_array1[i] = int_array1;
        ext_array2[i] = int_array2;
    }

    obj.position = ext_array1;
    obj.speed = ext_array2;
    return obj;
}