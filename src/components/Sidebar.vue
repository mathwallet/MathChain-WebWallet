<template>
  <section v-if="account">
    <article class="user-info text-center">
      <p class="avator">
        <img src="@/assets/img/icons/galois_icon.png" width="100%" />
      </p>
      <h4>Galois Wallet</h4>
      <p>{{ account.address }}</p>
      <a class="copy-btn grey-fsz" @click="copyAction(account.address)">{{
        $t("copy_address")
      }}</a>
      <div class="token-info" v-if="balanceList">
        <p>{{ $t("webwallet_total") }} {{ symbol }}</p>
        <h4>{{ webUtil.addCommas(balanceList.freeBalance, 6) }}</h4>
        <p class="grey-fsz">
          &#8776; {{ totalPrice ? totalPrice : "0.00" }}
          {{ legalCoin ? legalCoin.alias : "USD" }}
        </p>
        <ul class="token-list">
          <li v-for="(value, key) in formatBalanceList" :key="key">
            <p>{{ $t(key) }} {{ symbol }}</p>
            <p>{{ value ? webUtil.addCommas(value, 6) : "0.00" }}</p>
          </li>
        </ul>
      </div>
    </article>
    <div class="refresh-logout">
      <a class="grey-fsz refresh" @click="refresh">{{
        $t("webwallet_refresh")
      }}</a>
      <a class="grey-fsz logout" @click="logoutWallet">{{
        $t("webwallet_logout")
      }}</a>
    </div>
  </section>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      totalPrice: "",
    };
  },
  computed: {
    formatBalanceList() {
      let list = {
        available: 0,
        locked: 0,
      };
      if (this.balanceList) {
        list.available = this.balanceList.availableBalance;
        list.locked = this.balanceList.lockedBalance;
      }
      return list;
    },
  },
  created() {
    this.computePrice();
  },
  methods: {
    ...mapActions(["logout"]),
    async computePrice() {
      if (!this.balanceList || !this.legalCoin) return;
      let price = this.tokenPrice
        ? this.tokenPrice
        : await this.getTokenPrice(this.chainId);
      this.totalPrice = this.webUtil.computePriceByCoin(
        this.balanceList.freeBalance,
        price,
        this.legalCoin,
      );
    },
    refresh() {
      window.location.reload();
    },
    logoutWallet() {
      this.logout();
      window.location.reload();
    },
  },
  watch: {
    balanceList: {
      deep: true,
      handler() {
        this.computePrice();
      },
    },
    legalCoin() {
      this.computePrice();
    },
  },
};
</script>
<style scoped>
.user-info {
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 48px;
  width: 400px;
  background: #fff;
  z-index: 100;
  padding: 32px 16px 0;
  font-size: 12px;
  line-height: 16px;
  overflow-y: scroll;
}

.user-info .avator {
  width: 96px;
  height: 96px;
  display: inline-block;
  border-radius: 50%;
  box-shadow: 0 0 1px 1px var(--pale-grey);
  border: 8px solid #fff;
  overflow: hidden;
  margin-bottom: 12px;
}

.user-info h4 {
  font: 500 20px/1.2 Gotham-Medium;
  margin: 4px 0;
}

.user-info p {
  word-break: break-all;
}

.copy-btn {
  display: block;
  margin-top: 34px;
}

.user-info .token-info {
  margin-top: 32px;
  padding: 32px 0;
  border-top: 1px solid var(--pale-grey);
}

.user-info .token-list {
  margin-top: 32px;
  padding-left: 0;
}

.user-info .token-list li {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.refresh-logout {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 400px;
  padding: 16px 24px;
  background: #fff;
  text-align: left;
}

.refresh-logout a {
  padding-left: 20px;
}

.refresh-logout a:first-child {
  background: url(../assets/img/icons/refresh_grey@2x.png) no-repeat left
    center/16px;
}

.refresh-logout a:last-child {
  background: url(../assets/img/icons/logout_grey@2x.png) no-repeat left
    center/16px;
}

.refresh-logout a:hover:first-child {
  background-image: url(../assets/img/icons/refresh_blue@2x.png);
}

.refresh-logout a:hover:last-child {
  background-image: url(../assets/img/icons/logout_blue@2x.png);
}

.refresh-logout a:first-child {
  border-right: 1px solid var(--pale-grey);
  margin-right: 12px;
  padding-right: 12px;
}

.user-info a:hover,
.refresh-logout a:hover {
  color: var(--blueColor) !important;
  cursor: pointer;
}
</style>
