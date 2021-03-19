---
id: rpc
title: JSON-RPC 列表
---

> **Methods Name Changed ！** For the user of V0.16 and older versions: Please pay attention that we deprecated the pre-fix in the name of JSON-RPC interfaces, which makes it looks more tidy and easier to use.

## JSON-RPC

### peerCount

当前节点连接数。

* 参数

无

* 返回值

`Quantity` - 本节点连接节点个数

示例：

Request：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"peerCount","params":[],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": "0x3"
}
```

* * *

### peersInfo

获取与本节点相连的其它节点信息。

* 参数

无

* 返回值

PeerInfo object - 节点信息对象

* amount：`Quantity` - 和该节点相连的节点数量
* peers：`Object` - 节点信息，包括节点地址和节点 `ip` 地址
* errorMessage：`String` - 错误信息

示例：

Request：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"peersInfo","params":[],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "amount": 3,
    "peers": {
     "0x2aaeacf658e49f58973b4ef6f37a5c574a28822c": "127.0.0.1",
     "0x3ea53608732da3761ef41805da73f0d45d3e8e09": "127.0.0.1",
     "0x01cb0a8012b75ea156eaef3e827547f760dd917a": "127.0.0.1"
    },
    "errorMessage": null
  }
}

```

* * *

### blockNumber

返回当前块高度。

* 参数

无

* 返回值

`Quantity` - 链高度

示例：

Request：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"blockNumber","params":[],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": "0x1d10"
}
```

* * *

### sendRawTransaction

发送交易。

* 参数

`Data`, 签名后的交易数据

```js
const signed_data = "0a9b0412013018fface20420f73b2a8d046060604052341561000f57600080fd5b5b60646000819055507f8fb1356be6b2a4e49ee94447eb9dcb8783f51c41dcddfe7919f945017d163bf3336064604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b5b610178806100956000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b1146100495780636d4ce63c1461006c575b600080fd5b341561005457600080fd5b61006a6004808035906020019091905050610095565b005b341561007757600080fd5b61007f610142565b6040518082815260200191505060405180910390f35b7fc6d8c0af6d21f291e7c359603aa97e0ed500f04db6e983b9fce75a91c6b8da6b816040518082815260200191505060405180910390a1806000819055507ffd28ec3ec2555238d8ad6f9faf3e4cd10e574ce7e7ef28b73caa53f9512f65b93382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b50565b6000805490505b905600a165627a7a72305820631927ec00e7a86b68950c2304ba2614a8dcb84780b339fc2bfe442bba418ce800291241884bfdfd8e417ab286fd761d42b71a9544071d91084c56f9063471ce82e266122a8f9a24614e1cf75070eea301bf1e7a65857def86093b6892e09ae7d0bcdff901"
```

* 返回值

`Data32` - 交易哈希

示例：

Request：
> 注意：测试时不能直接复制如下参数中的数据，因为签名后的交易数据包含交易上链最大区块高度等信息。

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"sendRawTransaction","params":["0x0a910212013218fface20420a0492a8302606060405234156100105760006000fd5b610015565b60e0806100236000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b114604b5780636d4ce63c14606c576045565b60006000fd5b341560565760006000fd5b606a60048080359060200190919050506093565b005b341560775760006000fd5b607d60a3565b6040518082815260200191505060405180910390f35b8060006000508190909055505b50565b6000600060005054905060b1565b905600a165627a7a72305820942223976c6dd48a3aa1d4749f45ad270915cfacd9c0bf3583c018d4c86f9da200291241edd3fb02bc1e844e1a6743e8986a61e1d8a584aac26db5fa1ce5b32700eba5d16ba4c754731f43692f3f5299e85176627e55b9f61f5fe3e43572ec8c535b0d9201"],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "hash": "0x4b5d67c1debdd5899fc7b5cd77e71987b8a2d174b361ca2dd4d713434b4ff037",
        "status": "OK"
    }
}
```

如果是近期发送的重复交易，则会提示重复交易：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "error": {
        "code": -32006,
        "message": "Dup"
    }
}
```

#### 关于签名交易

* CITA 交易结构

```protobuf
// Transaction
syntax = "proto3";
enum Crypto {
    DEFAULT = 0;
    RESERVED = 1;
}

message Transaction {
    string to = 1;
    string nonce = 2;
    uint64 quota = 3;
    uint64 valid_until_block = 4;
    bytes data = 5;
    bytes value = 6;
    uint32 chain_id = 7;
    uint32 version = 8;
    bytes to_v1 = 9;
    bytes chain_id_v1 = 10;
}

