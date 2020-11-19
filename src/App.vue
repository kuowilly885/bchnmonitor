<template>
  <div class="master">
    <loadingComponent class="" :active.sync="isBlocksDataLoading"
      :can-cancel="false"
      :lock-scroll="true"
      :is-full-page="true"></loadingComponent>
      <div class="header">
          <div class="title"> BCH HF Monitor</div>
          <div class="menu">
              <div><a v-on:click="changeTab" v-bind:class="{ selected: tab == 'mix', normal: tab != 'mix' }" tab="mix">MIX</a></div>
              <div><a v-on:click="changeTab" v-bind:class="{ selected: tab == 'bch', normal: tab != 'bch' }" tab="bch">ABC</a></div>
              <div><a v-on:click="changeTab" v-bind:class="{ selected: tab == 'bchn', normal: tab != 'bchn' }" tab="bchn">NODE</a></div>
              <div><a v-on:click="changeTab" v-bind:class="{ selected: tab == 'bchbchn', normal: tab != 'bchbchn' }" tab="bchbchn">ABC NODE</a></div>
          </div>
      </div>
      <div class="page_container">
        <div class="blockdata_container">
          <div class="blocksection">
            <blockDataComponent v-for="bdata in bdatas" :key="bdata.tag" :bdata="bdata"/>
          </div>
        </div>
        <div class="chain_container">
          <div class="search">
            <input class="searchbar" placeholder="height" v-model="gotoHeight">
            <img class="searchicon" src="/image/search.png" v-on:click="handleGotoHeight">
          </div>
          <div class="chain">
            <div v-if="blocks.length && blocks[0].height != topHeight" v-observe-visibility="handleScrolledToTop"></div>
            <blockComponent v-for="block in blocks" :key="block.height" :block="block" :tag="tab" :id="'block-' + block.height" :ref="'block-' + block.height"/>
            <div v-if="blocks.length" v-observe-visibility="handleScrolledToBottom"></div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>

