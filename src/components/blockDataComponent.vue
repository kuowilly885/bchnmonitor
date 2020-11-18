<template>
  <div class="block">
    <h1 class="title">{{ bdata.tag }}</h1>
    <div class="item">
      <span>Height:</span>
      <span>{{ bdata.height }}</span>
    </div>
    <div class="item">
      <span>Size:</span>
      <span>{{ bdata.size }}</span>
    </div>
    <div class="item">
      <span>Version:</span>
      <span>{{ bdata.version }}</span>
    </div>
    <div class="item">
      <span>Version Hex:</span>
      <span>{{ bdata.versionHex ? bdata.versionHex : 'null' }}</span>
    </div>
    <div class="item">
      <span>Time:</span>
      <span>{{ `${bdata.time} (${this.getTime(bdata.time)} ago)` }}</span>
    </div>
    <div class="item">
      <span>Median Time:</span>
      <span>{{ `${bdata.mediantime} (${this.getTime(bdata.mediantime)} ago)` }}</span>
    </div>
    <div class="item">
      <span>Nonce:</span>
      <span>{{ bdata.nonce }}</span>
    </div>
    <div class="item">
      <span>Bits:</span>
      <span>{{ bdata.bits }}</span>
    </div>
    <div class="item">
      <span>Nunber of Txs:</span>
      <span>{{ bdata.nTx }}</span>
    </div>
    <div class="item">
      <span>Chainwork:</span>
      <span>{{ bdata.chainwork }}</span>
    </div>
    <div class="item">
      <span>Previous Hash:</span>
      <span>{{ bdata.previousblockhash }}</span>
    </div>
    <div class="item">
      <span>Merkle Root:</span>
      <span>{{ bdata.merkleroot }}</span>
    </div>
    <div class="item">
      <span>Hash:</span>
      <span>{{ bdata.hash }}</span>
    </div>
  </div>
</template>

<script scoped>
export default {
  name: "BlockData",
  data() {
    return {
    }
  },
  props: {
    bdata: Object
  },
  methods: {
    getTime(time) {
      let timeDiff = Math.round(new Date().getTime() / 1000) - time
      if (timeDiff < 60) {
        return timeDiff + ' secs'
      } else if (timeDiff < 3600) {
        return Math.round(timeDiff / 60) + ' mins'
      } else if (timeDiff < 86400) {
        return Math.round(timeDiff / 3600) + ' hrs'
      }
      return Math.round(timeDiff / 86400) + ' days'
    }
  },
  mounted() {
    this.getTime(this.bdata.time)
  }
}
</script>

<style scoped>
  .title {
    margin: 10px;
  }

  .item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
  }

  .item span:nth-child(1) {
    font-weight: bold;
  }

  .item span:nth-child(2) {
    font-style: italic;
  }

  .block {
    margin: 10px;
    border-radius: 10px 10px;
    border: 2px dotted #000000;
  }


</style>
