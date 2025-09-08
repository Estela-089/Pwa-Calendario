if ('serviceWorker' in navigator){
    navigator.serviceWorker.register("sw.js").then((registration) => {
        console.log("Service Worker registrado com sucesso");
    })
    .catch((error) => {
        console.log("Falha ao registrar o Service Worker");
        console.log(error);
    }
    )
} 

// Essa parte cria constantes que estarão dentro dos elementos do HTML, pegos pelo "document.getElementById"
const cal = document.getElementById("calendario"); 
const mes = document.getElementById("mes"); // nome do mes vai ser exibido aqui
const dia = document.getElementById("selecione"); // mostra o dia selecionado
const notas = document.getElementById("nota"); //onde o usuário escreve a nota


let selecioneD = null; // cria uma variável vazia que o valor pode ser mudado, é onde fica amarzenado o dia escolhido.
let nota = JSON.parse(localStorage.getItem("nota")) || {}; /* onde guarda oq foi escrito.
"JSON.parse(localStorage.getItem("nota"))"  tranforma as notas salvas (no localStorage) e transforma em objeto
para o JS. || e {} é para se não existir nada, salvar um objeto vazio
*/

// cria constantes para a data atual
const hoje = new Date();
const mesatual = hoje.getMonth();
const ano = hoje.getFullYear();

// cria array, por isso "[]". mesN significa Nomes dos meses
const mesN = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
              "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

// isso é para o caledário ser gerado 
function rodar(mesAtual, anoAtual){
    cal.innerHTML = ""; //se tiver um calendário antigo, isso limpa ele.
    mes.textContent = `${mesN[mesAtual]} ${anoAtual}`; /*coloca o nome dos mês e do ano no h1.
    Tá falando que a const mes (= <h1 id:mes> tem esse valor) */


    const semana = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

    for (let s of semana) // percorre os dias da semana
        {
        const cabecalho = document.createElement("div"); //cria uma div para o dia da semana
        cabecalho.textContent = s; // coloca o nome do dia na div
        cabecalho.classList.add("cabeçalho"); //adiciona uma classe, dá pra estilizar no CSS
        cal.appendChild(cabecalho); //põe a div dentro de calendario "<div class="calendar" id="calendario"></div>"
    }

    const primeiro = new Date(anoAtual, mesAtual, 1).getDay(); //qual foi o primerio dia número nos dias da semana
    const diames = new Date(anoAtual, mesAtual + 1, 0).getDate(); //número total de dias no mês


    //colocar espaços vazios antes do primeiro dia
    for (let i = 0; i < primeiro; i++){
        const vazio = document.createElement("div");
        cal.appendChild(vazio);
    }


    //cria uma div para cada dia do mês, põe a classe dias para estilizar
    for (let dias = 1; dias <= diames; dias++){
        const diasEl = document.createElement("div");
        diasEl.textContent = dias;
        diasEl.classList.add("dias");
        diasEl.onclick = () => selecionarDia(dias, mesAtual, anoAtual); // chama selecionarDia quando clicado
        cal.appendChild(diasEl);
    }
}

function selecionarDia(dias, mesAtual, anoAtual){
    selecioneD = `${dias}/${mesAtual+1}/${anoAtual}`; //gurda a data selecionada
    dia.textContent = "Anotações para " + selecioneD; //atualiz h2 pro dia selecionado
    notas.value = nota[selecioneD] || ""; //preenche textarea com oq for salvo (se nn tiver nada, salva vazio)
}

//verifica se um dia for selecionado
function salveNota(){
    if (!selecioneD){
        alert("Selecione um dia");
        return;
    }
    nota[selecioneD] = notas.value;
    localStorage.setItem("nota", JSON.stringify(nota)); //atualiza nota
    alert("Salvo!"); //alerta que salvou
}

// inicia o calendário
rodar(mesatual, ano);