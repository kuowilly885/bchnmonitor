<template>
  <div class="block-container">
    <div v-tooltip.left="tip" class="block-content-container">
      <img class="block" :src="imgSrcPath">
      <div class="height-container">
        <div class="height" v-bind:class="{ height_black: isDiff, height_red: !isDiff }">{{ block.height }}</div>
      </div>
    </div>
    <div class="vl" v-bind:class="{ vl_black: isDiff, vl_red: !isDiff }">
    </div>
  </div>
</template>

<script scoped>
export default {
  name: "Block",
  data() {
    return {
      imgSrcPath: '/image/cube-same.png',
      isDiff: false,
      tip: ''
    }
  },
  props: {
    block: Object
  },
  methods: {
    getLastHash(hash) {
      return hash ? '...' + hash.substring(hash.length-15, hash.length) : 'none'
    }
  },
  mounted() {
    let bchHash = this.block.bch.hash
    let bchnHash = this.block.bchn.hash
    let bchbchnHash = this.block.bchbchn.hash

    this.isDiff = bchHash == bchnHash && bchnHash == bchbchnHash
    this.imgSrcPath = this.isDiff ? '/image/cube-same.png' : '/image/cube-diff.png'

    this.tip = 'bchabc: ' + this.getLastHash(bchHash) + '\n' + 'bchnode: ' + this.getLastHash(bchnHash) + '\n' + 'bchbchn: ' + this.getLastHash(bchbchnHash)
  }
}
</script>

<style scoped>
  .block-container {
    position: relative;
  }
  .block-content-container {
    cursor: pointer;
    position: relative;
    height: 150px;
    width: 150px;
    left: 50%;
    transform: translateX(-50%);
  }
  .block {
    height: 150px;
    width: 150px;
  }
  .height-container {
    position: absolute;
    height: 92px;
    width: 92px;
    left: 11px;
    top: 47px;
    display: table;
  }
  .height {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    font-weight: bold;
  }
  .height_red {
    color: red;
  }
  .height_black {
    color: black;
  }
  .vl {
    position: relative;
    border-left-width: 8px;
    border-left-style: dotted;
    height: 45px;
    width: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .vl_black {
    border-left-color: black;
  }
  .vl_red {
    border-left-color: red;
  }
</style>
