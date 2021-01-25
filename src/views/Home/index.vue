<template>
  <div class="webwallet">
    <SideBar />
    <section class="main-info" v-if="account">
      <div class="main-container">
        <!-- tab -->
        <ul class="tabs">
          <li
            :class="{ active: selectedTab == 'transfer' }"
            @click="selectedTab = 'transfer'"
          >
            {{ $t("transfer") }}
          </li>
          <li>
            <a
              :href="
                'https://scan.boka.network/#/Galois/account/' + account.address
              "
              target="_blank"
              rel="noopener noreferrer"
              >{{ $t("explorer") }}</a
            >
          </li>
          <li
            v-for="(item, i) in tabList"
            :key="i"
            :class="{ active: selectedTab == item }"
            @click="selectedTab = item"
          >
            {{ $t(item) }}
          </li>
        </ul>
        <!-- tab content -->
        <Transfer v-if="selectedTab == 'transfer'" />
        <EVMAddress v-if="selectedTab == 'EVM_address'" />
        <DID v-if="selectedTab == 'DID'" />
        <Recovery v-if="selectedTab == 'recovery'" />
        <Limit v-if="selectedTab == 'limit'" />
      </div>
    </section>
  </div>
</template>

<script>
import SideBar from "@/components/Sidebar";
import Transfer from "./Transfer";
import EVMAddress from "./EVMAddress.vue";
import DID from "./DID.vue";
import Recovery from "./Recovery.vue";
import Limit from "./Limit.vue";
export default {
  data() {
    return {
      selectedTab: "transfer",
      tabList: ["EVM_address", "DID", "recovery", "limit"],
    };
  },
  created() {
    if (this.account) {
      this.getInfoByAccount();
    } else {
      this.$router.push("/login");
    }
  },
  components: {
    SideBar,
    Transfer,
    EVMAddress,
    DID,
    Recovery,
    Limit,
  },
};
</script>
