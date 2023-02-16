

function setColorForLables(color){
    warringtext = document.querySelectorAll('.textFieldLabel');
            for (let i=0; i<warringtext.length; i++){
            warringtext[i].style.color = color;
            } 
}
let condParams =[[1000, 850, 10]];
let pipeline = [];
let pipeParams = [];
let pumpParams =[];
let gateValveParams =[];

// Увеличиваем масштаб .workspace при skroll
var scale = 1,
        panning = false,
        pointX = 0,
        pointY = 0,s
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
// стоп анимации
let anim = true;
let pauseBtn = document.getElementById('pauseBtn');
pauseBtn.onclick = function animStop(){
    anim = false
};
//продолжить анимацию
let resumeBtn = document.getElementById('resumeBtn');
resumeBtn.onclick = function animResume(){
    anim = true;
};


let topMenuBtns1 = document.getElementById('manipulatingButtons1')
let topMenuBtns2 = document.getElementById('manipulatingButtons2');
let startBtnOuter = document.getElementById('startBtnOuter')

// Отправка запроса на сервер для расчета и получение ответа
startBtn = document.getElementById('startBtn');
startBtn.onclick = function(){
    if (pipeline.includes('pipe')){
        req = {"condParams": condParams,
            "pipeline": pipeline,
            "pipeParams": pipeParams,
            "pumpParams": pumpParams,
            "gateValveParams":gateValveParams
            }
        fetch('/index', {
            headers : {
                'Content-Type' : 'application/json'
            },
            method : 'POST',
            body : JSON.stringify(req)
        })
        .then(function (response){

            if(response.ok) {
                topMenuBtns1.style.display  ="none";
                topMenuBtns2.style.display  ="inline";
                startBtnOuter.style.display = 'none';
                response.json()
                .then(function(response) {                    
                    drawChart(response, response.Napory, 600, -200, 150, 'H');
                    drawChart(response, response.Davleniya, 6000000, -2000000, -10, 'P')
                    drawChart(response, response.Skorosty, 3, -3, -10, 'S');
                });
                
            }
            else {
                throw Error('Something went wrong');
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    }
    else{
        condLbl = document.getElementById('conditionLbl');
        condLbl.innerHTML = 'Добавьте элементы в трубопровод'
    }
}

// Выдвижение меню
let menuBtn = document.querySelector('.sideMenuBtn')
let listBtns = document.querySelectorAll('li span')
let leftSide = document.querySelector('.leftSide')
menuBtn.onclick = function(){
    for (let i=0; i<listBtns.length; i++){
        listBtns[i].classList.toggle('menuTextAfter')
        listBtns[i].classList.toggle('menuTextBefore')
    };
    if (leftSide.style.width ==='250px'){
        leftSide.style.width = '90px'
    } else{
        leftSide.style.width ='250px'
    }
}

let y = '150';
let x = '100';
// 

// действия кнопок

// Меню параметров среды
let toolBarInnerCondBtn = document.getElementById('toolBarInnerConditions');
toolBarInnerCondBtn.onclick = function(){
function setNoneConv(){
    let envCond = document.getElementById('envCond');
        envCond.style.display = 'none';
        document.getElementById('timeToIter').value = '1000';
        document.getElementById('density').value = '850';
        document.getElementById('viscosity').value = '10';
}

    let envCond = document.getElementById('envCond');
    envCond.style.display = 'block';
    let closeFavCond = document.getElementById('closeFavCond')
    closeFavCond.onclick = function(){
        setNoneConv()
    }

    let envCondBtn = document.getElementById('envCondBtn')
    envCondBtn.onclick = function(){
        if (condParams.length === 0){
        condParams.push([parseInt(document.getElementById('timeToIter').value), parseInt(document.getElementById('density').value), parseInt(document.getElementById('viscosity').value)])
        setNoneConv();
    }
        else{
            condParams.pop();
            condParams.push([parseInt(document.getElementById('timeToIter').value), parseInt(document.getElementById('density').value), parseInt(document.getElementById('viscosity').value)])
            setNoneConv();
        }
    }

}

// 


let objBtns = document.querySelectorAll('.circleImage')



pipeForm = document.getElementById('pipeFormBtn');

// трубопровод
objBtns[0].onclick = function (){
    function setNonePipe(){
        pipeForm = document.getElementById('pipeForm');
        pipeForm.style.display = 'none';
        document.getElementById('lengthOfPipe').value = '100';
        document.getElementById('diameterOfPipe').value = '1000';
    }

    pipeForm = document.getElementById('pipeForm');
    pipeForm.style.display = 'block';
    pipeFormBtn = document.getElementById('pipeFormBtn');
    closeFavPipe = document.getElementById('closeFavPipe');
    closeFavPipe.onclick = function(){
        setNonePipe();
    }
    pipeFormBtn.onclick = function(e, dx = document.getElementById('lengthOfPipe').value){
        if (document.getElementById('lengthOfPipe').value ==='' ||  document.getElementById('diameterOfPipe').value ==='' ) {
            setColorForLables('red');
        }
        else{
            pipeline.push('pipe');
            pipeParams.push([parseInt(document.getElementById('lengthOfPipe').value), parseInt(document.getElementById('diameterOfPipe').value)/1000])

            
            let svg = document.getElementsByTagName('svg')[0]; 

            let g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            g.setAttribute('class', 'pipe')
        
            let crl1 =  document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            crl1.setAttribute('cx', x);
            crl1.setAttribute('cy', y);
            crl1.setAttribute('r', '5');

            let path1 =  document.createElementNS("http://www.w3.org/2000/svg", 'path');
            path1.setAttribute("d","M "+ x + " " + y +  " h " +  dx); 
            path1.style.stroke = "#000";
            path1.style.strokeWidth = "4px"; 
            

            let path2 =  document.createElementNS("http://www.w3.org/2000/svg", 'path');
            path2.setAttribute("d","M "+ (parseInt(x) + 15).toString() + " " + y +  " h " +  (parseInt(dx) - 30).toString()); 
            path2.style.stroke = "transparent";
            path2.style.strokeWidth = "10"; 

            x = (parseInt(x) + parseInt(dx)).toString();

            let crl2 =  document.createElementNS("http://www.w3.org/2000/svg", 'circle');
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
objBtns[1].onclick = function (){
    function setNonePump(){
        pumpForm = document.getElementById('pumpForm');
        pumpForm.style.display = 'none';
        document.getElementById('aOfPump').value = '310';
        document.getElementById('bOfPump').value = '0.0000008';
        document.getElementById('timePump').value = '0';
        document.getElementById('Run-outTimeOfPump').value = '20';
    }

    pumpForm = document.getElementById('pumpForm');
    pumpForm.style.display = 'block';
    pumpFormBtn = document.getElementById('pumpFormBtn');
    closeFavPump = document.getElementById('closeFavPump');
    closeFavPump.onclick = function(){
        setNonePump();
    }
    pumpFormBtn.onclick = function(){
        if (document.getElementById('aOfPump').value ==='' ||  document.getElementById('bOfPump').value ===''
                ||  document.getElementById('timePump').value ==='' ||  document.getElementById('Run-outTimeOfPump').value ==='') {
            setColorForLables('red');
        }
        else{
            pipeline.push('pump');
            pumpParams.push([parseFloat(document.getElementById('aOfPump').value), parseFloat(document.getElementById('bOfPump').value),
            parseInt(document.getElementById('pumpSelect').value), parseFloat(document.getElementById('timePump').value), 
            parseFloat(document.getElementById('Run-outTimeOfPump').value)])

            dy = '35';
            let svg = document.getElementsByTagName('svg')[0]; 
        
            let g = document.createElementNS("http://www.w3.org/2000/svg", 'g'); 
            g.setAttribute('class', 'pump')
            
            let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
            path.setAttribute("d","M "+ x + " " + y +  " L " + x + " " + (parseInt(y) - parseInt(dy)).toString());
            path.style.stroke = "#000";
            path.style.strokeWidth = "2px";
        
            let crl1 = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            crl1.setAttribute('cx', x);
            crl1.setAttribute('cy', (y-dy - 25));
            crl1.setAttribute('r', '12.5');
            crl1.setAttribute('stroke-dasharray', '19.6349');
            crl1.setAttribute('stroke-dashoffset', '19.7');
            crl1.setAttribute('fill', 'transparent');
            crl1.setAttribute('stroke', '#000');
            crl1.setAttribute('stroke-width', '25');    
            
        
            let crl2 = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
            crl2.setAttribute('cx', x);
            crl2.setAttribute('cy', (y-dy - 25));
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
objBtns[2].onclick = function (){
    function setNoneGateValve(){
        gateValveForm = document.getElementById('gateValveForm');
        gateValveForm.style.display = 'none';
        document.getElementById('timeGateValve').value ='100';
        document.getElementById('Run-outTimeOfGateValve').value ='100';
        document.getElementById('percentGateValve').value ='100';
    }
    
    gateValveForm = document.getElementById('gateValveForm');
    gateValveForm.style.display = 'block';
    gateValveFormBtn = document.getElementById('gateValveFormBtn');
    closeFavGateValve = document.getElementById('closeFavGateValve');
    closeFavGateValve.onclick = function(){
        setNoneGateValve();
    }

    gateValveFormBtn.onclick = function(){
        if (document.getElementById('timeGateValve').value ==='' ||  document.getElementById('Run-outTimeOfGateValve').value ===''
            ||  document.getElementById('percentGateValve').value ==='') {
        setColorForLables('red');
        }
        else{
            pipeline.push('gateValve');
            gateValveParams.push([parseInt(document.getElementById('gateValveSelect').value), parseFloat(document.getElementById('timeGateValve').value),
            parseInt(document.getElementById('Run-outTimeOfGateValve').value), parseInt(document.getElementById('percentGateValve').value)])
    

            dy = '20';
            dx = '40';
            let svg = document.getElementsByTagName('svg')[0]; 
            let g = document.createElementNS("http://www.w3.org/2000/svg", 'g'); 
            g.setAttribute('class', 'gateValve')

            let pg = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
            pg.setAttribute('fill', 'white')
            pg.setAttribute('stroke', '#000')
            pg.setAttribute("points",
                x + "," + (parseInt(y) + parseInt(dy/2)).toString() + 
                ' ' + (parseInt(x) + parseInt(dx)).toString()+ "," + (parseInt(y) - parseInt(dy/2)).toString() + 
                ' ' + (parseInt(x) + parseInt(dx)).toString() + "," +  (parseInt(y) + parseInt(dy/2)).toString()+
                ' ' + x + "," +  (parseInt(y) - parseInt(dy/2)).toString()
                );
            pg.setAttribute('stroke-width', '2'); 

            x = (parseInt(x) + parseInt(dx)).toString();

            g.appendChild(pg);
            svg.appendChild(g);

            setNoneGateValve();
            setColorForLables('black');
        }
    }
}
// 

// пред.клапан
objBtns[3].onclick = function (){
    dy = '20';
    dx = '40';
    let svg = document.getElementsByTagName('svg')[0]; 
    let g = document.createElementNS("http://www.w3.org/2000/svg", 'g'); 
    g.setAttribute('class', 'safetyGate')

    let pg = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
    pg.setAttribute('fill', 'white')
    pg.setAttribute('stroke', '#000')
    pg.setAttribute("points",
        x + "," + (parseInt(y) + parseInt(dy/2)).toString() + 
        ' ' + (parseInt(x) + parseInt(dx)).toString()+ "," + (parseInt(y) - parseInt(dy/2)).toString() + 
        ' ' + (parseInt(x) + parseInt(dx)).toString() + "," +  (parseInt(y) + parseInt(dy/2)).toString()+
        ' ' + x + "," +  (parseInt(y) - parseInt(dy/2)).toString()
        );
    pg.setAttribute('stroke-width', '2'); 

    let pl = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
    pl.setAttribute("stroke", '#000')
    pl.setAttribute("fill", 'transparent')
    pl.setAttribute('points',
        (parseInt(x) + parseInt(dx/2)).toString()+ "," + y +
        ' ' + (parseInt(x) + parseInt(dx/2)).toString()+ "," + (parseInt(y) - 7).toString() +
        ' ' + (parseInt(x) + parseInt(dx/2) + 10).toString()+ "," + (parseInt(y) - 12).toString() +
        ' ' + (parseInt(x) + parseInt(dx/2) - 10).toString()+ "," + (parseInt(y) - 17).toString() +
        ' ' + (parseInt(x) + parseInt(dx/2)).toString()+ "," + (parseInt(y) - 22).toString() + 
        ' ' + (parseInt(x) + parseInt(dx/2)).toString()+ "," + (parseInt(y) - 27).toString()
        );


    x = (parseInt(x) + parseInt(dx)).toString();

    g.appendChild(pg);
    g.appendChild(pl)
    svg.appendChild(g);
}



