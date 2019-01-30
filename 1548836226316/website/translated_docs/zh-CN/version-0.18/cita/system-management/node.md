---
id: version-0.18-node
title: Node Management
original_id: node
---
CITA 中节点分为共识节点和普通节点，交易由共识节点排序并打包成块，共识完成后即被确认为合法区块。普通节点不参与共识，只同步和验证链上所有的原始数据。

公有链没有节点准入机制，意味着任何节点都可以接入链并同步其全部的数据，在满足一定的条件下都可以参加共识。而 CITA 对于共识节点和普通节点都进行了准入管理。 对于身份验证失败的节点，即使该节点能够在网络层与其他 CITA 节点连通，这些 CITA 节点也会拒绝与之建立通讯会话，如此可避免信息泄漏。

CITA 作为联盟链共识节点采用轮流出块的方式进行出块。作为公有联盟链可以根据节点的出块权重分配出块权，管理员可以设置每个出块节点的 Stake 来调整出块权重。 出块权重按照每个出块节点所占的千分比进行分配，对于小数部分采用的 [Largest_remainder_method](https://en.wikipedia.org/wiki/Largest_remainder_method) 算法进行分配。 每次出块时，查询共识节点的权重，根据权重计算出每个节点在 1000 个块中可以出的块个数，这 1000 个块算为一个 epoch，再将这 1000 个块出块顺序以创世块的时间戳为种子进行随机排序。 如果在同一个 epoch 中出块节点列表和权重没有变化，共识将会按照此顺序进行出块；如果节点列表和权重有变化，将按照新的顺序进行出块。

## 普通节点管理 (白名单)

目前 CITA 对于普通节点的准入管理采用白名单的方式。每个节点本地保存白名单配置文件，其中记录着允许连接的 p2p 通信和数据同步的节点，包括其公钥、IP 地址、端口、对应的身份信息等。 白名单由管理机构生成并分发，运维人员可对其进行维护和管理，可选择连接若干其他节点同时可配置若干普通节点，使其承担数据分析等工作。

普通节点的管理，包括添加和删除。下面我们将用具体的示例来阐述。

### 添加普通节点（以下以 4 号节点举例）

1. 假设目前的工作目录在 `../cita/target/install/` 下：
    
    ```bash
    $ pwd
    ../cita/target/install
    $ ls test-chain/
     0  1  2  3  template
    ```
    
    template 中保存了当前节点的公钥地址 `template/authorities.list`，以及创世块信息 `template/configs/genesis.json`，目前地址有四个。

2. 生成新 node：
    
    ```bash
    $ ./scripts/create_cita_config.py append --node "127.0.0.1:4004"
    $ ls test-chain/
     0  1  2  3  4  template
    ```

- append 子命令，在指定链中增加对应 ip 地址的节点
- 脚本将自动生成 4 号节点，并在原有节点中 `test-chain/*/network.toml` 中插入新节点的 ip 及端口配置

1. 启动新节点：
    
    对于原来的节点，如果正在运行，那么 network.toml 修改后，将自动重新加载 p2p 网络配置，并开始尝试寻找新节点。
    
    新节点只需要按照正常流程启动，就可以连接入网络，并开始同步链上的块数据，**注意，此时的新节点为普通节点，不参与共识选举，即只能同步数据和接收 jsonrpc 请求**。
    
    ```bash
    $ ./bin/cita setup test-chain/4
    $ ./bin/cita start test-chain/4
    ```

### 删除普通节点

到对应节点目录下，找到 `network.toml`，删除对应 `peers` 条目即可。

## 共识节点管理

CITA 作为一个面向企业级应用的区块链框架，需要保证监管方能够获得相关的权限对共识节点进行管理，包括增加、删除共识节点等操作。对于共识微服务，需要对其提供实时读取共识节点列表的接口，而中心化管理的方式无法保证各个节点的共识节点列表的安全性及一致性。CITA 采用合约的方式来实现共识节点的管理，通过区块链上的合约可以保证共识节点的安全性及一致性。

在 CITA 初始化创世块阶段，需要初始化一个管理员地址，其拥有管理员角色，将其写入到每个节点的创世块文件中，共识节点管理合约拥有的一个固定地址也写入其中。创世块内容在初始化以后不允许被修改。区块链正常启动之后，将合约写入到创世块中。链外的操作人员可以通过调用 RPC 接口来实现对共识节点的管理。

对于共识节点的管理，包括添加、删除及获得共识节点。下面我们将用具体的示例来阐述。

- 添加操作只可由管理员执行;
- 删除操作只可由管理员执行;
- 获得共识节点列表；
- 获取共识节点权重；
- 设置共识节点权重；
- 获取共识节点权重千分比。

### 共识节点管理合约接口

<table>
  <tr>
    <th>名称</th>
    <th>需要权限</th>
    <th>传入参数</th>
    <th>返回值</th>
    <th>详细描述</th>
  </tr>
  <tr>
    <td>approveNode(address) <br/> <strong>确认共识节点</strong></td>
    <td>管理员权限</td>
    <td>新增共识节点地址</td>
    <td>操作是否成功 (bool)</td>
    <td>新节点成功准备后，可调用此方法确认节点成为共识节点，同时节点将处于 start 状态</td>
  </tr>
  <tr>
    <td>deleteNode(address) <br/> <strong>删除共识节点</strong></td>
    <td>管理员权限</td>
    <td>节点地址</td>
    <td>操作是否成功 (bool)</td>
    <td>成功后节点将从节点列表中删除，同时节点将处于 close 状态</td>
  </tr>
  <tr>
    <td>listNode() <br/> <strong>获取共识节点列表</strong></td>
    <td>普通权限(只读)</td>
    <td>空</td>
    <td>地址列表(address[])</td>
    <td>获取共识节点列表，即状态为 start 的节点</td>
  </tr>
  <tr>
    <td>listStake() <br/> <strong>获取共识节点Stake列表</strong></td>
    <td>普通权限(只读)</td>
    <td>空</td>
    <td>地址列表(uint64[] _stakes)</td>
    <td>获取共识节点Stake列表</td>
  </tr>
  <tr>
    <td>setStake(address,uint64) <br/> <strong>设置共识节点Stake</strong></td>
    <td>管理员权限</td>
    <td>节点地址，Stake</td>
    <td>操作是否成功 (bool)</td>
    <td>设置共识节点Stake</td>
  </tr>
  <tr>
    <td>stakePermillage(address _node) <br/> <strong>获取共识节点出块权重千分比</strong></td>
    <td>普通权限(只读)</td>
    <td>节点地址</td>
    <td>权重千分比 (uint64)</td>
    <td>获取共识节点节点出块权重千分比（省略小数部分）</td>
  </tr>
  <tr>
    <td>getStatus(address) <br/> <strong>获得节点状态</strong></td>
    <td>普通权限(只读)</td>
    <td>节点地址</td>
    <td>
      节点的状态 (uint8):
      <ul>
        <li>0: close 状态</li>
        <li>1: start 状态</li>
      </ul>
    </td>
    <td>获取共识节点状态</td>
  </tr>
</table>

### 增加共识节点

节点需先被添加成为普通节点（参考普通节点管理），才能申请成为共识节点，由管理员(拥有管理员角色的账号)确认才完成了添加操作。

从普通节点升级到共识节点，具体操作需要用到上面合约方法 `approveNode(address)`。

共识节点管理合约是系统合约，默认将放在创世块上，下面是共识节点管理合约的 hash：

```shell
# solc --hashes system/node_manager.sol --allow-paths .
contract address: 0xffffffffffffffffffffffffffffffffff020001
Function signatures:
    dd4c97a0: approveNode(address)
    2d4ede93: deleteNode(address)
    30ccebb5: getStatus(address)
    609df32f: listNode()
    6ed3876d: listStake()
    51222d50: setStake(address,uint64)
    0c829315: stakePermillage(address)
    645b8b1b: status(address)
```

#### 首先，获取当前链上的共识节点列表：

```bash
$ curl -X POST --data '{"jsonrpc":"2.0","method":"call", "params":[{"to":"0xffffffffffffffffffffffffffffffffff020001", "data":"0x609df32f"}, "latest"],"id":2}' 127.0.0.1:1337

{"jsonrpc":"2.0","id":2,"result":"0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000005000000000000000000000000cb9480d61bf0964687c6839670f1c3e65c1ca193000000000000000000000000dd21b5f342b017a6546a3e5455be1a6e4d6e83a10000000000000000000000000bb7249753e5dcec37c4ad3b917f10c68d64bffa00000000000000000000000011f0bba536cde870fb7c733f93d9b12ecedd13a1"}

```

- to 为共识节点管理合约地址
- data 为 listNode（）的 Function signature

返回值为目前的共识节点地址列表。

下面我们需要将新增的普通节点通过交易的方式升级为共识节点，新增的普通节点的公钥地址，演示中，为 `59a316df602568957f47973332f1f85ae1e2e75e`。

#### 构造交易格式并发送

调用合约遵循 [ABI](https://solidity.readthedocs.io/en/develop/abi-spec.html), 提供工具 `make_tx.py`：

1. 构造 approveNode 交易信息
    
    ```bash
    $ python3 make_tx.py --to "ffffffffffffffffffffffffffffffffff020001" --code "dd4c97a000000000000000000000000059a316df602568957f47973332f1f85ae1e2e75e" --privkey "5f0258a4778057a8a7d97809bd209055b2fbafa654ce7d31ec7191066b9225e6"
    ```

- privkey 是私钥，用来签证，确认交易信息合法，系统默认的几个私钥可以看 [系统合约相关](./chain/config-tool)
- code 前 8 位是函数 hash 值，即 newNode 对应的 hash，后面 64 位是函数的参数 address 的值，即节点地址，不足 64 位用 0 补齐。

1. 发送交易
    
    ```bash
    $ python3 send_tx.py
    --> {"params": ["0a5b0a283030303030303030303030303030303030303030303030303030303030303030303133323431613212013118fface20420ef