import axios from 'axios'
import blockComponent from './components/blockComponent'
import blockDataComponent from './components/blockDataComponent'
import { EventBus } from './main.js';
import loadingComponent from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  name: "App",
  components: {
    blockComponent,
    blockDataComponent,
    loadingComponent
  },
  data() {
    return {
      blocks: [],
      afterHeight: 0,
      tab: 'mix',
      bdatas: [],
      isBlocksDataLoading: true,
      topHeight: 0,
      gotoHeight: null,
      selectedHeight: -1
    }
  },
  methods: {
    showBlockBroadcast (blockToShow) {
      if (this.tab == 'mix') {
        EventBus.$emit('showBlock', blockToShow)
      } else {
        let block = {
          height: blockToShow.height,
          bch: { isEmpty: true },
          bchn: { isEmpty: true },
          bchbchn: { isEmpty: true },
        }
        block[this.tab] = blockToShow
        EventBus.$emit('showBlock', block)
      }
    },
    async getTopBlocks () {
      let afterHeight = -1
      if (this.tab == 'mix') {
        let res = await axios.get('/api/mix/blocks')
        let topHeightOfBch = res.data.bch.blocks.length == 0 ? -1 : res.data.bch.blocks[0].height
        let topHeightOfBchn = res.data.bchn.blocks.length == 0 ? -1 : res.data.bchn.blocks[0].height
        let topHeightOfBchBchn = res.data.bchbchn.blocks.length == 0 ? -1 : res.data.bchbchn.blocks[0].height
        afterHeight = Math.max(topHeightOfBch, topHeightOfBchn, topHeightOfBchBchn) + 1
      } else {
        let res = await axios.get('/api/'+this.tab+'/blocks')
        let topHeightOfBch = res.data.blocks.length == 0 ? -1 : res.data.blocks[0].height
        afterHeight = topHeightOfBch + 1
      }

      let res = await this.getBlocksByHeight(afterHeight)
      this.afterHeight = res.afterHeight
      this.blocks = res.blocks
      this.$nextTick(() => {
        document.getElementById('block-' + (afterHeight - 1)).scrollIntoView(true)

        if (res.blocks.length > 0) {
          this.topHeight = res.blocks[0].height
          this.showBlockBroadcast(res.blocks[0])
        }

        this.isBlocksDataLoading = false
      })
    },
    async getBlocksByHeight (afterHeight) {
      let blocks = []
      let isReachToEnd = false
      let height = -1
      if (this.tab == 'mix') {
        let res = await axios.get('/api/mix/blocks?afterHeight='+afterHeight)
        console.log('afterHeight: ' + afterHeight)
        console.log(res.data)
        let bchMap = this.getMap(res.data.bch)
        let bchnMap = this.getMap(res.data.bchn)
        let bchbchnMap = this.getMap(res.data.bchbchn)

        height = afterHeight - 1
        for (let i = 0 ; i < 10 ; i++, height--)  {

          let bchBlk = bchMap[height]
          let bchnBlk = bchnMap[height]
          let bchbchnBlk = bchbchnMap[height]

          let block = {
            height: height,
            bch: bchBlk ? bchBlk : { isEmpty: true },
            bchn: bchnBlk ? bchnBlk : { isEmpty: true },
            bchbchn: bchbchnBlk ? bchbchnBlk : { isEmpty: true }
          }

          if (!block.bch.isEmpty || !block.bchn.isEmpty || !block.bchbchn.isEmpty) {
            blocks.push(block)
          } else {
            isReachToEnd = true
            break
          }
        }
      } else {
        let res = await axios.get('/api/' + this.tab + '/blocks?afterHeight='+afterHeight)
        let map = this.getMap(res.data)
        height = afterHeight - 1

        for (let i = 0 ; i < 10 ; i++, height--)  {
          let blk = map[height]
          let block = blk ? blk : { isEmpty: true }
          if (!block.isEmpty) {
            blocks.push(block)
          } else {
            isReachToEnd = true
            break
          }
        }

      }

      if (isReachToEnd) {
        afterHeight = -1
      } else {
        afterHeight = height + 1
      }

      return { blocks, afterHeight }
    },
    async handleScrolledToBottom (isVisible) {
      if (!isVisible) {
        return
      } else if (this.afterHeight != -1) {
        this.isBlocksDataLoading = true
        let res = await this.getBlocksByHeight(this.afterHeight)
        this.afterHeight = res.afterHeight
        for (let i = 0 ; i < res.blocks.length - 1 ; i++) {
          this.blocks.push(res.blocks[i])
        }
        this.blocks.push(res.blocks[res.blocks.length - 1])
        this.$nextTick(() => {
          this.isBlocksDataLoading = false
        })
      }
    },
    async handleScrolledToTop (isVisible) {
      if (!isVisible) {
        return
      } else {
        if (!this.isBlocksDataLoading) {
          this.isBlocksDataLoading = true
        }

        let originalHeight = this.blocks[0].height
        let afterHeight
        let top = 10

        if (this.topHeight - originalHeight >= 10) {
          afterHeight = originalHeight + 11
        } else {
          afterHeight = this.topHeight + 1
          top = this.topHeight - originalHeight
        }

        let res = await this.getBlocksByHeight(afterHeight)

        if (res.blocks.length > 0) {
          for (let i = top - 1; i > 0 ; i--) {
            this.blocks.unshift(res.blocks[i])
          }

          this.blocks.unshift(res.blocks[0])
          this.$nextTick(() => {
            document.getElementById('block-' + originalHeight).scrollIntoView(true)
            this.isBlocksDataLoading = false
          })
        }
      }
    },
    async handleGotoHeight () {
      let gotoHeight = -1
      if (this.gotoHeight != null && !isNaN(gotoHeight = Number(this.gotoHeight))) {
        this.isBlocksDataLoading = true
        let res = await this.getBlocksByHeight(gotoHeight + 1)
        if (res.blocks.length > 0 && res.afterHeight != -1) {
          this.afterHeight = res.afterHeight
          this.blocks = res.blocks
          this.$nextTick(() => {
            document.getElementById('block-' + gotoHeight).scrollIntoView(true)
            if (gotoHeight == this.topHeight) {
              this.isBlocksDataLoading = false
            }
            this.showBlockBroadcast(this.blocks[0])
          })
        } else {
          this.isBlocksDataLoading = false
        }
      }
    },
    updateBlocks (blocks, isToReplace) {
      if (isToReplace) {
        this.blocks = blocks
      } else {
        for (let block of blocks) {
          this.blocks.push(block)
        }
      }
      this.isBlocksDataLoading = false
    },
    getMap (chain) {
      let map = {}
      for (let block of chain.blocks) {
        if (block) {
          map[block.height] = block
        }
      }
      return map
    },
    showBlock (block) {
      let prev = this.$refs['block-' + this.selectedHeight]
      if (prev && prev[0] != null) {
        prev[0].selected = false
      }

      this.$refs['block-' + block.height][0].selected = true
      this.selectedHeight = block.height

      let bdatas = []
      if (!block.bch.isEmpty) {
        bdatas.push(block.bch)
        block.bch.tag = 'BCH'
      }

      if (!block.bchn.isEmpty) {
        bdatas.push(block.bchn)
        block.bchn.tag = 'BCH NODE'
      }

      if (!block.bchbchn.isEmpty) {
        bdatas.push(block.bchbchn)
        block.bchbchn.tag = 'BCH ABC NODE'
      }

      this.bdatas = bdatas
    },
    changeTab (e) {
      let tab = e.currentTarget.getAttribute('tab')
      if (tab != this.tab) {
        this.gotoHeight = null
        this.isBlocksDataLoading = true
        this.blocks = []
        this.afterHeight = 0
        this.tab = tab
        this.bdatas = []
        this.getTopBlocks()
      }
    }
  },
  mounted() {
    EventBus.$on('showBlock', this.showBlock)
    this.getTopBlocks()
  }
}
</script>

