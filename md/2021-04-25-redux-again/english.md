A quick review on why you should use Redux in your React applications and how.

Alguns anos se passaram, o Typescript se popularizou e o Redux tornou-se de uso mais palatável com a introdução do `redux-toolkit`. O intuito aqui é passar uma revisão (/opinião) de porque o Redux é necessário e como usá-lo, além de passar pontos geralmente ausentes em outros guias.

**Sobre o alvo**

Embora eu passe conceitos introdutórios, não vou entrar muito neles, pois não pretendo me estender muito. A leitura pode ser complementada com a consulta na documentação do _redux_, _react-redux_ e _redux-toolkit_.


# Como os dados trafegam entre componentes?

A divisão da interface de usuário em componentes implica a necessidade de tráfego de informação entre estes. Existem 2 principais formas de tráfego de dados.

## Props

![Props dataflow](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/otufw2zleqowo3f6858h.png)

Props são portas de entrada (e saída) de dados de um componente.

O fluxo ocorre entre um componente e seu pai direto. Para que um componente acesse estado presente em um pai indireto (o pai do pai) via props, o dado tem que trafegar pelo componente intermediário. É como se fosse uma autoestrada passando no meio de uma cidade.

Abaixo exemplos em código representando a imagem acima:

React:
```tsx
function ComponentWithState() {
  const [productInfo, setProductInfo] = useState('Product')
  return <Intermediary 
    productInfo={productInfo}
    productInfoChange={ev => setProductInfo(ev.target.value)}
  />
}

function Intermediary({ productInfo, productInfoChange }) {
  return <ChildDesiresData
    productInfo={productInfo}
    productInfoChange={productInfoChange}
  />
}

function ChildDesiresData({ productInfo, productInfoChange}) {
  return <input
    type="text"
    value={productInfo}
    onChange={productInfoChange}
  />
}
```

## Injeção de dependências / estado contextual

![DI Dataflow](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/11nhkvy8yjbua0fmtjwb.png)

A comunicação entre o dono do estado e o consumidor é realizada por intermédio de um "portal de dados" (termo livre). Com isso, o dado não precisa trafegar em componentes intermediários.

  - O filho, consumidor, se registra para receber dados do "Portal";
  - O detentor do estado se registra para fornecer dados ao "Portal";


No React este "portal" é representado pelo tipo `Context`. O portal de entrada é o `context.Provider`, o portal de saída é o hook `useContext()` (ou o componente `context.Consumer`).

```tsx
const thePortal = createContext(null)

function ComponentWithState() {
  const [productInfo, setProductInfo] = useState('Product')
  const payload = {
    productInfo,
    productInfoChange: ev => setProductInfo(ev.target.value)
  }
  // entrada -->
  return <thePortal.Provider value={payload}>
    <Intermediary />
  </thePortal>;
}

function Intermediary() {
  return <div>
    <p>I am intermediary.</p>
    <ChildDesiresData/>
  </div>
}

function ChildDesiresData() {
  // saída <--
  const { productInfo, productInfoChange } = useContext(thePortal)
  return <input
    type="text"
    value={productInfo}
    onChange={productInfoChange}
  />
}
```


# Quando usar props ou estado contextual?

O caso de uso comum para **props** são **componentes reutilizáveis**. Componentes que possuirão múltiplas instâncias no documento.

  - Componentes do sistema de design. Ex: Botão, Bloco, Select, Tabela...
  - Componentes que serão repetidos em um loop. Ex: Card de Pessoa, Linha de Tabela;

Se o componente não é reutilizado, é interessante acessar os dados via contexto.

  - Digamos que temos um grande formulário de CRUD, que se colocado todo em um único componente, daria um arquivo com 3000 linhas;
  - De modo a separar as responsabilidades e organizar o desenvolvimento, esta grande formulário é dividido em muitos componentes menores, com poucas linhas, em múltiplos níveis de aninhamento;
  - Estes componentes filhos requisitam todos do mesmo componente "pai", que fica na raiz da estrutura. O pai guarda o estado do CRUD e controla suas modificações;
  - Um componente pode simultaneamente requisitar dados de diferentes "portais" DI.

![DI samples](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/62qehdz9gydu5222xplb.png)

É um erro comum usar-se mais Props do que deveria. Vamos enfatizar melhor, **se o componente não é reutilizável, ele deveria estar obtendo suas fontes via dado contextual**.

# Onde mora o estado de uma aplicação

O estado é atrelado a componentes. Posiciona-se o estado em um componente pai ou filho dependendo da visibilidade desejada.

  - Uma peça de estado é geralmente visível (*) aos componentes filho, privada aos componentes pais.

