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
      <span>{{ bdata.time }}</span>
    </div>
    <div class="item">
      <span>Median Time:</span>
      <span>{{ bdata.mediantime }}</span>
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
  },
  mounted() {
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

  .item span {
  }

  .block {
    margin: 10px;
    border-radius: 10px 10px;
    border: 2px dotted #000000;
  }


</style>
