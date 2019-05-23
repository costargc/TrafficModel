var TASEPobj = {
    position: [],
    speed: [],
    cars: 0,
    columns: 10,
    rows: 2,
    MCsteps: 1000, // total = columns*rows*MCsteps
    Vmax: 1,
    responseInstinct: 0,
    results: {
        flow: 0,
        rho: 0,
        averageSpeed: 0,
    }
}

make_zeros(TASEPobj);
TASEPobj.cars = 3;
populate(TASEPobj);

drawGrid(TASEPobj);



move=setInterval(function () {

    move_dinamics(TASEPobj);
    // console.log(TASEPobj.position);
    document.getElementById("canvas").remove();
    move_dinamics(TASEPobj);
    // console.log(TASEPobj.position)
    drawGrid(TASEPobj);
    // console.log(TASEPobj_in.position);


}, 50);



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
    w = obj.columns * 60 + 2;
    h = obj.rows * 60 + 2;
    step = 60;
    mycanvas = document.createElement("canvas");
    mycanvas.setAttribute("id", "canvas");
    mycanvas.setAttribute("width", w);
    mycanvas.setAttribute("height", h);

    // var c = document.getElementById("canvas");
    var ctx = mycanvas.getContext("2d");
    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);

    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 1;

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

    setCars(obj)

    document.body.appendChild(mycanvas);

}
// function - grid end

// function - cars
function setCars(obj) {
    peice = obj.position;
    var ctx = mycanvas.getContext("2d");
    for (i = 0; i < peice.length; i++) {
        for (j = 0; j < peice[0].length; j++) {
            if (peice[i][j] == 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(j * 60 + 2, i * 60 + 2, 60 - 2, 60 - 2);
            }
        }
    }
}
// function - cars end