Embora próprio guia do React recomende que você "mova estado para cima", em determinados casos você quer que ele fique "embaixo". Posiciona-se o estado no componente filho quando não interessa ao componente pai saber de sua existência. É tipo como se fosse uma propriedade _private_.

Exemplo:

```tsx
function Host() {
  const [value] = useState(2)
  // ...
  return <Autocomplete 
    value={value}
    onChange={handleChange}
    queryOptions={...}
  />
}

function Autocomplete(
  props: { value, onChange, queryOptions: (...) => Promise<Option[]> }
) {
  const [inputText, setInputText] = useState('')
  const [currentOptions, setCurrentOptions] = useState([] as Option[])
  // controla internamente a lista de opções de acordo com os eventos
  // ...
  return <div>
    <InputText value={inputText} onChange={handleTextChange}/>
    <PopperList list={currentOptions}/>
  </div>
}
```

No exemplo acima

  - Não interessa ao pai de um componente de _Autocomplete_ saber do conteúdo que o usuário está digitando na caixa de texto (`inputText`, `currentOptions`). Interessa a ele apenas o id da opção selecionada;
  - Desta forma, o ID selecionado não é armazenado no estado do Autocomplete, mas entra via props; Já o valor da caixa de texto é armazenado como estado no autocomplete, tornando-se assim privado ao componente pai;

# Redux

É prática recomendada o uso do **Redux** para armazenar e trafegar dados contextuais (ao invés do `Context`). No Redux moderno, utilizamos a biblioteca `@reduxjs/tookit`, quer trás alguns padrões e facilidades.

**O que é, como funciona?**

A classe abaixo é um container de estado. Ela possui dados e funções (métodos) para a sua alteração;

```tsx
class StateContainer {
  // estado
  readonly addresses: Address[] = []
  // função
  addAddress(address: Address) { }
}

const instance = new StateContainer()
```

  - O Redux também é um container de estado como a classe acima; No exemplo abaixo temos um container redux com propriedades similares;


```tsx
const slice = createSlice({
  name: 'main',
  initialState: {
    // estado
    adresses: [] as Address[]
  },
  reducers: {
    // função
    addAddress(state, payload: Address) {
      state.addresses.push(payload) // immer
    },
  },
});

const store = configureStore({
  reducer: slice.reducer,
});
```

  - O isolamento do estado e de sua manipulação **fora** dos componentes auxilia na organização de código e escrita de testes;

  - As funções do container do Redux (`addAddress`) são invocadas via _passagem de mensagens_;

