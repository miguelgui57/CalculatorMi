class CalcController{

    constructor(){ // local onde declaramos as variaveis 
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false; // atributo para armazenar de começo o audio em false, em desligado
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = []; // criando uma operação para a calculadora em branco que sera retornada valores 
        this._locale = 'pt-BR' // função que so retornar que sempre sera no formato pt-BR
        this._displayCalcEl = document.querySelector("#display"); //selecionando um documento do arquivo html para passar funções e metodos para eles
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate; 
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    pasteFromClipBoard(){ // metodo para adicionar dentro do display 
        document.addEventListener('paste', e=>{ // pegando o evento paste 
            let text = e.clipboardData.getData('Text'); // adicionando em uma variavel text o evento 

            this.displayCalc = parseFloat(text); // adicionando dentro do display o evento text que foi adicionado 

        });
    }

    copyToClipboard(){ // metodo que ira adicionar um elemento no display como ctrl c e ctrl d
        let input = document.createElement('input'); // criando um elemento com o nome de input 

        input.value = this.displayCalc;// passando o elemento input para o display 

        document.body.appendChild(input); // adicionando no body o input 

        input.select(); 

        document.execCommand("Copy");// adicionando o evento de copy 

        input.remove(); // removendo o input da tela 
    }

    initialize(){

        this.setDisplayDateTime();

        setInterval(()=>{ // setando um intervalo para a data e o time
            this.setDisplayDateTime();
        },1000);
        this.setLastNumberToDisplay();
        this.pasteFromClipBoard();

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dbclick', e=>{
                this.toggleAudio();
            });
        });

        //setTimeout(()=>{  o setTimeout serve para adicionar um intervalo apartir da quantidade de segundos colocado
            //clearInterval(this.interval);
        //},10000);  10 segundos, então que dizer que quando passar esse tempo, o contador ou Date sera pausado
    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff

    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    initKeyboard(){ // metodo para capturar os eventos do teclado 
        document.addEventListener('keyup', e=>{ // adicionando um evento de keyup que é capturar os click do teclado 

            this.playAudio();

            console.log(e.key);

                switch(e.key){
                    case 'Escape': 
                        this.clearAll();
                        break;
                    case 'Backspace':
                        this.clearEntry();
                        break;    
                    case '+':
                    case '-':
                    case '*':
                    case '/':
                    case '%':        
                        this.addOperation(e.key); // pegando os eventos de cima e adicionando no metodo addOperation que ja adiciona para o display
                        break;    
                    case 'Enter':
                    case '=':    
                        this.calc(); // pegando os eventos que faz o calculo 
                        break; 
                    case '.':
                    case ',':    
                        this.addDot(); // pegando os eventos de . e ,
                        break;

                    case '0': 
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':            
                    case '6':
                    case '7':
                    case '8':
                    case '9':    
                        this.addOperation(parseInt(e.key)); // função para adicionar caso um dos case de cima for selecionado
                        break;      
                        
                    case 'c': // capturando a tecla c 
                        if(e.ctrlKey)  this.copyToClipboard(); // e adicionando uma condição que quando o c for precionado mais o ctrl o valor sera copiado 
                        break;
                };
            });
    };

    addEventListenerAll(element, events, fn){ // criando um novo addEventListenerAll, pois usando apenas addEventListener, não é possivel usar dois eventos
        events.split(' ').forEach(event =>{ // pegando os dois eventos e separando eles, e fazendo um forEach para
            element.addEventListener(event, fn, false); // cada vez que for passado em um evento ele execute 
        });
    }

    clearAll(){ // deletando tudo que esta na calculadora  'ac'
        this._operation = []; // e passando um array vazio 
        this._lastNumber= ''; // passando o lastNumber pois o operation esta recebendo um valor, então para zerar é so passar a string vazia
        this._lastOperator= ''; // mesma maneira se for um operador 

        this.setLastNumberToDisplay()//apos o calculo ser feito e for apertado o ac, sera passado o array vazio zerando a calculadora
    }
    clearEntry(){ //remolvendo o ultimo valor da calculadora inserido 'ce'
        this._operation.pop();

        this.setLastNumberToDisplay()//apos o calculo ser feito e for apertado ce, o ultimo valor ou operação sera remolvido 
    }

    getLastOperation(){
        return this._operation[this._operation.length-1];// pegando o ultimo operador inserido para juntar ou trocar
    }

    setLastOperation(value){ // criando um metodo para a operação de pegar o ultimo valor inserido
        this._operation[this._operation.length-1]=value;
    }

    isOperator(value){
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1); 
    }

    pushOperation(value){ //metodo para sempre que um novo numero ou operador for acionado, sera dado um push para adicionar ao final 
        this._operation.push(value);

        if(this._operation.length >3){ // condição para que quando mais de 3 operações forem adicionadas, a conta ja seja feita 
                             
            this.calc();
        }
    }

    getResult(){ // criando um metodo para guardar a operação do eval 
        try{ // usando o try para caso a conta for correta diante o eval, ela seja feita
            return eval(this._operation.join("")); // usando o eval para fazer a conta e passando o join para transformar o array para string e remolver virgulas
        }catch(e){ // caso contrario sera retornando uma mensagem de error 
            setTimeout(()=>{ // setando um time de 1milisegundo, para dps que o 0 aparecer mudar para error
                this.setError();
            } , 1);
        };
    }

    calc(){ //metodo que ira fazer a conta 

        let last ='';// variavel last vazia 

        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if(this._operation.length >3){// condição para quando a operação tiver mais que 3 operadores 
            last = this._operation.pop(); // pegando o valor do resultado que sera o quarto elemento e guardando 

            this._lastNumber = this.getResult(); // pegando o numero que foi calculado quando for mais de 3 itens 

        }else if (this._operation.length ==3){ // condição para quando uma conta com 3 operadores forem feitas e futuramente for passado (=), o operação seguinte sera usado o numero do resultado

            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult(); // usando o eval para fazer a conta e passando o join para transformar o array para string e remolver virgulas

        if(last == '%'){// condição para a que se last for o a quarta declaração, e no caso for o % 
            result /=100; // sera feita o resultado da conta de 3 operadores, dividio por 100 

            this._operation = [result];
        }else{


            this._operation = [result]; // passando a operação na maneira que sera exibida, o resultado + o restante das operações que foram inseridas, no caso um operador
            if(last)this._operation.push(last); // condição para quando o last for diferente de vazio, dar um push no proprio last
        }
        this.setLastNumberToDisplay()//apos o calculo ser feito e mais um operador for inserido, sera atualizado na tela a operação feita 
    }

    getLastItem(isOperator = true){
        let lastItem;//variavel que sera passado a operação 

        for(let i =this._operation.length-1; i >=0; i --){ //criando um for e passando i como o this.operation e seu tamanho

            if(this.isOperator(this._operation[i]) == isOperator){// fazendo um if para ver se é um numero, negando caso for um operador
                lastItem= this._operation[i];//passando o numero para a variavel 
                break;
            }
        }

        if(!lastItem){ // recuperando o ultimo item 
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber; // pegando o lastItem, pergutando se é um operador ou um number
        }
        return lastItem;
    }

    setLastNumberToDisplay(){ // metodo para passar os valores e operadores no display 
        let lastNumber = this.getLastItem(false);//variavel que sera passado a operação  

        if(!lastNumber) lastNumber=0;

        this.displayCalc = lastNumber;//pegando o objeto no caso o display e passando o numero nele para ser mostrado
    }
    
    addOperation(value){ // adicionando nova operação quando um valor ou operador for inserido 

        if(isNaN(this.getLastOperation())){

            if(this.isOperator(value)){ // if para pegar o ultimo valor e ver se é um number ou um operador

                this.setLastOperation(value); // e apenas trocar quando o ultimo a ser inserido for um proprio operador ex: o + pelo -
            
            }else{
                this.pushOperation(value);// apos a verificação, damos um .push que ira inserir um valor compondo o outro(3)(2) = 32 e n 3 e 2
                this.setLastNumberToDisplay()
            }
        }else{

            if(this.isOperator(value)){ // pegando o metodo isOperator e passando na condição, que se ele for adicionado 

                this.pushOperation(value); // sera inserido no final e n concatenar com o restante, por não é um number

            }else{ // caindo no else, que se cas não tenha sido inserido um operador, continua concatenar os numeros

            let newValue = this.getLastOperation().toString() + value.toString();// criando uma nova declaração para um novo numero, que é o composto por outro e passando para um string
            this.setLastOperation(newValue);// pegando o ultimo valor e passando para um numero inteiro     
            
            this.setLastNumberToDisplay()
            }
    
        }
    }

    setError(){ // inserindo um erro caso não for encontrado nenhuma das condições
        this.displayCalc = 'Error';
    }

    addDot(){

       let lastOperation = this.getLastOperation(); // passando o metodo de pegar a ultima operação e inserir para lastOperation

        if(typeof lastOperation ==='string' && lastOperation.split('').indexOf('.') > -1) return; // condição para quando haver ja um . em uma variavel, a proxima vez n sera adicionado o (.)

       if(this.isOperator(lastOperation) || !lastOperation){ // condição para verificar se é vazio o calculo 
            this.pushOperation('0.'); // se caso for e o ponto for inserido um '0.' sera adicionado
       }else{
        this.setLastOperation(lastOperation.toString()+'.'); // caso ja haver um numero sera convertido para string e adicionado o .
       }

       this.setLastNumberToDisplay();

    }

    execBtn(value){

        this.playAudio(); //quando um botão for apertado sera executado um audio junto 

        switch(value){
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;    
            case 'soma':
                this.addOperation('+');
                break;    
            case 'subtracao':
                this.addOperation('-');
                break;   
            case 'divisao':
                this.addOperation('/');
                break;     
            case 'multiplicacao':
                this.addOperation('*');
                break;     
            case 'porcento':
                this.addOperation('%');
                break;   
            case 'igual':
                this.calc();
                break; 
            case 'ponto':
                this.addDot(); 
                break;
            case '0': 
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':            
            case '6':
            case '7':
            case '8':
            case '9':    
                this.addOperation(parseInt(value)); // função para adicionar caso um dos case de cima for selecionado
                break;
            default:
                this.setError();
                break;               
        };
    };

    initButtonsEvents(){ // selecionando os buttons e adicionando o evento de click neles 
        let buttons = document.querySelectorAll('#buttons > g, #parts > g') // selecionando todos os buttons

        buttons.forEach((btn, index)=>{ // adicionando um forEach para cada vez ele encontrar um botão sera executado 
            this.addEventListenerAll(btn, 'click drag',e=>{ // adicionando o evento de click nos botão
                let textBtn = btn.className.baseVal.replace('btn-', '');

                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e =>{ // usando o a mesma função podemos estilizar o mouse ou qualquer outra coisa
                btn.style.cursor = 'pointer' // passando um estilização
            });
        });
    }

    setDisplayDateTime(){ // criando um metodo para o relogio começar a rodar quando a pagina for carregada 
        //usando os get e set dos display, passamos eles para uma função que sera igual a nova data 'currentDate'e colocamos na formatação pt-BR
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day: "2-digit", // personalização de data 
            month: "long",
            year: "numeric"
        }); 
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    

// ----------------    
    get displayTime(){ // ***ambos hora de data são passados pelo new Date*** 
        return this._timeEl.innerHTML; // get para o display do time para retornar o valor new Date configurado
    }
    set displayTime(value){
        return this._timeEl.innerHTML = value; 
    }
    get displayDate(){ // ***ambos hora de data são passados pelo new Date*** 
        return this._dateEl.innerHTML; // get para o display do date para retornar o valor new Date configurado
    }
    set displayDate(value){  
        return this._dateEl.innerHTML = value;
    }
//-----------------    


    get displayCalc(){ // get para o display que ira retornar um valor 
        return this._displayCalcEl.innerHTML; //retornando o displayCalcEl que foi atribuido no querySelector 
    }

    set displayCalc(value){ // set para atribuir ao valor 
        if(value.toString().length > 10){ // limitando o tanto de display que ira aparecer no display 
            this.setError(); //retorando um error se caso for mais de 10 elementos 
            return false;
        }
        return this._displayCalcEl.innerHTML = value; //setando que o querySelector que foi buscado no html, tera o valor que ira ser atribuido a ele 
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(date){
        this.currentDate = date;
    }
}