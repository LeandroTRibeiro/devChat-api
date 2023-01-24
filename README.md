<h1 align="center">devChat</h1>
<p align="center">Backend de meu liveChat</p>

<p align="center">
 <a href="#demo">Demo</a> •
 <a href="#objetivo">Objetivo</a> •
 <a href="#tecnologias">Tecnologias</a> •
 <a href="#implantacao">Implantação</a> •
 <a href="#funcionalidades">Funcionalidades</a> • 
 <a href="#about">Api endpoints</a> • 
 <a href="#licenca">Licença</a> • 
 <a href="#autor">Autor</a>
</p>

<h4 align="center"> 
	🚧  Em construção...  🚧
</h4>

<h2 id="demo">🕹️ Demo</h2>

Link do demo da aplicação publicado no <a href="https://render.com/">Render</a> - https://devchat.onrender.com

<h2 id="objetivo">📖 Objetivo</h2>
<p>Objetivo principal deste projeto foi a criação de um Backend para meu liveChat com todas as rotas e sockets necessários para fornecer um sistema de autenticação e autorização completo e recebimento de mensagens e envio para os usuários.</p>

<h2 id="tecnologias">🛠 Tecnologias</h2>

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Mongoose](https://mongoosejs.com/)
- [Express](https://expressjs.com/pt-br/)
- [SendGrid](https://sendgrid.com/)
- [Cloudinary](https://cloudinary.com/)
- [JsonWebToken](https://jwt.io/)
- [Multer](https://www.npmjs.com/package/multer)
- [Sharp](https://sharp.pixelplumbing.com/)
- [Socket.IO](https://socket.io/)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Validator](https://www.npmjs.com/package/validator)
- [.env](https://www.npmjs.com/package/dotenv)
- [Body Parser](https://www.npmjs.com/package/body-parser)
- [Cors](https://www.npmjs.com/package/cors)

> Veja o arquivo  [package.json](https://github.com/LeandroTRibeiro/devChat-api/blob/main/package.json)

<h2 id="implantacao">📦 Implantação</h2>

Este projeto é dividio em duas partes:

1. Backend 
2. Frontend <a href="https://github.com/LeandroTRibeiro/devChat-app" target="_blank">Veja o repositório aqui!</a>

💡 O Backend precisa de um arquivo ".env" com a chave "MONGO_URL" de seu banco de dados <a href="https://www.mongodb.com/">MongoDB</a>, da chave "JWT_SECRET_KEY" para criação do token de senha de seus usuários, da chave "SENDGRID_API_KEY" de sua conta no <a href="https://sendgrid.com/">SendGrid</a>, das chaves "JWT_SECRET_RECOVER" e "JWT_SECRET_CONFIRM" para criação do token de recupeção de senha e confirmação de ativação da conta, e das chaves "CLOUD_NAME", "API_KEY" e "API_SECRET" de sua conta <a href="https://cloudinary.com/">Cloudinary</a> para funcionar.

🧭 Rodando a aplicação web (Backend)

```bash
# Pré-requisitos globais
$ npm i -g nodemon typescript ts-node

# clone o repositório
$ git clone https://github.com/LeandroTRibeiro/devChat-api

# Acesse a pasta do projeto no seu terminal/cmd
$ cd devChat-api

# Execute a aplicação em modo de desenvolvimento
$ npm run start-dev
```

<h2 id="funcionalidades">⚙️ Funcionalidades</h2>

Após o usuário acessar a aplicação:
- [x] Registro de usuário:
  - [x] Fazer o registro de um novo usuário com "nome", "sobrenome", "email", "senha" e "foto"
  - [x] Manipula a imagem e faz upload da mesma para uma conta no <a href="https://cloudinary.com/">Cloudinary</a>
  - [x] Salva todos os dados do usuário em um banco de dados <a href="https://www.mongodb.com/">MongoDB</a>, salvando a senha em formato <a href="https://jwt.io/">JsonWebToken</a>
  - [x] Após registro enviá um E-mail para usuário com um link que contem um token temporário para ativação da conta
- [x] Recuperação de senha:
  - [x] Envia para o E-mail do usuário com um token temporário para ter acesso a renovação de senha
- [x] Login:
  - [x] Feito corretamente envia um token para futuras autorizações
- [x] LiveChat:
  - [x] Se comunica atravez de sockets com os usuários para envio e recebimento de dados

<h2 id="about">🗃️ Api endpoints</h2>

A Api recebe informações pelo query params e por JSON.

| Methods | Endpoint | Descrição |
|--------:|---------:|----------:|
|`GET`    | /ping    | retorna: ```{"pong":"true"}```|
|`POST`    | <a href="#getuser">/getuser</a> | retorna o nome completo do usuário e a url de seu avatar |
|`POST`   | <a href="#login">/login</a> | faz o login do usuário e retorna o status da requisição e o token para futuras autorizações |
|`POST`   | <a href="#register">/register</a> | faz um novo registro fazendo o upload da imagem no cloudinary e salvando a url da imagem e demais dados no banco de dados MongoDB e retorna os dados no novo usuário |
|`POST`   | <a href="#recover">/recover</a> | envia um e-mail com um link que contem um token para autorização temporário de renovação de senha |
|`POST`   | <a href="#updatepassword">/updatepassword</a> | renova a senha do usuário enviando o token de autorização e a nova senha |
|`POST`   | <a href="#confirm">/confirm</a> | envia um e-mail com um link que contem um token para autenticação da conta temporário |
|`POST`   | <a href="#authenticate">/authenticateacount</a> | envia o token recebido por e-mail do "/confirm" para mudar o status da conta para ativo | 

<h3 id="getuser">POST - /getuser</h3>
💡 Mandar informações de requisição por JSON.
<br>Request:

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxhbGFAbGFsYS5jb20iLCJwYXNzd29yZCI6IjEyMzQ1NiIsImlhdCI6MTY3NDU2Njc1NX0.LfjrebklZvH_4GV5eK4Fjs1eNJMxT8O9t6UULRC9mwM"
}
```
___

Response:

```
{
    "userName": "Novo Usuário",
    "avatar": "http://res.cloudinary.com/dvxrv2coa/image/upload/v1674566757/06fc55f55b5b4a88145a749b7aacefe6.png"
}

```
___


<h3 id="login">POST - /login</h3>
💡 Mandar informações de requisição por JSON.
<br>Request:

```
{
    "email": "novo@usuario.com",
    "password": "123456"
}
```
___

Response:

```
{
    "status": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImR5bXlAaG90bWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMzQ1NiIsImlhdCI6MTY3NDI0MzAzNn0.nE7BDqyjqVUD5zcqVp40GK65GJRJOvmsNsATqxf23KY"
}

```
___

<h3 id="register">POST - /register</h3>
💡 Mandar informações de cadastro por form-data.

| Method | type | KEY | Value | Exemplo |
| -------:| ----:| ---:| -----:| ------:|
| `POST`   | `text` | firstName | string | "Novo" |
| `POST`   | `text` | lastName | string | "Usuário" |
| `POST`   | `text` | email | string | "lala@lala.com" |
| `POST`   | `text` | password | string | "123456" |
| `POST`   | `File` | password | File | avatar.jpg |

<br>Response:

```
{
    "newUser": {
        "name": {
            "firstName": "Novo",
            "lastName": "Usuário"
        },
        "autenticate": false,
        "_id": "63cfdc6444422e292c8ffa21",
        "email": "lala@lala.com",
        "password": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxhbGFAbGFsYS5jb20iLCJwYXNzd29yZCI6IjEyMzQ1NiIsImlhdCI6MTY3NDU2Njc1NX0.LfjrebklZvH_4GV5eK4Fjs1eNJMxT8O9t6UULRC9mwM",
        "avatar": "http://res.cloudinary.com/dvxrv2coa/image/upload/v1674566757/06fc55f55b5b4a88145a749b7aacefe6.png",
        "__v": 0
    }
}
```
___

<h3 id="recover">POST - /recover</h3>
💡 Mandar informações de requisição por JSON, o E-mail enviado para o cliente vai conter no query params um token temporário que sera necessário para renovação de senha.
<br>Request:

```
{
    "email":"novo@usuario.com"
}
```
___

<br>Response:

```
{
    "send": true
}
```
___

<h3 id="updatepassword">POST - /updatepassword</h3>
💡 Mandar informações da requisição por JSON, o token sendo enviado é o mesmo recebido por E-mail do endpoint "/recover".
<br>Request:

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJydW5hdGVsbGVzMUBsaXZlLmNvbSIsInRva2VuIjoicmVjb3ZlcmluZ3Bhc3N3b3JkIiwiaWF0IjoxNjc0NTY3NDQzLCJleHAiOjE2NzQ1NzEwNDN9.l9FvgdOtvAjnpCXRA0h2vNpDeYLAjlCAf6Tc-Dm3xy4",
    "newPassword": "123456"
}
```

<br>Response:

```
{
    "userUpdate": {
        "name": {
            "firstName": "Novo",
            "lastName": "Usuário"
        },
        "_id": "63c85181f2c905bf51522bff",
        "autenticate": true,
        "email": "novo@usuario.com",
        "password": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJydW5hdGVsbGVzMUBsaXZlLmNvbSIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjc0NTcwNDk3fQ.Lyzdc-L9TKDTbyBdwyqKQfE1RhxcEHhERBtsgayDlwo",
        "avatar": "http://res.cloudinary.com/dvxrv2coa/image/upload/v1674566757/06fc55f55b5b4a88145a749b7aacefe6.png",
        "__v": 0
    }
}
```
___

<h3 id="confirm">POST - /confirm</h3>
💡 Mandar informações da requisição por JSON.

<br>Request:

```
{
    "email": "novo@usuario.com
}
```

<br>Response:

```
{
    "send": true
}
```
___

<h3 id="authenticate">POST - /authenticateacount</h3>
💡 Mandar informações da requisição por JSON, o token recebido é o token para futuras autorizações.
<br>Request:

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJydW5hdGVsbGVzMUBsaXZlLmNvbSIsInRva2VuIjoiY29uZmlybWVtYWlscGVyc29uIiwiaWF0IjoxNjc0NTcwNjU3LCJleHAiOjE2NzQ1NzQyNTd9.S0FogOVYc_NMwb5Gap6Du7JGtPllM90bVpZtDtEx2Lk"
}

```
___

<br>Response:

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJydW5hdGVsbGVzMUBsaXZlLmNvbSIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjc0NTcwNDk3fQ.Lyzdc-L9TKDTbyBdwyqKQfE1RhxcEHhERBtsgayDlwo"
}

```
___
	
<h2 id="licenca">📝 Licença</h2>

Este projeto está sobre a licença MIT. 
> Veja o arquivo <a href="https://github.com/LeandroTRibeiro/devChat-api/blob/main/LICENSE" target="_blank">LICENSE</a> para detalhes.

<h2 id="autor">✒️ Autor</h2>

<a href="https://github.com/LeandroTRibeiro">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/111009157?s=400&u=ccf989df0bb9cf41495186f2bc0564c1b03b0d4e&v=4" width="100px;" alt=""/>
 <br />
 <sub><b>Leandro Thiago Ribeiro</b></sub></a> 👋
 <br />
 
[![GitHub Badge](https://img.shields.io/badge/-LeandroTRibeiro-black?style=flat-square&logo=GitHub&logoColor=white&link=https://github.com/LeandroTRibeiro)](https://github.com/LeandroTRibeiro)
[![Linkedin Badge](https://img.shields.io/badge/-LeandroRibeiro-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/leandro-ribeiro-2a8a8b24b/)](https://www.linkedin.com/in/leandro-ribeiro-2a8a8b24b/) 
[![Gmail Badge](https://img.shields.io/badge/-leandrothiago_ribeiro@hotmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:leandrothiago_ribeiro@hotmail.com)](mailto:leandrothiago_ribeiro@hotmail.com)

