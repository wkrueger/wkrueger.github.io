# Guia Promises

[[Tag: Notas Permanentes]]

Pode-se afirmar que no momento Promises são a forma mais "padrão" no momento de se tratar com
assincronismo no JS. Para quem trabalha com javascript, conhecê-las é essencial.
Uma dificuldade comum é que esta API tem uma curva de aprendizado um tanto acentuada de início, especialmente
se comparado com as alternativas mais antigas: callbacks e o módulo `async`. No meu caso, levei ao menos uns 3 
meses pra "cair a ficha".

> -- na verdade promises ainda são um remendo para o problema do assincronismo do JS. Elas ainda possuem certa dificuldade
> na adoção (se comparado a código síncrono) e ainda comem tempo de processamento de seu cérebro (se comparado a código síncrono).
> Mas são o mínimo necessário para levar a escrita de código JS a um nível são, já que callbacks facilmente levam a "spaghetti code". --

Tentarei aqui fazer uma introdução ao assunto, com foco em passar muitos exemplos. Algumas vezes posso sacrificar
a precisão acadêmica propositalmente em nome de uma explicação mais simples. Em alguns casos trago opiniões pessoais.

## Pré-definições

Uma função que retorna uma informação de "forma síncrona":

```javascript
try {
  var cinco = somar(2, 3)
  console.log(cinco)
} catch(err) {
  //erro na soma
}
```

Uma função que retorna uma informação de forma ASSÍNCRONA via pattern de CALLBACK.

```javascript
somar(2, 3, (err, cinco) => {
  if (err) {
    //erro na soma
    return
  }
  console.log(cinco)
})
```

Uma função que retorna uma informação de forma ASSÍNCRONA via pattern de PROMISE.

```javascript
somar(2, 3).then( cinco => {
  console.log(cinco)
}).catch( err => {
  //erro na soma
})
```

## Apresentação
A principal motivação por trás das Promises é resolver problemas trazidos pelo "pattern" de callbacks. Um desses problemas é a identação excessiva (A.K.A. callback hell). Outra função importante das promises é cuidar (e padronizar) o tratamento de erro.

Quando uma chamada assíncrona é "encapsulada" dentro de uma promise, torna-se possível dar a ela um tratamento mais "funcional" -- uma caixinha com entrada e saída definidas. Já uma função "callback" não trás a sua resposta no seu retorno de função, mas sim em um de seus parâmetros. Comportamento este que facilmente leva a complicações no código e dificuldade de leitura e reaproveitamento.

Exemplo besta de callback hell:
```javascript
const soma = (a, b, callback) => callback( null, a + b )
//somar 1 + 2 + 3 + 4 + 5
function somarTudo( callback ) {
  soma(1, 2, (err, r) => {
    soma( r, 3, (err, r) => {
      soma( r, 4, (err, r) => {
        soma( r, 5, (err, r) => {
          callback(null, r)
        })
      })
    })
  })
}
somarTudo( (err, result) => console.log(result) )
```

O mesmo exemplo usando promises:
```javascript
const soma = (a, b) => Promise.resolve(a + b)
function somarTudo() {
  return soma(1, 2)
    .then( r => soma(r, 3) )
    .then( r => soma(r, 4) )
    .then( r => soma(r, 5) )
}
somarTudo().then( result => console.log(result) )
```

Veja que promises ainda estão longe de ser "o mundo perfeito". Chamemos de "mundo perfeito" um código cuja leitura claramente identifica a regra de negócio com um mínimo de "sujeira". Por exemplo, se você for escrever uma mesma regra do javascript em um código PHP, o código PHP possivelmente será mais simples, terá menos linhas. Isto porque o código PHP é "síncrono": ele é mais simples porque faz menos coisas. A assincronia acaba trazendo uma carga adicional de sujeira ao código, ou seja, linhas adicionais que não estão relacionadas à regra de negócio, mas a detalhes técnicos.

**Comparado a um código síncrono** um código com promises é um tanto "sujo".

**Comparado a um código de callbacks**, um código com promises ainda é "sujo", porém um pouco menos.

Uma evolução do pattern de promises é o uso de async/await, que abstrai ainda mais o tratamento de assincronismo em uma linguagem muito similar a um código síncrono. (Pesquise depois no github pela biblioteca "tj/co", uma das raízes do async/await do javascript.) Mas ANTES de você usar async/await, é interessante entender primeiro como se usam promises.

