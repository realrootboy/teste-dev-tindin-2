# Teste Desenvolvedor: Backend 
## _(TINDIN - Educação Financeira Gamificada)_

Email: renangomes.es@gmail.com
Telefone: +5527992875113
Residência: Vila Velha - ES

Para o consumo da API da Unsplash, foi criado um pequeno service localizado no diretório "src/services/unsplash.service.ts".
Testes de integração relativos à API estão no diretório "\_\_tests\_\_/integration/unsplash.test.ts".

Para autenticação nas rotas foi utilizado o jsonwebtoken para gerar o token JWT. 
A autenticação funciona utilizando o bcrypt para a verificação de senhas (observe a função generateUser do unsplash.test.ts).

Atenção ao .env e ao .env.test, deverão ser alterados os seguintes parâmetros:
```sh
UNSPLASH_ACCESS_KEY="ACCESS_KEY"
UNSPLASH_SECRET_KEY="SECRET_KEY"
```

Para os filtros de busca no GET foi utilizado regex para a tratativa de acentuação e substrings.

## Instalação

Instale as dependências e inicie o servidor.

```sh
npm i
npm start
```

Para executar os testes, execute:

```sh
npm run test
```
