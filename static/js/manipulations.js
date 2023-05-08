
d3.selection.prototype.last = function () {
    var last = this.size() - 1;
    return d3.select(this[0][last]);
};

function setColorForLables(color) {
    warringtext = document.querySelectorAll('.textFieldLabel');
    for (let i = 0; i < warringtext.length; i++) {
        warringtext[i].style.color = color;
    }
}
let condParams = [[500, 850, 10]];
let pipeline = [];
let pipeParams = [];
let pumpParams = [];
let gateValveParams = [];
let safeValveParams = [];

// Увеличиваем масштаб .workspace при skroll
var scale = 1,
    panning = false,
    pointX = 0,
    pointY = 0,
    start = { x: 0, y: 0 },
    zoom = document.querySelector(".workSpace");
function setTransform() {
    zoom.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";

}

zoom.onmousedown = function (e) {
    e.preventDefault();
    start = { x: e.clientX - pointX, y: e.clientY - pointY };
    panning = true;
}

zoom.onmouseup = function (e) {
    panning = false;
}

zoom.onmousemove = function (e) {
    e.preventDefault();
    if (!panning) {
        return;
    }
    pointX = (e.clientX - start.x);
    pointY = (e.clientY - start.y);
    setTransform();
}

zoom.onwheel = function (e) {
    e.preventDefault();
    var xs = (e.clientX - pointX) / scale,
        ys = (e.clientY - pointY) / scale,
        delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
    (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
    pointX = e.clientX - xs * scale;
    pointY = e.clientY - ys * scale;
    setTransform();
}

// Удалить последний элемент 
function delLastElem(arr) {
    return arr.slice(0, arr.length - 1)
};

delBtn = document.getElementById('delBtn');
delBtn.onclick = function () {
    let lastElem = pipeline.pop();

    if (lastElem === 'pipe') {
        d3.selectAll('.pipe:last-of-type').remove();
        x = (parseInt(x) - pipeParams[pipeParams.length-1][0]).toString();
        pipeParams.pop();

    } else if (lastElem === 'pump') {
        pumpParams.pop();
        d3.selectAll('.pump:last-of-type').remove();

    } else if (lastElem === 'gateValve') {
        gateValveParams.pop();
        d3.selectAll('.gateValve:last-of-type').remove();
        
    } else if (lastElem === 'safeValve') {
        safeValveParams.pop()
        d3.selectAll('.safeValve:last-of-type').remove();
        
    }
};

// Полное обновление SVG
resetBtn = document.getElementById('resetBtn');
resetBtn.onclick = function () {
    let mainSVG = d3.select("#mainSVG");
    mainSVG.selectAll("*").remove();
    condParams = [[500, 850, 10]];
    pipeline = [];
    pipeParams = [];
    pumpParams = [];
    gateValveParams = [];
    safeValveParams = [];
    y = '150';
    x = '100';
}

var socket = io();
// стоп анимации
let anim = true;
let pauseBtn = document.getElementById('pauseBtn');
pauseBtn.onclick = function animStop() {
    anim = false
    // socket.emit('anim', anim)
    
};
//продолжить анимацию
let resumeBtn = document.getElementById('resumeBtn');
resumeBtn.onclick = function animResume() {
    anim = true;
    // socket.emit('anim', anim)
   
};
let controller = new AbortController();
let reloadBtn = document.getElementById('reloadBtn');
reloadBtn.onclick = ()=>{
    let iter_data = 0
    controller.abort();
    controller = new AbortController();
    d3.selectAll('.tooltip').remove()
    drawCharts(fullData, controller, iter_data)
}

let topMenuBtns1 = document.getElementById('manipulatingButtons1')
let topMenuBtns2 = document.getElementById('manipulatingButtons2');
let startBtnOuter = document.getElementById('startBtnOuter')

// создание вебсокета

startBtn = document.getElementById('startBtn');
startBtn.onclick = function () {
    if (pipeline.includes('pipe')) {
        let req = {
            "condParams": condParams,
            "pipeline": pipeline,
            "pipeParams": pipeParams,
            "pumpParams": pumpParams,
            "gateValveParams": gateValveParams,
            "safeValveParams": safeValveParams
        }
        
        socket.emit('json', JSON.stringify(req));
        topMenuBtns1.style.display = "none";
        topMenuBtns2.style.display = "inline";
        startBtnOuter.style.display = 'none';

        fullData = {
            "Davleniya": [],
            "Napory": [],
            "Skorosty": [],
            "t": []
        }

        socket.on('res', res => {
            res = JSON.parse(res)

            fullData.t.push(res.t);
            fullData.Davleniya.push(res.Davleniya)
            fullData.Skorosty.push(res.Skorosty)
            fullData.Napory.push(res.Napory)  
        });

        let interval = setInterval(() => {
            if (fullData.t.length >= req.condParams[0][0]*0.2){
                clearInterval(interval);
                drawCharts(fullData, controller, 0); 
                // drawCharts(fullData, 'P');
                // drawCharts(fullData, 'S');
            }
        }, 1);
        
            
        
    }   
    else {
        condLbl = document.getElementById('conditionLbl');
        condLbl.innerHTML = 'Добавьте элементы в трубопровод'
    }
}

// Выдвижение меню
let menuBtn = document.querySelector('.sideMenuBtn')
let listBtns = document.querySelectorAll('li span')
let leftSide = document.querySelector('.leftSide')
menuBtn.onclick = function () {
    for (let i = 0; i < listBtns.length; i++) {
        listBtns[i].classList.toggle('menuTextAfter')
        listBtns[i].classList.toggle('menuTextBefore')
    };
    if (leftSide.style.width === '250px') {
        leftSide.style.width = '90px';
    } else {
        leftSide.style.width = '250px';
    }
}

let y = '150';
let x = '100';
// 

// действия кнопок
//функции установки начального значения
function setNoneConv() {
    let envCond = document.getElementById('envCond');
    envCond.style.display = 'none';
    document.getElementById('timeToIter').value = '500';
    document.getElementById('density').value = '850';
    document.getElementById('viscosity').value = '10';
}

function setNonePipe() {
    pipeForm = document.getElementById('pipeForm');
    pipeForm.style.display = 'none';
    document.getElementById('lengthOfPipe').value = '100';
    document.getElementById('diameterOfPipe').value = '1000';
}

function setNonePump() {
    pumpForm = document.getElementById('pumpForm');
    pumpForm.style.display = 'none';
    document.getElementById('aOfPump').value = '310';
    document.getElementById('bOfPump').value = '0.0000008';
    document.getElementById('timePump').value = '0';
    document.getElementById('Run-outTimeOfPump').value = '20';
}

function setNoneGateValve() {
    gateValveForm = document.getElementById('gateValveForm');
    gateValveForm.style.display = 'none';
    document.getElementById('timeGateValve').value = '100';
    document.getElementById('Run-outTimeOfGateValve').value = '100';
    document.getElementById('percentGateValve').value = '100';
}

function setNoneSafeValve() {
    safeValveForm = document.getElementById('safeValveForm');
    safeValveForm.style.display = 'none';
    document.getElementById('kForSafeValve').value = '0.5';
    document.getElementById('startPresure').value = '9';
    
}

// Меню параметров среды
let toolBarInnerCondBtn = document.getElementById('toolBarInnerConditions');
toolBarInnerCondBtn.onclick = function () {
    setNonePipe();
    setNoneGateValve();
    setNonePump();

    let envCond = document.getElementById('envCond');
    envCond.style.display = 'block';
    let closeFavCond = document.getElementById('closeFavCond')
    closeFavCond.onclick = function () {
        setNoneConv()
    }

    let envCondBtn = document.getElementById('envCondBtn')
    envCondBtn.onclick = function () {
        if (condParams.length === 0) {
            condParams.push([parseInt(document.getElementById('timeToIter').value), parseInt(document.getElementById('density').value), parseInt(document.getElementById('viscosity').value)])
            setNoneConv();
        }
        else {
            condParams.pop();
            condParams.push([parseInt(document.getElementById('timeToIter').value), parseInt(document.getElementById('density').value), parseInt(document.getElementById('viscosity').value)])
            setNoneConv();
        }
    }

}

// 


let objBtns = document.querySelectorAll('.circleImage')





// трубопровод
objBtns[0].onclick = function () {

    setNoneGateValve();
    setNonePump();
    setNoneConv();
    setNoneSafeValve();

    pipeForm = document.getElementById('pipeForm');
    pipeForm.style.display = 'block';
    pipeFormBtn = document.getElementById('pipeFormBtn');
    closeFavPipe = document.getElementById('closeFavPipe');
    closeFavPipe.onclick = function () {
        setNonePipe();
    };
    pipeFormBtn.onclick = function (e, dx = document.getElementById('lengthOfPipe').value) {
        if (document.getElementById('lengthOfPipe').value === '' || document.getElementById('diameterOfPipe').value === '') {
            setColorForLables('red');
        }
        else {
            pipeline.push('pipe');
            pipeParams.push([parseInt(document.getElementById('lengthOfPipe').value), parseInt(document.getElementById('diameterOfPipe').value) / 1000])


            let svg = document.getElementsByTagName('svg')[0];

            let g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            g.setAttribute('class', 'pipe')

            let crl1 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            crl1.setAttribute('cx', x);
            crl1.setAttribute('cy', y);
            crl1.setAttribute('r', '5');

            let path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            path1.setAttribute("d", "M " + x + " " + y + " h " + dx);
            path1.style.stroke = "#000";
            path1.style.strokeWidth = "4px";


            let path2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            path2.setAttribute("d", "M " + (parseInt(x) + 15).toString() + " " + y + " h " + (parseInt(dx) - 30).toString());
            path2.style.stroke = "transparent";
            path2.style.strokeWidth = "10";

            x = (parseInt(x) + parseInt(dx)).toString();

            let crl2 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            crl2.setAttribute('cx', x);
            crl2.setAttribute('cy', y);
            crl2.setAttribute('r', '5');

            g.appendChild(crl1);
            g.appendChild(path1);
            g.appendChild(path2);
            g.appendChild(crl2);
            svg.appendChild(g);

            setNonePipe();
            setColorForLables('black');
        }
    }
}
// 

// насос
objBtns[1].onclick = function () {

    setNonePipe();
    setNoneGateValve();
    setNoneConv();
    setNoneSafeValve();

    pumpForm = document.getElementById('pumpForm');
    pumpForm.style.display = 'block';
    pumpFormBtn = document.getElementById('pumpFormBtn');
    closeFavPump = document.getElementById('closeFavPump');
    closeFavPump.onclick = function () {
        setNonePump();
    }
    pumpFormBtn.onclick = function () {
        if (document.getElementById('aOfPump').value === '' || document.getElementById('bOfPump').value === ''
            || document.getElementById('timePump').value === '' || document.getElementById('Run-outTimeOfPump').value === '') {
            setColorForLables('red');
        }
        else {
            pipeline.push('pump');
            pumpParams.push([parseFloat(document.getElementById('aOfPump').value), parseFloat(document.getElementById('bOfPump').value),
            parseInt(document.getElementById('pumpSelect').value), parseFloat(document.getElementById('timePump').value),
            parseFloat(document.getElementById('Run-outTimeOfPump').value)])

            dy = '35';
            let svg = document.getElementsByTagName('svg')[0];

            let g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            g.setAttribute('class', 'pump')

            let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            path.setAttribute("d", "M " + x + " " + y + " L " + x + " " + (parseInt(y) - parseInt(dy)).toString());
            path.style.stroke = "#000";
            path.style.strokeWidth = "2px";

            let crl1 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            crl1.setAttribute('cx', x);
            crl1.setAttribute('cy', (y - dy - 25));
            crl1.setAttribute('r', '12.5');
            crl1.setAttribute('stroke-dasharray', '19.6349');
            crl1.setAttribute('stroke-dashoffset', '19.7');
            crl1.setAttribute('fill', 'transparent');
            crl1.setAttribute('stroke', '#000');
            crl1.setAttribute('stroke-width', '25');


            let crl2 = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
            crl2.setAttribute('cx', x);
            crl2.setAttribute('cy', (y - dy - 25));
            crl2.setAttribute('r', '25');
            crl2.setAttribute('stroke', '#000');
            crl2.setAttribute('stroke-width', '2');
            crl2.setAttribute('fill', 'white');


            g.appendChild(path);
            g.appendChild(crl2);
            g.appendChild(crl1);
            svg.appendChild(g);

            setNonePump();
            setColorForLables('black');

        }
    }
}
// 

// задвижка
objBtns[2].onclick = function () {

    setNonePipe();
    setNoneConv();
    setNonePump();
    setNoneSafeValve();

    gateValveForm = document.getElementById('gateValveForm');
    gateValveForm.style.display = 'block';
    gateValveFormBtn = document.getElementById('gateValveFormBtn');
    closeFavGateValve = document.getElementById('closeFavGateValve');
    closeFavGateValve.onclick = function () {
        setNoneGateValve();
    }

    gateValveFormBtn.onclick = function () {
        if (document.getElementById('timeGateValve').value === '' || document.getElementById('Run-outTimeOfGateValve').value === ''
            || document.getElementById('percentGateValve').value === '') {
            setColorForLables('red');
        }
        else {
            pipeline.push('gateValve');
            gateValveParams.push([parseInt(document.getElementById('gateValveSelect').value), parseFloat(document.getElementById('timeGateValve').value),
            parseInt(document.getElementById('Run-outTimeOfGateValve').value), parseInt(document.getElementById('percentGateValve').value)])


            dy = '20';
            dx = '40';
            let svg = document.getElementsByTagName('svg')[0];
            let g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            g.setAttribute('class', 'gateValve')

            let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            path.setAttribute("d", "M " + x + " " + y + " L " + x + " " + (parseInt(y) + 1.25*parseInt(dy)).toString());
            path.style.stroke = "#000";
            path.style.strokeWidth = "2px";


            y = (parseInt(y) + 1.25*parseInt(dy)).toString();
            x = (parseInt(x) - parseInt(dx)/2).toString();

            let pg = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
            pg.setAttribute('fill', 'white')
            pg.setAttribute('stroke', '#000')
            pg.setAttribute("points",
                x + "," + (parseInt(y) + parseInt(dy)/ 2).toString() +
                ' ' + (parseInt(x) + parseInt(dx)).toString() + "," + (parseInt(y) - parseInt(dy)/ 2).toString() +
                ' ' + (parseInt(x) + parseInt(dx)).toString() + "," + (parseInt(y) + parseInt(dy)/ 2).toString() +
                ' ' + x + "," + (parseInt(y) - parseInt(dy)/ 2).toString()
            );
            pg.setAttribute('stroke-width', '2');

            y = (parseInt(y) - 1.25*parseInt(dy)).toString();
            x = (parseInt(x) + parseInt(dx)/2).toString();
            // x = (parseInt(x) + 5).toString();
            
            g.appendChild(path);
            g.appendChild(pg);
            svg.appendChild(g);

            setNoneGateValve();
            setColorForLables('black');
        }
    }
}
// 

// пред.клапан
objBtns[3].onclick = function () {
    setNonePipe();
    setNoneConv();
    setNonePump();
    setNoneGateValve();

    safeValveForm = document.getElementById('safeValveForm');
    safeValveForm.style.display = 'block';
    safeValveFormBtn = document.getElementById('safeValveFormBtn');
    closeFavSafeValve = document.getElementById('closeFavSafeValve');
    closeFavSafeValve.onclick = function () {
        setNoneSafeValve();
    };

    safeValveFormBtn.onclick = function () {
        if (document.getElementById('kForSafeValve').value === '' || document.getElementById('startPresure').value === '') {
            setColorForLables('red');
        }
        else{
            pipeline.push('safeValve');
            safeValveParams.push([parseFloat(document.getElementById('kForSafeValve').value), parseInt(document.getElementById('startPresure').value)*10**5]);

            dy = '20';
            dx = '40';


            let svg = document.getElementsByTagName('svg')[0];
            let g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            g.setAttribute('class', 'safeValve')

            let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            path.setAttribute("d", "M " + x + " " + y + " L " + x + " " + (parseInt(y) - 0.5*parseInt(dy)).toString());
            path.style.stroke = "#000";
            path.style.strokeWidth = "2px";

            y = (parseInt(y) - 0.5*parseInt(dy)).toString();
            x = (parseInt(x) - parseInt(dx)/2).toString();
            
            let pg = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
            pg.setAttribute('fill', 'white')
            pg.setAttribute('stroke', '#000')
            pg.setAttribute("points",
                x + "," + (parseInt(y) + parseInt(dy / 2)).toString() +
                ' ' + (parseInt(x) + parseInt(dx)).toString() + "," + (parseInt(y) - parseInt(dy / 2)).toString() +
                ' ' + (parseInt(x) + parseInt(dx)).toString() + "," + (parseInt(y) + parseInt(dy / 2)).toString() +
                ' ' + x + "," + (parseInt(y) - parseInt(dy / 2)).toString()
            );
            pg.setAttribute('stroke-width', '2');

            let pl = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
            pl.setAttribute("stroke", '#000')
            pl.setAttribute("fill", 'transparent')
            pl.setAttribute('points',
                (parseInt(x) + parseInt(dx / 2)).toString() + "," + y +
                ' ' + (parseInt(x) + parseInt(dx / 2)).toString() + "," + (parseInt(y) - 7).toString() +
                ' ' + (parseInt(x) + parseInt(dx / 2) + 10).toString() + "," + (parseInt(y) - 12).toString() +
                ' ' + (parseInt(x) + parseInt(dx / 2) - 10).toString() + "," + (parseInt(y) - 17).toString() +
                ' ' + (parseInt(x) + parseInt(dx / 2)).toString() + "," + (parseInt(y) - 22).toString() +
                ' ' + (parseInt(x) + parseInt(dx / 2)).toString() + "," + (parseInt(y) - 27).toString()
            );

            y = (parseInt(y) + 0.5*parseInt(dy)).toString();
            x = (parseInt(x) + parseInt(dx)/2).toString();

            g.appendChild(path);
            g.appendChild(pg);
            g.appendChild(pl)
            svg.appendChild(g);

            setNoneSafeValve();
            setColorForLables('black');
        }
    }
}