## Usando

### O objeto (classe) promise

Um objeto de promise encapsula
  - uma informação qualquer
  - um estado (pendente/concluído/falha)
  - uma ação pra obter essa informação

Você nunca vai acessar os estados e informações diretamente via propriedades, mas sempre pelos métodos `.then()` e 
`.catch()`.

### construtor

O construtor é usado pra **converter um código de callback/evento em um código de promise**.

> **SE O QUE PRETENDES FAZER
> NÃO É CONVERTER DE CALLBACK -> PROMISE, ENTÃO VOCÊ NÃO DEVERIA ESTAR USANDO ESTE CONSTRUTOR.**

No exemplo abaixo convertemos o `$.ajax` em um formato de Promise (*)

>  (*) apenas para exemplo. O jQuery na verdade já expõe uma interface promise-ish nesse método

```javascript
var ajaxPromise = function(url) {
    return new Promise( function CallbackDoContrutor(completar,falhar) {
        $.ajax({{
            url : url , 
            success : function(data) {
                return completar(data)
            } , 
            error : function(jqXhr, status, error) {
                return falhar(error)
            }
        }})
    }
})

ajaxPromise('some-url').then( function(response) {
    fazerCoisas(response)
}).catch( function(err) {
    //exibir erro na tela
})
```

`completar` e `falhar` recebidos ali pelo `CallbackDoConstrutor`, são funções a ser chamadas pra indicar que a promessa foi "concluída"
ou "falha". Aceitam um (e apenas um) parâmetro o qual é repassado para a próxima etapa da cadeia (o `then` ou o `catch`).
Tome cuidado pra não chamá-los mais de uma vez. Pessoalmente adoto como prática sempre usá-los junto com `return`.

(Observação) Observe que o _retorno_ de `CallbackDoConstrutor` não é utilizado pra nada. Apenas o `completar` e o `falhar`.

> (Recomendação) Mantenha funções conversoras Callback -> Promise separadas da sua regra de negócio, preferencialmente as defina como funções puras.

### Promise.resolve( [valor] )

Faz iniciar uma cadeia de promises com determinado valor inicial. Encapsula um valor em uma Promise.

É **exatamente** igual a se fazer:

```javascript
var imitaçãoDoResolve = function( value ) {
    return new Promise( function(completar) {
        completar(value)
    })
}
imitaçãoDoResolve(3).then( function(result) {
    console.log(result) // exibe 3
})
Promise.resolve(3).then( function(result) {
    console.log(result) // exibe 3
})
```

### Promise.reject( [valor] )

Faz iniciar uma cadeia de promises com status de falha.

A mesma coisa do *Promise.resolve*, só que desta vez chamando um `falhar` ao invés do completar.

>  NOTA  
>  Uma cadeia de promises SEMPRE nascerá a partir de um construtor, de um Promise.resolve ou de um Promise.reject.

### Promise#then( sequenceFn , [failFn] )

(parêntese ilustrativo. favor ignorar se confuso)
```typescript
class Promise {
    then<K,V>( sequenceFn : (prevResult?) => Promise<K>|K , failFn? : (prevResult?) => Promise<V>|V ) 
        : Promise<K>|Promise<V>
}
```

É um **método** do objeto Promise usado pra **encadear** eventos assíncronos subsequentes.

Caso a etapa anterior tenha sucesso, `sequenceFn()` é executado, caso contrário
roda a `failFn()`.

Os callbacks `sequenceFn` e `failFn` recebem como argumento a resposta passada na etapa anterior da sequência de eventos.

```javascript
Promise.resolve('legal').then(function(prev){
    return prev + ' mesmo'
}).then(function(prev) {
    console.log(prev) // legal mesmo
})
```
UMA PAUSA: Agora que você já sabe que o segundo argumento (`failFn`) existe, pode ignorá-lo. Você nunca vai usá-lo, isso porque existe o `Promise#catch`.

O callback `sequenceFn` é beeem diferente do callback do construtor que vimos lá em cima.
Pra repassar dados para as próximas etapas da sequência utilizamos o RETORNO da função (ou o `throw`).
Este retorno de função pode ser um valor qualquer, ou OUTRA promise.

