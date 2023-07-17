# Lodash mudou a forma como escrevo JavaScript

Quando iniciei em programação, aprendi inicialmente a realizar manipulações de dados
de forma "imperativa", como é comum para a maioria das pessoas.

```js
// operação de mapeamento escrita de forma imperativa

const output = []

for (const item of source) {
  output.push({ ...item, hello: 'world' })
}

// modo funcional

const output = source.map(item => {
  return { ...item, hello: 'world' }
})
```

Ler a documentação da antiga biblioteca _underscore_ me fez perceber que muitos padrões
de manipulação de dados podem ser encapsulados em funções. Seguindo este caminho, as manipulações, ao invés de serem escritas no modo "imperativo" (como na imagem acima), podem ser escritas a partir da **composição** de funções comuns.

**Imperativo vs. funcional**

  - No modo imperativo, você geralmente inicia um loop declarando a sua saída de antemão (como no exemplo acima);
  - Você não tem como saber se a operação é um _map_ ou um _reduce_ sem ler o conteúdo do loop for inteiro; Um loop é uma construção mais genérica do que uma função pré-determinada -- isto torna a leitura mais tediosa;
  - No modo funcional, a saída é o _retorno_ de uma função;
  - No modo funcional você precisa declarar menos tipos. Eles são determinados via inferência a partir da função e de sua entrada;
  - Funções são construções menos genéricas, sua saída é mais específica e previsível do que a de um loop for -- isto facilita a leitura;


## Quais funções do Lodash mais utilizo?

O Lodash possui centenas de funções, algumas mais úteis do que outras, muitas delas hoje integradas ao núcleo do JS. Listo aqui algumas que uso bastante:

### `[].keyBy(...)`

Indexar um _array_ de acordo com uma propriedade ou um predicado.

Se você quer frequentemente _procurar_ um item dentro de um array mas quer evitar gerar uma operação O(n^2), provavelmente é mais eficiente _indexar_ a coleção de antemão, criando assim um hash map.

```
X[] --> { string : X }
```

### `[].groupBy(...)`

Similar ao `keyBy()`, mas reconhecendo que podem ocorrer múltiplas instâncias de uma chave selecionada. Desta forma, ao final ta operação, é gerado um objeto do tipo `Record<string, X[]>`.

Um ponto interessante do `groupBy()` é que os ganhos de clareza do código são grandes. A versão imperativa de um _groupBy_ é um código de volume considerável e leitura pesada.

```
X[] --> { string: X[] }
```

### `{}.toPairs()` e `[].fromPairs()`

Estas funções agora possuem suas versões na biblioteca JS: `Object.entries()` e `Object.fromEntries()`, que devem ser utilizadas ao invés das versões Lodash.

Classicamente no JS, pra iterar em um objeto você poderia utilizar `Object.keys()` ou `for .. in` (*). A vantagem do uso do _pairs_ é a sintaxe mais sucinta, e também que você passa a contar com os métodos de arrays (`.map`, `.filter`, etc).

### `[].sortBy(...)`

Geralmente a função `.sort()` padrão do JS necessita que escrevamos uma função de comparação de pelo menos umas 3 linhas para ser usada em coleções. Do MDN:

> The sort() method sorts the elements of an array in place and returns the reference to the same array, now sorted. The default sort order is ascending, built upon converting the elements into strings, then comparing their sequences of UTF-16 code units values.

Já com o `sortBy` podemos simplesmente passar uma chave, além de esta operação não ser feita _in-place_ (ela não muta o objeto de origem).


### `[].uniq(...)`

### `[].isEqual(...)`

Comparação _deep_ entre objetos.

### `[].difference(...)` e `[].intersection()`

Operação entre conjuntos, usada - por exemplo - pra determinar novos itens ou itens excluídos.

### Métodos de array JS

Os métodos de array são o feijão com arroz da programação (semi)funcional de JS e intercalam bem com os helpers do Lodash. Em um passado remoto eles não faziam parte do JS e tínhamos que usar versões externas (como as do Lodash).

  - `[].find()`
  - `[].map()`
  - `[].filter()`
  - `[].reduce()`
  - `[].flat()`
  - `[].flatMap()`
  - `[].some()`
  - `[].every()`
  - ...

## Além do uso de funções

O conhecimento de padrões funcionais me facilita na leitura de codebases imperativas. Por exemplo, identifico blocos de código que agem como funções...

  - "Essas 30 linhas são um `.map`"
  - "Essas outras 30 linhas são um `.reduce`"


## "You may not need Lodash"

Algumas críticas comuns ao uso do Lodash:

 - Algumas de suas funções podem ser implementadas de forma próxima por códigos curtos (ex: one-liners);
 - As implementações podem ser mais complexas e menos performáticas do que se imagina, devido ao tratamento de _edge cases_;
 - Os módulos do Lodash não se dão (ou não se davam bem) com _code-splitting_, gerando bundles maiores do que o necessário. Em determinada época era necessário um plugin para Webpack pra otimizar o tamanho do bundle, não sei como está hoje;
 - O Lodash "base" não é totalmente orientado a programação funcional, ao contrário de alternativas como o Ramda;
 - O código escrito usando helpers pode ser menos performático;

Em geral o que acho importante aqui é perceber como os padrões de programação imperativa aos quais estamos acostumados são blocos bem repetitivos que podem ser extraídos em funções menores, independentemente de como isto for feito.