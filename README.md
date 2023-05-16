# Projeto Controle Financeiro
    Projeto criado por Jessica da Silva, e Rodrigo Alves.

> O projeto consiste no controle financeiro do usuario, nele é possivel acrescentar valores de receita ou de despesas. Além de mostrar todo o historico das transações feitas pelo cliente e o saldo.


# Banco de dados
Necessario criar um banco de dados chamado "financial" no mysql com o comando: 
```    
CREATE DATABASE financial;
```

# Dependencias necessarias para a visualização do projeto

Para instalar todas as dependências é necessario entrar no seu terminal dentro da pasta do projeto e rodar o comando:
```
npm install    
```
# Como iniciar o projeto
Dentro da pasta do projeto rode o comando 
```
npm start
```
Abra seu navegador de preferência e acesse o link: http://localhost:3000/


## Dependência utilizadas:
>  
> bcryptjs -> Necessaria para criptografar senhas e afins.
> 
> connect-flash -> Utilizado para mandar mensagens ao usuario.
> 
> cookie-parser -> Cookies são arquivos/dados simples e pequenos que são enviados ao cliente.
> 
> cookie-session -> Armazena dados da sessão do cliente dentro de um cookie.
> 
>express -> Usado para a criação de servidores web.
> 
> express-flash -> Usados para mensagem flash do formulario.
> 
> express-handlebars -> Para modelagem geral.
> 
> express-session -> Para criar uma sessao middleware
> 
> mysql2 -> Mysql Para Node.js
> 
> nodemon -> Para atualização automaticado no node.js
> 
> sequelize -> Para realização e coorelação entre o Mysql.
> 
> session-file-store -> Armazenar dados de um usuario a um arquivo.
> 

# Organização das pastas

## Controllers
    TransactionController.js --> Responsavel por toda a CRUD da tabela de transações e renderização das páginas.
    UserController.js --> Responsavel pelas ações dos usuários desde a criação do cadastro a verificação do login.
    
## db
    conn.js --> conexão com o banco de dados existente no mysql.
    
## helpers
    auth.js --> permite a entrada do usuario em rotas restritas.
    
## models
    Transaction.js --> criação da tabela transações.
    User.js --> criação da tabela usuarios.
    
## public
    css/styles.css --> estilização das paginas com conceitos de responsividade.
    js/scripts.js --> dinanmismo do site.
    
## routes
    authRouters.js --> rotas que variam da pagina de Login e Cadastro, rotas não restritas.
    dashRouters.js --> rotas internas que precisam de login para serem acessadas, rotas restritas.
    
## views

### authentication
    Pasta onde se encontram os arquivos handlebars das paginas de login e registro

### dashboard
    Pasta onde se encontram os arquivos handlebars das paginas para acrescentar receitas, despesas, e verificar o historico. 

### layouts
    Pasta onde se encontra o arquivo handlebars main.


# Paleta de cores em HEXADECIMAL:
    #400101
    #CF4526
    #612940
    #DB7396
    #D9C1D0
    #DBC5BD
    #EFE6EC
