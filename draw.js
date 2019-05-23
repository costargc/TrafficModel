var TASEPobj = {
    position: [],
    speed: [],
    cars: 4,
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
    linesize=1;
    step = 1200/obj.columns;
    w = obj.columns * step + linesize*2;
    h = obj.rows * step + linesize*2;

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
                ctx.fillRect(j * step + linesize*2, i * step + linesize*2, step - linesize*2, step - linesize*2);
            }
        }
    }
}
// function - cars end