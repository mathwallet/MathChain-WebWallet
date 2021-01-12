<template>
  <div id="app">
    <Nav />
    <router-view class="min-height" />
    <Foot />
  </div>
</template>
<script>
import Nav from "@/components/Nav.vue";
import Foot from "@/components/Footer.vue";
import { web3Accounts } from "@polkadot/extension-dapp";
export default {
  components: {
    Nav,
    Foot,
  },
  created() {
    web3Accounts();
    this.getLegalList();
    this.getTokenPrice(this.chainId);
  },
  methods: {
    getLegalList() {
      let coinList = {};
      this.axios
        .get(
          this.marketDomain +
            "api/baseCoinPub?v=1.0" +
            this.webUtil.getCodeTime()
        )
        .then((res) => {
          if (res.data.success) {
            let legalList = res.data.data.legal;
            this.setLegalList(legalList);
            if (legalList && legalList.length > 0) {
              legalList.map((item) => {
                switch (item.alias) {
                  case "CNY":
                    coinList["cn"] = item;
                    break;
                  case "KRW":
                    coinList["ko"] = item;
                    break;
                  default:
                    coinList["en"] = item;
                    break;
                }
              });
              if (!this.legalCoin) {
                let selectedCoin = coinList[this.lang]
                  ? coinList[this.lang]
                  : legalList[0];
                this.setLegalCoin(selectedCoin);
              }
            }
          }
        });
    },
  },
};
</script>
