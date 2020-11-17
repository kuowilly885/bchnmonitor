<template>
  <div class="master">
    <loadingComponent class="" :active.sync="isBlocksDataLoading"
      :can-cancel="false"
      :lock-scroll="true"
      :is-full-page="true"></loadingComponent>
      <div class="header">
          <h1> BCH Hard Fork Monitor</h1>
          <div class="menu">
              <div><a v-on:click="changeTab" v-bind:class="{ selected: tab == 'mix', normal: tab != 'mix' }" tab="mix">MIX</a></div>
              <div><a v-on:click="changeTab" v-bind:class="{ selected: tab == 'bch', normal: tab != 'bch' }" tab="bch">BCH ABC</a></div>
              <div><a v-on:click="changeTab" v-bind:class="{ selected: tab == 'bchn', normal: tab != 'bchn' }" tab="bchn">BCH NODE</a></div>
              <div><a v-on:click="changeTab" v-bind:class="{ selected: tab == 'bchbchn', normal: tab != 'bchbchn' }" tab="bchbchn">BCH ABC NODE</a></div>
          </div>
      </div>
      <div class="page_container">

        <div class="blockdata_container">
          <div class="blocksection">
            <blockDataComponent v-for="bdata in bdatas" :key="bdata.tag" :bdata="bdata"/>
          </div>
        </div>
        <div class="chain_container">
          <div class="chain">
            <blockComponent v-for="block in blocks" :key="block.height" :block="block" :tag="tab"/>
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
      isBlocksDataLoading: true
    }
  },
  methods: {
    async getTopBlocks () {
      if (this.tab == 'mix') {
        let res = await axios.get('/api/mix/blocks')
        let topHeightOfBch = res.data.bch.blocks.length == 0 ? -1 : res.data.bch.blocks[0].height
        let topHeightOfBchn = res.data.bchn.blocks.length == 0 ? -1 : res.data.bchn.blocks[0].height
        let topHeightOfBchBchn = res.data.bchbchn.blocks.length == 0 ? -1 : res.data.bchbchn.blocks[0].height
        this.afterHeight = Math.max(topHeightOfBch, topHeightOfBchn, topHeightOfBchBchn) + 1
      } else {
        let res = await axios.get('/api/'+this.tab+'/blocks')
        let topHeightOfBch = res.data.blocks.length == 0 ? -1 : res.data.blocks[0].height
        this.afterHeight = topHeightOfBch + 1
      }

      this.blocks = await this.getBlocksByHeight()

      if (this.tab == 'mix') {
        EventBus.$emit('showBlock', this.blocks[0])
      } else {
        let block = {
          bch: { isEmpty: true },
          bchn: { isEmpty: true },
          bchbchn: { isEmpty: true },
        }
        block[this.tab] = this.blocks[0]
        EventBus.$emit('showBlock', block)
      }
    },
    async getBlocksByHeight () {
      this.isBlocksDataLoading = true
      let blocks = []
      if (this.tab == 'mix') {
        let res = await axios.get('/api/mix/blocks?afterHeight='+this.afterHeight)
        let bchMap = this.getMap(res.data.bch)
        let bchnMap = this.getMap(res.data.bchn)
        let bchbchnMap = this.getMap(res.data.bchbchn)

        let height = this.afterHeight - 1
        let isReachToEnd = false
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

        if (isReachToEnd) {
          this.afterHeight = -1
        } else {
          this.afterHeight = height + 1
        }
      } else {
        let res = await axios.get('/api/' + this.tab + '/blocks?afterHeight='+this.afterHeight)
        let map = this.getMap(res.data)
        let height = this.afterHeight - 1
        let isReachToEnd = false
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

        if (isReachToEnd) {
          this.afterHeight = -1
        } else {
          this.afterHeight = height + 1
        }
      }
      this.isBlocksDataLoading = false
      return blocks
    },
    async handleScrolledToBottom (isVisible) {
      if (!isVisible) {
        return
      } else if (this.afterHeight != -1) {
        let blocks = await this.getBlocksByHeight()
        for (let block of blocks) {
          this.blocks.push(block)
        }
      }
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

  .header h1 {
    color: white;
    margin-left: 30px;
  }

  .menu {
      display: flex;
      margin-right: 30px;
  }

  .menu div {
      margin-right: 5px;
  }

  .menu div:nth-child(3) {
      margin-right: 0;
  }

  .menu div a {
      padding: 25px 25px;
      text-decoration: none;
      display: block;
      cursor: pointer;
  }

  .menu div a:hover {
      color: #FFFF66;
      /* border-bottom: 8px solid #FFFF66; */
  }

  .normal {
    color: #ffffff;
    border-bottom: 8px solid transparent;
  }

  .selected  {
    color: #06bd8e;
    border-bottom: 8px solid #06bd8e;
  }

  .page_container {
    height: inherit;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    flex-wrap: wrap;
    padding-top: 79px;
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
  .dataloading {
    top: 79px;
    bottom: 10px;
    width: 50%;
    position: fixed;
  }
</style>
