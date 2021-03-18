<template>
  <form class="basic-form">
    <!-- Token -->
    <div class="token">
      <label>Token</label>
      <select v-model="symbol">
        <option v-for="item in tokenList" :value="item" :key="item">
          {{ item }}
        </option>
      </select>
    </div>

    <label>{{ $t("daily_transfer_limit") }}</label>
    <p>{{ dailyLimit ? dailyLimit : "--" }} {{ symbol }}</p>
    <label>{{ $t("remaining_limit") }}</label>
    <p>{{ remainLimit ? remainLimit : "--" }} {{ symbol }}</p>
    <ul class="basic-group clearfix mt-32">
      <li class="amount">
        <input
          type="number"
          title=""
          placeholder="0"
          v-model="amount"
          @keydown.enter.prevent="adjust"
        />
      </li>
      <li>
        <a class="token btn disabled" v-if="signing">
          {{ $t("signing") }}
        </a>
        <a class="token btn" v-else @click="adjust">{{ $t("adjust") }}</a>
      </li>
    </ul>
    <p class="grey-fsz mt-8">
      {{
        $t("limit_note")
          .replace("d%", webUtil.addCommas(defaultLimit, 0))
          .replace("w%", symbol)
      }}
    </p>
  </form>
</template>
<script>
export default {
  data() {
    return {
      tokenList: ["MATH"],
      amount: "",
      signing: false,
      remainLimit: 1000,
      defaultLimit: 1000,
      limit: {
        daily_limit: "1000000000000000000000",
        monthly_limit: "100000000000000000000000",
        yearly_limit: "1000000000000000000000000000",
      },
    };
  },
  computed: {
    dailyLimit() {
      return this.webUtil.formatByDecimal(
        this.limit.daily_limit,
        this.decimals
      );
    },
  },
  created() {
    this.getLimit();
  },
  methods: {
    async getLimit() {
      this.$loading(1);
      let res = await this.user.getLimit(this.account.address).catch((err) => {
        console.log(err);
      });
      if (res) this.limit = res;
      this.remainLimit = await this.user
        .getRemainLimit(
          this.account.address,
          this.limit.daily_limit,
          this.decimals
        )
        .catch((err) => {
          console.log(err);
        });
      this.$loading(0);
    },
    adjust() {
      if (!this.amount || this.amount > this.defaultLimit) {
        return this.$toast(this.$t("limit_range") + "0 ~ " + this.defaultLimit);
      }

      this.signing = true;
      this.$loading(1);
      let params = {
        daily_limit: this.webUtil.timesByDecimal(this.amount, this.decimals),
        monthly_limit: this.limit.monthly_limit,
        yearly_limit: this.limit.yearly_limit,
      };

      this.user.setSigner(this.account).then((api) => {
        api.tx.balances
          .setLimit(params)
          .signAndSend(this.account.address, (status) => {
            if (status.isCompleted && status.isInBlock && !status.isError) {
              if (status.findRecord("system", "ExtrinsicSuccess")) {
                this.$toast(this.$t("set_success"));
                this.amount = "";
                this.signing = false;
                this.getLimit();
              } else {
                this.signing = false;
                this.$toast(this.$t("set_fail"));
              }
              this.$loading(0);
            }
          })
          .catch((err) => {
            this.$loading(0);
            console.log(err);
            this.$toast(this.$t("set_fail"));
            this.signing = false;
          });
      });
    },
  },
};
</script>