message UnverifiedTransaction {
    Transaction transaction = 1;
    bytes signature = 2;
    Crypto crypto = 3;
}
```

一些交易字段的说明：

* `to` 交易接收地址。

调用合约时即为被调用合约的地址，部署合约时不填写该字段。**注意**地址是长度 40 的十六进制字符（160 位），前导 0 不能省略，必须补全。

* `nonce` 交易填充字段。

区块链为了防止重放攻击，会拒绝接收重复的交易。如果交易中仅包含有效的交易数据，会存在两个正常交易完全一样的情况。比如两次转账，如果转账人，收款人和金额都一样，那么两个交易就完全一样。因此需要用户在交易中填充一些内容，使得两个交易不一样。填充内容的形式为字符串，最大长度 128，具体内容用户自己定义。

* `quota` 交易配额。

合约执行是图灵完备的，这也意味着交易执行过程中可能出现死循环等无法终止的情况。因此，每个交易都要填写一个配额，交易执行过程中不断消耗配额，配额耗光后，交易终止执行。

* `valid_until_block` 交易上链最大区块高度。

区块链发送交易和得到交易执行结果是一个异步过程，交易进入交易池即返回交易哈希值。后面需要用户轮询交易什么时候真正上链。由于不同时间系统的拥堵情况，等待时间并不是一个确定值，甚至有可能在后续环节发生错误，最终没有上链。因此用户轮询一段时间之后，发现交易还没有上链，这时无法确定交易的状态（失败还是拥堵）。发送交易操作没有幂等性，因此无法通过重复发送交易来解决这个问题。因此，需要一个类似超时的机制，保证等待一段时间之后，交易的状态就确定是失败的。

`valid_until_block` 字段就是这样一种机制，用来表示用户愿意等待交易上链的最大区块高度。在区块链达到该高度之后，交易就确定不会再上链了，用户可以放心地重新发送交易，或者进行其他的后续处理。实际使用中，**可选值**当前区块高度到当前区块高度 +100 之间。

* `data` 合约对应的 `Bytecode`, 参考：

    - [How-to-get-the-bytecode-of-a-transaction-using-the-solidity-browser](https://ethereum.stackexchange.com/questions/8115/how-to-get-the-bytecode-of-a-transaction-using-the-solidity-browser)
    - [Solidity docs](https://solidity.readthedocs.io/en/develop/)

#### 构造签名

1. 构造 `Transaction` 对象 `tx`，填充 `to(to_v1)` , `nonce`, `valid_until_block`, `quota`, `data`, `value`, `chain_id(chain_id_v1)`, `version` 8 个字段。
2. `tx` 对象 `protobuf` 序列化后按照指定的哈希算法做哈希计算, 得到 `hash` 值。
3. 由发送者使用私钥对 `hash` 进行签名, 得到 `signature`。
4. 构造 `UnverifiedTransaction` , 使用 `hash`, `signature`, `Crypto` 填充构造出 `unverify_tx`。
5. `unverify_tx` 对象 `protobuf` 序列化。

> 填充 to 或者 to_v1, chain_id 或者 chain_id_v1 取决于链的协议版本
>
> version < 1 : 填充 to, chain_id
>
> version > 1 : 填充 to_v1, chain_id_v1

* * *

### getVersion

获取当前 CITA 软件的版本号，默认关闭，如果使用需要在链创建时开启该功能。详细查看[链级配置]中的 `--enable_version` 选项说明。

* 参数

无

* 返回值

`String` - 软件版本号

示例：

Request：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getVersion","params":[],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "softwareVersion": "20.2.0"
  }
}
```

* * *

### getBlockByHash

根据块哈希值查询块。

* 参数

1. `Data32` - 块哈希值
2. `Boolean` - 是否返回交易信息（True：返回详细交易列表 | False：只返回交易哈希）

* 返回值

1. `Object` - 块对象，如果不存在，则返回空

示例：

Request：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getBlockByHash","params":["0x296474ecb4c2c8c92b0ba7800a01530b70a6f2b6e76e5c2ed2f89356429ef329", true],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "version": 0,
        "hash": "0x5038c222d460c32fd06df36d58bb7cf5c368a55e207a46ecb18695451bfe4069",
        "header": {
            "timestamp": 1499756200950,
            "prevHash": "0xb28ec1911d375350664b9673a61d952e9a748f3e63606f1440f313c4911fde58",
            "proof": {
                "proposal": "0x0f25d396361c7d54bb16389f6a14bf95207915f91d180d382093e19adfc4133b",
                "height": 902,
                "round": 0,
                "commits": {
                    "0x2b027dacd33a41ddb09e21805778f19951776ed5": "0x1532c58faedf9e103dd84aa6aacbd2121aa3a8102faa506e7e152fb10e45bafd31b1c3d372cf5d42f8b27a8bfea112ae194de76d99206f73837ad8c30267e6a501",
                    "0x2d74a106464fbdf94e47bb28605a1aa244ab7788": "0x2ec53371cee732d59d23a58cf6cf53d818fb906fdeb5b0521a3a4cdbb75cf29658a1ff5fa95e4dc71563cbed10070c68e2eec0f812fa3be8e019b6df6e9ea66201",
                    "0x3efd4959af72e1214ab83caa0f04a0cc3e54d383": "0xb051f0cc41bc3caed472d3c7a35e06d805e8f6d15ccb3efc257d71ee96932c5877a8e52fc29cb3bef73e0edbad62c617c4dd16763709b2604ab8b1db2d87736301",
                    "0x5223818f7096520bfad68ce3d5ac959267dbc45f": "0x1cf6f8dc9654d461a317db199de0ed0d2d008762833b3358e269ceb3c412b60b3f1a2bd08f969e0dc1c9ebe1a0710002f853438a6ef3ea048de9b4e67387827400"
                }
            },
            "stateRoot": "0xe29266e5574bc0c848b513d36403d4da71f99f328d3324e8d3134809c33d4fb4",
            "transactionsRoot": "0xf31e32611322f410f430ef8141c2237c19dd1034eddef8dedba692ec9851799b",
            "receiptsRoot": "0x9646cf2572734b4b13fe1616446ab2658e208cfdbaf25e47ebea9b6327e10c5b",
            "quotaUsed": "0x0",
            "number": "0x387",
            "proposer":"0xe6d430a2d830236d3774d148cbee72bbf26cd481"
        },
        "body": {
            "transactions": [
                {
                    "hash": "0xf31e32611322f410f430ef8141c2237c19dd1034eddef8dedba692ec9851799b",
                    "content":"0x0a28356230373365393233333934346235653732396534366436313866306438656466336439633334611a80040aba030a28356230373365393233333934346235653732396534366436313866306438656466336439633334611a87030a013010a08d0622fd026060604052341561000c57fe5b5b7f4f8cfde3439a1a302c21ca51eec26086efbfd940b8c0279889fc6bb6e73ecc6633604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a15b5b60fd806100806000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b11460445780636d4ce63c146061575bfe5b3415604b57fe5b605f60048080359060200190919050506084565b005b3415606857fe5b606e60c6565b6040518082815260200191505060405180910390f35b7fc6d8c0af6d21f291e7c359603aa97e0ed500f04db6e983b9fce75a91c6b8da6b816040518082815260200191505060405180910390a1806000819055505b50565b600060005490505b905600a165627a7a7230582079ba3769927f0f8cf4bec7ce02513b56823c8fc3f4047989951e042a9a04651900292080808080101241d51ca7a0171113478f47357a71c240bd0431f52639741a6721725de276a88d2e723b12f4bbeb1cdddea63f947ddb9db6e2667f08a03af1577c42d3c1a3dc5a7c01208080808010"
                }
            ]
        }
    }
}