<style scoped>
  .master {
    position: relative;
    height: inherit;
  }

  .header {
    position: fixed;
    width: 100% ;
    background-color: rgb(40,0,0);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    z-index: 100;

  }

  .header .title {
    color: white;
  }

  @media screen and (max-width: 500px) { /* size equals or less to mobile */
    .header .title {
      font-size: small;
      margin-left: 10px;
    }
  }
  @media screen and (min-width: 501px) and (max-width: 950px) { /* size equals to tablet */
    .header .title {
      font-size: medium;
      margin-left: 20px;
    }
  }
  @media screen and (min-width: 951px) { /* pc */
    .header .title {
      font-size: x-large;
      margin-left: 30px;
    }
  }

  .menu {
      display: flex;
  }

  @media screen and (max-width: 500px) { /* size equals or less to mobile */
    .menu {
        margin-right: 5px;
    }
  }
  @media screen and (min-width: 501px) and (max-width: 950px) { /* size equals to tablet */
    .menu {
        margin-right: 20px;
    }
  }
  @media screen and (min-width: 951px) { /* pc */
    .menu {
        margin-right: 30px;
    }
  }

  .menu div {
      margin-right: 5px;
  }

  .menu div:nth-child(3) {
      margin-right: 0;
  }

  .menu div a {
      text-decoration: none;
      display: block;
      cursor: pointer;
  }

  @media screen and (max-width: 500px) { /* size equals or less to mobile */
    .menu div a {
      font-size: xx-small;
      padding: 3px 3px;
    }
    .normal {
      border-bottom: 2px solid transparent;
    }
    .selected  {
      border-bottom: 2px solid #06bd8e;
    }
  }
  @media screen and (min-width: 501px) and (max-width: 950px) { /* size equals to tablet */
    .menu div a {
      font-size: small;
      padding: 10px 10px;
    }
    .normal {
      border-bottom: 4px solid transparent;
    }
    .selected  {
      border-bottom: 4px solid #06bd8e;
    }
  }
  @media screen and (min-width: 951px) { /* pc */
    .menu div a {
      font-size: large;
      padding: 25px 25px;
    }
    .normal {
      border-bottom: 8px solid transparent;
    }
    .selected  {
      border-bottom: 8px solid #06bd8e;
    }
  }

  .menu div a:hover {
      color: #FFFF66;
      /* border-bottom: 8px solid #FFFF66; */
  }

  .normal {
    color: #ffffff;
  }

  .selected  {
    color: #06bd8e;
  }

  .page_container {
    height: inherit;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    flex-wrap: wrap;
  }

  @media screen and (max-width: 500px) { /* size equals or less to mobile */
    .page_container {
      padding-top: 18px;
    }
  }
  @media screen and (min-width: 501px) and (max-width: 950px) { /* size equals to tablet */
    .page_container {
      padding-top: 43px;
    }
  }
  @media screen and (min-width: 951px) { /* pc */
    .page_container {
      padding-top: 79px;
    }
  }

  .chain_container {
    flex: 1;
    background-color: #f0f8ff;
  }

  .chain  {
    margin: 30px;
  }

  .blockdata_container {
    flex: 1;
  }

  .blocksection {
    top: 79px;
    bottom: 10px;
    width: 50%;
    position: fixed;
    overflow-y: scroll;
  }

  @media screen and (max-width: 500px) { /* size equals or less to mobile */
    .blocksection {
      top: 18px;
    }
  }
  @media screen and (min-width: 501px) and (max-width: 950px) { /* size equals to tablet */
    .blocksection {
      top: 43px;
    }
  }
  @media screen and (min-width: 951px) { /* pc */
    .blocksection {
      top: 79px;
    }
  }

  .search {
    position: fixed;
    z-index: 10000;
  }

  .search .searchicon {
    cursor: pointer;
  }

  @media screen and (max-width: 500px) { /* size equals or less to mobile */
    .search {
      margin-left: 5px;
      margin-top: 5px;
    }
    .search .searchbar {
      width: 33px;
      font-size: xx-small;
    }
    .search .searchicon {
      width: 11px;
      height: 11px;
      margin-left: 2px;
      margin-top: 2px;
      display: block;
    }
  }
  @media screen and (min-width: 501px) and (max-width: 950px) { /* size equals to tablet */
    .search {
      margin-left: 5px;
      margin-top: 5px;
    }
    .search .searchbar {
      vertical-align: middle;
      width: 47px;
    }
    .search .searchicon {
      width: 11px;
      height: 11px;
      margin-left: 2px;
    }
    .search .searchicon {
      display: inline-block;
      vertical-align: middle;
    }
  }
  @media screen and (min-width: 951px) { /* pc */
    .search {
      margin-left: 10px;
      margin-top: 10px;
    }
    .search .searchbar {
      vertical-align: middle;
      width: 100px;
    }
    .search .searchicon {
      width: 15px;
      height: 15px;
      margin-left: 5px;
    }
    .search .searchicon {
      display: inline-block;
      vertical-align: middle;
    }
  }

</style>
