# Crash course to NodeJS (web app) [parte 3]

Serviremos uma página dinâmica, arquivos estáticos, e realizaremos conexão com
o banco de dados MySQL.

---

## Ponto de partida

Começamos pelo hello world

```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send("Hello world")
})

app.listen( 80 , () => console.log('Server up') )
```

## Definição inicial

```typescript
type RequestHandler = (req, res, next) => any
```

Chamaremos aqui de `RequestHandler` uma função que tenha a assinatura acima. Também popularmente chamado de _middleware_, 
mas fugirei um pouco desse termo aqui.

## Servindo arquivos estáticos

Pode-se usar o middleware **express-static**.

Referência:  
[https://expressjs.com/en/starter/static-files.html]() (tutorial do express)  
[https://expressjs.com/en/api.html#express.static]() (documentação do express)

```javascript
const app = express()

//serve a pasta assets no caminho /assets
app.use('/assets', express.static('assets'))

app.get('/', (req, res, next) => {
    res.send("Hello world")
})
```

`express.static('assets')` gera nada mais nada menos que uma função do tipo `RequestHandler`.

Configurações adicionais como cache etc estão disponíveis como opções do static, as quais você passaria opcionalmente
em um objeto no segundo parâmetro.

> Embora o `express.static` seja OK para servir arquivos estáticos, em um ambiente de produção você pode preferir
> usar um processo _nginx_ separado para isso, por esse ser um servidor otimizado para arquivos estáticos.
> Ou ainda deixar seus arquivos estáticos em um serviço especializado pra isso (ex Amazon S3).


## Middleware

Atualmente o fluxo da aplicação é algo assim

```
 request { url, method, headers, body ... }
                  |
                  v
    ** SE req.url começa com /assets **
        static(req, res, next)  ---------> fim
                  |
                  v
             hello world        ---------> fim
```

De acordo com o url de origem da requisição, esta passará por determinados `RequestHandlers`.
Estas funções podem finalizar o fluxo a qualquer momento (por exemplo, mandando uma resposta final), 
ou repassá-lo para a próxima etapa. Em outros casos, o handler irá alterar a requisição, fazendo
coisas como adicionar uma propriedade a mais no objeto `req` (ex: session, body).

Quando você registra um `RequestHandler` usando o metodo `app.get`, `app.post`, etc, apenas as requests
com esses verbos E que tenham a URL compatível com o caminho definido passarão por ele.

```javascript
app.post('/api/cliente/:idcliente', (req, res, next) => {
    //apenas requisições com URL compatível e do tipo POST passarão por aqui
})
```

Quando você registra um `RequestHandler` usando o método `app.use`, as requisições de todos os verbos
(GET, POST, PUT, DELETE, OPTIONS) passarão por aquela função. No caso do exemplo acima, todas as requisições
que iniciam com 'assets' passarão pelo `express.static`, que finalizará a requisição enviando o arquivo
como resposta, ou encaminhará o fluxo para a próxima etapa (caso um arquivo não tenha sido encontrado).


A ordem de definição dos `RequestHandlers` importa.

## Middleware de erro

Caso algum `RequestHandler` na cadeia chamar a função `next(obj)`, e `obj` possuir um tipo de Erro, 
a requisição será roteada para o próximo `ErrorRequestHandler` **(pulando todos os demais handlers que não são de erro)**.

    type ErrorRequestHandler = (req, res, next, err) => any

Quando você chama `app.<X>` com uma função de 4 parâmetros, esta é reconhecida como um tratador de erros.

Você pode definir um middleware de erros para, por exemplo, enviar uma página bonita de erro para o usuário.

## Middleware final

Quando nenhum `RequestHandler` é encontrado para uma URL ou quando o `express.static` não encontra o arquivo
solicitado, o fluxo é passado adiante. Caso o fluxo termine sem encontrar nenhum tratador,
este vai para o "último tratador padrão" do express, que envia uma resposta `404 Cannot GET <URL>`.

![Cannot GET](https://gist.githubusercontent.com/wkrueger/d58187f5be6e578d168e292ae51519aa/raw/c2b99c4eed42defc078451541e73d47d082b6417/zzz_cannotget.PNG)

Você pode personalizar o comportamento dos erros 404 declarando um `RequestHandler` como etapa final da cadeia
de tratamento.

```javascript
app.get('/', (req, res) => {
    res.send("Hello world")
})

app.use( (req, res, next) => {
    //quando abrindo e fechando uma string com ` , você informa que esta aceita
    //interpolação de variáveis com ${}. Isto só é válido no ES6.
    res.status(404).send(`NADA ACHADO: ${req.method} ${req.url}`)
})

app.listen( 80 , () => console.log('Server up') )
```

## Enviando uma página pré-renderizada

Colsulte o wiki do github do _express_ pra verificar uma boa lista de "plugins" populares.

    https://github.com/expressjs/express/wiki

Na seção "template engines" temos umas dezenas de opções de como injetar dados sobre um
determinado conteúdo (geralmente html). Usaremos aqui o _express-handlebars_. Estou também incluindo
o pacote _lorem-ipsum_, porque sim.

```javascript
const app = express()
const hbs = require('express-handlebars')
const ipsum = require('lorem-ipsum')

app.engine('.hbs', hbs({
    extname: '.hbs'
}));

app.set('view engine', '.hbs')
```

No express você chamará o handlebars usando o método `Response::render( template:string, toinject:any )`.

```javascript
app.get('/pagina', (req, res) => {
    res.render('modelo', {
        titulo : 'Título' ,
        itens : [
            {
                titulo : 'Título 1' ,
                conteudo : ipsum({count:3})
            } ,
            {
                titulo : 'Título 2' ,
                conteudo : ipsum({count:3})
            }
        ]
    })
})
```

Remova a rota hello world previamente existente ou a mova para depois desta nova (caso contrário ela ganhará precedência).

Na configuração padrão do express-handlebars, você coloca seus modelos na pasta `views`.
Para modelos pai, o padrão é `views/layouts`, para seções parciais, `views/partials`.

Criamos um arquivo no caminho `views/modelo.hbs`.

```html
<html>
<head>
    <title>Página :: {{titulo}}</title>

    <link rel="stylesheet" href="assets/semantic.min.css" type="text/css"></link>
    <style>
        body {
            padding: 30px;
        }
    </style>
</head>
<body>
    <h1>{{titulo}}</h1>
    <div>
        {{#each itens}}
        <div class="ui segment">
            <h3 class="ui header">{{titulo}}</h3>
            <p>{{conteudo}}</p>
        </div>
        {{/each}}
    </div>
</body>
</html>
```

Aqui eu também baixei o `semantic.min.css` da framework _semantic UI_ a partir de

    http://semantic-ui.com/introduction/getting-started.html
    > Simpler setup > Download zip

e o coloquei na pasta assets.

![preview](https://gist.github.com/wkrueger/d58187f5be6e578d168e292ae51519aa/raw/55a2760c6d72972b7dd06a685b0c4c35d19a00d0/zzz_preview.PNG)

Em resumo, o handlebars injeta variáveis a partir da tag `{{x}}`. O conteúdo é automaticamente
"HTML escaped", logo se você deseja injetar HTML deverá usar `{{{x}}}`.

Existem algumas funções disponíveis. Dentre elas

  - `{{#if x}}` Rederiza um bloco condicionalmente  
  - `{{#each x}}` Itera dentro de um array
  - `{{#with x}}` Muda o contexto para dentro da propriedade especificada
  - `{{> x}}` Injeta uma parcial
  - `{{FUNÇÃO x}}` É possível definir funções personalizadas

Para mais detalhes, consulte a documentação do _handlebars_ e do _express-handlebars_.

## Conectando ao mySQL

Vou te confessar que nunca usei o node com o mySQL (só com o postgres, e via ORM). Mas, na verdade geralmente as coisas
são tão simples como procurar no google `node mysql` e ler as primeiras linhas de documentação.

No caso, minha busca primeiro encontrou o pacote "mysql" que diz ser uma implementação
em JS puro, e depois achei o "mysql2", que diz ser uma evolução deste unindo ele e outros projetos.
Para mais detalhes e saneamento de dúvidas, consulte o github desses dois projetos.

>Na verdade, no fim das contas deveríamos usar um ORM, o [sequelize](http://docs.sequelizejs.com/en/v3/).
>Este abstrai a implementação de BD relacional (postgres ou mysql), e possui uma interface de nível mais alto.
>Mas não cabe neste capítulo.


Criei uma database de nome "test" e uma tabela de nome "artigos".

![sql](https://gist.githubusercontent.com/wkrueger/d58187f5be6e578d168e292ae51519aa/raw/c2b99c4eed42defc078451541e73d47d082b6417/zzz_ddl.PNG)

```sql
CREATE TABLE `artigos` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`seq` INT(11) NULL,
	`titulo` VARCHAR(100) NOT NULL,
	`conteudo` TEXT NULL,
	PRIMARY KEY (`id`)
)
ENGINE=InnoDB
;
```

Adicionei alguns dados aleatórios

```sql
INSERT INTO `artigos` (`id`, `seq`, `titulo`, `conteudo`) VALUES (1, 0, 'Título 1', 'Lorem ipsum!');
INSERT INTO `artigos` (`id`, `seq`, `titulo`, `conteudo`) VALUES (2, 0, 'Título 2', 'Lorem ipsum 2!');
```

Agora, consultando o [Hello World do pacote mysql2](https://github.com/sidorares/node-mysql2), vamos pegar a página que temos e injetar esses dados nela.

Substituindo a parte do app.listen

```javascript
const mysql = require('mysql2/promise')
var connection
mysql.createConnection({
    host : 'localhost' ,
    user : 'root' ,
    database : 'test'
}).then( resp => {
    connection = resp
    //iniciar o servidor só depois de ter conectado com o mysql
    app.listen( 80 , () => console.log('Server up') )    
})
```

Substituindo a rota `/pagina`.

```javascript
app.get('/pagina', (req, res, next) => {
    connection.execute('SELECT * FROM artigos')
        .then(([rows, fields]) => {
            res.render('modelo', {
                titulo : 'Título' ,
                itens : rows
            })
        }).catch(next)
})
```

![inspect](https://gist.github.com/wkrueger/d58187f5be6e578d168e292ae51519aa/raw/55a2760c6d72972b7dd06a685b0c4c35d19a00d0/zzz_inspect.PNG)

![funfou](https://gist.github.com/wkrueger/d58187f5be6e578d168e292ae51519aa/raw/c2b99c4eed42defc078451541e73d47d082b6417/zzz_funfou.PNG)

Aqui usamos a versão "promise wrapper" do mysql2. O uso de Promises é um tópico importantíssimo e
complicado no js. Caso esteja por fora, tenho um guia [aqui](https://gist.github.com/wkrueger/573c4be8d5081ca6aee9d445fac3c668).
Roteamos o erro da Promise para o middleware de erro usando `.catch(next)`.

> (comentário por fora)  
> A sintaxe de promise e os middlewares do express não parecem bater muito bem entre si. 
> Há alguma repetição de código porque ambos cumprem em parte funções similares. Isto é porque
> o express em si é um framework de antes da popularização das promises.
>
> Possivelmente veremos nos próximos anos a popularização de algum framework que se integre melhor
> com promises e o async/await, talvez o koa2.

E com isso fechamos os tópicos prometidos para a parte 3. Uff!