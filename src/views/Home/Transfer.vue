<template>
  <form class="basic-form">
    <label>{{ $t("webwallet_to_address") }}</label>
    <input
      type="text"
      :placeholder="$t('webwallet_to_address_pl')"
      v-model="destination"
    />
    <ul class="basic-group clearfix">
      <li class="amount">
        <label>{{ $t("transfer_amount") }}</label>
        <input type="text" placeholder="0" v-model="amount" />
      </li>
      <li class="token">
        <label>Token</label>
        <select v-model="symbol">
          <option v-for="item in tokenList" :value="item" :key="item">
            {{ item }}
          </option>
        </select>
      </li>
    </ul>
    <label>{{ $t("webwallet_fee") }} {{ fee ? fee : "-m " + symbol }}</label>

    <a class="block-btn btn disabled" v-if="transferring">{{$t("signing")}}</a>
    <a class="block-btn btn" v-else @click="sendTransfer">{{$t("transfer")}}</a>
  </form>
</template>
<script>
export default {
  data() {
    return {
      amount: "",
      destination: "",
      transferring: false,
      tokenList: ["MATH"],
      transferFee: [],
    };
  },
  computed: {
    fee() {
      if (this.amount && this.destination && this.amount - 0 > 0) {
        this.getTransferFee(this.destination, this.amount).then((res) => {
          this.$set(this.transferFee, 0, res);
        });
        return this.transferFee[0];
      } else {
        return "-m " + this.symbol;
      }
    },
  },
  methods: {
    sendTransfer() {
      if (!this.destination) {
        this.$toast(this.$t("transfer_account_null"));
        return false;
      }
      if (!this.amount) {
        this.$toast(this.$t("transfer_amount_null"));
        return false;
      }
      if (this.amount < Math.pow(10, -this.decimal)) {
        this.$toast(
          this.$t("transfer_amount_min") + Math.pow(10, -this.decimal)
        );
        return false;
      }
      if (this.amount - 0 > this.balanceList.availableBalance) {
        this.$toast(this.$t("webwallet_amount_not_enough"));
        return false;
      }

      this.transferring = true;
      this.$loading(1);
      let destination = this.webUtil.trimString(this.destination);
      let amount = this.webUtil.timesByDecimal(this.amount, this.decimals);

      this.user.setSigner(this.account).then((api) => {
        api.tx.balances
          .transfer(destination, amount)
          .signAndSend(this.account.address, (status) => {
            if (status.isCompleted && status.isInBlock && !status.isError) {
              if (status.findRecord("system", "ExtrinsicSuccess")) {
                this.$loading(0);
                this.$toast(this.$t("transfer_success"));
                this.transferring = false;
                setTimeout(() => {
                  window.location.reload();
                }, 2000);
              } else {
                this.$loading(0);
                this.transferring = false;
                this.$toast(this.$t("transfer_fail"), 3000);
              }
            }
          })
          .catch((err) => {
            console.log(err);
            this.$loading(0);
            this.$toast(this.$t("transfer_fail"), 3000);
            this.transferring = false;
          });
      });
    },
    getTransferFee(to, amount) {
      return this.user.getApi().then(async (api) => {
        let amountFormat = this.webUtil.timesByDecimal(amount, this.decimal);
        let transfer = await api.tx.balances.transfer(to, amountFormat);
        let payment = await transfer.paymentInfo(this.account.address);
        return payment.partialFee.toHuman();
      });
    },
  },
};
</script>
