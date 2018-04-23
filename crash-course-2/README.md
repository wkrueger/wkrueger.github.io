# Crash course to nodeJs (web app) [parte 2]

Nesta parte criaremos um projeto e daremos uma rápida passada em como funciona o gerenciador
de pacotes NPM, o ambiente de execução do node.js e seu sistema de dependências (o `module`). No 
fim ainda vai sobrar tempo para fazer um servidor HTTP de Hello World usando o _Express.js_.

---

Para este tutorial

  1. Instale o node.js  
  2. Instale o editor de texto _Visual Studio Code_  
  3. Crie uma pasta com um nome qualquer para o seu projeto. Abra ela com o VS Code.

**Console do node**

Você pode abrir um
terminal dentro do VS Code apertando F1 (ctrl/cmd+shift+P), digitando "terminal" e escolhendo a opção
"Create new Integrated Terminal". Ou usando o atalho `CTRL+SHIFT+'`.

Invocar `node` de qualquer terminal o abrirá no modo "console"
[REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop). Aqui, você tem
um console de javascript similar ao que se tem em um navegador ao apertar F12. 

    bash-3.2$ node
    > 2*2
    4

**Executando um script**

Chamar no terminal `node <script.js>` irá, obviamente, fazer esse script ser executado.

Crie um arquivo de nome `index.js` e o preencha com o seguinte exemplo:

```javascript
var out = Number(process.argv[2]) * 5
console.log('RESULTADO: ' + out)
```

Execute chamando `node index 4` para ter 20 como resposta.

**Separando em vários arquivos**

No ambiente de navegador, o ponto de entrada é o HTML principal, a partir do qual se incluem as
tags `<script>`. Todos os scripts compartilham o mesmo escopo global, e o usam pra definir/exportar
código. Por exemplo, ao incluir o jquery em uma página, ele define uma variável global `var $ = (...)`, a qual
é usada (ou pode também ser apagada) pelos scripts subsequentes.

No node.js, o ponto de entrada é um script js, e o escopo é isolado por aquivo.
Se você declarar `var x` em um arquivo, outro arquivo
não vai ter acesso a essa variável. Para _exportar_ variáveis para outro arquivo, o node disponibiliza
em cada script o objeto global `exports`. Para _importar_ outros scripts o node disponibiliza a
função global `require`.

