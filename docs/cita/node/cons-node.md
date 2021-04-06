---
id: cons-node
title: 共识节点管理
---

CITA 采用[共识节点管理系统合约]来实现共识节点的管理，通过区块链上的合约可以保证共识节点的安全性及一致性。

在 CITA 初始化创世块阶段，需要初始化一个超级管理员地址，其拥有超级管理员角色，将其写入到每个节点的创世块文件中，共识节点管理合约拥有的一个固定地址也写入其中。创世块内容在初始化以后不允许被修改。区块链正常启动之后，将合约写入到创世块中。链外的操作人员可以通过调用 RPC 接口来实现对共识节点的管理。

对于共识节点的管理，包括添加、删除及设置共识节点出块权重。下面我们将用具体的示例来阐述。

* 增加共识节点 - 操作只可由超级管理员执行；
* 删除共识节点 - 操作只可由超级管理员执行；
* 设置共识节点权重。

## 增加共识节点

节点需先被添加成为普通节点（参考普通节点管理），才能申请成为共识节点，由超级管理员（拥有超级管理员角色的账号）确认才完成了添加操作。

从普通节点升级到共识节点，具体操作需要用到下面合约方法 `approveNode(address)`。

共识节点管理合约是系统合约，默认将放在创世块上，下面使用 [solc] 命令（solidity 的命令行编译器，在 CITA 镜像中已安装）查看共识节点管理合约的 hash：

```bash
$ solc --hashes system/node_manager.sol --allow-paths .
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

*首先需要启动一条链，具体方法见快速入门部分*

接下来的测试，用 [cita-cli] 命令行模式（与交互式模式的命令是一致的）进行演示。

### 查看当前的共识节点列表：

```bash
$ cita-cli scm NodeManager listNode --url http://127.0.0.1:1337
```

输出：

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000004000000000000000000000000d0f05f536ffc6a5d27b17cd14a544418b0500e92000000000000000000000000cccda2959225fc79f61f99bed213bd1172a7ea830000000000000000000000000014e2a75b4b5399f09732ecb6ed1a5b389c9e700000000000000000000000003e91911ba91b10dfa41f0a34d4a3c5a4f838eace"
}
```

返回值为目前的共识节点地址列表。

下面我们需要将新增的普通节点通过交易的方式升级为共识节点，新增的普通节点的公钥地址，演示中，为 `0x59a316df602568957f47973332f1f85ae1e2e75e`。

### approve 节点

* 发送交易

```bash
$ cita-cli scm NodeManager approveNode \
    --address 0x59a316df602568957f47973332f1f85ae1e2e75e \
    --admin-private 0x5f0258a4778057a8a7d97809bd209055b2fbafa654ce7d31ec7191066b9225e6 \
    --url http://127.0.0.1:1337
```

  其中 `--admin-privkey` 是超级管理员私钥，系统默认的超级管理员私钥可以看[超级管理员账户信息]。

输出：

```json
{
  "id": 3,
  "jsonrpc": "2.0",
  "result": {
    "hash": "0x286402ed9e27a11dbbcf5fc3b8296c36f66cb39068a3c468c632ee370e81bdb2",
    "status": "OK"
  }
}
```

* 获取 receipt

```bash
$ cita-cli rpc getTransactionReceipt \
    --hash 0x286402ed9e27a11dbbcf5fc3b8296c36f66cb39068a3c468c632ee370e81bdb2 \
    --url http://127.0.0.1:1337
```

输出：

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "blockHash": "0xe7bb245d4ee718703746241c8cf3352063c7761b789b79a74a991d993f6d48e1",
    "blockNumber": "0xba",
    "contractAddress": null,
    "cumulativeQuotaUsed": "0x11660",
    "errorMessage": null,
    "quotaUsed": "0x11660",
    "logs": [
      {
        "address": "0xffffffffffffffffffffffffffffffffff020001",
        "blockHash": "0xe7bb245d4ee718703746241c8cf3352063c7761b789b79a74a991d993f6d48e1",
        "blockNumber": "0xba",
        "data": "0x",
        "logIndex": "0x0",
        "topics": [
          "0x5d55f24dd047ef52a5f36ddefc8c424e4b26c8415d8758be1bbb88b5c65e04eb",
          "0x00000000000000000000000059a316df602568957f47973332f1f85ae1e2e75e"
        ],
        "transactionHash": "0x286402ed9e27a11dbbcf5fc3b8296c36f66cb39068a3c468c632ee370e81bdb2",
        "transactionIndex": "0x0",
        "transactionLogIndex": "0x0"
      }
    ],
    "logsBloom": "0x00000000000000020040000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000010000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000020000000000800000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "root": null,
    "transactionHash": "0x286402ed9e27a11dbbcf5fc3b8296c36f66cb39068a3c468c632ee370e81bdb2",
    "transactionIndex": "0x0"
  }
}
```

  从 `log` 中可以看出本次操作的相关信息。

### 查看当前的共识节点数

```
$ cita-cli scm NodeManager listNode --url http://127.0.0.1:1337
```

输出：

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000005000000000000000000000000d0f05f536ffc6a5d27b17cd14a544418b0500e92000000000000000000000000cccda2959225fc79f61f99bed213bd1172a7ea830000000000000000000000000014e2a75b4b5399f09732ecb6ed1a5b389c9e700000000000000000000000003e91911ba91b10dfa41f0a34d4a3c5a4f838eace00000000000000000000000059a316df602568957f47973332f1f85ae1e2e75e"
}
```

返回值为目前的共识节点地址列表（可以看到新添加的共识节点地址 `0x59a316df602568957f47973332f1f85ae1e2e75e`）

## 删除共识节点

