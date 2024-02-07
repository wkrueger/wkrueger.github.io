# Paradigmas de programação

Estava ouvindo uma conversa sobre paradigmas de programação e resolvi dar meus 2 centavos sobre o
assunto, sempre tentando ser super breve.

## Procedural

Procedural equivale mais ou menos ao estilo de código usado na linguagem C, especialmente em
bibliotecas mais antigas. O código procedural consiste de funções, o que pode levar à sua confusão
com o paradigma funcional, mas existem diferenças.

  - Em bibliotecas antigas, com a ausência de recursos de agrupamento, era muito comum o emprego
    de prefixos em nomes de funções para denotar agrupamento. Exemplo: `str_`, `mem_`, `file_`;
  
  - Argumentos comuns entre funções podem ser agrupados em "structs" (como objetos das linguagens
    modernas);

Exemplo hipotético:

```
File handle = file_open("arquivo.txt");
string* s = file_read(handle, 200)
file_append(handle, "abc")
```

## Orientação a objeto

O objeto é uma estrutura agrupadora que confere algumas propriedades de organização que discutiremos
adiante. As linhas de código do exemplo anterior poderiam ser escritas dessa forma:

```
File file = new File("arquivo.txt");
string* s = file.read(200)
file.append("abc")
```

  - Não precisamos mais de prefixos para organizar as funções;
  - Ao invés de termos a variável `handle` passada como primeiro argumento de todas as funções, ela
  é agora armazenada como estado interno do objeto e omitida dos argumentos;

Logo, uma propriedade importante de um objeto é que ele pode armazenar um estado interno. Em um
código C antigo, esse estado interno ao invés disso moraria em uma variável que é exaustivamente
passada no primeiro argumento de toda função.

Outra propriedade importante da orientação a objetos é o poder de **substituição**. No seguinte código
JS:

```js
const somador = {
  rodar(num) {
    const resultado1 = this.calcular(num)
    const resultado2 = this.coisar(resultado1)
    return resultado2
  },
  calcular(num) {
    return num * 2
  },
  coisar(num) {
    return num
  }
}

somador.rodar(2) // 4
```

O procedimento `rodar()` é dividido em sub-etapas `calcular()` e `coisar()`. Graças à disposição
em objeto, temos a flexibilidade de sobrescrever essas sub-etapas individualmente para compor novas rotinas.

```js
const somador2 = Object.create(somador)
somador2.coisar = function(num) {
  return num * 3
}

somador2.rodar(2) // 12
```

Na orientação a objetos é extremamente comum a criação de novos procedimentos a partir da _substituição_
(overriding) de partes de outros procedimentos.

## Programação funcional

Além do uso de funções, a programação funcional abraça a imutabilidade e a ausência de efeitos
colaterais (side-effects), o que é muito interessante pra aplicações de processamento paralelo.

Dada uma função:

```
f(x) -> y
```

  - Para uma determinada função f, e um dado x, o resultado y será sempre o mesmo;
  - A execução de `f()` não altera nenhuma variável fora de seu escopo; `f()` é uma caixa-preta
    isolada; `f()` é dita uma função pura;

A exigência de imutabilidade faz a programação funcional diferir vastamente do paradigma procedural,
pois naquele é comum a mutação de argumentos de funções.

```php
// procedural
string src = 'abc'
str_concat(src, 'd')
print(src) // abcd
```

Em linguagens puramente funcionais, mesmo pilares básicos como estruturas de controle de fluxo são
repensados para atingir e suportar a imutabilidade. Por exemplo, não existe `for` ou `if` propriamente ditos em uma linguagem puramente funcional.

A rigidez de linguagens funcionais permite a criação de sistemas de tipos altamente precisos
na identificação de erros em tempo de compilação.

Linguagens funcionais são focadas em combinar código através da
"composição", que é o ato de combinar várias funções simples para gerar uma complexa, passando uma
como argumento de outra.

```
h(x) = f(g(x))
h : f g
```

Uma técnica de composição da programação funcional é o "currying",
onde uma função de 2+ argumentos é convertida em múltiplas funções de 1 argumento.

```js
// javascript

// somar: num -> num -> num
function somar(a) {
  return function (b) {
    return a + b
  }
}

somar(2)(3) // 5
const somar5 = somar(5) // somar5: num -> num
somar5(3) // 8
```