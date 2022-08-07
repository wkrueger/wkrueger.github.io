# Fluxos do oauth

[[Tag: Notas Permanentes]]

| Flow                              | Application                        |
| --------------------------------- | ---------------------------------- |
| Authorization Code                | 1st party apps<br />3rd party apps |
| (R. Owner's) Password Credentials | 1st party apps                     |
| Implicit                          | SPA's (google fonts)               |
| Client credentials                | Daemons                            |

	## Password credentials

- O app pode ver senha do usuário.

```
user:        username+password  ->  app
app:         username+password + app ID  ->  auth_server
auth_server: access_token + refresh_token  ->  app
```

## Authorization code

- Redirect com código intermediário

```
app:         browser link to auth server  ->  user
user:        username+password  -> browser  ->  auth_server
auth_server: browser link to app with auth_code  ->  user  ->  app
app:         auth_code  ->  auth_server
auth_server: access_token + refresh_token  ->  app
```

## Implicit

- Mesmo que o fluxo "authorization code", mas sem o código intermediário `auth_code`;
- O `access_token` é passado direto pro app no callback;
- Não há `refresh_token`;

## Client credentials

- App dá `client_id` e `client_secret` pro servidor e tem acesso a tudo;
- Só dá acesso a dados globais (afinal, o usuário não autenticou)