按照以上方法，普通节点可以被添加为共识节点，那么共识节点怎么删除呢？下面是删除共识节点的示例：

删除共识节点需要由超级管理员来完成， 具体操作需要调用 deleteNode(address) 合约方法。

### 获取当前的共识节点列表：

```bash
$ cita-cli scm NodeManager listNode --url http://127.0.0.1:1337
```

输出：

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000005000000000000000000000000d0f05f536ffc6a5d27b17cd14a544418b0500e92000000000000000000000000cccda2959225fc79f61f99bed213bd1172a7ea830000000000000000000000000014e2a75b4b5399f09732ecb6ed1a5b389c9e700000000000000000000000003e91911ba91b10dfa41f0a34d4a3c5a4f838eace00000000000000000000000059a316df602568957f47973332f1f85ae1e2e75e"
}
```

(由于接着上面步骤操作，所以这里有五个共识节点)

### 删除共识节点

* 发送交易

```bash
$ cita-cli scm NodeManager deleteNode \
    --address 0x59a316df602568957f47973332f1f85ae1e2e75e \
    --admin-private 0x5f0258a4778057a8a7d97809bd209055b2fbafa654ce7d31ec7191066b9225e6 \
    --url http://127.0.0.1:1337
```

  其中 `--admin-privkey` 是超级管理员私钥，系统默认的超级管理员私钥可以看[超级管理员账户信息]。

输出：

```json
{
  "id": 3,
  "jsonrpc": "2.0",
  "result": {
    "hash": "0x01a4eac643589780090d5ed9fa1ac56d139776dd79ebc74a6414594d4d607393",
    "status": "OK"
  }
}
```

* 获取 receipt

```bash
$ cita-cli rpc getTransactionReceipt \
    --hash 0x01a4eac643589780090d5ed9fa1ac56d139776dd79ebc74a6414594d4d607393 \
    --url http://127.0.0.1:1337
```

输出：

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "blockHash": "0xc57c25447a24f7bd2b0d5699dfa151ba42456309d9da70101cfb3f599ec77c8d",
    "blockNumber": "0x1db",
    "contractAddress": null,
    "cumulativeQuotaUsed": "0x558c",
    "errorMessage": null,
    "quotaUsed": "0x558c",
    "logs": [
      {
        "address": "0xffffffffffffffffffffffffffffffffff020001",
        "blockHash": "0xc57c25447a24f7bd2b0d5699dfa151ba42456309d9da70101cfb3f599ec77c8d",
        "blockNumber": "0x1db",
        "data": "0x",
        "logIndex": "0x0",
        "topics": [
          "0x74976f07ac4bfb6a02b2dbd3bc158d4984ee6027d938e870692126ca9e1931d5",
          "0x00000000000000000000000059a316df602568957f47973332f1f85ae1e2e75e"
        ],
        "transactionHash": "0x01a4eac643589780090d5ed9fa1ac56d139776dd79ebc74a6414594d4d607393",
        "transactionIndex": "0x0",
        "transactionLogIndex": "0x0"
      }
    ],
    "logsBloom": "0x00000000000000020040000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000100000000000000000000000000000000000000000000000000000000000800000000000000002000000000000000000000000400000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "root": null,
    "transactionHash": "0x01a4eac643589780090d5ed9fa1ac56d139776dd79ebc74a6414594d4d607393",
    "transactionIndex": "0x0"
  }
}
```

  从 `log` 中可以看出本次操作的相关信息。

### 查看当前的共识节点数

```bash
$ cita-cli scm NodeManager listNode --url http://127.0.0.1:1337
```

输出：

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000004000000000000000000000000d0f05f536ffc6a5d27b17cd14a544418b0500e92000000000000000000000000cccda2959225fc79f61f99bed213bd1172a7ea830000000000000000000000000014e2a75b4b5399f09732ecb6ed1a5b389c9e700000000000000000000000003e91911ba91b10dfa41f0a34d4a3c5a4f838eace"
}
```

返回值为目前的共识节点地址列表（可以看到新添加的共识节点地址 59a316df602568957f47973332f1f85ae1e2e75e 已经删除了）

> 以上代码的返回值有所删减，实际操作会略有不同

## 设置共识节点的出块权重

CITA 作为许可链共识节点采用轮流出块的方式进行出块。作为公有许可链可以根据节点的出块权重分配出块权，超级管理员可以设置每个出块节点的 Stake 来调整出块权重。

出块权重按照每个出块节点所占的千分比进行分配，对于小数部分采用的 [Largest_remainder_method] 算法进行分配。
每次出块时，查询共识节点的权重，根据权重计算出每个节点在 1000 个块中可以出的块个数，这 1000 个块算为一个 epoch，再将这 1000 个块出块顺序以创世块的时间戳为种子进行随机排序。
如果在同一个 epoch 中出块节点列表和权重没有变化，共识将会按照此顺序进行出块；如果节点列表和权重有变化，将按照新的顺序进行出块。

[setStake 接口]可对共识节点出块权重进行配置。
[stakePermillage 接口]可查询共识节点出块权重千分比（目前只对 Charge 模型开放）。

[共识节点管理系统合约]: ../sys-contract-interface/interface#interface#approveNode
[setStake 接口]: ../sys-contract-interface/interface#setstake
[solc]: https://solidity-cn.readthedocs.io/zh/develop/installing-solidity.html
[超级管理员账户信息]: ../getting-started/run-cita
[cita-cli]: https://github.com/citahub/cita-cli
[Largest_remainder_method]: https://en.wikipedia.org/wiki/Largest_remainder_method
[stakePermillage 接口]: ../sys-contract-interface/interface#stakepermillage
