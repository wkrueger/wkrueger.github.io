# Typescript: Aumentando a cobertura de tipos com menos anotações

[[Tag: Typescript]]

Devido à propria natureza de um sistema de tipos, você pode escrever o código de formas que auxiliem o TS a inferir mais tipos com menos anotações.

## Beabá da inferência

- Uma variável só pode ter um tipo durante toda a sua vida (contrariando a natureza dinâmica do javascript);
- Na declaração de uma variável, se o seu tipo não for explicitamente especificado por uma anotação de tipo, ele será inferido a partir da inicialização da variável.

```ts
var a; //any
var b = 3; //number

function x() {
  // () => number
  return 3;
}
```

## Inferência um pouco mais avançada

Funções com generics podem gerar um tipo de saída que varia de acordo com
o seu tipo de entrada.

```ts
function insideArray<T>(i: T) {
  return [i];
}
insideArray(1); //number[]
insideArray("a"); //string[]
```

## Reduzindo o uso de padrões mutáveis

Mutável é quando uma mesma variável assume diferentes valores dentro de uma execução - isso incluindo um estado inicial nulo. Enquanto no caso "imutável", compomos um objeto final a partir de funções e de outras variáveis.

O código mutável é mais difícil de ler e mais fácil de errar, além disso ele necessita de mais anotações pra ser efetivamente tipado.

Em um nível mais baixo sempre necessitaremos de algoritmos mutáveis, porém muitas vezes esses podem ser abstraídos em funções puras, assim isolamos o código perigoso no seu canto.

O contrário de mutável é o imutável e funcional. Uma tranformação feita de forma imutável cria uma cópia do objeto original, sem alterá-lo. A característica marcante de código funcional (sem side-effects) é que você pode facilmente aplicar um modelo de "caixa-preta" em uma transformação. Só de ler a assinatura da função eu sei que entra X e sai Y, não preciso ficar revisando todas as linhas da implementação pra ver se no meio do caminho ela não faz um this.a = Z.

**Side-effect:** Quando uma função altera alguma variável ou recebe alguma infomração de fora de sua "caixa preta", geralmente isto pode ser chamado de um "side-effect". Por exemplo, se uma função lê dados de um banco de dados, além do argumento da função, há uma segunda fonte de informação "extra" vindo do banco de dados.

Quando for necessário o uso de mutações, que estas estejam concentradas em um único local ou isoladas em funções puras, ao menos minimiza o perigo.

## Identificando transformações de dados comuns

Eu mudei bastante meu fluxo de pensamento na época em que estudei a biblioteca underscore (hoje, lodash). Códigos de mapeamentos de dados geralmente podem ser decompostos em transformações comuns, tão comuns que abstraídas em funções.

Exemplos:

### map

Se entra um array de dimensão X, e sai um array de mesma dimensão, então a transformação pode ser representada por um map. Se eu ler um `forEach` em um código, eu sei que vai haver algum _side effect_ ali, caso contrário ele poderia ser representado com um map.

```ts
var input: Input[] = [a, b, c];
var output: Output[] = [];

for (let x = 0; x < input.length; x++) {
  output.push({ 1: input.x, 2: input.y + input.z });
}
```

```ts
var input: Input[] = [a, b, c];
const output = input.map(item => ({ 1: input.x, 2: input.y + input.z }));
```

Observe que no segundo exemplo não precisamos anotar o tipo de `output`, pois ele já inferido a partir da transformação do tipo de `input`.

### Outras transformações imutáveis comuns

- omit (remover chaves de um objeto imutavelmente)
- flatMap: `T[][] => T[]` (unir arrays)
- keyBy: `T[] => Record<string,T>` (indexar coleções por id/chave)
- values: `Record<string, T> => T[]`
- concat: `[...a, ...b]` (unir arrays)
- assign: `{...a, ...b}` (unir objetos ou adicionar propriedades)
- await: `Promise<T> => T`
- Promise.all: `Promise<T>[] => Promise<T[]>`

**Reduce?** Dificilmente você ganhará muito escrevendo `reduce` (depende do caso claro), tanto no aspecto de performance e até mesmo na legibilidade, porque ele é uma operação muito genérica, praticamente no nível onde é melhor escrever imperativamente. Também é tão chato de tipar quanto um _for_ imperativo. O reduce não abstrai nenhuma transformação de dados definida, ele é quase apenas um "for" disfarçado.

### Uso de `const`

A regra [_prefer-const_](https://eslint.org/docs/rules/prefer-const) do eslint sumariza bem porque devemos estar atentos a usar o const sempre que possível. A leitura de um `let` ou `var` deve sinalizar o leitor de que aquela variável será mutada, questão de etiqueta de código. Eu adoro escrever `let` por ter uma letra a menos, mas melhor é ser educado.

## Construindo objetos em um passo único

Antes:

```ts
function getX() {
  var x = {}; //{}
  x.a = getA(); //vai dar erro, vai ter q anotar x com any
  x.b = { b: Symbol() };
  return x;
}
var response = getX(); //any :/
```

Depois:

```ts
function getX() {
  const a = getA();
  const b = { b: Symbol() };
  const c = { d: 1, e: 2 };
  return { a, b, ...c };
}
const response = getX(); // vai montar o tipo corretamente
```

Pra construir objetos "de uma vez", geralmente você terá que declarar algumas variáveis a mais. Porém, você pode reduzir a verbosidade ao declará-las com o mesmo nome da propriedade que deseja setar. Notar que _object spread_ `{...x}` e _array spread_ `[...x]` são também tranformações de dados comuns que já trazem o tipo correto ao resultado.

## Usando _class properties_

Em alguns casos, você pode mover variáveis inicializadas dentro de um construtor para uma inicialização
de propriedade, que poupa uma anotação de tipo.

Antes

```ts
class ShapeContainer {

  shapes: Shape[]

  constructor(data: Something) {
    this.shapes = data.getShapes()
  }

}
```

Depois

```ts
class ShapeContainer {

  constructor(private data: Something) {}

  shapes = this.data.getShapes()
}
```