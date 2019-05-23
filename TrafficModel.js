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

// code
// TASEPobj.cars = 0;

// for (i = 1; i < TASEPobj.columns * TASEPobj.rows; i = i + 1) {
//     TASEPobj.cars = i;
//     make_zeros(TASEPobj);
//     // console.log(TASEPobj.position);

//     populate(TASEPobj);
//     // console.log(TASEPobj.position);

//     // move_dinamics(TASEPobj);
//     // console.log(TASEPobj);
//     recursive_move(TASEPobj);
//     // console.log(TASEPobj);
//     // console.log(TASEPobj.position);
//     console.log(TASEPobj.results.rho + ", " + TASEPobj.results.flow);
//     // drawGrid(TASEPobj);
// }

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

//populate
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





// counter = 100000;
// M_arr = move_dinamics(P_arr);
// while (counter > 0) {
//     M_arr = move_dinamics(M_arr);
//     console.log(M_arr);
//     counter--;
// }


//dinamics recursive
function recursive_move(obj) {
    counter = obj.MCsteps * obj.rows * obj.columns;
    // arr=obj.position;
    // Marr = move_dinamics(obj);
    while (counter > 0) {
        move_dinamics(obj);
        // console.log(M_arr);
        counter--;
    }
    // obj.position = Marr;
    return obj
}

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
    if(obj.Vmax-1==vmaxcount){
        vmaxcount=vmaxcount-1;
    }

    var move = true;
    // console.log(obj.position);
    if (ext_array[x][y] == 1) {
        while (vmaxcount < obj.Vmax-1 && move == true) { //loop to keep moving
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
