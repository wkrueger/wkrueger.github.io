# Dores do React, pt 1 of... - A terceirização

O React de certa forma me lembra o Express (do node.js) com relação ao escopo da biblioteca. O React foca em uma parte importante, porém incompleta, de uma proposta de criação de interface de usuário. As partes faltantes são completadas por bibliotecas de terceiros ou sugeridas.

Um ponto positivo para essa abordagem é que a comunidade propôe novas e melhores formas de resolver os problemas de uma forma bem dinâmica.

Faço a comparação com o Express porque criar uma aplicação com uma escala e qualidade razoável a partir de apenas Express, e então ir adicionando as partes de terceiros uma a uma, é um tanto improdutivo. Usar um pacote mais integrado, a partir de uma framework bem desenvolvida (Rails, Laravel, Spring Boot, escolha a sua...) trás resultados mais consistentes e padronizados.

O desenvolvimento "terceirizado" também trás mais armadilhas e um caminho menos claro a um novo desenvolvedor. É especialmente fácil errar ou perder algum ponto essencial, quando este não faz parte do núcleo da ferramenta.

Um exemplo claro de um ponto essencial ausente no núcleo do React é a funcionalidade suprida pelo redux. O _react-redux_ faz -- de uma forma piorada -- , aquilo que os serviços do Angular fazem: providenciar estado contextual, de modo a evitarmos o "prop-drilling". 3 anos depois a comunidade já sabe que Redux é ruim, mas ainda não tem lá muita certeza do que utilizar para resolver o problema.

Na verdade o React passou anos sem mesmo ter uma API estável de injeção de dependências, um recurso absolutamente essencial. Mesmo a API atual de contexto é um tanto de baixo nível pra ser usada diretamente, servido mais como bloco de construção para soluções mais elaboradas.

E finalmente, temos as consequências de um ecossistema que "move rápido e quebra coisas". Cada projeto React de um ano diferente e de um gosto diferente usará libs diferentes para gestão de estado, CSS-in-JS, formulários, roteamento, build, etc. Talvez após alguns anos algumas dessas se tornem legados, ou tenham mudado radicalmente. Não é lá a coisa mais prazerosa de se fazer manutenção. Acabam se criando camadas extras de complexidade sobre algo que inicialmente teria a função de simplificar o desenvolvimento.

**Onde o Angular é melhor neste aspecto**

  - O Angular (2+) trás uma gestão de estado poderosa e simples de usar desde o dia 1; 
  - O Angular trás consigo um sistema de build mais completo do que o CRA, com uma forma clara de fazer code splitting. Existem pacotes de build melhores que o CRA? Sim. Mas o projeto que você pegar pra fazer manutenção vai estar usando o CRA;
  - O sistema de roteamento do Angular funciona bem. É estável. Integra com code splitting. Ele dá o caminho certo. Por outro lado, no projeto React que você pegar pra manter, você tem a chance de pegar 5 versões diferentes de react-router, e não vão ter descoberto o que é code splitting.
  - Apesar da framework estar em constante atualização, atualizações do Angular são, sem sombra de dúvidas, menos disruptivas do que atualização de umas das 50 libs de React em seu projeto. Ou do próprio React;
  - Nem tudo é perfeito no Angular. Ninguém é lá muito fã dos formulários reativos. E eles continuarão lá. Não que as pessoas tenham decidido, em 2021, como fazer formulários no React.