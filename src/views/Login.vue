<template>
  <section>
    <div class="main-container">
      <img src="@/assets/img/galois_banner.jpg" width="100%" />
      <div class="account-list" v-if="accounts && accounts.length > 0">
        <h4>{{ $t("select_account") }}</h4>
        <ul>
          <li
            v-for="(account, i) in accounts"
            :key="i"
            :class="{ active: account.isActive }"
            @click="selectAction(account)"
          >
            {{ account.address }}
          </li>
        </ul>
      </div>
      <div class="login-info" v-else>
        <h1>{{ $t("webwallet_your_wallet").replace('w%',chain) }}</h1>
        <p>
          {{ $t("webwallet_home_des").replace('w%',symbol) }} {{ symbol }}
        </p>
        <a @click="login" class="btn">{{ $t("webwallet_login") }}</a>
      </div>
    </div>
  </section>
</template>
<script>
import { isWeb3Injected } from "@polkadot/extension-dapp";
export default {
  data() {
    return {
      accounts: [],
    };
  },
  methods: {
    selectAction(account) {
      this.accounts.map((acc) => {
        if (acc.address == account.address) {
          acc.isActive = true;
        } else {
          acc.isActive = false;
        }
      });

      this.setAccount(account);
      this.getInfoByAccount();

      this.$router.push("/");
    },
    login() {
      if (isWeb3Injected) {
        this.user.getAccounts().then((accounts) => {
          if (accounts && accounts.length > 0) {
            this.accounts = accounts;
          }
        });
      } else {
        this.noExtension();
      }
    },
    noExtension() {
      this.$confirm({
        info: this.$t("noMathExtension"),
        yesBtn: this.$t("download")
      }).then(()=>{
        window.open("https://mathwallet.org");
        window.location.reload();
      })
    },
  },
};
</script>
<style scoped>
.login-info {
  font-size: 16px;
  line-height: 1.5;
  color: var(--greyColor);
}

.login-info {
  padding: 64px 24px 48px;
  text-align: center;
}

.login-info h1 {
  font: 500 24px/1.33 Gotham-Medium;
  margin-bottom: 8px;
  color: #000;
}

.login-info .btn {
  display: inline-block;
  margin-top: 48px;
}

.account-list {
  padding: 32px 24px;
}
.account-list h4 {
  font-weight: 500;
}
.account-list ul {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.account-list li {
  margin-top: 16px;
  width: 49%;
  border-radius: 8px;
  padding: 16px 42px 16px 16px;
  background: #efeff4 url("../assets/img/icons/checkbox_off.png") no-repeat
    right 16px center/20px;
  color: #000;
  font-size: 14px;
  line-height: 20px;
  word-break: break-all;
  cursor: pointer;
}
.account-list li.active {
  background-image: url("../assets/img/icons/selected.png");
}
</style>
