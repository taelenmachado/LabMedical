## LAB Medical

> Projeto desenvolvido usando React, Bootstrap e Json-Server.

A LabMedical é um software de gestão médica desenvolvida para auxiliar na administração e organização de hospitais.

##### Objetivo principal

O objetivo principal é oferecer uma plataforma que simplifique processos de atendimento, gerenciamento de consultas, exames e prontuários de paciente.

##### Funcionalidades Principais

- Cadastro e gerenciamento de pacientes
- Cadastro e gerenciamento de exames
- Cadastro e gerenciamento de consultas
- Dashboard com estatísticas da quantidade de pacientes cadastrados, consultas e exames realizados
- Página e listagem de prontuários

## Instalação

1. Clone o repositório: `git clone git@github.com:taelenmachado/LabMedical.git`
2. Acesse o diretório do projeto: `cd labmedical`
3. Instale as dependências: `npm install`
4. Inicialize o json-server com o comando: `npx json-server -p 4000 --watch server/db.json`
5. Inicie o projeto com o comando: `npm start`


## Uso

Após a instalação e configuração, acesse a aplicação pelo navegador usando o endereço `http://localhost:3000`. Faça o login com as credenciais padrão (e-mail: `mail@mail.com`, senha: `12345678`) ou crie um novo na opção "cadastre-se".

#### Melhorias a serem implementadas

- Integração com o backend
- Foto do paciente para agilizar atendimentos emergenciais
- Feedback de atendimento para médico/paciente
