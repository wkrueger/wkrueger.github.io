# Resumo do resumo: Data Fetching in React

> yet another React post...

Resumo do vídeo [Data Fetching in React](https://www.youtube.com/watch?v=Ao8F3FypsbI), do [Theo Browne](https://twitter.com/t3dotgg). Thanks Theo.

> O artigo é um misto de afirmações minhas e do autor do vídeo. Não assuma antes de checar.

## Prólogo: Coisas das quais não vamos falar

- Se você deseja simplesmente buscar dados sem muita preocupação, e pricipalmente evitando dezenas de futuras armadinhas, use o [Tanstack Query](https://tanstack.com/query/v4/docs/overview);
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

![[Pasted image 20220730144939.png]]

## O problema de carregamento em cascata

Quando um componente filho é responsável por carregar seus próprios dados, este processo só será iniciado após a criação do componente filho. O que dependerá do carregamento prévio dos componentes pai.

```
Pai:
getUserInfo() --> { followedChannels: [1, 2] }

Filho1:                Filho2:
getChannel(1)          getChannel(2)
```

Podemos mover o carregamento dos dados filhos para o componente pai, o que não necessariamente resolve o problema. Só vai haver uma melhora se evitarmos uma viagem extra ao servidor.
```
NÃO RESOLVE:
getUserInfo()  --> { followedChannels: [1, 2] }
getChannel(1)    getChannel(2)

RESOLVE:
getUserInfo()  --> { followedChannels: [{ ... }, { ... }] }
```

O carregamento em cascata é um _tradeoff_ entre simplicidade e performance. É mais _simples_ escrever um componente que cuide de seus próprios dados e não possua dependência externa, pois este estará mais isolado. Para você evitar o carregamento em cascata, você tem que mover partes do carregamento de dados para cima, e para o servidor.

**Relay:** O _Relay_ é uma das poucas bibliotecas que se propõe a abstrair o problema de "mover o carregamento de dados pra cima e para o servidor". O Theo tem uma opinião mista sobre o Relay. Diz ele que é bem complexa, o que dá margem pra pessoas a usando errado. E possui relativamente pouco uso na comunidade. Eu ainda não peguei para testar.

