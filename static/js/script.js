

function setColorForLables(color){
    warringtext = document.querySelectorAll('.textFieldLabel');
            for (let i=0; i<warringtext.length; i++){
            warringtext[i].style.color = color;
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

// действия кнопок

let objBtns = document.querySelectorAll('.circleImage')

let pipeline = [];
let pipeParams = [];
let pumpParams =[];
let gateValveParams =[];

pipeForm = document.getElementById('pipeFormBtn');

// трубопровод
objBtns[0].onclick = function (){
    

    pipeForm = document.getElementById('pipeForm');
    pipeForm.style.display = 'block';
    pipeFormBtn = document.getElementById('pipeFormBtn');
    closeFavPipe = document.getElementById('closeFavPipe');
    closeFavPipe.onclick = function(){
        pipeForm.style.display = 'none';
        document.getElementById('lengthOfPipe').value = '';
        document.getElementById('diameterOfPipe').value = '';
    }
    pipeFormBtn.onclick = function(e, dx = document.getElementById('lengthOfPipe').value){
        if (document.getElementById('lengthOfPipe').value ==='' ||  document.getElementById('diameterOfPipe').value ==='' ) {
            setColorForLables('red');
        }
        else{
            pipeline.push('pipe');
            pipeParams.push([document.getElementById('lengthOfPipe').value, document.getElementById('diameterOfPipe').value])

            
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

            pipeForm.style.display = 'none';
            document.getElementById('lengthOfPipe').value = '';
            document.getElementById('diameterOfPipe').value = '';
            setColorForLables('black');
        }
    }
}

// насос
objBtns[1].onclick = function (){
    

    pumpForm = document.getElementById('pumpForm');
    pumpForm.style.display = 'block';
    pumpFormBtn = document.getElementById('pumpFormBtn');
    closeFavPump = document.getElementById('closeFavPump');
    closeFavPump.onclick = function(){
        pumpForm.style.display = 'none';
        document.getElementById('aOfPump').value = '';
        document.getElementById('bOfPump').value = '';
        document.getElementById('timePump').value = '';
        document.getElementById('Run-outTimeOfPump').value = '';
    }
    pumpFormBtn.onclick = function(){
        if (document.getElementById('aOfPump').value ==='' ||  document.getElementById('bOfPump').value ===''
                ||  document.getElementById('timePump').value ==='' ||  document.getElementById('Run-outTimeOfPump').value ==='') {
            setColorForLables('red');
        }
        else{
            pipeline.push('pump');
            pumpParams.push([document.getElementById('aOfPump').value, document.getElementById('bOfPump').value,
                document.getElementById('pumpSelect').value, document.getElementById('timePump').value, 
                document.getElementById('Run-outTimeOfPump').value])

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

            pumpForm.style.display = 'none';
            document.getElementById('aOfPump').value = '';
            document.getElementById('bOfPump').value = '';
            document.getElementById('timePump').value = '';
            document.getElementById('Run-outTimeOfPump').value = '';
            setColorForLables('black');
            
        }
    }
}

// задвижка
objBtns[2].onclick = function (){
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
}

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



