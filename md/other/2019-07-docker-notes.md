```
docker container --help
docker container ls
docker contaner ls --all
```

Instâncias em execução ou executadas no passado.

### Definir imagem

- Dockerfile
- `docker build [--tag=thetag[:v1.0]] .`
- `docker image ls`
- `docker run <tag>` - **cria container**

```Dockerfile
FROM python:2.7-slim
WORKDIR /app
COPY . /app
RUN pip install --trusted-host pypi.python.org -r requirements.txt
EXPOSE 80
ENV NAME World
CMD ["python", "app.py"]
```

- Comandos acima controem a imagem no `docker build`
- `CMD` é executado no `docker run` sobre a imagem construída no _build_

### Argumentos

```
 -e  env: variável de ambiente
 -d  detach
 -it interativo
 --name
 -p expor portas
 -rm apagar apos finalizar
 --network X : conectar à rede X
```



### Upload da imagem

```
docker login
docker push username/repo:tag
```

`docker run` baixará a imagem se ela não estiver presente na máquina.

## Prune

[referência](https://docs.docker.com/engine/reference/commandline/image_prune/)

**Imagens**

- `docker image prune` Limpa imagens sem tag e sem container;
- `docker image prune -a` Limpa imagens sem container
- `docker image prune -a --filter "until=24h"`

**Containers**

`docker container prune` remove containers parados.

### Volumes, redes

### docker system prune

---

## Stacks

- docker-compose.yml
- docker swarm init (ativa o modo swarm)
- docker stack deploy -c docker-compose.yml stackname

```
stack (grupo de serviços) {
	service (ex: http server) {
		task/container (ex: instancia n do http server)[]
	}[]
}
```

- **Listar serviços** docker service ls OU --> services
- **Listas serviços da stack** docker stack services stackname --> services
- **Listar tasks/containers do serviço** docker service ps servicename --> tasks

---

## Swarms

- Múltiplas máquinas (_nodos_)
- **Swarm manager** controla o cluster (outros nodos são **workers**)

```shell
$ docker-machine ssh myvm1 "docker swarm init --advertise-addr <myvm1 ip>"
To add a worker to this swarm, run the following command:
  docker swarm join \
  --token <token> \
  <myvm ip>:<port>

$ docker-machine ssh myvm2 "docker swarm join \
--token <token> \
<ip>:2377"

This node joined a swarm as a worker.
```

- **Listar nodos** `docker node ls`
- **Sair** `docker swarm leave`
- **Alterar ambiente**

```shell
$ docker-machine env myvm1
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://192.168.99.100:2376"
export DOCKER_CERT_PATH="/Users/sam/.docker/machine/machines/myvm1"
export DOCKER_MACHINE_NAME="myvm1"
# Run this command to configure your shell:
# eval $(docker-machine env myvm1)
```

- `docker-machine ls` - Listar máquinas, verificar se está no ambiente
- Rodar o `docker stack deploy` agora irá fazer com que rode como se estivesse na máquina ambiente, mas com acesso a seus arquivos
- **Derrubar a stack** `docker stack rm`
- **Resetar ambiente** `eval $(docker-machine env -u)`
- **Iniciar máquina parada** `docker-machine start|stop <machine-name>`