```

* * *

### getBlockByNumber

根据块高度查询块。

* 参数

1. `Quantity` - 高度
2. `Boolean` - 是否返回交易信息（True：返回详细交易列表 | False：只返回交易哈希）

* 返回值

结果同 [getBlockByHash](#getblockbyhash)

示例：

Request：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getBlockByNumber","params":["0xF9", true],"id":1}' 127.0.0.1:1337 | jq
```

高度参数可以用 0x 开头的十六进制。0x 开头或者十进制整数都是错误的参数格式。

结果同 [getBlockByHash](#getblockbyhash)

* * *

### getTransactionReceipt

根据交易哈希获取交易回执。

* 参数

1. `Data32` - 交易哈希

* 返回值

Object - 回执对象

* transactionHash：`Data32` - 交易哈希
* transactionIndex：`Quantity` - 交易 `index`
* blockHash：`Data32` - 交易所在块的块哈希
* blockNumber：`Quantity` - 交易所在块的块高度
* cumulativeQuotaUsed：`Quantity` - 块中该交易之前（包含该交易）的所有交易消耗的 quota 总量
* quotaUsed：`Quantity` - 交易消耗的 quota 数量
* contractAddress：`Data20` - 如果是部署合约, 这个地址指的是新创建出来的合约地址，否则为空
* logs：`Array` - 交易产生的日志集合
* root：`Data32` - 状态树根
* errorMessage：`String` 错误信息

回执错误：

* No transaction permission - 没有发交易权限
* No contract permission - 没有创建合约权限
* Not enough base quota - [基础配额]不够
* Block quota limit reached - 达到块配额限制
* Account quota limit reached - 达到账户配额限制
* Out of quota - 配额不够
* Cost of transaction exceeds sender balance - 账户余额不足
* Jump position wasn't marked with JUMPDEST instruction - EVM 内部错误
* Instruction is not supported - EVM 内部错误
* Not enough stack elements to execute instruction - EVM 内部错误
* Execution would exceed defined Stack Limit - EVM 内部错误
* EVM internal error - EVM 内部错误
* Mutable call in static context - EVM 内部错误
* Out of bounds - EVM 内部错误
* Reverted - EVM 内部错误，[REVERTED instruction](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-140.md)

示例：

Request：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getTransactionReceipt","params":["0xb38e5b6572b2613cab8088f93e6835576209f2b796104779b4a43fa5adc737af"],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result":{
        "transactionHash": "0xb38e5b6572b2613cab8088f93e6835576209f2b796104779b4a43fa5adc737af",
        "transactionIndex": "0x0",
        "blockHash": "0xe068cf7299450b78fe97ed370fd9ebe09ecbd6786968e474fae862ccbd5c5020",
        "blockNumber": "0xa",
        "cumulativeQuotaUsed": "0x17a0f",
        "quotaUsed": "0x17a0f",
        "contractAddress": "0xea4f6bc98b456ef085da5c424db710489848cab5",
        "logs":[
            {
                "address": "0xea4f6bc98b456ef085da5c424db710489848cab5",
                "topics":[
                    "0x8fb1356be6b2a4e49ee94447eb9dcb8783f51c41dcddfe7919f945017d163bf3"
                ],
                "data": "0x0000000000000000000000005b073e9233944b5e729e46d618f0d8edf3d9c34a0000000000000000000000000000000000000000000000000000000000000064",
                "blockHash": "0xe068cf7299450b78fe97ed370fd9ebe09ecbd6786968e474fae862ccbd5c5020",
                "blockNumber": "0xa",
                "transactionHash": "0xb38e5b6572b2613cab8088f93e6835576209f2b796104779b4a43fa5adc737af",
                "transactionIndex": "0x0",
                "logIndex": "0x0",
                "transactionLogIndex": "0x0"
            }
        ],
        "root": "0xe702d654a292a8d074fd5ba3769b3dead8095d2a8f2207b3a69bd49c91a178af",
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100040000000010000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
    }
}
```

Error：

```json
{
    "contractAddress": "0xbb6f8266fae605da373c2526c386fe07542b4957",
    "cumulativeQuotaUsed": "0x0",
    "logs": [],
    "blockHash": "0x296474ecb4c2c8c92b0ba7800a01530b70a6f2b6e76e5c2ed2f89356429ef329",
    "transactionHash": "0x019abfa50cbb6df5b6dc41eabba47db4e7eb1787a96fd5836820d581287e0236",
    "root": null,
    "errorMessage": "No contract permission.",
    "blockNumber": "0x1da3",
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "transactionIndex": "0x0",
    "quotaUsed": "0x0"
}
```

如果出现 **Timeout，errorcode 99** ，请查看可能的解决方法 [Can't assign requested Address](https://vincent.bernat.im/en/blog/2014-tcp-time-wait-state-linux)

* * *

### getLogs

根据 `Topic` 查询 `logs`。

* 参数

1. `Filter` - 过滤器对象，详见 `Filter` 的说明

* 返回值

`Array` - 日志对象集合，如果没有则为空

* `address` - 合约地址
* `topics`- 用来构造过滤器的索引数组
* `data`- 根据索引数组筛选的日志数据

示例:

Request：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getLogs","params":[{"topics":["0x8fb1356be6b2a4e49ee94447eb9dcb8783f51c41dcddfe7919f945017d163bf3"],"fromBlock": "0x0"}],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result":[
        {
            "address": "0xea4f6bc98b456ef085da5c424db710489848cab5",
            "topics":[
                "0x8fb1356be6b2a4e49ee94447eb9dcb8783f51c41dcddfe7919f945017d163bf3"
            ],
            "data": "0x0000000000000000000000005b073e9233944b5e729e46d618f0d8edf3d9c34a0000000000000000000000000000000000000000000000000000000000000064",
            "blockHash": "0x3e83b74560860344f4c48d7b8089a18173aecd96b6b2148653c61b5d3f559764",
            "blockNumber": "0x4",
            "transactionHash": "0xb38e5b6572b2613cab8088f93e6835576209f2b796104779b4a43fa5adc737af",
            "transactionIndex": "0x0",
            "logIndex": "0x0",
            "transactionLogIndex": "0x0"
        }
    ]
}
```