> **Se o retorno de `fnSequencia` fror uma Promise, a próxima etapa da cadeia apenas é chamada quando esta Promise concluir
> (seja com sucesso ou falha). Esta próxima etapa receberá o valor com o qual a promise sucedeu ou falhou.**

```javascript
numeroEntreZeroE100.then( function(numero) {
    if (numero < 50) return numero
    return ajaxPromise(ENDERECO + '?numero=' + numero)
}).then( function(resultado) {
    mostraNaTela(resultado)
})
```
No exemplo acima, temos um bloco que pode ter um resultado síncrono ou assíncrono dependendo do caso.

### Promise#catch( fn )

Quando você dá um `throw` dentro do `sequenceFn` ou quando o retorno desse é uma Promise falha, 
o fluxo é encaminhado para o próximo `.catch` da sequência.

Observe que esse `throw` não "propagará" para o resto do programa (nem o interromperá), apenas para a sequência de Promise em questão.
Em plataformas recentes (com Promise nativa do es6) aparece uma mensagem no console sobre o erro (uncaught rejection), mas em algumas mais
antigas ou em bibliotecas um erro pode não deixar aviso nenhum se não tratado com uma etapa `.catch()` e um log.

Quando há uma falha em uma sequência de Promises, o erro varre a sequência até encontrar
o primeiro `.catch()`. Para que o erro não seja "engolido", não se esqueça de repassá-lo para o resto da cadeia
usando `throw` novamente. Usar `return` dentro de um `.catch()` fará o status mudar pra "sucesso" e a sequência cair no
`.then()` seguinte.

```javascript
Promise.resolve()
    .then( etapa1 )
    .then( etapa2 )  //falhou aqui
    .then( etapa3 )  // pulou este
    .catch( function(err) { // caiu aqui
        console.log(err)
        // não engolir o erro
        throw err
    })
    .then( etapa4 )
    .catch( catch2 )
```

Se tudo for feito certinho, pra receber um erro e exibí-lo na tela você só precisara de 1 catch pra tripa toda de código.
Nada de inúmeras chamadas à função que mostra o erro na tela.

### Promise.all( entradas )

(parêntese ilustrativo. favor ignorar se confuso)
```typescript
class Promise {
    static all( promises : Promise<T>[] ) : Promise<T[]>
}
```
Recebe `Promise[]` como entrada.

`Promise.all` só seguirá para a próxima etapa da cadeia depois que todas as suas `entradas` finalizarem, ou na primeira falha.

A próxima etapa recebe como resultado um _array_ com as respostas das `entradas`.

```javascript
var clientesP = [264,735,335,999 277].map( function(id) {
    return lerDoBanco({
        tabela : 'cliente' ,
        id : id
    })
}) // tipo Promise<Cliente>[]
Promise.all(clientesP).then( function(clientes) {
    // clientes tem tipo Cliente[]
    mostrar(clientes)
}).catch( function(err) {
    mostrarErro(err.message)
    //repassar o erro, caso contrário seguirá a cadeia como se não houvesse erro
    throw err
}) //...
```

Geralmente você estará utilizando `Promise.all` e, conjunção com `Array#map` para criar fluxos "paralelos". (*)

```
           |
        [1,2,3]
  Array#map + Promise
    /      |      \
 [ p(1),  p(2),   p(3)]
   \       |      /
      Promise.all
           |
    [r(1),r(2),r(3)]
```

>  (*) Paralelo entre aspas. Se você entende do event loop sabe do que estou falando.

## Padrões, exemplos

### Basicão array#map e array#reduce

Eu ainda não sou o guru da programação funcional, mas uma das partes importantes (e mais fáceis) dela é pensar
em termos de __fluxos de dados__ e __transformações__.

Por exemplo, se no início tenho uma lista com 15 ids, e ao final terei 15 ~qualquer coisa~, então certamente esta
transformação pode ser feita com o map (exceto se esses 15 ids tiverem interdependências/não linearidades).

```
number[15] => Array#map => Promise<Cliente>[15] => Promise.all => Promise<Cliente[15]> => Promise#then => Cliente[15]
```

Por outro lado, se de 15 números, ao final quero obter apenas um objeto/estatística, então certamente terei de usar
o reduce.

```
number[15] => Array#reduce => string
```

### Pedidos assíncronos em paralelo

