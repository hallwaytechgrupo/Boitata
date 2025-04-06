# Estrutura do Projeto e Convenção de nomenclatura

Este documento explica a organização da pasta `src/` do front-end, construído com Vite e React. Nossa estrutura foi pensada para ser simples, funcional e seguir boas práticas, facilitando o trabalho em equipe e a manutenção do código.


## Convenções de Nomenclatura
Adotamos algumas convenções para manter consistência no projeto, ambas foram explicadas pelo Arley, na aula de Desenvolvimento Web II:

- **Pastas**: Todas as pastas dentro de `src/` são nomeadas no **plural** e em **letras minúsculas** (ex.: `components`, `services`).  
  - **Por quê?**: O uso do plural reflete que essas pastas contêm múltiplos arquivos relacionados (ex.: vários componentes em `components`). Letras minúsculas seguem uma convenção amplamente adotada em projetos JavaScript/TypeScript para evitar problemas de case-sensitivity em sistemas de arquivos (como Linux) e manter uniformidade. Essa prática é recomendada em guias como o [JavaScript Style Guide da Airbnb](https://github.com/airbnb/javascript#naming--filename-matches-export), que sugere nomes consistentes e legíveis para pastas e arquivos.
  
- **Componentes**: Arquivos de componentes React começam com **letra maiúscula** (ex.: `Button.tsx`, `LineGraphModal.tsx`).  
  - **Por quê?**: Essa convenção é exigida pelo React para diferenciar componentes personalizados (que são funções ou classes) de elementos HTML nativos (como `<div>` ou `<span>`), que são minúsculos. Veja mais detalhes na [documentação oficial do React sobre componentes](https://react.dev/learn/your-first-component#naming-components).

---

## Sobre as pastas

Abaixo, o popósito de cada pasta dentro de `src/`:

### Estrutura de Pastas

```
src/
├───assets
├───components
├───contexts
├───services
├───styles
├───types
└───utils
```

### `assets` (já vem no vite)
- **Propósito**: Armazena arquivos estáticos que fazem parte da interface do usuário, como imagens, ícones, fontes ou outros recursos visuais.
- **Exemplo de uso**: Uma logo do projeto em `assets/logo.png` ou um ícone em `assets/icons/user.svg`.
- **Por que usamos?**: Mantemos esses arquivos separados do código para facilitar o acesso e organização, evitando misturá-los com a lógica da aplicação.

### `components`
- **Propósito**: Contém os componentes do React, que são os blocos de construção da nossa interface. Aqui ficam tanto os componentes reutilizáveis quanto os específicos.
- **Exemplo de uso**: Um botão genérico em `components/Button.tsx` ou um modal como `components/LineGraphModal.tsx`.
- **Por que usamos?**: Centralizar os componentes ajuda a reutilizar código e manter a interface consistente.

### `contexts`
- **Propósito**: Gerencia estados globais da aplicação usando a Context API do React. Serve para compartilhar informações entre diferentes partes do projeto sem passar props manualmente.
- **Exemplo de uso**: Um contexto de autenticação em `contexts/AuthContext.tsx` para saber se o usuário está logado.
- **Por que usamos?**: Facilita o controle de dados que várias telas ou componentes precisam acessar, como temas ou informações do usuário.

### `services`
- **Propósito**: Reúne a lógica de integração com serviços externos, como chamadas a APIs. É aqui que conectamos nosso front-end ao back-end ou a outros sistemas.
- **Exemplo de uso**: Uma função para buscar clientes em `services/clienteService.ts`, usando uma biblioteca como Axios.
- **Por que usamos?**: Separar a comunicação com a API do resto do código torna tudo mais organizado e fácil de testar ou ajustar.

Aqui está o trecho da documentação apenas para a pasta `styles`, adaptado para o uso de CSS-in-JS (como mostrado anteriormente por mim, presumindo que "Arley" seja eu mesmo, já que estou respondendo). Incluí a explicação sobre por que colocá-la em `src/` e não em `public/` ou na raiz, mantendo o tom formal e acessível do "SomosJuniors".


### `styles`
- **Propósito**: Armazena estilos globais, temas ou configurações relacionadas à aparência da aplicação, utilizando CSS-in-JS (como `styled-components`). Serve como um ponto central para definir estilos compartilhados que complementam os componentes.
- **Exemplo de uso**: Um tema em `styles/theme.ts` com cores e espaçamentos, ou estilos globais em `styles/globalStyles.ts` aplicados via `createGlobalStyle` do `styled-components`.
- **Por que usamos?**: Centralizar estilos globais melhora a manutenção e permite que os componentes em `components/` foquem em estilos locais, enquanto `styles/` cuida do que é compartilhado. O uso de CSS-in-JS nos dá flexibilidade para integrar lógica TypeScript com estilos, mantendo tudo no mesmo ecossistema.
- **Por que em `src/` e não em `public/` ou na raiz?**: 
  - Em `src/`, os arquivos são processados pelo Vite, permitindo integração com TypeScript e o bundler, o que é essencial para CSS-in-JS (ex.: importar temas em componentes). 
  - A pasta `public/` é reservada para arquivos estáticos não processados (como `favicon.ico`), que não passam pelo bundler e não suportam a dinâmica do CSS-in-JS. 
  - Colocar na raiz (fora de `src/`) quebraria a convenção do Vite, que espera o código fonte em `src/`, dificultando a organização e o acesso pelo time.


### `types`
- **Propósito**: Centraliza as definições de tipos do TypeScript, garantindo que os dados usados no projeto tenham uma estrutura clara e segura.
- **Exemplo de uso**: Uma interface como `types/focoDeCalor.types.ts` para descrever o formato de um Foco de Calor vindo da API.
- **Por que usamos?**: Isso nos ajuda a evitar erros e melhora a experiência de desenvolvimento com autocompletar e verificação de tipos.

### `utils`
- **Propósito**: Guarda funções utilitárias genéricas, que não dependem de APIs ou serviços externos, mas ajudam em tarefas comuns no código.
- **Exemplo de uso**: Uma função para formatar datas em `utils/formatDate.ts` ou validar e-mails em `utils/validateEmail.ts`.
- **Por que usamos?**: Essas funções são como ferramentas que podemos usar em qualquer lugar, mantendo o código mais limpo e reutilizável.

----

## Tipo de arquivos

### Diferença entre `.ts` e `.tsx`
No nosso projeto, usamos TypeScript, e os arquivos podem ter duas extensões principais:
- **`.ts`**: Arquivos TypeScript puro, sem JSX. Usamos para lógica que não envolve interface.
  - Exemplo: `utils/formatDate.ts` ou `services/clienteService.ts`.
- **`.tsx`**: Arquivos TypeScript com suporte a JSX, usados para componentes React que contêm marcação (HTML-like).
  - Exemplo: `components/Button.tsx` ou `contexts/AuthContext.tsx`.
- **Quando usar?**: Use `.tsx` sempre que o arquivo incluir JSX (ex.: `<div>`). Caso contrário, `.ts` é suficiente.

### Export Default vs Export Normal
No TypeScript e JavaScript, temos duas formas de exportar módulos:
- **`export default`**:
  - Exporta um único valor principal do arquivo como o "padrão".
  - Uso: Quando o arquivo tem um propósito claro e único, como um componente principal ou uma função principal.
  - Exemplo:
    ```tsx
    // components/Button.tsx
    const Button = () => <button>Clique</button>;
    export default Button;
    ```
    - Importação: `import Button from './Button';` (sem chaves).

- **`export` (normal)**:
  - Exporta múltiplos valores nomeados do arquivo.
  - Uso: Quando queremos disponibilizar várias funções, tipos ou constantes de um mesmo arquivo.
  - Exemplo:
    ```ts
    // utils/formatDate.ts
    export const formatDate = (date: Date) => date.toLocaleDateString();
    export const formatTime = (date: Date) => date.toLocaleTimeString();
    ```
    - Importação: `import { formatDate, formatTime } from './formatDate';` (com chaves).
- **Quando usar?**:
  - Use `export default` para componentes ou módulos com uma única responsabilidade clara (ex.: um componente React).
  - Use `export` para arquivos com várias utilidades ou tipos (ex.: `types/focoDeCalor.types.ts` pode exportar várias interfaces).