* * *

### call

合约中读操作类接口调用。

* 参数

1. `CallRequest` - `Call` 请求对象，详见 `CallRequest` 的说明
2. `BlockNumber` - 块高度

* 返回值

`Data32` - 交易哈希

示例：

Request：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"call","params":[{"from":"0xca35b7d915458ef540ade6068dfe2f44e8fa733c","to":"0xea4f6bc98b456ef085da5c424db710489848cab5","data":"0x6d4ce63c"}, "latest"],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x0000000000000000000000000000000000000000000000000000000000000064"
}

```

* * *

### getTransaction

根据交易哈希查询交易。

* 参数

1. `Data32` - 交易哈希值

* 返回值

Object - 交易对象，如果没有则为空

* hash：`Data32` - 交易哈希
* content：`Data` 交易内容
* from：`Data20` - 交易发送者
* blockHash：`Data32` - 交易所在块的块哈希，如果没有，则为空
* blockNumber：`Quantity` - 交易所在块的块高度，如果没有，则为空
* index：`Quantity` - 交易在块交易体内的位置，如果没有，则为空

示例：

Request：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getTransaction","params":["0x019abfa50cbb6df5b6dc41eabba47db4e7eb1787a96fd5836820d581287e0236"],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "hash": "0x019abfa50cbb6df5b6dc41eabba47db4e7eb1787a96fd5836820d581287e0236",
        "content": "0x0a9b0412013018fface20420f73b2a8d046060604052341561000f57600080fd5b5b60646000819055507f8fb1356be6b2a4e49ee94447eb9dcb8783f51c41dcddfe7919f945017d163bf3336064604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b5b610178806100956000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b1146100495780636d4ce63c1461006c575b600080fd5b341561005457600080fd5b61006a6004808035906020019091905050610095565b005b341561007757600080fd5b61007f610142565b6040518082815260200191505060405180910390f35b7fc6d8c0af6d21f291e7c359603aa97e0ed500f04db6e983b9fce75a91c6b8da6b816040518082815260200191505060405180910390a1806000819055507ffd28ec3ec2555238d8ad6f9faf3e4cd10e574ce7e7ef28b73caa53f9512f65b93382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b50565b6000805490505b905600a165627a7a72305820631927ec00e7a86b68950c2304ba2614a8dcb84780b339fc2bfe442bba418ce800291241884bfdfd8e417ab286fd761d42b71a9544071d91084c56f9063471ce82e266122a8f9a24614e1cf75070eea301bf1e7a65857def86093b6892e09ae7d0bcdff901",
        "from": "0x5b073e9233944b5e729e46d618f0d8edf3d9c34a",
        "blockNumber": "0x1da3",
        "blockHash": "0x296474ecb4c2c8c92b0ba7800a01530b70a6f2b6e76e5c2ed2f89356429ef329",
        "index": "0x0"
    }
}
```