```tsx
// plain class - direct call
instance.addAddress(address)
// redux store - message passing
const action = slice.actions.addAddress(address) // { type: 'addAddress', payload: '...' }
store.dispatch(action);
```

  - A característica passagem de mensagens permite a adição de `middlewares` a chamadas de função, (["chain of responsability"](https://refactoring.guru/design-patterns/chain-of-responsibility));
  - Funções do redux (reducers) não podem fazer mutações no estado anterior. Retorna-se um novo objeto imutavelmente criado a partir do estado anterior; Isso segue a necessidade do React de termos alterações de estado imutáveis (dentre outras razões);
  - O `redux-toolkit` embute a biblioteca [_immer_](https://github.com/immerjs/immer) em suas APIs de reducer. O immer "cria o próximo estado imutável a partir da mutação do atual". Se você retornar `undefined` em um reducer, o _tookit_ entenderá que você quer usar o immer. Neste caso, você pode fazer mutações à vontade, apenas _não retorne nada_ no reducer.

## react-redux

É a biblioteca que integra o Redux ao React (duh);

Principais APIs:

  - `<Provider store={store}>`

Passa a _store_ redux no "portal de entrada" do `react-redux`. Usado na raiz da aplicação. As demais APIs do `react-redux` exigem e consomem desse portal.

  - `useSelector(selector)`

Lê algo da store e passa para o componente. O parâmetro passado para a função é chamado de **seletor**.

Abaixo um caso de uso correto, e um errado:

```tsx
// exemplo correto
function Component() {
  const person = useSelector(storeState => storeState.card?.person)
  return <Person person={person} />
}

// uso errado
function Component() {
  const person = useSelector(storeState => storeState).card?.person
  return <Person person={person} />
}
```

O que muda do exemplo correto pro exemplo errado? Embora em ambos os casos os componentes recebam os dados desejados, no segundo caso o componente fará _re-render_ para _qualquer_ alteração da store. No primeiro caso, apenas quando o dado relevante for alterado.

A sacada aqui então é que o `useSelector()` permite melhorar a performance da aplicação reduzindo renders desnecessários.

Note que se meramente usássemos a API `Context` para trazer dados, como foi feito no exemplo lá em cima, teríamos um problema similar ao do "uso errado": Todos os consumidores do contexto dariam re-render para qualquer alteração do valor:

```tsx
// não ideal também!
function ChildDesiresData() {
  const { productInfo, productInfoChange } = useContext(thePortal)
  return <input
    type="text"
    value={productInfo}
    onChange={productInfoChange}
  />
}
```

O uso de `Context` sozinho não é performático, teríamos que implementar um mecanismo de seletores para torná-lo mais eficiente. O `react-redux` já trás isso.

  - `useDispatch()`

As funções do nosso container de estado são chamadas pelo `useDispatch`.

```tsx
function Component() {
  const dispatch = useDispatch()
  return <button onClick={() => dispatch(incrementAction())}>
}
```

## reselect

O `reselect` é utilizado para trabalharmos com "dados derivados". É uma biblioteca que faz composição de seletores, memoizando seus resultados.

```tsx
import { createSelector, useSelector } from '@reduxjs/toolkit'

const selectPerson = state => state.person;

function calculateHash(person) {
  // some complex calc...
}

const selectPersonHash = createSelector(
  [selectPerson],
  person => calculateHash(person)
)

function Component() {
  const personHash = useSelector(selectPersonHash)
}
```

No exemplo acima a função `calculateHash` é computacionalmente intensiva.

Quando `Component` renderiza, o `selectPersonHash` retorna uma versão memoizada do hash. O hash só é recalculado quando `person` muda.

Infelizmente não dá pra usar seletores memoizados pra retornar `Promises`, pois quando a `Promise` finaliza isto não ativará num novo render.

## Estado global

O Redux quer que você armazene o estado em uma única _store_  global. Você até pode criar múltiplas _stores_ e amarrá-las a componentes mas isto não é recomendado e deve ser usado apenas em casos raros.

![State Design](https://github.com/wkrueger/wkrueger.github.io/raw/master/md/2021-04-25-redux-again/state_design.svg)

Embora você tenha liberade para desenhar o seu estado como quiser, o Redux sugere que você o divida via _slices_. Na imagem acima temos um exemplo de uma estrutura de projeto e de seu estado global correspondente.

Embora as páginas (Person, Company...) só possam existir 1 por vez, na estrutura do Redux sugerida cada uma delas possui um _slot_ no objeto. Devemos prestar atenção para que o Redux limpe o estado das páginas não abertas, caso contrário teremos bugs;

Correto:
```json
{
  "personPage": { },
  "companyPage": null,
  "invoicePage": null,
  "productPage": null,
}
```
Errado:
```json
{
  "personPage": { },
  "companyPage": { },
  "invoicePage": { },
  "productPage": null,
}
```

Uma forma de atingirmos isso é pelo _hook_ `useEffect()`. Solicite a limpeza do _slice_  relacionado quando o componente for desmontado.

```tsx
function PersonPage() {
  const dispatch = useDispatch()
  const person = useSelector(state => state.personPage)
  useEffect(() => {
    dispatch(initPersonPage())
    return () => {
      dispatch(unmountPersonPage())
    }
  }, [])

  if (!person) return <Loading/>
  return <Something person={person}/>
}
```

## Construindo o estado

Existem infinitas maneiras de construirmos e manipularmos o estado no redux, e isto é um problema. Para que a comunidade siga um padrão e para que o desenvolvedor tenha um norte, o `@reduxjs/toolkit` expõe práticas recomendadas na forma de APIs.

![ah sht](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6eqof361lx626brv5qq8.png)

Aqui vai um bloco de código grande. Declaramos todo o esqueleto base de uma aplicação. Leia os comentários!

```tsx
import { configureStore, createSlice } from "@reduxjs/toolkit"
import { Provider, useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { BrowserRouter, Switch, Route } from 'react-router-dom'

/**
 * -- Person slice
 */

interface PersonPageState {}

/**
 * Criamos aqui um bloco de estado para a página "person".
 * Esta definição é encapsulada, não definimos ainda ONDE 
 * este estado vai morar. 
 */
const personPageSlice = createSlice({
  /**
   * este "nome" determina um prefixo a ser adicionado às
   * mensagens das ações.
   * Por ex: o reducer "init" vai gerar uma mensagem com nome 
   * "personPage/init"
   */
  name: "personPage",
  /**
   * deixamos claro que o estado inicial pode ser TAMBÉM nulo, 
   * pois a página pode não estar aberta, ou não estar
   * inicializada.
   * Mas não APENAS nulo. É necessário um cast para que o 
   * typescript entenda todas as possibilidades que esse estado
   * abriga.
   */
  initialState: null as null | PersonPageState,
  reducers: {
    init: (state) => {
      // do something...
      return {}
    },
    unmount: (state) => null,
  },
})

/**
 * -- Product slice
 */

interface ProductPageState {}

const productPageSlice = createSlice({
  name: "productPage",
  initialState: null as null | ProductPageState,
  reducers: {
    init: (state) => {
      // do something...
      return {}
    },
    unmount: (state) => null,
  },
})

/**
 * -- Building the store
 */

const store = configureStore({
  /**
   * aqui definimos onde cada "slice" declarado acima vai morar no
   * estado global
   */
  reducer: {
    personPage: personPageSlice.reducer,
    productPage: productPageSlice.reducer,
  },
  devTools: true,
})

/**
 * -- Wire up redux and TS.
 */

/** 
 * O TS inicialmente não sabe qual é o tipo da sua store. Abaixo segue
 * uma forma recomendada de informá-lo, presente na documentação do redux-toolkit.
 */

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch
const useAppDispatch = () => useDispatch<AppDispatch>()

declare module "react-redux" {
  // allow `useSelector` to recognize our app state
  interface DefaultRootState extends RootState {}
}

/**
 * --  Wire up react and redux
 */

function AppRoot() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Switch>
          <Route path="/person" component={PersonPage}></Route>
          <Route path="/product" component={ProductPage}></Route>
        </Switch>
      </Provider>
    </BrowserRouter>
  )
}

/**
 * -- Our☭ consumer component
 */

function PersonPage() {
  const dispatch = useAppDispatch()
  const person = useSelector((state) => state.personPage)
  useEffect(() => {
    dispatch(initPersonPage())
    return () => {
      dispatch(personPageSlice.actions.unmount())
    }
  }, [])

  if (!person) return <Loading />
  return <Something person={person} />
}

```

Conforme comentamos antes, cada _página_ da aplicação tem o seu estado isolado em um `createSlice`. Estes estados são então combinados na definição da _store_  redux, `configureStore`. Estes estados _podem ser nulos_, pois eles correspondem a instâncias de páginas que podem não existir no momento!

Algumas práticas também são recomendadas para que o typescript possa entender melhor o seu estado e assim realizar melhores validações.

## Operações assíncronas

As funções de atualização de estado (reducers) presentes no redux são todas _síncronas_. Existem inúmeras opiniões de como tratar operações assíncronas no redux (por exemplo: _thunks_ ou _sagas_). O `redux-toolkit` sugere o uso do `createAsyncThunk`. Esta escolha não foi tomada levianamente, então vamos seguí-la!

Uma _store_ redux, por padrão, apenas aceita mensagens na forma de um objeto `{ type: string, payload: any }`. O `redux-tookit` adiciona a opção de passarmos um thunk, que é uma espécie de função iteradora como a abaixo:

```ts
const aThunk = async (dispatch, getState) => {
  const data = await readSomething()
  dispatch(syncAction({ data }))
}
```

Porém, como existem mil formas de tratar erros, o simples uso de um _thunk_ acaba sendo uma opção muito "solta", muito baixo nível. Desta forma, é recomendado o uso do `createAsyncThunk`, o qual:

  - Isola a regra de negócio das regras de tratamento de `Promise`;
  - Deixa explícito que temos que tratar as alterações de estado da `Promise` (`'idle' | 'pending' | 'succeeded' | 'failed'`);

Replicarei aqui parte da [documentação do `createAsyncThunk`](https://redux-toolkit.js.org/api/createAsyncThunk). O uso básico dele é assim:

```tsx
const fetchUserById = createAsyncThunk(
  'users/fetchById',
  // if you type your function argument here
  async (userId: number) => {
    const response = await fetch(`https://reqres.in/api/users/${userId}`)
    return (await response.json()) as Returned
  }
)

interface UsersState {
  entities: []
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState = {
  entities: [],
  loading: 'idle',
} as UsersState

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // fill in primary logic here
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserById.pending, (state, action) => {
      // both `state` and `action` are now correctly typed
      // based on the slice state and the `pending` action creator
    })
  },
})
```

No _asyncThunk_ apenas tratamos de regra de negócio. No _extraReducers_ pegamos o dado de resposta (ou o erro) e determinamos onde que ele vai ficar no estado.