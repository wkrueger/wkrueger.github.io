# Atualização do blog: Wikilinks e Tags

[[Tag: Blog release notes]]

## Sobre Wikilinks

  - [Documentação de Links da Wikipédia](https://en.wikipedia.org/wiki/Help:Link)
  - Escrever links com menos fricção, e usando linguagem natural (usando o próprio título da referência);
  - Um wikilink pode referenciar uma página que ainda não existe, indicando uma intenção de futuramente escrever um novo artigo expandindo sobre um assunto;

### Implementação
 
  - Substituição ingênua de strings;
  - Implementar lógica que relacione um texto de wikilink com um link acessível;
    - Usada busca fuzzy sobre títulos de artigos, de modo a permitir uma "margem de erro" na definição de links (escrever um conteúdo parecido com um título de artigo basta);
  - Posteriormente notado que ao invés de substituir strings não mão, talvez teria sido melhor usar um [plugin](https://github.com/landakram/remark-wiki-link) para o _remark_, o parser de markdown usado no projeto;
    - O plugin também permite implementação de "resolução de links" personalizada, além de uma implementação mais completa de links (como o uso de cores diferentes pra links existentes ou não);


## Tags

  - Inspirado no que pode ser feito no Notion, uma tag pode ser definida como uma mera referência a uma página existente; Para definir uma tag, basta criar um página, a exemplo de [[Tag: Blog release notes]];
  - A listagem de itens marcados por uma tag é realizada a partir de backlinks;


## (01/08/2022) Backlinks

**Definição**: Determinar, para cada página, todos os links no projeto que referenciam a esta;

Este é um caso de complexidade maior, pois agora toda página depende do projeto inteiro.

Devido a ordem das dependências, este se torna um forte candidato para uma informação a ser carregada apenas no lado do cliente. Mas mantive ela no servidor.

```
Página 1 com backlinks
  depende de
  Backlinks da página 1
    depende de
    Detalhe de todas as páginas
      depende de
      Listagem de páginas
  e de
  Detalhe da página 1
```

  - Inicialmente ingenuamente coloquei as páginas já carregadas em um cache na memória; Isto não adiantou, e todas as páginas foram carregadas umas 4 vezes;
  - Logando `process.pid` confirmamos a desconfiança de que build é paralelizada em vários subprocessos;

Entramos aqui em um problema de IPC. O cache tem que ser lido e salvo a partir de comunicação externa.

  - Uma idéia trabalhosa aqui seria lansar um processo de cache. Como esse processo se comunicaria? stdout? Socket?
  - Se o subprocesso for lançado a partir de um dos processos filhos, quando este filho terminar a build, o next chama um `process.exit()` nele, matando também o subprocesso;

Acabei seguindo por uma idéia talvez menos eficiente, que foi o uso de um banco SQLite para comunicação;

  - Segundo documentação, o SQLite lida com sincronização de vários clientes lendo e escrevendo no mesmo arquivo;
  - Um problema aqui é que pra aguardar a conclusão de tarefas temos que fazer polling no banco;

```ts
function tryCache(cacheKey, useCache) {
  if (useCache) {
    let foundCache = sqlQuery(...)
    if (!foundCache) {
      // este processo vai calcular o resultado desta chave
      sqlQuery(/* INSERT: set as pending */)
      return null
    } else {
      // outro processo já está calculando, aguardar
      if (foundCache.ready) return foundCache.data
      while (!foundCache.ready) {
        await wait()
        foundCache = sqlQuery(...)
      }
      return foundCache.data
    }
  } else {
    return null
  }
}
```

  - Um segundo problema aqui é que uma grande fatia do processamento vai ficar em um processo só (excluindo a parte de I/O que é abstraída pelo node); No fim das contas os outros processos do next vão só processar a geração final de HTML;