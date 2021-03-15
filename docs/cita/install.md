---
id: install
title: 部署指南
---

CITA 是一个开源的区块链内核，任何人都可以基于 CITA 来搭建属于自己的一条区块链，在本文档中将为你详解 CITA 的各种部署方案，用户可根据自身业务需要选择合适的部署方案。

> * 如果你想一键搭建属于你自己的链，你可以选择租用 CITA 的云服务。只需根据您的需求，在云服务平台选择适合自己的方案直接租用，帮你省去准备服务器以及部署 CITA 的一系列操作。具体请参考下文中的云部署手册。
> * 如果你想在 CITA 上直接开发应用，我们建议你使用已经搭好的 [CITA 测试链]。

## 环境要求

* 操作系统：参见 [适用操作系统声明]
* 软件依赖：参见 [软件依赖声明]
* 客户端工具：参见 [安装 CITA 客户端工具]

## 部署 CITA

[CITA 测试链]: ../toolchain/testnet/testchain
[安装 CITA 客户端工具]: ../cita/getting-started/setup#安装-cita-客户端工具
[软件依赖声明]: ../cita/getting-started/setup#软件依赖声明
[适用操作系统声明]: ../cita/getting-started/setup#适用操作系统声明

<!--DOCUSAURUS_CODE_TABS-->

<!--发布件部署-->

### CITA 发布件部署

参见 [下载 CITA 发布件]

[下载 CITA 发布件]: ../cita/getting-started/setup#下载-cita

<!--源码部署-->

### CITA 源码编译部署

1. 下载 CITA 源码

   从 Github 仓库下载 CITA 的源代码，然后切换到 CITA 的源代码目录

   ```shell
   $ git clone https://github.com/citahub/cita.git
   $ cd cita
   $ git submodule init
   $ git submodule update
   ```

2. 编译源码

   可以按照自己的需求自行选择相应的编译方式（Debug-调试模式 或 Release-发行模式）

   ```shell
   $ ./env.sh make debug
   ```

   或者

   ```shell
   $ ./env.sh make release
   ```

3. 进入 CITA 运行目录

   ```shell
   $ cd target/install
   ```