* * *

### getTransactionCount

获取指定账户发送交易的数量。

* 参数

1. `Data20` - 账户地址
2. `BlockNumber` - 块高度

* 返回值

`Quantity` - 指定账户从块高 0 到指定高度所发送的交易总量

示例：

Request：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getTransactionCount","params":["0x5b073e9233944b5e729e46d618f0d8edf3d9c34a","latest"],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x1"
}

```

* * *

### getCode

获取合约 `Byte code`。

* 参数

1. `Data20` - 合约地址
2. `BlockNumber` - 块高度

* 返回值

`Data` - 合约 `Byte code`

示例：

Request：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getCode","params":["0xea4f6bc98b456ef085da5c424db710489848cab5", "latest"],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x60606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360fe47b11460445780636d4ce63c146061575bfe5b3415604b57fe5b605f60048080359060200190919050506084565b005b3415606857fe5b606e60c6565b6040518082815260200191505060405180910390f35b7fc6d8c0af6d21f291e7c359603aa97e0ed500f04db6e983b9fce75a91c6b8da6b816040518082815260200191505060405180910390a1806000819055505b50565b600060005490505b905600a165627a7a7230582079ba3769927f0f8cf4bec7ce02513b56823c8fc3f4047989951e042a9a0465190029"
}
```

* * *

### getAbi

获取合约 `ABI`。

* 参数

1. `Data20` - 合约地址
2. `BlockNumber` - 块高度

* 返回值

`Data` - 合约 `ABI` 信息

示例：

Request：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getAbi","params":["0x73552bc4e960a1d53013b40074569ea05b950b4d", "latest"],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x4ed3885e000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001275b7b22636f6e7374616e74223a66616c73652c22696e70757473223a5b7b226e616d65223a2278222c2274797065223a2275696e74323536227d5d2c226e616d65223a22736574222c226f757470757473223a5b5d2c2270617961626c65223a66616c73652c2273746174654d75746162696c697479223a226e6f6e70617961626c65222c2274797065223a2266756e6374696f6e227d2c7b22636f6e7374616e74223a747275652c22696e70757473223a5b5d2c226e616d65223a22676574222c226f757470757473223a5b7b226e616d65223a22222c2274797065223a2275696e74323536227d5d2c2270617961626c65223a66616c73652c2273746174654d75746162696c697479223a2276696577222c2274797065223a2266756e6374696f6e227d5d00000000000000000000000000000000000000000000000000"
}

```

#### 保存 `ABI` 和读取 `ABI` 说明

默认将接收方地址为`0xffffffffffffffffffffffffffffffffff010001` 的交易视为保存合约 `ABI` 交易类型。

#### 保存 ABI

主要步骤：

1. 部署合约，得到合约地址。
2. 使用 `solc` 编译合约代码得到 `ABI`内容，并填充 data 字段。
3. 使用 `cita-cli store abi` 保存 `ABI` 内容。

以 [Test contract] 作为示例：

* 链上部署该合约，得到合约地址
* 首先可以通过 `solc` 得到合约的`ABI`

```shell
$ solc SimpleStorage.sol --abi
```

输出：

```json
[{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]
```

* Store ABI

```bash
$ cita-cli store abi \
    --content '[{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]' \
    --address 0xcf73525b380c5b706f35c1ff02aa798cc9950860 \
    --private-key 0x5f0258a4778057a8a7d97809bd209055b2fbafa654ce7d31ec7191066b9225e6 \
    --url http://127.0.0.1:1337
```

输出：

```json
{
    "id": 4,
    "jsonrpc": "2.0",
    "result": {
        "hash": "0x3690665c3ce5548e74113ab88b1bc81b72f48564211f1341735b9fb17914ff91",
        "status": "OK"
    }
}
```

#### 查询 ABI

```bash
$ cita-cli rpc getAbi \
    --address 0xcf73525b380c5b706f35c1ff02aa798cc9950860 \
    --url http://127.0.0.1:1337
```

输出：

```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": "0x5b7b22636f6e7374616e74223a66616c73652c22696e70757473223a5b7b226e616d65223a2278222c2274797065223a2275696e74323536227d5d2c226e616d65223a22736574222c226f757470757473223a5b5d2c2270617961626c65223a66616c73652c2273746174654d75746162696c697479223a226e6f6e70617961626c65222c2274797065223a2266756e6374696f6e227d2c7b22636f6e7374616e74223a747275652c22696e70757473223a5b5d2c226e616d65223a22676574222c226f757470757473223a5b7b226e616d65223a22222c2274797065223a2275696e74323536227d5d2c2270617961626c65223a66616c73652c2273746174654d75746162696c697479223a2276696577222c2274797065223a2266756e6374696f6e227d5d"
}
```

注：使用 cita-cli 查询到的结果是 abi 字符串的十六进制 Ascii 编码。

* * *

### getBalance

获取账户余额。

* 参数

1. `Data20` - 账户地址
2. `BlockNumber` - 块高度

* 返回值

`Quantity` - 在指定高度的账户余额

示例：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getBalance","params":["0xea4f6bc98b456ef085da5c424db710489848cab5", "latest"],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x0"
}
```

