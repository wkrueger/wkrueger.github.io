# Resumo do resumo: Data Fetching in React

> yet another React post...

Resumo do vídeo [Data Fetching in React](https://www.youtube.com/watch?v=Ao8F3FypsbI), do [Theo Browne](https://twitter.com/t3dotgg). Thanks Theo.

> O artigo é um misto de afirmações minhas e do autor do vídeo. Não assuma antes de checar.

## Prólogo: Coisas das quais não vamos falar

- Se você deseja simplesmente buscar dados sem muita preocupação, e pricipalmente evitando dezenas de futuras armadilhas, use o [Tanstack Query](https://tanstack.com/query/v4/docs/overview);
- [useSWR (da Vercel)](https://swr.vercel.app/) é uma segunda alternativa, porém menos completa e não muito menor em tamanho;

> Nestas bibliotecas, para cada consulta você fornece um _identificador único_, que serve como base para múltiplos recursos como a deduplicação de múltiplas chamadas para a mesma API, cache, etc.
> 
> Estas libs abstraem o tratamento de estados de uma solicitação assíncrona (pendente, erro, pronto), possuem auxiliadores para paginação, atualizam dados automaticamente em mutações; e tratam os dados como vivos, fazendo polling para atualizações. Dentre outros.

- `fetch` é considerado um recurso de baixo nível. Geralmente você não deve precisar usá-lo pois este já estará sendo abstraído pelo (ex.) React Query.
> ... mesmo que surja um caso onde você diretamente chame o fetch, isto acontecerá em um wrapper criado por você, nunca diretamente de um `useEffect`;

- Existem absolutamente _zero_ motivos pra usar Axios. É tipo usar jQuery em 2022.

## Anatomia do carregamento de uma SPA

![[Pasted image 20220730143025.png]]

1. <span style={{color:"red"}}>x</span> Página completamente em branco até ser recebido o HTML inicial;
2. <span style={{color:"yellow"}}>x</span> Navegador recebe um HTML mínimo, com instruções pra carregar a aplicação;
3. <span style={{color:"yellow"}}>x</span> O ~~buraco negro~~ _bundle_ é baixado e carregado. O React inicializa e monta na tela os componentes raiz em estado de carregamento, o "esqueleto 2". Os componentes realizam requisições;
4. <span style={{color:"yellow"}}>x</span> Completadas as requisições, novos componentes filhos são exibidos. Alguns deles também precisam de mais dados, e então realizam novas requisições;
5. <span style={{color:"green"}}>x</span> A página está completa quando todos os filhos tiverem completados suas requisições;

![[Pasted image 20220731070055.png]]


![[Pasted image 20220730144939.png]]

## O problema de carregamento em cascata

Quando um componente filho é responsável por carregar seus próprios dados, este processo só será iniciado após a criação do componente filho. O que dependerá do carregamento prévio dos componentes pai.

```ini
[componente pai]
getUserInfo() --> { followedChannels: [1, 2] }

[componente filho 1]   [componente filho 2]
getChannel(1)          getChannel(2)
```

Podemos mover o carregamento dos dados filhos para o componente pai, o que não necessariamente resolve o problema. Só vai haver uma melhora se evitarmos uma viagem extra ao servidor.
```ini
NÃO RESOLVE:
[componente pai]
getUserInfo()  --> { followedChannels: [1, 2] }
getChannel(1)    getChannel(2)

RESOLVE:
[componente pai]
getUserInfo()  --> { followedChannels: [{ ... }, { ... }] }
```

O carregamento em cascata é um _tradeoff_ entre simplicidade e performance. É mais _simples_ escrever um componente que cuide de seus próprios dados e não possua dependência externa, pois este estará mais isolado. **Para se evitar a cascata, você tem que mover partes do carregamento de dados para cima, e para o servidor.**

Ao mover a busca de dados de um componente para fora dele, quebra-se seu isolamento e agora temos que cuidar deste componente em 2 lugares separados no código.

**Relay:** O _Relay_ é uma das poucas bibliotecas que se propõe a abstrair o problema de "mover o carregamento de dados pra cima e para o servidor". O Theo tem uma opinião mista sobre o Relay. Diz ele que é bem complexa, o que dá margem pra pessoas a usando errado. E possui relativamente pouco uso na comunidade. Eu ainda não peguei para testar.


## Carregamento via SSR (Next.js)

Falamos anteriormente em mover o carregamento de dados para cima e para o servidor. Em uma SPA, isto significaria ter uma API que inicialmente já trouxesse os dados necessários em apenas uma viagem. No caso do Next.js (com SSR), isto pode também ser feito movendo o carregamento para a função `getStaticProps()`.

Suponhamos que temos um código que realiza múltiplas requisições à API para montarmos um estado completo:

```tsx
const currentUser = await getCurrentUser()
const onlineChannelsInfo = await Promise.allSettled(
  currentUser.onlineFollowedChannels.map(id => getChannelInfo(id)
)
```

O código acima faria sentido tanto em uma seção de JS do browser quanto no `getStaticProps()`. Só que no caso do SSR estes dados carregariam mais rapidamente, primeiro porque as requisições não aguardariam o carregamento da página para serem iniciadas, e segundo porque teriam uma latência menor para a API.


### Tempos de carregamento

![[Pasted image 20220731070904.png]]

Como o HTML inicial da página depende do carregamento dos dados no lado do servidor, uma página usando SSR ficará mais tempo parada em branco do que uma página usando "SPA". Por outro lado, a primeira leva de dados já virá mais completa, teremos menos tempo de "spinners"*, e a página ficará pronta em menos tempo.

Vantagens:
 - Carregamento total da página ocorre antes;
 - Não é necessário alterar a API (no caso de REST);

Desvantagens:
- O servidor não é mais estático;
- "Time to first paint" maior;
- Lógica do componente continua quebrada em 2 partes do código, da mesma forma como no caso de "levantar o carregamento" de SPA;
- Toda lógica de carregamento de SSR concentrada em um lugar só (`getStaticProps()`);

## SSR + sublayouts (Remix)

![[Pasted image 20220731071806.png]]

Na arquitetura do Remix é possível dividir a página em sublayouts. Cada sublayout possui uma "URL" que identifica seu conteúdo (alguma semelhança com os identificadores do React Query mencionados antes?). E cada sublayout possui sua função para carregamento de dados no lado do servidor,.

Uma vantagem clara aqui é a maior modularização do código de carregamento. Você não precisa mover **todo** o código de carregamento pra uma função única, função esta que possuiria braços de lógica à medida que atendemos a diferentes layouts. O framework abstrai de você o carregamento de blocos menores e permite um isolamento mais fácil do código.

Mesmo no Remix não temos isolamento a nível de componente (como em SPA/Relay), mas sim a nível de sublayout. Já é melhor.

![[Pasted image 20220731072532.png]]
O Theo afirma que o Remix permite a parelelização do carregamento de dados. Fico com um pé atrás aqui, pois se os dados possuem dependências entre si*, não tem como 100% paralelizar, no máximo a mesma informação será carregada várias vezes.

> (\*) A disposição de dados é a verdade indivisível e incontestável.

Vemos aqui que continuamos com um problema do SSR: o tempo maior de página em branco até o recebimento do HTML inicial.

## Streaming / server components

No momento da escrita deste texto, esta é uma tecnologia ainda em desenvolvimento. Ainda estamos no aguardo de uma implementação estável.

No "streaming", um componente React rodando no servidor pode disparar diversos pacotes de dados para o cliente com atualizações de conteúdo;

![[Pasted image 20220731074622.png]]

Em prática, isto significaria que teríamos os benefícios do carregamento de dados no lado do servidor (menor latência, etc), mas sem o _downside_ do tempo grande até o primeiro gráfico para o usuário, combinando benefícios de SPA e SSR.

O servidor mandaria o mais cedo possível uma página vazia para o cliente, continuaria carregando os dados, e então mandaria posteriormente a página completa.

## Comparativo final

![[Pasted image 20220731075712.png]]

- **SPA**
	- Primeiro gráfico é exibido antes;
	- Carregamento final demora mais, devido a esperas e à latência de múltiplas requisições;
- **Cascatas**
	- É mais fácil escrever componentes que cuidam das suas próprias requisições de dados. No entanto, isso torna os carregamentos de página mais lentos;
	- Apenas reduzindo o número de viagens ao servidor temos uma redução efetiva do tempo de carregamento adicional produzido por cascatas;
- **SSR (Next.js)**
	- O carregamento total da página é mais rápido;
	- O gráfico inicial demora mais, pois este precisa aguardar o carregamento de dados no servidor;
	- Todos os dados que queiramos carregar via SSR têm que ser concentrados em uma unica função para a página toda;
- **SSR + Sublayouts (Remix)**
	- Código de carregamento de dados modularizado para cada sublayout;
	- Ainda temos o problema de primeiro gráfico lento do SSR;
- **React Streaming**
	- Componente montado no servidor pode emitir múltiplas atualizações para o cliente;
	- Permite que tenhamos uma página de carregamento exibida antes, mantendo o carregamento de dados no servidor.
	- Busca unir as vantagens do SSR e do SPA.