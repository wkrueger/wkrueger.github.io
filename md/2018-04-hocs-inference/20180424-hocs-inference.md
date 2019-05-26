# Lutando com HOCs e a inferência do typescript

>Nota: com o redux 4.x, muita coisa deve ter melhorado.

Trabalhar com HOCs no typescript pode ser uma luta. Às vezes realmente tem um erro no seu código, mas a mensagem de erro pode estar indicando pra outra coisa que não tem a ver com seu erro. Geralmente a mensagem de erro é bem críptica também.

Em outros casos pode ser que o erro é nas tipagens das libs de terceiros. Não dá pra confiar muito nelas, digamos que estas tipagens muitas vezes estão bem "frescas". Vamos lá, a inferência do TS não é algo muito bem documentado, quando fui procurar detalhes não achei não muito além dos guias superficiais. As definições de tipos facilmente podem se tornar bichos bem complexos. Os recursos mais poderosos (poderosos porém absurdamente essenciais) como mapped types e agora conditional types não possuem nem 1 ano de aniversário...

## O TS se perde com o compose

Uma coisa que bati bastante cabeça é o uso da função `compose` com HOCs. Ele se perde na inferência fácil e logo começa a brotar os tão temidos `{}`. Depois de bater alguma cabeça me conformei com uma forma "safe" de tratar o problema. Compõe os HOCs na mão mesmo.

```typescript
const composed = hoc1(hoc2(hoc3(Presentational)))
```

Eu imagino que seja sim possível criar uma função `compose` que funcione com HOCs, mas fica pra outro dia.

## Montar os tipos de cima pra baixo

Ok, digamos que estou escrevendo um componente de apresentação que vai passar por uns 3 HOCs, inclusive o complexo `connect`. Sugiro definir as props nos HOCs, e no presentation você só usa o que já foi definido nos HOCs.

```typescript
  const connectHoc = connect<A, B, C, D>( ... )
  const Presentation: T.FirstArg<typeof connectHoc> = props => {}
```

## Mais detalhes sobre a inferência de parâmetros de funções

Ok, digamos que eu quero especificar uma função cujo tipo de retorno dinâmico é função do tipo de entrada dinâmico. A primeira coisa que se faz é designar os argumentos a _type parameters_ .

```typescript
const yada = <A, B>(a: A, b: B): A|B => undefined as any
```

O TS vai permitir chamar essa função ou sem nenhum TP ou com 2 TPs. Ou é tudo ou é nada. Caso você passe zero TPs e o TS não conseguir inferir as parada, ele vai cagar tudo designando pra `{}`.

```typescript
yada(2, 's') // A vira number, B vira string
```

Caso você queira restringir alguns dos parâmetros de entrada, usa-se o `extends`, melhor lido como _is assignable to_.

```typescript
const yada = <
  A extends { [k: string]: Reducer },
  B
>(a: A, b: B) => ...
```

Isto é diferente de escrever:

```typescript
const yada = <B>(a: { [k: string]: Reducer }, b: B) => ...
```

O que muda? No caso 2, o tipo original de `a` é _apagado_. Se eu quiser usar uma informação específica dele pra construir um retorno (ex: _quais_ chaves ele possuía?), já era.

Digamos que eu queira explicitamente passar um _type argument_ C, como no exemplo abaixo, mas ainda continuar obtendo A e B por inferência. Isso não é possível. No exemplo abaixo, ou você passa os 3 TPs, ou C _sempre_ vai ficar com tipo `{}`.

```typescript
const yada = <
  A extends { [k: string]: Reducer<C> },
  B,
  C
>(a: A, b: B) => ...
```

O que dá pra fazer é quebrar em 2 funções:

```typescript
const yada = <C>() => <
  A extends { [k: string]: Reducer<C> },
  B
>(a: A, b: B) => ...

yada<MyType>()(a, b)
```

As funções internas possuem acesso aos _type parameters_ das funções acima. Afinal, se closures valem pra variávels, elas têm que valer pra seus tipos também.

**Exact types**

Tem uma função do _redutser_ que teria uma assinatura mais ou menos desse jeito:

```typescript
const yada = <
  A extends { [k in keyof B]?: Reducer<B[k]> },
  B
>(a: A, b: B) => ...
```

A intenção inicial é que `A` deveria possuir apenas chaves que existem em `B`. O código acima, no entanto não funciona assim, porque a cláusula `extends` faz algo um pouco diferente. Ali, o objeto passado em A aceita qualquer chave, só que se esta chave estiver presente em B, o valor deve seguir a regra. Se não estiver presente em B, aceita qualquer valor. Exemplo:

    se B for { x: X , y: Y }
    A pode ser { x: Reducer<X>, y: Reducer<Y> }
    A pode ser { y: Reducer<Y>, z: 'qualquercoisa' }
    A não pode ser { x: 'qualquercoisa' , y: Reducer<Y> }

Os gurus do SO me indicaram o uso de _exact types_ pra solucionar o problema. No flow existe uma sintaxe mais ou menos assim pra isso.

    {| x: number |}

No TS, com o uso de _conditional types_ o seguinte tipo apresenta funcionalidade similar. Não me pergunte como!

```typescript
export type Exactify<T, X extends T> = T &
  { [K in keyof X]: K extends keyof T ? X[K] : never }
```

No fim a solução fica como

```typescript
const yada = <
  A extends Exactify<{ [k in keyof B]?: Reducer<B[k]> }, A>,
  B
>(a: A, b: B) => ...
```
