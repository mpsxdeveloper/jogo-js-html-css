var loop = false;
var timer = null;
var tempo = 60;
var placar = 0;
var acertosRodada = 0;                
var placarDiv = document.getElementById("placar");

var paises = new Array(
    // Preencher com os nomes dos países
);

var palavras = new Array();

function retirarAcentos(letra) {
    
    if(letra === 'Á' || letra === 'Ã' || letra === 'Â') {
        return 'A';
    }
    else if(letra === 'Ç') {
        return 'C';
    }
    else if(letra === 'É' || letra === 'Ẽ') {
        return 'E';
    }                        
    else if(letra === 'Í') {
        return 'I';
    }
    else if(letra === 'Ó' || letra === 'Õ' || letra === 'Ô') {
        return 'O';
    }
    else if(letra === 'Ú') {
        return 'U'; 
    }
    return letra;

}

function checarAcertos(escolha) {
        
    var acertou = false;                        
    var palavrasConcat = new String();
    var quadrados = document.getElementsByClassName("quadrado");
    var quantidadeLetras = 0;
        
    for(var i = 0; i < palavras.length; i++) {
        var p = palavras[i].replace(" ", "").replace("-", "").toString();
        palavrasConcat = palavrasConcat.concat(p.trim());              
    }
    for(var i = 0; i < quadrados.length; i++) {
        c = quadrados[i].getAttribute("data-marcado");
        if(c !== "" && c !== "*") {
            quantidadeLetras++;
        }
    }
    for(var i = 0; i < palavrasConcat.length; i++) {
        for(var q = 0; q < quadrados.length; q++) {
            letra = quadrados[q].getAttribute("data-marcado");
            if(letra !== "" && letra !== "*") {
                if(escolha === retirarAcentos(letra)) {
                    quadrados[q].innerHTML = letra;
                    quadrados[q].classList.add("quadrado-correto");
                    acertou = true;                                        
                }
            }
        }
    }
    var snackbarDiv = document.getElementById("snackbar");
    snackbarDiv.className = "show";
    if(acertou === true) {
        snackbarDiv.innerHTML = "ACERTOU!";
        setTimeout(function(){ snackbarDiv.className = snackbarDiv.className.replace("show", ""); }, 1000);
        var acertosTotais = document.getElementsByClassName("quadrado-correto").length;
        if(acertosTotais === quantidadeLetras) {
            placar = placar + (acertosTotais * (tempo > 0 ? tempo : 1));
            placarDiv.innerHTML = "PLACAR: " + placar;
            var node = document.getElementById("game");
            var child = node.lastElementChild;  
            while(child) { 
                node.removeChild(child); 
                child = node.lastElementChild; 
            }
            var a = document.getElementsByClassName("alfabeto-letras");
            for(var i = 0; i < a.length; i++) {
                if(a[i].getAttribute("data-marcado") === "*") {
                    a[i].setAttribute("data-marcado", "");
                    a[i].style.backgroundColor = "#fff";					
                }
            }
            if(paises.length > 0) {
                tempo = 60;
                montarPaineis(selecionarPalavras());
            }
            else {
                cancelTimer();
                alert('Parabéns! Descobriu o nome de todos os países!');                
            }
        }
    }
    else {
        snackbarDiv.innerHTML = "ERROU!";
        setTimeout(function(){ snackbarDiv.className = snackbarDiv.className.replace("show", ""); }, 1000);
    }    
        
}

function montarPaineis(palavras) {

    var game = document.getElementById("game");
    game.innerHTML = "";
    if(palavras == undefined) {
        return;
    }
    for(var i = 0; i < palavras.length; i++) {
        var palavra = palavras[i];
        for(p = 0; p < palavra.length; p++) {
            var quadrado = document.createElement('div');
            if(palavra.charAt(p) !== " " && palavra.charAt(p) !== "*" && palavra.charAt(p) !== "-") {						
                quadrado.classList.add("quadrado");
                quadrado.setAttribute("data-marcado", palavra[p]); 
                game.appendChild(quadrado);						
            }
            else {
                quadrado.classList.add("quadrado");
                quadrado.setAttribute("data-marcado", "*");
                quadrado.style.backgroundColor = "#FFFF00";
                quadrado.innerHTML = "*";
                game.appendChild(quadrado);			
            }
        }                                
        espaco = document.createElement('div');
        espaco.style.clear = "both";
        game.appendChild(espaco);
        espaco = document.createElement('br');                              
        game.appendChild(espaco);                           
    }

}

function selecionarPalavras() {
    
    var quantidade = paises.length;
    var vezes = 3;
    palavras.length = 0;

    if(quantidade < 3) {
        vezes = quantidade;
    }
    
    for(var i = 0; i < vezes; i++) {
        var index = Math.floor(Math.random() * paises.length);
        palavras.push(paises[index]);
        paises.splice(index, 1);
    }
    return palavras;
    
}

function iniciarTimer() {
    
    var tempoDiv = document.getElementById('tempo');
    tempoDiv.innerHTML = `TEMPO: ${tempo}`;    
    intervalo = setInterval(() => {
        if(tempo > 0) {
            tempo--;
            tempoDiv.innerHTML = `TEMPO: ${tempo}`;
        }
        else {
            loop = false;                        
            clearInterval(intervalo);
            alert('GAME OVER');            
        }        
    }, 1000);

}

function cancelTimer() {

    clearInterval(intervalo);
    tempo = 60;
    loop = false;
    
}

window.onload = function() {

    document.getElementById("start").onclick = function() {
        document.getElementById("start").disabled = true;
        loop = true;
        if(loop) {            
            var tempoDiv = document.getElementById('tempo');
            tempoDiv.innerHTML = "TEMPO: 60";
            iniciarTimer();
            var game = document.getElementById("game");
            if(!game.hasChildNodes()) {
                montarPaineis(selecionarPalavras());
                document.getElementById('alfabeto').style.display = "block";
            }
        }
    };
    var letras = document.getElementsByClassName("alfabeto-letras");
    for(var i = 0; i < letras.length; i++) {
        letras[i].onclick = function() {
            if(loop) {
                if(this.getAttribute("data-marcado") === "") {
                    this.setAttribute("data-marcado", "*");
                    this.style.backgroundColor = "lightblue";
                    checarAcertos(this.innerHTML);
                }
            }
        };
    }

};