* * *

### newFilter

基于给定的 `Filter` 建立过滤器，监听合约状态变化。合约状态发生改变时，可以调用 `getFilterChanges` 查看状态变化内容。
当 `60s` 内不对 `filter id` 进行操作时，系统会清除建立的过滤器。若要继续使用需重新建立

* 参数

1. `Filter` - 过滤器对象，详见 `Filter` 的说明。 由于是获取上次操作以来的状态改变，所以 Filter 中的 `fromBlock` 以及 `toBlock` 没有作用，可以不用设置。


* 返回值

`Quantity` - 过滤器 id

示例：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"newFilter","params":[{"topics":["0x8fb1356be6b2a4e49ee94447eb9dcb8783f51c41dcddfe7919f945017d163bf3"]}],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": "0x1"
}
```

* * *

### newBlockFilter

创建新块产生过滤器，当新块产生时，记录块哈希值。调用 `getFilterChanges` 查看 `newFilter` 创建时高度之后的块哈希列表。
当 `60s` 内不对 `filter id` 进行操作时，系统会清除建立的过滤器。若要继续使用需重新建立

* 参数

无

* 返回值

`Quantity` - 过滤器 id

示例：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"newBlockFilter","params":[],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
    "id": 1,
    "jsonrpc":  "2.0",
    "result": "0x1"
}
```

* * *

### uninstallFilter

卸载 `filter` 过滤器，在没有监听任务的时候，调用该方法卸载过滤器。

* 参数

1. `Quantity` - 过滤器 id

* 返回值

`Boolean` - 卸载成功返回 true，否则 false

示例：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"uninstallFilter","params":["0xb"],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": true
}
```

* * *

### getFilterChanges

获取最近一次监听内容。

* 参数

1. `Quantity` - 过滤器 id

* 返回值

`Array` - log 对象集合，如果没有，则为空

* 块过滤器（`BlockFilter`）会返回自上次操作过滤器（调用 newBlockFilter 以及 getFilterChanges）以来产生新块的块哈希值集合
* 状态过滤器（`NewFilter`）会根据 `Filter` 过滤返回自上次操作过滤器（调用 newFilter, getFilterLogs 以及 getFilterChanges）状态变化

示例：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getFilterChanges","params":["0x16"],"id":1}' 127.0.0.1:1337 | jq
```

NewFilter Result：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result":[
        {
            "address": "0xea4f6bc98b456ef085da5c424db710489848cab5",
            "topics":[
                "0x8fb1356be6b2a4e49ee94447eb9dcb8783f51c41dcddfe7919f945017d163bf3"
            ],
            "data": "0x0000000000000000000000005b073e9233944b5e729e46d618f0d8edf3d9c34a0000000000000000000000000000000000000000000000000000000000000064",
            "blockHash": "0x3e83b74560860344f4c48d7b8089a18173aecd96b6b2148653c61b5d3f559764",
            "blockNumber": "0x4",
            "transactionHash": "0xb38e5b6572b2613cab8088f93e6835576209f2b796104779b4a43fa5adc737af",
            "transactionIndex": "0x0",
            "logIndex": "0x0",
            "transactionLogIndex": "0x0"
        }
    ]
}
```

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getFilterChanges","params":["0x3"],"id":1}' 127.0.0.1:1337 | jq
```

BlockFilter Result：

```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": [
        "0x2a5da766caf9a83139b15249bbe56f48f51df3124610e007156af8117817c966",
        "0x77eb877cfd841e996d078ff43e81a3700adda27ce9895d224e02a9b78aa01aaa",
        "0x8780527ca2f34c52006b2e1af3b7e6c8f5f26bd1c02c78e0e751f0f44bf66fcf",
        "0x63d7057e10d1441911864167cece31d5065b7efb062cac172d262ed93a749e84"
    ]
}
```

* * *

### getFilterLogs

指定过滤器筛选 log 并返回。

* 参数

1. `Quantity` - 过滤器 id

* 返回值

`Array` - log 对象集合，如果自上次轮询以来没有发生变化，则为空

示例：

