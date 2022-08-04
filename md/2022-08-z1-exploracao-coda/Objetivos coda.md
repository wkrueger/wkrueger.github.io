# Exploração em 1h - Avaliação do Coda como base de documentos do projeto

# Estado existente

 - Base de documentos no google docs

**Dores**
 - Formato WYSWYG ruim de navegar, especialmente em documentos grandes
 - Maioria dos documentos seguem modelos bem definidos ex:
	 - Descrição textual da regra de negócio
	 - Campos
	 - Cenários
	 - Mocks

# Pricing

- A versão gratuita do coda dá acesso livre a usos em time. A limitação fica no tamanho dos documentos;
	- A documento vai ficar tão grande a ponto de chegar à limitação? Pode dividir?

# Conceitos principais

- Knowledge base com documentos que podem ter elementos personalizados
- Boa navegação. Links, outline.
![[Pasted image 20220804095340.png]]

## Tabelas, tabelas

- A tabela torna o Coda uma espécie de Excel embutido em um documento de texto
- Colunas podem ter valores de listas. Células podem incluir Rich Text
- Colunas podem ser agrupadas na visualização, para visualizações de 1-N etc;
![[Pasted image 20220804100232.png]]
- Tabelas podem ser "views" de uma tabela fonte, exibindo um conjunto diferente de colunas etc;
- Dados alterados em views são sincronizados com a tabela fonte (duh);
- Tabelas são fonte pra todo tipo de fancy visualizações. Cartões, master detail...

![[Pasted image 20220804102211.png]]

# Modelos

Desenhar a base do documento requer algum conhecimento e trabalho. Um documento base com a estrutura de dados pode ser publicado como um Modelo.

# Outros recursos (fora do escopo)

 - Integrações com serviços e bases de dados externas;
 - Podem ser construídas uma gama de views gerenciais comuns como Kanbans, gráfico Gantt;
 - Formulários publicáveis;

# The big problems

- Migrar documentos já existentes;
- Importação direta do GDocs funciona mal. Doc fica ruim de navegar (espaços sobram, imagens não carregam), app fica travando (muitas tabelas). Tem que ser feita manualmente ou arrumada outra forma...