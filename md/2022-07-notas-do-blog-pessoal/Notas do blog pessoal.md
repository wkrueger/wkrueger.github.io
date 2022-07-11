# Notas do blog pessoal

## Requisitos
- Escrever textos em markdown
- Preferencialmente usando arquivos, sobre um controle de versão
- Facilmente inserir imagens
- Publicar no commit

### Requisitos mais avançados
 - Suportar uma estrutura já existente de textos escritos
 - Suportar wikilinks
 - Exibir backlinks
 - Permitir leitura também pelo github
 - Syntax highlighting
 - Publicação e sincronização em plataformas externas via API

Em geral acho o github muito bonito para leitura. Porém se o texto incluir wikilinks, ele precisa de processamento pra poder ser diretamente lido pelo Github. Se o site ficar bonito, então o Github não é lá importante.

Pra edição de arquivos .md temos Obsidian, VSCode, Typora... Cada um deles tem seus quirks em relação a edição de blocos de código, inserção de imagens e navegação.

A algum tempo eu já vinha acumulando alguns artigos (blogs ou peças maiores) em .md para talvez num futuro publicar em um site local. Alguns foram publicados no dev.to e no gitbook. Ao publicar no dev.to e ficar editando lá, o artigo acaba dessincronizando.

# Implementação

A idéia é converter o markdown em HTML usando um gerador estático. Vamos de next.js pela familiaridade.

No lado do CSS, vamos de Chakra. É algo com que ainda estou me familiarizando mas em geral é um software com que "fui com a cara" [[Atributos de um software que me fazem ir com a sua cara | (adiciona wikilink pra futuramente escrever o que me faz ir com a cara de um software)]].

## Estrutura pré-existente

 - Pasta `md` dentro do `wkrueger.github.io`. Cada post gera uma subpasta com ano, mês e slug. A subpasta vai possuir um arquivo `.md` e pode possuir imagens e rascunhos;
 - Além da estrutura de posts de blog, isso talvez possa expandir pra outras pastas com conjuntos de documentos;
 - Além do conteúdo no `github.io`, tenho outras coisas postadas em outros repositórios de GitBook, que mais adiante poderiam ser integradas;