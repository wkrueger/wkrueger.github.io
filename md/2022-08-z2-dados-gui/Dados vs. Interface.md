# Dados vs. Interface Gráfica

Uma interface gráfica é um remapeamento de uma estrutura de dados de origem.

![[Pasted image 20220804222213.png]]

Nas frameworks modernas, os dados de origem estão atrelados a componentes. Um componente une dados e layout (HTML).

Uma das primeiras etapas na construção de uma interface de usuário é: determinar quais **dados de origem** esta interface está representando. Geralmente esses dados são vindos de uma API externa.

## Onde devem morar os dados

Quando temos um componente só, a escolha de onde os dados irão morar é óbvia. O mesmo componente armazenará todo o estado da aplicação e também todo o layout.

```ts
@Component({
  selector: "root",
  "template": `
    <form>
      <input type="text" name="nome" [(ngModel)]="nome" />
      ...
    </form>
  `
})
class Raiz {
  nome: string
  assinante: { id; nome; avatar }
  versoes: { id; nome; dataDeCriacao; arquivo }[]
}

```

Quando dividimos layouts em subcomponentes temos também que tratar da divisão dos dados, o que gera alguma complexidade adicional.

![[Pasted image 20220804223649.png]]

Ao dividirmos componentes temos que determinar onde deve morar o estado (os dados). No componente pai ou no filho? Qual é o escopo de cada componente?

Seguindo a imagem acima, exemplifico duas possíveis opções:

1: (imagem)
```
- Componente pai possui id de contrato
- Componente pai inicialmente obtêm os objetos completos Versao[]
- Versao[] é repassada ao componente filho
- Quando há uma alteração nos dados (ex: criada uma nova versão):
  - o componente filho SOLICITA ao pai a alteração dos dados;
  - o pai aprova a alteração, então os dados atualizados voltam pelo caminho de entrada do comp. filho;
- O componente pai é responsável em sincronizar os dados com o servidor (salvar CRUD)
```

2:
```
- Componente pai apenas sabe o id do contrato (number)
- Id do contrato é repassado ao componente filho
- Componente filho carrega os objetos completos das versões (Versao[])
  - Objetos completos Versao[] armazenados no componente filho
- Quando existem alterações nas versões, o componente filho se responsabiliza de:
  - Atualizar o seu estado interno Versao[]
  - Sincronizar essa informação com o servidor
```

No caso 1 o componente pai faz a gestão de todas as informações, e o componente filho tem menos responsabilidade, apenas se preocupando em exibir informações, mas não de buscá-las ou salvá-las.

No caso 2 o componente pai não sabe dos detalhes das versões. Diz-se que o estado "desceu".