结果同 [getFilterChanges](#getfilterchanges)

* * *

### getTransactionProof

根据交易哈希获取交易执行证明。

* 参数

1. `Data32` - 交易哈希

* 返回值

`Data` - 一份包含交易，交易回执，回执树根和块头的证明

示例：

Request：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getTransactionProof","params":["0x37f1261203d7b81a5a5cfc4a5c4abf15297555a47fd8686580d5a211876516c4"],"id":1}' 127.0.0.1:1337 | jq
```

Result：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0xf9070df903f2a09a9102d68052de36b825d5b1f4dc9512684a8b1a61add6337e455ef69eb304e7a044d0da81e6ebd0928c084692e5aacb6f0e56dbd0a064c9639adb7ef9f6fd3b41a037f1261203d7b81a5a5cfc4a5c4abf15297555a47fd8686580d5a211876516c4a02c533219294c9fce960e0749b017a3ce281eb45facaa138123240336fef8327db90100000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000400000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000005b88ffffffffffffffff826d7b86016242114b6f80b902530ace0442000000000000003078306139383765623937646438323539626433623063386665303832303333333762336631386536613161653735613035636261383032336135346563303564355a00000000000000000000000000000004000000000000002a000000000000003078316666333830313730633765633338613831643731636663636433343765653033386464646237304100000000000000cf81312f4118a72b53f35ecd99817cb499597f1ff7132df672e58cbb615180e8535eebe2040d6303b50c55cbe01d01de49512b6dbffc363dd950a4a919b9693b002a000000000000003078383665373133326164326535323433326466323537633630373638373962626334393962343365624100000000000000f75f5b766676560d6e1a116c29ac6176070c5448c453dc68202b4ac7d388c3cc0edf07d2e0c171710c6ec30735d06590b7fa8e3c094a9275df1bfddf026f1a94002a000000000000003078373661393566333633313532666133353338623530366362636539333764343138613164643131644100000000000000cba1c56842458c11245ba64b0fc3f93dc90682b12407623634433a6a22a741af356a2df0603ab6d300b7c8638db7c56761a716d4948da10be177b36193c058e7012a0000000000000030783362313836653138643263353530383661343230323338373239613238303761393364366163633941000000000000000727955db4413d3c7f476d94d7570ae6d6ed4177fff682fde08ee21b1e46e47073d39d22218b55bb56e1e620fb4a5f17c998d9b80892a27fd73d947756483085001002f901e5826d7bb9010000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000040000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000f8dbf8d99473552bc4e960a1d53013b40074569ea05b950b4de1a002d96cafa1b66d774136b3051a7a5675d5cb23a055bfe1410019ec924f4f93acb8a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000073552bc4e960a1d53013b40074569ea05b950b4d00000000000000000000000000000000000000000000000000000000ec90a79a0000000000000000000000000000000000000000000000000000000000000000c001c0f9012c31808398967f9473552bc4e960a1d53013b40074569ea05b950b4d80b8644c6e5926000000000000000000000000000000000000000000000000000000000000000000000000000000000000000073552bc4e960a1d53013b40074569ea05b950b4d000000000000000000000000000000000000000000000000000000000000000281aeb84182e91042d0201d5f3c8def6f7b09a46a02c6d4a9890e878406498f47fc78719a6d86ee0cfb7bba33228649790c7340ea975dbe59b7fd6a0f267de972b1008dbf0180a037f1261203d7b81a5a5cfc4a5c4abf15297555a47fd8686580d5a211876516c4b840c7561cde2792e85c76bf423cf9c339bd085f6ca686e2fe5cb5092c6bff210786790cac0bf6472e6837282bef5e19416e791f5dbf6abbb33e04e4b291d6ef4e1b80"
}
```

* * *

### getMetaData

根据高度查询链上元数据。

* 参数

1. `BlockNumber` - 块高度

* 返回值

    * `chainId` - `Integer` - `version < 1` 时的 `chain_id`
    * `chainIdV1` - `Quantity` - `version > 1` 时的 `chain_id` 用来防止重放攻击，不同链的 chainId 建议设置为不同值
    * `chainName` - `String` - 链名称
    * `operator` - `String` - 链的运营者
    * `genesisTimestamp` - `Integer` - 创世块时间戳
    * `validators` - `[Data20]` - 验证者地址集合
    * `blockInterval` - `Integer` - 出块间隔
    * `tokenName` - `String` - Token 名称
    * `tokenSymbol` - `String` - Token 标识
    * `tokenAvatar` - `String` - Token 标志
    * `version` - `Integer` - 链版本
    * `economicalModel` - `EconomicalModel` - 链经济模型

示例：

Request：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getMetaData","params":["latest"],"id":1}' 127.0.0.1:1337
```

Result：

```json
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": {
        "blockInterval": 3000,
        "chainId": 0,
        "chainIdV1": "0x1",
        "chainName": "test-chain",
        "economicalModel": 1,
        "genesisTimestamp": 1541058686340,
        "operator": "test-operator",
        "tokenAvatar": "https://cdn.citahub.com/icon_cita.png",
        "tokenName": "CITA Test Token",
        "tokenSymbol": "CTT",
        "validators": [
            "0xc489d5cb6f497e4708cc8c3805473b9528f83c7a",
            "0x497c68f02bbe335cc879356af120371ebf6cbc29",
            "0x6fbb4c8bb76ace631d634545fe39cbee979dd08e",
            "0x3c0f681e13f18b51d5350823eae45cb502231cf4"
        ],
        "version": 1,
        "website": "https://www.example.com"
    }
}
```

* * *

### getBlockHeader

根据块高度获取块头，为侧链设计。

* 参数

1. `BlockNumber` - 块高度

* 返回值

`Data` - 块头序列化后的字节码

示例：

Request：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getBlockHeader","params":["latest"],"id":1}' 127.0.0.1:1337
```

