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

### TODO

  - Prosseguindo a implementação de wikilinks, seguirá a implementação de _referências inversas_ (backlinks), que nos permite caminhar pelo _grafo de informações_ pelo caminho inverso;
  - Poderemos também construír uma lista de _links órfãos_, sinalizando assuntos pendentes pra escrever;


## Tags

  - Inspirado no que pode ser feito no Notion, uma tag pode ser definida como uma mera referência a uma página existente; Para definir uma tag, basta criar um página, a exemplo de [[Tag: Blog release notes]] e [[Tag: Notas permanentes]];
  - A listagem de itens marcados por uma tag é realizada a partir de backlinks;