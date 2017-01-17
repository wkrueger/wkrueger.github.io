# Crash course de node.js (web app) [parte 1]

A parte 1 é destinada a iniciantes que não possuem experiência com javascript, mas que
já programaram em outra linguagem. Caso você esteja mais à frente, pode pular sem medo.

Notação de exemplos:

```javascript
var a = 2
//quando eu digo
a //2
//quer dizer que eu abri um console no navegador, digitei a, ENTER, e ele respondeu 2!
//use o console para sanar dúvidas!
```
Glossário: OOP = orientado a objeto  
syntax sugar = uma forma mais simples de escrever algo, providenciada pela linguagem

---

## javascript basicão

Javascript é uma linguagem quem tem sintaxe C-like.  
O que é isso? Mesmo que você seja um iniciante, você já deve ter uma noção de qualquer linguagem C-like. C, java, PHP...
A grande maioria das linguagens que você provavelmente já viu é C-like.
Se você já viu uma que não é (haskell, lisp-likes), então você também já sabe do que estou falando. 

A intenção do guia é ser resumido. Para mais detalhes, recomendo o [guia da Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript). Se for lê-lo apenas
tome cuidado/leve em conta que a parte de OOP que consta nele pode ser considerada hoje uma prática "deprecada" e não recomendadas no JS atual.**

**Não há tempo de explicar, jovem padawan.


**Não tipada (tipagem dinâmica)**

Quer dizer que você vai declarar variável com `var`. Tudo é uma `var`.

```javascript
var isso = 2
var aquilo = "aquilo"
```

Se você ESQUECER de colocar `var`, ainda será declarada a variável, só que ficará no escopo global. Não faça isso.
Você está terminantemente proibido.

**Tipagem fraca**