Result：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0xf90405a09e0de735f97a187a7283e72f334b387ab666d162094a47ca0aacc4fe2daba5eba0eb31a422e6241fabb1f875be997f5a59f840c6887384ad443fa34889e11dc887a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421b90100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000388ffffffffffffffff80860165132998dd80b902530ace0442000000000000003078393835633635353039613538393634386138313930363262363166393361356263343132326538346330643866373066383434393234653664626131366166370200000000000000000000000000000004000000000000002a000000000000003078336537356436306637393863366564663763623532396231326564316261373062303166323938654100000000000000f7ac260d88a06e58e455c9e35a6e455f36db576158622ead6e1b19fa512278ef5b0c71a1b9359f97f744934430935e9367ddbdd29b5afc05891786714d42b5b9002a00000000000000307835396463373465306436366538653338366336353966303030616339306436323134326233333563410000000000000049853ccffbff1524c132de60eaf0d053864db0d31ca33cb0358097177c2ac89a7d0e471e3f0552b2472aef7151627c28941cd36781e0abf8fde8b8bca6662665002a0000000000000030783866613166633631326666633435663538386564306561653938376233656532643031616262656441000000000000003134f9bde5d8de7fc35186506295a0560a11397602c3cd3ffd50aef80b3df7ec6797b7966dc648ef19be06cb050cd1f1f271a782a12a7ddc312890d02c047156012a000000000000003078343435386466626535323163393064356436316639633566333466636338666431643966313133664100000000000000fe398b42155b78b5b3670f3093a00361d9d3d4e56ceace1ec9176467f77ab1d47a280531adcb758f9292d4c91dfbda247c601d37b0877fd5b5dc6b2cda5a9b7c001002943e75d60f798c6edf7cb529b12ed1ba70b01f298e"
}
```

* * *

### getStateProof

获取指定高度状态里，某个键值的状态证明，为侧链设计。

* 参数

1. `Data20` - 合约地址
2. `Data32` - `key` 值和键值对的位置
3. `BlockNumber` - 块高度

* 返回值

`Data` - 某一个值的状态证明，包含合约地址，账户证明，键值证明

示例：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getStateProof","params":["0xad54ae137c6c39fa413fa1da7db6463e3ae45664", "0xa40893b0c723e74515c3164afb5b2a310dd5854fac8823bfbffa1d912e98423e", "16"],"id":1}' 127.0.0.1:1337
```

Result：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0xf902a594ad54ae137c6c39fa413fa1da7db6463e3ae45664f901eeb90114f9011180a088e2efeed0516020141cbbba149711e0ce67634363097a441520704040aa8dd9a0479ca451cdb343dd2eedbf313e805983e87c0f4f16e9c14f28ab3f1750eb1b8e80a0dd94e00536c62d8c801b8496fb0834ab7225954bac452a7d14c0f4a35df81074a07c689f1111314c391b164c458f902366bb18b90a53d9000a1ffd41abc96373d380808080a0b219eebc746ca232aa4a839213565d1932b4b952c93c5aa585e226ac5412d836a0b758264786a8fb6eaa6f7f2185a3f38111de3c532517ef4e46b99b80e4866d27a093ddedf515207b9a68b50f5f344aae23e709316d96345b146746ae2e511893178080a03b5530655278a731d4c895c92359fb217c64f9fde0c6945339863638396627f480b853f851808080808080808080808080a0d7a0fd35748eceb8fc8040517033416adcfb5523f4abe9789b749700c36b4ba5a0e4fe51db54afdd475e2c50888623567385f2b3694ffdb33c92a1bc782de44be7808080b880f87e942054ae137c6c39fa413fa1da7db6463e3ae45664b867f8658080a0a860517f2f639d5c3e9e8a8c04ef6c71018e18cd0881099776a73653973f90a4a00f1cd9fb6dda499878b60cdb90cf0acf25424afb5583131e4dff5e512cd64a4da0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470a0a40893b0c723e74515c3164afb5b2a310dd5854fac8823bfbffa1d912e98423ef87cb853f851a02c839c2946385ef0a820355b6969c49c97bdaa6a19b02384bcc39c992046d6b9808080808080808080a051be428c087e3544a47f273c93ffcb9999267593d3b36042a9d3e96ed068fceb808080808080a6e5a0340893b0c723e74515c3164afb5b2a310dd5854fac8823bfbffa1d912e98423e83827a02"
}
```

* * *

### getStorageAt

获取合约中在指定高度的 `Key` 对应值。

* 参数

1. `Data20` - 合约地址
2. `Data32` - `key`值和相对位置
3. `BlockNumber` - 块高度

* 返回值

`Data` - 指定高度下，合约 `key` 值对应的 `value` 值

示例：

```shell
$ curl -X POST --data '{"jsonrpc":"2.0","method":"getStorageAt","params":["0xffffffffffffffffffffffffffffffffff020000", "0x0000000000000000000000000000000000000000000000000000000000000007", "latest"],"id":1}' 127.0.0.1:1337
```

Result：

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": "0x000000000000000000000000ffffffffffffffffffffffffffffffffff02000d"
}
```

* * *

[How-to-get-the-bytecode-of-a-transaction-using-the-solidity-browser]: https://ethereum.stackexchange.com/questions/8115/how-to-get-the-bytecode-of-a-transaction-using-the-solidity-browser
[Ethereum Contract ABI]: https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI
[Solidity docs]: https://solidity.readthedocs.io/en/develop/
[Test contract]: https://github.com/citahub/test-contracts/blob/master/SimpleStorage.sol
[链级配置]: ../configuration-guide/chain-config
[基础配额]: ../faq#什么是交易的基础配额
