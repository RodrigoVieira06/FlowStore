# Configuração de Ambiente para Aplicação Angular

Este documento fornece as instruções necessárias para configurar o ambiente de desenvolvimento para o projeto Flow Store. Siga os passos abaixo para instalar as ferramentas necessárias e configurar o ambiente corretamente.

## Pré-requisitos

### Ferramentas Necessárias:
1. Node.js e NPM (Node Package Manager)
2. Git
3. Configuração de SSH
4. Angular CLI

## 1. Instalação do Node.js e NPM

O Node.js é um pacote módulos e bibliotecas JavaScript utilizado para adicionar várias funcionalidades a aplicativos ou scripts. Como o Angular é uma das ferramentas contidas, é necessário que ele esteja instalado.

Já o NPM é um gerenciador de pacotes para o Node.JS. Ele é importante para que possamos fazer as instalações do Angular CLI.

### Windows

1. Baixe o instalador do Node.js na versão v20.16.0 (LTS) em [nodejs.org](https://nodejs.org/en/download/prebuilt-installer).

2. Execute o instalador e siga as instruções na tela.

3. Verifique a instalação:

    ```sh
    node -v
    npm -v
    ```
### Linux

1. Abra o terminal e execute o comando apropriado para sua distribuição:

    **Ubuntu/Debian**:

    ```sh
    sudo apt update
    sudo apt upgrade
    ```

    **Fedora**:

    ```sh
    sudo dnf update
    ```

2. Instale o Node.js a partir do NodeSource:

    **Ubuntu/Debian**:

    ```sh
    curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    ```

    **Fedora**:

    ```sh
    curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo dnf install -y nodejs
    ```

3. Verifique a instalação:

    **Ubuntu/Debian**:

    ```sh
    node -v
    npm -v
    ```

    **Fedora**:

    ```sh
    node -v
    npm -v
    ```


## 2. Instalação do Git

Git é um sistema de controle de versão distribuído. Você pode instalar o Git seguindo as instruções abaixo:

### Windows

1. Baixe o instalador do Git em: [git-scm.com](https://git-scm.com/download/win)
2. Execute o instalador e siga as instruções na tela.

### Linux

1. Abra o terminal e execute o comando apropriado para sua distribuição:

    **Ubuntu/Debian**:

    ```sh
    sudo apt-get update
    sudo apt-get install git
    ```

    **Fedora**:

    ```sh
    sudo dnf install git
    ```

2. Configure seu nome de usuário e endereço de e-mail no Git. Isso é importante para que suas contribuições sejam identificadas corretamente nos commits. Substitua com seu nome e seu email:

    ```sh
    git config --global user.name "Seu Nome"
    git config --global user.email "seu_email@example.com"
    ```


## 3. Configuração de SSH

Para clonar repositórios usando SSH, você precisa gerar uma chave SSH e adicioná-la à sua conta GitHub.

A partir daqui, Windows Ubuntu e Fedora podem utilizar o terminal para executar os comandos. No caso do Windows, utilize o terminal Bash recém instalado do Git.

### Gerar uma chave SSH

1. Abra o terminal.

2. Execute o seguinte comando para gerar uma nova chave SSH (substitua "your_email@example.com" pelo seu e-mail):

    ```sh
    ssh-keygen -t ed25519 -C "your_email@example.com"
    ```

    Se você estiver usando uma versão mais antiga do OpenSSH, use   

    ```sh
    ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
    ```

3. Pressione Enter para aceitar o local padrão do arquivo.

4. Digite uma senha segura quando solicitado (opcional, mas recomendado).

### Adicionar a chave SSH ao agente SSH

1. Inicie o agente SSH:

   ```sh
   eval "$(ssh-agent -s)"
   ```

2. Adicione sua chave SSH ao agente:

   ```sh
   ssh-add ~/.ssh/id_ed25519
   ```

   Ou para RSA:

   ```sh
   ssh-add ~/.ssh/id_rsa
   ```

### Adicionar a chave SSH ao GitHub

1. Copie o conteúdo da chave SSH para a área de transferência:

    ```sh
    cat ~/.ssh/id_ed25519.pub
    ```

    Ou para RSA:

    ```sh
    cat ~/.ssh/id_rsa.pub
    ```

2. Vá para GitHub, acesse Settings > SSH and GPG keys > New SSH key.

3. Cole a chave SSH no campo "Key" e dê um título descritivo.

4. Clique em Add SSH key.


## 4. Instalar o Angular CLI

O Angular CLI é uma ferramenta importante para executar os comandos ``ng`` no terminal, com objetivo de auxiliar o desenvolvimento da aplicação. Será fundamental para a execução do projeto.

1. Ainda no terminal, execute:

```sh
npm install -g @angular/cli
```


## Conclusão

Com as etapas executadas de acordo com o seu sistema operacional, você pode executar os ``Primeiros passos`` da documentação inicial.
