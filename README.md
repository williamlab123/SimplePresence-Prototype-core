<div align="center"> <h1>SimplePresence core</h1></div>


<h3>
</h3>

Este repositório contem os codigos de teste e pre-alpha do SimplePresence. O codigo fonte do SimplePresence nao será disponibilizado por questoes de segurança e privacidade, entao este repositorio será o maximo de código sobre o SP disponibilizado open source. Caso queira saber mais sobre seu funcionamento, acesse o site ou mande um email com suas duvidas. 

## Client
---
```mermaid
flowchart LR
  login[Tela de login]
  style login stroke:#00aa00,stroke-width:4px
  home_aluno[Inicio aluno]
  home_professor[Inicio Professor]

  listagem_aluno[Listagem de aulas]
  confirmacao_aluno[Confirmação Presença]
  gerar_relatorio[Gerar relatório]

  listagem_prof[Listagem de aulas]
  listagem_prof_histórico[Listagem de aulas passadas]
  abrir_chamada[Abrir chamada]
  fechar_chamada[Fechar chamada]
  resolver_chamada[Resolver chamada]

  login --> home_aluno
  login --> home_professor

  home_aluno --> listagem_aluno
  listagem_aluno --> confirmacao_aluno

  home_professor --> listagem_prof
  home_professor --> listagem_prof_histórico
  listagem_prof_histórico --> gerar_relatorio
  listagem_prof --> abrir_chamada
  listagem_prof --> fechar_chamada
  listagem_prof --> resolver_chamada
```



