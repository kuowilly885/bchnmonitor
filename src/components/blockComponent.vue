<template>
  <div class="block-container">
    <div v-on:click="showBlock" v-tooltip.left="tip" class="block-content-container">
      <img class="block" :src="imgSrcPath">
      <img v-if="selected" class="checked" src="/image/checked.png">
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
      tip: '',
      selected: false
    }
  },
  props: {
    block: Object,
    tag: String
  },
  methods: {
    getLastHash(hash) {
      return hash ? '...' + hash.substring(hash.length-10, hash.length) : 'none'
    },
    showBlock () {

      if (this.tag == 'mix') {
        EventBus.$emit('showBlock', this.block)
      } else {
        let block = {
          height: this.block.height,
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
    left: 50%;
    transform: translateX(-50%);
  }
  .checked {
    position: absolute;
  }

  @media screen and (max-width: 500px) { /* size equals or less to mobile */
    .checked {
      height: 10px;
      width: 10px;
    }
  }
  @media screen and (min-width: 501px) and (max-width: 950px) { /* size equals to tablet */
    .checked {
      height: 20px;
      width: 20px;
    }
  }
  @media screen and (min-width: 951px) { /* pc */
    .checked {
      height: 35px;
      width: 35px;
    }
  }



  .height-container {
    position: absolute;
    display: table;
  }
  .height {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    font-weight: bold;
  }

  @media screen and (max-width: 500px) { /* size equals or less to mobile */
    .block-content-container {
      height: 50px;
      width: 50px;
    }
    .block {
      height: 50px;
      width: 50px;
    }
    .height-container {
      height: 31px;
      width: 31px;
      left: 4px;
      top: 15px;
    }
    .height {
      font-size: xx-small;
    }
  }
  @media screen and (min-width: 501px) and (max-width: 950px) { /* size equals to tablet */
    .block-content-container {
      height: 100px;
      width: 100px;
    }
    .block {
      height: 100px;
      width: 100px;
    }
    .height-container {
      height: 61px;
      width: 61px;
      left: 8px;
      top: 31px;
    }
    .height {
      font-size: medium;
    }
  }
  @media screen and (min-width: 951px) { /* pc */
    .block-content-container {
      height: 150px;
      width: 150px;
    }
    .block {
      height: 150px;
      width: 150px;
    }
    .height-container {
      height: 92px;
      width: 92px;
      left: 11px;
      top: 47px;
    }
    .height {
      font-size: x-large;
    }
  }



  .height_red {
    color: red;
  }
  .height_black {
    color: black;
  }
  .vl {
    position: relative;
    border-left-style: dotted;
    width: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  @media screen and (max-width: 500px) { /* size equals or less to mobile */
    .vl {
      border-left-width: 2px;
      height: 10px;
    }
  }
  @media screen and (min-width: 501px) and (max-width: 950px) { /* size equals to tablet */
    .vl {
      border-left-width: 4px;
      height: 23px;
    }
  }
  @media screen and (min-width: 951px) { /* pc */
    .vl {
      border-left-width: 8px;
      height: 45px;
    }
  }

  .vl_black {
    border-left-color: black;
  }
  .vl_red {
    border-left-color: red;
  }
</style>