```javascript
//arquivo extenso.js
exports.extenso = {
    1 : "um" ,
    2 : "dois" ,
    3 : "três"
}
````

```javascript
//arquivo index.js
var extenso = require('./extenso')
console.log(extenso[2]) // dois
```

**Instalando e usando um pacote**

O NPM é uma vasta base de bibliotecas javascript E o gerenciador de pacotes padrão do node.js. Basta procurar `npm <qualquer-coisa>` no google.
Repositórios git ou qualquer pasta que possua o formato de projeto de nodejs também podem
ser importados.

    $ npm i cool-ascii-faces
    $ npm i colors

Isto criará no seu projeto uma pasta `node_modules` com as libs indicadas e suas dependências.
As libs indicadas podem ser prontamente chamadas de qualquer script js na pasta a partir da
função `require`.

```javascript
const coolFace = require('cool-ascii-faces')
let times = Number(process.argv[2])
if (isNaN(times)) times = 1
for (let it = 0; it < times; it++) console.log(coolFace())
```

> `const`, `let` e `var` possuem funcionalidades similares. `const` e `let` são adições mais recentes na linguagem,
>portanto engines mais antigas (IE) não suportarão.

**Pacotes globais e ferramentas de console**

Alguns pacotes NPM oferecem comandos para serem chamados diretamente do console (CLI). Para tal,
esses pacotes devem ser instalados como globais. Isso os instala, ao invés de no seu projeto,
em uma pasta dedicada para módulos globais, e registra os comandos para acesso no console.

No linux ou no OSX pode ser necessário chamar o npm com permissão root
para instalar um pacote globalmente.

    $ sudo npm i cool-ascii-faces
    $ cool-face
    ( ͝° ͜ʖ͡°)

Também é possível chamar um comando de console em um módulo instalado localmente (a nível de projeto).
Neste caso, o script fica localizado na pasta `node_modules/.bin/<comando>`.


**Um projeto NPM**

Vamos transformar nossa pasta em um projeto de verdade.

    $ git init

A pasta `node_modules` não deve ser incluída no seu repositório. Crie um arquivo `.gitignore` para excluí-la.

Conteúdo:
```
node_modules
```
O NPM reconhece as informações de projeto de uma pasta a partir do arquivo `package.json`. Para
criar um package.json, chame `npm init` no console.

```json
{
  "name": "crash",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {},
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1" ,
    "cool" : "cool-face"
  },
  "author": "",
  "license": "MIT"
}
```

  - **name** indica o nome identificador que seu projeto terá caso instalado como dependência 
    em outro projeto usando o `npm install`.  
  - **main** indica o ponto de entrada do seu módulo quando ele é chamado via `require` de outro
    projeto.  
  - **scripts** permite guardar comandos que podem ser chamados via "npm \<comando\>". Uma particularidade
    desta ferramenta é que, ao chamar (ver exemplo) `npm cool`, será executado `node_modules/.bin/cool-face`,
    a versão local do comando de console.

**Dependências**

Ao invés de incluirmos a `node_modules` no git, executamos o `npm i <modulo> --save` ou 
`npm i <modulo> --save-dev`, o que inclui uma entrada de dependência no _package.json_.

    $ npm i cool-ascii-faces --save

```json
//(package.json)
"dependencies": {
    "cool-ascii-faces": "^1.3.4"
}
```

O que muda entre **--save** e **--save-dev**? O primeiro inclui uma dependência "de produção", da qual
o seu módulo exige para que seja executado. O _--save-dev_ inclui uma dependência de desenvolvimento.

Muitos projetos possuem etapas intermediárias de _build_ ou ferramentas de auxílio que exigem 
módulos adicionais não necessários em produção.
Exemplos de módulos que geralmente são dependências de desenvolvimento são o _gulp_, o _babel_ e o _eslint_.

Ao reinstalar o projeto em outra máquina (por exemplo), após clonar o repositório, chama-se `npm install`
para recuperar todas as dependências descritas no package.json.


**Depurando scripts**

O uso do depurador é uma ferramenta muito importante no desenvolvimento em qualquer plataforma,
e ainda mais no javascript pela sua natureza dinâmica. Utilize a ferramenta de depuração do VS
Code, escolha o tipo "Node 6.3+ (experimental) (node2)" e comece a colocar breakpoints no seu
código. Simples assim.

![debug](https://gist.githubusercontent.com/wkrueger/1537c20e3dbcd4420ef08e06f174f6c9/raw/8505b57701d9f373526e3aa5bfc06031745f143f/zzz_debug.png)

O node também oferece uma ferramenta "agnóstica user-friendly" de debug. Você pode chamar um script
usando o comando

    $ node --inspect --debug-brk <script>

e então seguir as instruções para depurar seu script em uma janela de depurador no Google Chrome. Com este comando também é possível
depurar um programa executado em uma VM remota (dado que a porta indicada esteja aberta).


**API do node.js**

O node.js disponibiliza uma generosa API ([referência](https://nodejs.org/api/)). Em geral, alguns recursos
você usará pontualmente, outros você praticamente nem tocará de acordo com o seu projeto. Em muitos 
casos as APIs são "wrappadas" por populares libs do NPM que facilitam o seu uso.

Em minha experiência, as API do node.js que utilizo diretamente com mais frequência são:

  - Child Process
  - File System
  - Path

Vale a pena dar uma olhadinha por cima, só pra saber que funcionalidades existem, mas não se preocupe
muito com isso. Ao dar essa olhada por cima pode-se notar porque o rótulo (e o foco) do node é
"asynchronous I/O for javascript". A responsabilidade do node é ser uma framework de I/O -- leitura e escrita de arquivos,
conexões de rede, etc.

Um outro ponto à parte é o extensivo uso de _streams_ e _callbacks_ em várias partes da API, além da estrutura comum
de emissores de eventos. Mas é algo que podemos pular por hoje.


**Modelo de funcionamento: event-loop**

O javascript (node e browsers) funciona em apenas uma thread -- não há processamento paralelo.
O que existe é a separação de diversos blocos de execução os quais são agendados/enfileirados para execução
em sequência. Esses blocos de execução formam uma "pilha" de instruções, a qual vai sendo limpada à medida
que o loop principal da engine vai as processando.

```javascript
function ramoPrincipal() {
    fazAlgumaCoisa()                          //algum processo síncrono
    function processaArquivo(err, arquivo) {  //apenas define, não executa nada 
        envia(arquivo)                            
    }
    lerArquivoDaWeb('http://local/arquivo.txt', processaArquivo)
}
```

Quando a função `lerArquivoDaWeb` recebe um parâmetro de callback, pensa-se que essa função está
**agendando** a execução de um bloco de instruções (o callback) para o **evento** da conclusão desta requisição.

Qualquer coisa que saia do ambiente de execução do node.js (por exemplo, uma chamada I/O a um banco de dados)
gera um evento assíncrono. Enquanto o node está aguardando a resposta de um banco de dados ou de uma requisição,
o seu processo está livre para a execução dos próximos itens na fila.

```
>>SEQUÊNCIA
{ bloco síncrono (blocante) 1
    fazAlgumaCoisa
    lerArquivoDaWeb envia requisição e agenda bloco2 no evento da resposta
    processo liberado
}
{ bloco síncrono (blocante) 2 -- requisição chegou
    coloca processaArquivo na fila de execução
    liberado
}
{ bloco síncrono (blocante) 3
    processaArquivo
    liberado
}
```
Observando o exemplo acima, agora imagine que o bloco 1 é executado sempre que o servidor recebe
uma requisição http na porta 3000, e que o servidor recebe 5 requisições por segundo. Levemos também
em conta que a requisição "lerArquivoDaWeb" leva alguns segundos para ser respondida. Na prática os
blocos 1, 2 e 3 das várias requisições seriam enfileirados/executados de forma entrelaçada de acordo com os
tempos das requisições e respostas. Ex:
```
requisição:bloco
1:1 2:1 1:2 3:1 2:2 2:3 1:3 3:3 
```
A vantagem alegada por esse modelo é que ele agenda tarefas de forma simples (menos overhead) do que
o modelo tradicional de multi-thread. A desvantagem é que se houver a presença de um bloco de processamento
intensivo, este irá atrasar o processamento dos próximos itens da fila de execução. No caso da presença
de blocos de processamento intensivo (ex: processamento de imagens) podem ser adotadas estratégias para evitar esse atraso,
como mover essas tarefas para um processo "worker" separado.

Outra desvantagem inerente é a grande presença de callbacks, o que torna o código mais "feio" se comparado
a um código síncrono comum.

**Hello world**

Voltando ao nosso script, vamos agora aprimorá-lo. Ao invés de mostrar uma carinha no console, vamos
levantar um servidor HTTP usando o módulo _express_ e exibi-la no navegador.

O _express_ é, de certa forma, não muito mais que um _wrapper_ ao módulo _http_ do node. Poderíamos aqui ter usado apenas o `require('http')`, mas como estamos com pressa já pulamos para o express e evitamos passar com algumas tarefas de mais baixo nível que teríamos no caso contrário. Mais detalhes no capítulo 3.

```
npm i express --save
```

```javascript
//FONTE: https://github.com/mgyarmathy/cool-face-service
//abrir "localhost:3000" no navegador

var express = require('express');
var app = express();
var cool = require('cool-ascii-faces');

var port = process.env.PORT || 3000;

//registra regras de roteamento
app.get('/', function(req, res) {
    res.send(cool() + '\n')
})

//inicia o servidor
app.listen(3000, function () {
  console.log('Listening on port ' + port);
});
```

> Caso você tenha vindo to PHP, note que aqui não temos a presença do servidor Apache/nginx.  
> O script node É o servidor. O express é uma parte de seu framework web (slim/codeigniter/laravel).

O _express_ recebe uma requisição HTTP crua. A partir das regras que você registrar
(`app.get`,  `app.post`, `app.use`, etc) ele irá rotear ela para a função definida.

O _express_ possui um bom tutorial em seu [site](http://expressjs.com/en/starter/installing.html). Até em português está!

Para mais detalhes sobre o que vem nas requisições (req, res, etc) pode-se consultar a documentação do express e brinque com o debugger do VS Code à medida que forem surgindo suas demandas e dúvidas!

Continuaremos falando dele na próxima etapa!

[Parte 3: express, templates, BD >>]()
