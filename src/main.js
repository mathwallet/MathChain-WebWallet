import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import i18n from "@/assets/js/i18n";
import user from "@/assets/js/user";
import webUtil from "@/assets/js/util";
import VueClipboard from "vue-clipboard2";
import Toast from "./components/Toast";
import Loading from "./components/Loading";
import Confirm from "./components/Confirm";
import AliCaptcha from "./components/AliCaptcha";
import "@/assets/css/index.css";

Vue.config.productionTip = false;
Vue.use(VueClipboard);
Vue.use(Toast);
Vue.use(Loading);
Vue.use(Confirm);
Vue.use(AliCaptcha);

import { mapGetters, mapActions } from "vuex";
Vue.mixin({
  data() {
    return {
      user: user,
      webUtil: webUtil,
      axios: axios,
      symbol: "MATH",
      chain: "Galois",
      decimals: 18,
      chainId: 19009,
      ws: null,
      marketDomain: "/market/",
      apiDomain:"/api/",
    };
  },
  computed: {
    ...mapGetters({
      lang: "lang",
      legalCoin: "legalCoin",
      isLoading: "isLoading",
      EVMAddress: "EVMAddress",
      account: "account",
      balanceList: "balanceList",
      tokenPrice: "tokenPrice",
      backupEmail: "backupEmail",
    }),
  },
  methods: {
    ...mapActions([
      "setAccount",
      "setBalanceList",
      "setLegalList",
      "setLegalCoin",
      "setTokenPrice",
      "setEVMAddress",
      "setBackupEmail",
    ]),
    // 复制
    copyAction(val) {
      this.$copyText(val).then(
        () => {
          this.$toast(this.$t("copy_success"));
        },
        () => {
          this.$toast(this.$t("copy_fail"));
        }
      );
    },
    async getTokenPrice(chainId) {
      let url =
        this.marketDomain +
        "api/tokenListPub?type=" +
        chainId +
        this.webUtil.getCodeTime();
      let res = await this.axios.get(url);
      let response = res.data.data;
      if (response && response[0]) {
        this.setTokenPrice(response[0].last2Rmb);
        return response[0].last2Rmb;
      }
      return 0;
    },
    getInfoByAccount() {
      if (!this.account) {
        return false;
      }
      this.getBalanceList();
      this.getEVMAddress();
      this.getBackupEmail();
    },
    async getBalanceList() {
      let list = await this.user.getAllBalance(this.account.address);
      let balanceList = Object.assign({}, list);
      for (var k in balanceList) {
        if (k.includes("Balance")) {
          balanceList[k] = this.webUtil.fixedByDecimal(
            balanceList[k].toString(),
            this.decimals,
            6
          );
        } else {
          balanceList[k] = balanceList[k].toString();
        }
      }
      this.setBalanceList(balanceList);
    },
    getEVMAddress() {
      this.user.getEVMAccount(this.account.address).then((res) => {
        if (res) {
          this.setEVMAddress(res.ethereum.Ethereum);
        } else {
          this.setEVMAddress("");
        }
      });
    },
    getBackupEmail() {
      this.axios
        .get(
          this.apiDomain +
            "apiPolka/getMathDIDBoundEmail?mathAddr=" +
            this.account.address
        )
        .then((res) => {
          if (res.data.success) {
            this.setBackupEmail(res.data.data.email);
          } else {
            this.setBackupEmail("");
          }
        })
        .catch((err) => {
          console.log(err);
          this.setBackupEmail("");
        });
    },
  },
});

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