Cria-se um array de promises, depois usa-se o `Promise.all` para verificar que todas estão prontas e coletar os dados.

Caso a fonte de dados pras promises seja um array, certamente você usará o `Array#map`.

```javascript
var clientesP = [264,735,335,999 277].map( function(id) {
    return lerDoBanco({
        tabela : 'cliente' ,
        id : id
    })
}) // tipo Promise<Cliente>[]
Promise.all(clientesP).then( function(clientes) {
    // clientes tem tipo Cliente[]
    mostrar(clientes)
})
```

### Pedidos assíncronos em sequência

Este é complicadinho. A partir de um array, usa-se o `array#reduce` iniciado com um `Promise.resolve()`
para criar um encadeamento com um `.then(...)` para cada item do array.

Antes

```javascript
chamada(1)().then( chamada(2) ).then( chamada(3) ).then( chamada(4) )
```

Equivale a
```javascript
Promise.resolve().then( chamada(1) ).then( chamada(2) ).then( chamada(3) ).then( chamada(4) )
```

Equivale a 
```javascript
[1,2,3,4].reduce( function(chain,currentItem) {
    return chain.then( chamada(currentItem) )
}, Promise.resolve())
```

Mais um exemplo:

```javascript
var estados = ['SP', 'RJ', 'MG']
var $listaDados = $('.lista')
return estados.reduce( (sequencia, estado) => {
    return sequencia.then(() => {
        return ajaxRequest('/dadosEstado/' + estado)
    }).then( dados => {
        $listaDados.append( TEMPLATE(dados) )
        return
    })
} , Promise.resolve())
```

### Aninhamento

O código em promise tem a característica de poder funcionar com aninhamento.
Se fôssemos pensar de forma gráfica, a informação na parte mais profunda da "cascata" parece que
vai "subindo" até a raiz, em uma espécie de árvore.

```javascript
// -- todas as funções personalizadas aqui retornam promises
obterCliente().then( function(cliente) {
    // escopo 1
    return obterCidadeDoCliente(cliente).then( function(cidade) {
        // escopo 2
        cliente.cidade = cidade
        return obterTemplate(cliente).then( function(template) {
            // escopo 3
            return '<div>' + template + '</div>'
        })
    })
}).then( function(templateClienteComDiv) {
    //recebe o resultado do escopo 3
    mostrar(templateClienteComDiv)
})
```

### Otimização

Lembre-se que um dos principais motivos do uso de Promises é cortar as identações. Embora às vezes seja
necessário criar mais níveis porque variáveis podem estar fora de escopo, em muitos casos o código pode ser otimizado
de modo a cortar identações. Por exemplo, o caso anterior poderia ser simplificado para:

```javascript
obterCliente().then( function(cliente) {
    //este bloco aqui ainda depende de "cliente" da closure, então não dá pra cortar identação dele
    return obterCidadeDoCliente(cliente).then( function(cidade) {
        cliente.cidade = cidade
        return cliente
    })
})
.then( obterTemplate ) //"escopo 2"
.then( function(template) { //"escopo 3"
    return '<div>' + template + '</div>'
}).then( function(templateClienteComDiv) {
    mostrar(templateClienteComDiv)
})
```

Você pode tornar as coisas mais lineares jogando as variáveis comuns entre os
blocos para o escopo superior. Aqui jogamos " cliente" pra cima.

```javascript
var cliente
obterCliente().then( function(_cliente) {
    cliente = _cliente
    return obterCidadeDoCliente(cliente)
})
.then( function(cidade) { //"escopo 1"
    cliente.cidade = cidade
    return cliente
})
.then( obterTemplate ) //"escopo 2"
.then( function(template) { //"escopo 3"
    return '<div>' + template + '</div>'
}).then( function(templateClienteComDiv) {
    mostrar(templateClienteComDiv)
})
```

### Mostrando erros com 1 catch só

Da mesma forma que em código síncrono podemos usar um `try` para pegar um erro de um grande bloco de
código, em um código de Promise um `.catch` no final de uma sequência faz o mesmo trabalho.

É importante, porém, que o formato dos erros seja **padronizado** no programa todo. Ou seja, que os objetos de erro
não tenham diversos formatos.

Outro erro bem comum é esquecer de usar **return** dentro de **.then()'s**. Um return não dado é um fio perdido, tome cuidado.

