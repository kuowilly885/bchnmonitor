<template>
  <div class="block-container">
    <div v-on:click="showBlock" v-tooltip.left="tip" class="block-content-container">
      <img class="block" :src="imgSrcPath">
      <div class="height-container">
        <div class="height" v-bind:class="{ height_black: isSame, height_red: !isSame }">{{ block.height }}</div>
      </div>
    </div>
    <div class="vl" v-bind:class="{ vl_black: isSame, vl_red: !isSame }">
    </div>
  </div>
</template>

<script scoped>

import { EventBus } from '../main.js'

export default {
  name: "Block",
  data() {
    return {
      imgSrcPath: '/image/cube-same.png',
      isSame: false,
      tip: ''
    }
  },
  props: {
    block: Object,
    tag: String
  },
  methods: {
    getLastHash(hash) {
      return hash ? '...' + hash.substring(hash.length-15, hash.length) : 'none'
    },
    showBlock () {

      if (this.tag == 'mix') {
        EventBus.$emit('showBlock', this.block)
      } else {
        let block = {
          bch: { isEmpty: true },
          bchn: { isEmpty: true },
          bchbchn: { isEmpty: true },
        }
        block[this.tag] = this.block
        EventBus.$emit('showBlock', block)
      }
    }
  },
  mounted() {

    if (this.tag == 'mix') {
      let bchHash = this.block.bch.hash
      let bchnHash = this.block.bchn.hash
      let bchbchnHash = this.block.bchbchn.hash

      this.isSame = bchHash == bchnHash && bchnHash == bchbchnHash
      this.imgSrcPath = this.isSame ? '/image/cube-same.png' : '/image/cube-diff.png'

      this.tip = 'bchabc: ' + this.getLastHash(bchHash) + '\n' + 'bchnode: ' + this.getLastHash(bchnHash) + '\n' + 'bchbchn: ' + this.getLastHash(bchbchnHash)
    } else {
      this.isSame = true
      this.imgSrcPath = '/image/cube-same.png'
      this.tip = this.getLastHash(this.block.hash)
    }
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