No fundo, na raiz da existência, toda variável tem um tipo. `isso` é um `Number`. `aquilo` é uma `String`.
As variáveis não possuem caráter. Elas podem trocar de tipo quando bem entenderem, ou quando a linguagem achar necessário ([type coercion](http://stackoverflow.com/questions/19915688/what-exactly-is-type-coercion-in-javascript)).

```javascript
//o operador +, quando aplicado a uma string, concatena
1 + '2' //12
1 + 2   //3
a = 2   //hoje ela é um number
a = 'dois' //amanhã ela é uma string 
```

**First-class functions (funções são primeira classe)**

Funções são variáveis, cidadãos banais, como quaisquer outros.

```javascript
var a = function(val) {
  return val * 2
}
a(4) //8
var b = a
b(4) //8
```

**Objetos**

No js não tem essa de classe ou o escambau (*). Tudo é um objeto ou uma primitiva. Até uma função é um objeto.
Primitivas são números, strings...

Não há limitação ao designar ou sobrescrever propriedades a objetos.

```javascript
var objeto = {
    a : 2 ,
    b : function(inp) { return inp * 2 }
}
```

De forma similar ao que acontece nas outras linguagens, quando você faz uma designação de um objeto a outra variável, apenas
a referência da "raiz do objeto" é copiada (e assim as propriedades deste não se tornam "independentes" -- ver exemplo). Com designações
de primitivas (string, number), as primitivas são copiadas.

```javascript
var numero = 2
var outronumero = 3
outronumero = 4
console.log(numero) //2
//as variáveis ficaram independentes

var objeto = { a : 2 }
var outroobjeto = objeto
outroobjeto.b = 3
console.log(objeto) // { a : 2 , b : 3 }
//foi copiada a referência da raiz do objeto, mudar seu
//conteúdo refletirá nos outros lugares a não ser que se efetue
//um "clone" do objeto
```


Em alguns casos existem notações especiais "syntax sugar" para se construir alguns tipos de objetos de forma mais "bonita" ou "fácil".

```javascript
var a = new Object() //NUNCA USE ESSA NOTAÇÃO
var a = {}           //aí sim
var array = new Array() //existe, mas NUNCA USE
var array = []          //aí sim
var regexp = new RegExp("[a-z]","g")
var regexp = /[a-z]/g
var fn = (a) => a * 2   //ES6
``` 

**Escopos**

As linguagens C-like mais convencionais fecham o escopo de suas variáveis dentro das chaves `{}` mais
próximas. O javascript fecha o escopo dentro da **função** mais próxima (quando usado `var`).


```javascript
function decima() {
  var globalzinha = 2
  console.log(teste) // (a) error

  function debaixo() {
      //é como se houvesse um "var teste = undefined" aqui
      var interna = 3
      console.log(teste) // (b) undefined
      if (interna > 2) {
          var teste = 5
      }
      console.log(teste) // (c) 5
      console.log(globalzinha) // (d) 2
  }
  console.log(interna) // (e) erro
}
```

Quando você usa `var`, a declaração é movida para o topo da função (closure), mas a designação continua onde estava.
Observando os casos no exemplo acima:

  - (a) `teste` não está declarado no escopo `decima`. Chamá-lo trará um erro e interormperá a execução do programa

  - (b) `teste` está declarado no escopo `debaixo`. A mera presença da declaração 2 linhas abaixo faz com que
    se declare a variável no escopo `debaixo`, como se houvesse uma linha antes de tudo dizendo `var teste = undefined`.

  - (c) mesmo que a variável tenha sido declarada dentro de um `if`, ela está disponível fora do IF, pois declarações possuem
    escopo de função, não de chaves.
 
  - (d) `globalzinha` foi declarada em um escopo acima. Funções dentro de `decima` também possuem acesso a ela.

  - (e) o escopo `decima` não tem acesso a variáveis declaradas no escopo `debaixo`.

Mais uma coisinha

**function fn(){} vs var fn = function()**

O primeiro caso é um "syntax sugar" especial onde declaração da função é jogada para o topo do contexto.

```javascript
a(2) //erro: não definido
b(2) //ok, retorna 4
var a = function(i) { return i * 2 }
function b(i) { return i * 2 }
```

Isso é interessante porque permite que você mova declarações de funções auxiliares/internas para o fim do código,
auxiliando na leitura por um terceiro.


**Protótipos**

Uma variável possui no mínimo um pai -- ou protótipo.  
Você pode inspecioná-lo chamando `obj.__proto__`. Objetos e primitivas recebem
protótipos pra que você possa trabalhar de uma forma "oriantada a objeto" com eles.

Abra o console do seu navegador (F12 ou CMD_shift+I) e digite...

```
var a = 1
a.
```
Ao digitar `a.` o navegador já te dará os "metodos" disponíveis. O mesmo resultado virá se você digitar
`a.__proto__` + enter. Números terão o protótipo `Number.prototype` (você também pode digitar isso no console),
strings terão `String.prototype`, objetos terão `Object.prototype`, e por aí vai.

Você pode criar um objeto com um protótipo desejado a partir de `Object.create(<proto>)`. Isto permite criar uma
espécie de "cadeia de herança" em objetos ou simular comportamentos de OOP.

```javascript
var objproto = { a : 2 }
var obj = Object.create({ a : 2 })

// obj.__proto__ é objproto
// objproto.__proto__ é Object.prototype

obj.a //2
obj.a = 3
obj.a //3
objproto.a //2  --> o objeto pai não foi alterado
Object.prototype.toString   //existe
obj.toString                //a função existe. Varreu-se obj -> objproto -> Object.prototype pra achar ela.
```

**new e this**

Não crie código usando `new` ou `this`. Só use quando alguma biblioteca especificar que ela tem que ser usada assim.
E assim economizamos umas 50 linhas de guia e mais umas futuras horas de tempo.

## APIs, ambientes

Uma parte do que se chama **javascript** é o que passei acima. 

Além da sintaxe, a **linguagem** em si trás consigo bibliotecas padrão (String, Math, Number,
Object, etc). Estas declaradas como objetos globais que estão disponíveis em qualquer ambiente javascript, e na sua especificação.

Uma outra grande variedade de objetos globais estão disponíveis quando acessamos
uma engine javascript via navegador (document, navigator, XMLHttpRequest, etc).
Estas coisas são interfaces disponíveis **apenas no navegador** e **não fazem parte
do javascript**.

Na maioria das vezes essas funções fazem parte da **API de manipulação
de documentos ("DOM API")**.

Quando você acessar o javascript a partir de outro contexto (ex: nodejs, phantomjs)
a API DOM não estará disponível, mas a API nativa do JS continuará lá. E esses ambientes
disponibilizarão outras funções exclusivas deles.

TD;DR: Não confunda linguagem com API. Não confunda javascript com API DOM! Não compare "jQuery" com "javascript puro" PELAMORDEDEUS. Você tem que comparar o "jQuery" com a API DOM!!!!

---

Vou me limitar a isso. A intenção aqui é uma revisão de algumas das principais partes da linguagem. Referência de funções o google pode dar melhor do que eu.

Concluímos a parte 1!

[Parte 2: NPM e mais coisas >>]()