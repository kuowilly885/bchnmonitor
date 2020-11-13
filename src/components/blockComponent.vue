<template>
  <div class="block-container">
    <div v-tooltip.left="'bch-abc: ...' + block.bch.hash.substring(block.bch.hash.length-10, block.bch.hash.length) + '\n' + 'bchnode: ...' + block.bchn.hash.substring(block.bchn.hash.length-10, block.bchn.hash.length) + '\n' + 'bchbchn: ...' + block.bchbchn.hash.substring(block.bchbchn.hash.length-10, block.bchbchn.hash.length)" class="block-content-container">
      <img class="block" :src="imgSrcPath">
      <div class="height-container">
        <div class="height">{{ block.height }}</div>
      </div>
    </div>
    <div class="vl">
    </div>
  </div>
</template>

<script scoped>
export default {
  name: "App",

  methods: {
    getImgSrcPath () {
      if (this.block.bch.hash == this.block.bchn.hash && this.block.bchn.hash == this.block.bchbchn.hash) {
        return '/image/cube-same.png'
      } else {
        return '/image/cube-diff.png'
      }
    }
  },


  data() {
    return {
      imgSrcPath: this.getImgSrcPath()
    }
  },
  props: {
    block: Object
  }
};
</script>

<style>
  .block-container {
    position: relative;
  }
  .block-content-container {
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
  .vl {
    position: relative;
    border-left: 8px dotted black;
    height: 45px;
    width: 0;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