```javascript
efetuarRequisicao('https://...') // volta HTTP 400 "O cliente solicitado não foi encontrado"
    .then( logicaDoApp ) //pula aqui
    .catch( function mostrarErro(err) {
        popup(err.message, err.code, err.title)
    }) // mostra na tela "O cliente solicitado não foi encontrado"
```

### Fuja do this

Promises não costumam gostar do uso do `this` e de classes. Utilize o escopo léxico para guardar estado ao invés de classes.

```javascript
function Greeter(message) {
    this.greeting = message;
}
Greeter.prototype.greet = function () {
    return "Hello, " + this.greeting;
};

var greeter = new Greeter("world");
Promise.resolve()
    .then( greeter.greet ) // hello, undefined!
    .then(function (resp) {
        console.log(resp);
    });
```

Solução

```javascript
    .then( () => greeter.greet() )
```


### async / await (rascunho)

  - Permite escrever código assíncrono de forma tão limpa como um código síncrono; Porque mesmo
    que promises sejam melhores que callbacks, elas ainda sujam o código;

  - Não disponíveis em browsers mais antigos que 2017.

  - Ao adicionar o nome `async` a uma função, essa passa a sempre retornar uma promise e a aceitar
    a decoração `await`;

  - Com o await, ao invés the escrever `fn().then( x => ... )`, você escreve `var x = await fn()`.
    "promise unwrap transform" seria um bom nome descritivo para ele;

  - O uso do async/await, mais notavelmente, evita a necessidade de mover variáveis comuns entre
    vários blocos `.then` para um escopo superior.

  - Se você esquecer de colocar o `await` em `var x = fn()`, x agora será uma Promise, nâo o valor retornado
    por ela.
  
Melhor mostrado com um exemplo:

Promise:

```javascript
api.post('/password-reset-request', (req, res, next) => {
    let _bytes = uuid(), _userName, _userId
    //variávies criadas pra "linearizar" a sequência de promises
    Promise.resolve().then(() => {
        $checkParams(req.body, 'email')
        return connection
        .execute(
            `SELECT u.id AS userId , u.name AS userName, ev.token AS token
                FROM 
                users u LEFT JOIN event_tokens ev ON u.id = ev.user
                WHERE u.email = ?`, 
            [req.body.email])
    })
    .then(([rows]) => {
        if (!rows.length) throw 'SKIP'
        if (rows[0].token) throw Error('Já existe um pedido pendente para este usuário.')
        _userName = rows[0].userName
        _userId = rows[0].userId    
        return connection
        .execute('INSERT INTO event_tokens(user, event, token) VALUES (?, ?, ?)',
            [_userId, 'password-reset-confirm', _bytes])
    }).then(() => {
        return mailer({
            email : req.body.email ,
            subject : 'Redefinição de senha' ,
            content : PWD_RESET_CONTENT(_userName, _bytes)
        })
    })
    .catch( err => {
        if (err === 'SKIP') return
        throw err
    })
    .then(() => {
        res.status(200).send({ token : _bytes })
    })
    .catch(next)
})
```

Async/await

```javascript
api.post('/password-reset-request', async (req, res, next) => {
    try {
        //aqui não precisamos "jogar variáveis pra cima"
        $checkParams(req.body, 'email')
        var bytes = uuid()             
        var [rows] = await connection.execute(
            `SELECT u.id AS userId , u.name AS userName, ev.token AS token
                FROM 
                users u LEFT JOIN event_tokens ev ON u.id = ev.user
                WHERE u.email = ?`, 
            [req.body.email]
        )
        if (!rows.length) throw 'SKIP'
        if (rows[0].token) throw Error('Já existe um pedido pendente para este usuário.')
        var { userName, userId } = rows[0]
        await connection.execute('INSERT INTO event_tokens(user, event, token) VALUES (?, ?, ?)',
            [userId, 'password-reset-confirm', _bytes])
        await mailer({
            email : req.body.email ,
            subject : 'Redefinição de senha' ,
            content : PWD_RESET_CONTENT(userName, bytes)
        })        
        return res.status(200).send({ token : bytes })
    }
    catch (err) {
        if (err === 'SKIP') return res.status(200).send({ token : bytes })
        next(err)
    }
})
```


## Concluindo

Espero ter ajudado! Abraço!