> 可选择替换 Rust Crates 的官方源，详细教程可以参考：
>
> - [USTC Mirror Help for Rust Crates](http://mirrors.ustc.edu.cn/help/crates.io-index.html)
> - [Source Replacement for Rust Crates](https://doc.rust-lang.org/cargo/reference/source-replacement.html)
> - [How to map a configuration file into docker](https://docs.docker.com/storage/volumes/)

> **Docker env 使用说明**
>
> * 在源码根目录下，我们提供了 `env.sh` 脚本，封装了 Docker 相关的操作。
运行此脚本，以实际要运行的命令作为参数，即表示在 Docker 环境中运行相关命令。
例如下面的命令即表示在 Docker 环境中运行 `make debug`。
>
>   ```shell
>   $ ./env.sh make debug
>   ```
>
> * 不带任何参数运行 `./env.sh`，将直接获取一个 Docker 环境的 shell。
> * 如果 Docker 容器是被 root 用户创建的，后续非 root 用户使用 `./env.sh` 会出现如下错误，因此要保证操作使用的始终是同一个系统用户。
>
>   ```shell
>   $ ./env.sh
>   error: failed switching to "user": unable to find user user: no matching entries in passwd file
>   ```
>
> * 如果出现 Docker 相关的报错，可以执行如下命令并重试：
>
>   ```shell
>   docker kill $(docker ps -a -q)
>   ```
>

<!--分布式部署-->

### CITA 分布式部署

案例：4 台服务器 IP 地址为 192.168.100~103

1. 使用真实 IP 初始化链

   ```shell
   $ bin/cita create —super_admin "0x141d051b1b1922bf686f5df8aad45cefbcb0b696" —nodes "192.168.1.100:4000,192.168.1.101:4000,192.168.1.102:4000,192.168.1.103:4000"
   ```

2. 在 4 台服务器上创建目录

   ```shell
   $ mkdir -p /data/cita
   ```

3. 将生成的节点拷贝到所有主机

   ```shell
   $ scp -r cita_secp256k1_sha3 192.168.1.100:/data/cita
   $ scp -r cita_secp256k1_sha3 192.168.1.101:/data/cita
   $ scp -r cita_secp256k1_sha3 192.168.1.102:/data/cita
   $ scp -r cita_secp256k1_sha3 192.168.1.103:/data/cita
   ```

4. 启动节点，需要登录到各节点服务器启动对应节点

   节点对应关系：

   * node0-192.168.1.100
   * node1-192.168.1.101
   * node2-192.168.1.102
   * node3-192.168.1.103

   启动节点 0

   ```shell
   $ ssh root@192.168.1.100
   $ cd /data/cita/cita_secp256k1_sha3
   $ ./bin/cita setup test-chain/0
   $ ./bin/cita start test-chain/0
   ```

   启动节点 1

   ```shell
   $ ssh root@192.168.1.101
   $ cd /data/cita/cita_secp256k1_sha3
   $ ./bin/cita setup test-chain/1
   $ ./bin/cita start test-chain/1
   ```

   启动节点 2

   ```shell
   $ ssh root@192.168.1.102
   $ cd /data/cita/cita_secp256k1_sha3
   $ ./bin/cita setup test-chain/2
   $ ./bin/cita start test-chain/2
   ```

   启动节点 3

   ```shell
   $ ssh root@192.168.1.103
   $ cd /data/cita/cita_secp256k1_sha3
   $ ./bin/cita setup test-chain/3
   $ ./bin/cita start test-chain/3
   ```

5. 验证操作与单机部署相同，区别在与返回的结果只会显示当前节点进程数信息

   ```
   7
   cita      6180 32335  0 10:54 ?        00:00:00 cita-forever
   cita      6188  6180  0 10:54 ?        00:00:00 cita-auth -c auth.toml
   cita      6191  6180  0 10:54 ?        00:00:00 cita-network -c network.toml
   cita      6193  6180  0 10:54 ?        00:00:00 cita-jsonrpc -c jsonrpc.toml
   cita      6194  6180  0 10:54 ?        00:00:00 cita-executor -c executor.toml
   cita      6195  6180  0 10:54 ?        00:00:00 cita-chain -c chain.toml
   cita      6202  6180  0 10:54 ?        00:00:00 cita-bft -c consensus.toml -p privkey
   ```

<!--Docker Images-->

### Docker Images 下载

CITA 在 1.0.1 及以后版本的发布件中提供 docker image 版本，并托管到 docker hub 上，其路径为 `cita/cita-release` 。发布件的 tag 规则为：

**版本号-签名算法-哈希算法**

如：

**20.2.0-secp256k1-sha3**

可以使用 `docker pull` 命令将所需要的 CITA 版本的镜像下载到本地，如下载 `20.2.0-secp256k1-sha3` ：

```shell
docker pull cita/cita-release:20.2.0-secp256k1-sha3
```

查看下载结果：

```shell
docker images
REPOSITORY          TAG                     IMAGE ID            CREATED             SIZE
cita/cita-release  20.2.0-secp256k1-sha3    020a7b1d2225        5 days ago          724MB
```

### Docker 命令运行 CITA

使用 CITA 启动一条链，包括**节点配置生成**与**启动节点**两部分。以下将以启动两个节点的链为例说明， 如需启动更多节点，可以参考 [链级配置] 来操作。

#### 节点配置生成

执行命令：

```shell
 docker run -v "`pwd`":/opt/cita-run cita/cita-release:20.2.0-secp256k1-sha3 cita create --super_admin "0x37d1c7449bfe76fe9c445e626da06265e9377601" --nodes "192.168.10.96:4000, 192.168.10.96:4001"
```

这个命分为两部分，前半部分 `docker run -v "`pwd`":/opt/cita-run cita/cita-release:20.2.0-secp256k1-sha3` 为 docker 命令，表示启动一个 docker 容器，而后半部分 `cita create --super_admin "0x37d1c7449bfe76fe9c445e626da06265e9377601" --nodes "192.168.10.96:4000, 192.168.10.96:4001"` 为需要执行的 CITA 命令，详见 [链级配置] 相关说明。

注意，为了使两个节点的配置运行在两个不同的容器中，所以 `--nodes` 中的 `ip` 要写主机的 IP，这不同于在同一个容器中运行两个节点的配置。
在 Linux 系统下可以通过 `ifconfig` 命令获得主机 IP，请注意更改以上命令中的主机 IP，以免后续命令不能正确执行。

命令执行成功后，会在当前目录下生成一个名为 `test-chain` 的文件夹。

#### 启动节点

启动节点 0：

```shell
docker run -d -p 1337:1337 -p 4000:4000 -v "`pwd`":/opt/cita-run cita/cita-release:20.2.0-secp256k1-sha3 /bin/bash -c 'cita setup test-chain/0 && cita start test-chain/0 && sleep infinity'
```

启动节点 1：

```shell
docker run -d -p 1338:1338 -p 4001:4001 -v "`pwd`":/opt/cita-run cita/cita-release:20.2.0-secp256k1-sha3 /bin/bash -c 'cita setup test-chain/1 && cita start test-chain/1 && sleep infinity'
```

注意，这里需要暴露 JSON-RPC 的端口外，还需要暴露 CITA 节点网络（4000、4001）的端口，以便两个 CITA 节点可以互联。

#### 验证

* 查询节点个数

  Request：

  ```shell
  curl -X POST --data '{"jsonrpc":"2.0","method":"peerCount","params":[],"id":74}' 192.168.10.96:1337 |jq
  ```

  Result：

  ```json
  {
    "jsonrpc": "2.0",
    "id": 74,
    "result": "0x1"
  }
  ```

* 查询当前块高度。

  Request：

  ```shell
  curl -X POST --data '{"jsonrpc":"2.0","method":"blockNumber","params":[],"id":83}' 192.168.10.96:1337 |jq
  ```

  Result：

  ```json
  {
    "jsonrpc": "2.0",
    "id": 83,
    "result": "0x8"
  }
  ```

  返回块高度，表示节点已经开始正常出块。

更多 API（如合约调用、交易查询）请参见 [RPC 调用]。

### docker-compose 运行 CITA

为了方便运行服务的管理，也可以使用 docker-compose 来运行 CITA。

#### 安装 docker-compose

参考 [docker-compose 安装说明] 来安装 docker-compose.

[docker-compose 安装说明]: https://docs.docker.com/compose/install/

#### 准备 docker-compose.yml

[docker-compose Demo] 是一个启动两个 CITA 节点的样例。

[docker-compose Demo]: https://github.com/citahub/cita/blob/develop/docker/sample/docker-compose.yml

#### 启动 CITA

```shell
USER_ID=`id -u $USER` docker-compose up
```

#### 验证
同上文描述。

[RPC 调用]: ../cita/rpc-guide/rpc
[链级配置]: ../cita/configuration-guide/chain-config



<!--END_DOCUSAURUS_CODE_TABS-->

------------------------------------------

## 配置 CITA

参见 [配置 CITA]

## 启动 CITA

参见 [启动 CITA]

## 验证 CITA 是否运行正常

参见 [验证 CITA 是否运行正常]

[启动 CITA]: ../cita/getting-started/run-cita#启动-cita
[配置 CITA]: ../cita/getting-started/run-cita#配置-cita
[验证 CITA 是否运行正常]: ../cita/getting-started/run-cita#验证-cita-是否运行正常
