# Opiniões: VSCode + typescript

- Usar camelCase no nome dos arquivos (ao invés do mais padrão pra JS, o snake-case)

  - Motivação: Mantém o mesmo padrão de nomes de classes, facilita o uso de algumas operações
    de refactor (notavelmente, "extract to file")

- Não usar `index.ts` como nome de arquivo. Para o ponto de entrada de uma pasta, usar o mesmo nome da pasta ou seguir em linha similar.

  - **Porque se usaria `index.js` como nome?**
  - Isso é útil para se "abusar" do algoritmo de resolução
    de módulos. Digamos que um pequeno módulo `/Modulo1.ts` cresça de forma significativa, pode-se
    movê-lo para uma pasta `/Modulo1/index.ts` sem necessitar renomear dependentes;
  - Neste caso ainda podemos usar o `index` como um "router" intermediário pra conseguir a vantagem
    acima, mas desenvolveremos em outro arquivo pois o nome `index.ts` atrapalha a navegação no
    projeto. Teríamos 30 `index.js` no projeto, mesmo que o _fuzzy search_ e a interface também
    mostre nomes de pastas, não é a mesma coisa.

  - Evitar usar `export default`

    - Exports nomeados funcionam melhor com o recurso _auto imports_
    - No caso de _top-level_ exports em bibliotecas, adicionamos uma variável;adicional a se preocupar que são as diferenças de import entre o _commonjs_ e o _es6 modules_, que frequentemente incomodam com typescript.
    - Também evitar `export =` pois pode prejudicar tree-shaking. Preferir sempre exports nomeados.

  - Testes + node.js: A opção mais simples (não exatamente a mais correta?) é compilar o teste junto com a fonte, com o mesmo tsconfig - não usar outro contexto de compilação;
    - Isto é uma opção _safa_ e garantida. O teste é rodado sobre o js compilado, _test runners_ ainda se utilizam dos source maps se eles estiverem ativados;
    - Evita dores de cabeça de ter que lidar com 2 ambientes diferentes de compilação (1 pro código, outro pro teste.) Exemplo: ter que configurar "require paths" no jest, quando este já é feito em outro lugar (ex: webpack).
    - `node-tap` geralmente é a minha lib de preferência quando no lado servidor
      - menos mágica, sem variáveis globais injetadas, sem eventos mágicos como `beforeAll`, portanto mais previsível e transparente;
      - controle do assincronismo do seu teste (quais podem rodar em paralelo? quais possuem dependências?)
      - o script de teste roda diretamente via `node`, sem precisar passar por uma CLI
      - ...o que torna super simples rodar em modo debug
      - ainda pode-se usar a CLI `tap`, que adiciona o output moderno de teste (similar ao do jest) e exeuta cobertura;
