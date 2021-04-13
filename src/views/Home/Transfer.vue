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
    <label>{{ $t("webwallet_fee") }} {{ fee ? fee : "-m " }} {{symbol}}</label>

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
      transferFee:0,
    };
  },
  computed: {
    fee() {
      if (this.amount && this.destination && this.amount - 0 > 0) {
        this.getTransferFee(this.destination, this.amount)
        return this.transferFee;
      } else {
        return 0;
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
                this.$toast(this.$t("transfer_success")).then(()=>{
                  window.location.reload();
                })
                this.transferring = false;
              } else {
                this.transferring = false;
                this.$toast(this.$t("transfer_fail"));
              }
              this.$loading(0);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$loading(0);
            this.$toast(this.$t("transfer_fail"));
            this.transferring = false;
          });
      });
    },
    getTransferFee(to, amount) {
      this.user.getApi().then(async (api) => {
        let amountFormat = this.webUtil.timesByDecimal(
          amount,
          this.decimals
        );
        let transfer = await api.tx.balances.transfer(to, amountFormat);
        let payment = await transfer.paymentInfo(this.account.address);
        this.transferFee = this.webUtil.fixedByDecimal(
            payment.partialFee.toString(),
            this.decimals,
            this.decimals
          )
      });
    },
  },
};
</script>
