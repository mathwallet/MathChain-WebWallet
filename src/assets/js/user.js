import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  isWeb3Injected,
  web3Accounts,
  web3Enable,
  web3FromSource,
} from "@polkadot/extension-dapp";

web3Enable("mathwallet");

class User {
  constructor() {
    let provider = new WsProvider("wss://galois.maiziqianbao.net/ws");

    this.api = ApiPromise.create({
      provider,
      types: {
        Address: "MultiAddress",
        LookupSource: "MultiAddress",
        Account: {
          nonce: "U256",
          balance: "U256",
        },
        Transaction: {
          nonce: "U256",
          action: "String",
          gas_price: "u64",
          gas_limit: "u64",
          value: "U256",
          input: "Vec<u8>",
          signature: "Signature",
        },
        Signature: {
          v: "u64",
          r: "H256",
          s: "H256",
        },
        ExitReason: "U256",
        AccountServiceEnum: {
          _enum: {
            Nickname: "String",
            Ethereum: "H160",
          },
        },
        MultiAddressDetails: {
          nickname: "AccountServiceEnum",
          ethereum: "AccountServiceEnum",
        },
        Nickname: "String",
        Ethereum: "H160",
      },
    });
  }

  async getApi() {
    return await this.api;
  }

  // 获取钱包账号
  async getAccounts() {
    if (isWeb3Injected) {
      return await web3Accounts({ ss58Format: 40 }).then((accounts) => {
        accounts.map((account) => {
          account.isActive = false;
        });
        return accounts;
      });
    }
  }

  // 获取 EVM 账号
  async getEVMAccount(account) {
    const api = await this.api;
    return await api.query.accountService
      .multiAddressOf(account)
      .then((res) => {
        if (
          res.toHuman() &&
          res.toHuman().ethereum.Ethereum !=
            "0x0000000000000000000000000000000000000000"
        ) {
          return res.toHuman();
        }
        return null;
      });
  }

  // 签名操作
  async signMessage(account, str = "Hello world") {
    const injector = await web3FromSource(account.meta.source);
    let signRes = await injector.signer.signMessageByMath(
      account.address,
      str,
      "Sign message by Math",
      false
    );
    let result = {};
    if (signRes && signRes.length > 0) {
      signRes.map((v) => {
        if (v.chain == "ethereum") {
          result.ethAddr = v.address;
          result.ethSign = v.signature;
        } else {
          result.mathAddr = v.address;
          result.mathSign = v.signature;
        }
      });
    }
    return result;
  }

  // 操作方法
  async setSigner(account) {
    const api = await this.api;
    const injector = await web3FromSource(account.meta.source);
    api.setSigner(injector.signer);
    return api;
  }

  // 获取账户余额
  async getBalance(account) {
    const api = await this.api;
    return await api.derive.balances.all(account).then((res) => {
      return res.availableBalance.toString();
    });
  }

  async getAllBalance(account) {
    const api = await this.api;
    return await api.derive.balances.all(account).then((res) => {
      return res;
    });
  }

  async getBalanceBySystem(account) {
    const api = await this.api;
    return await api.query.system.account(account).then((res) => {
      return res;
    });
  }
}

export default new User();
