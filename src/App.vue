<template>
  <div class="page_container">
    <div class="blockdata_container">
      <div class="blockdata">Block data</div>
    </div>
    <div class="chain_container">
      <div class="chain">
        <blockComponent v-for="block in blocks" :key="block.height" :block="block"/>
        <div v-if="blocks.length" v-observe-visibility="handleScrolledToBottom"></div>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import blockComponent from './components/blockComponent'

export default {
  name: "App",
  components: {
    blockComponent
  },
  data() {
    return {
      blocks: [],
      afterHeight: 0
    }
  },
  methods: {
    async getTopBlocks () {
      let res = await axios.get('/api/mix/blocks')
      let topHeightOfBch = res.data.bch.blocks.length == 0 ? -1 : res.data.bch.blocks[0].height
      let topHeightOfBchn = res.data.bchn.blocks.length == 0 ? -1 : res.data.bchn.blocks[0].height
      let topHeightOfBchBchn = res.data.bchbchn.blocks.length == 0 ? -1 : res.data.bchbchn.blocks[0].height
      this.afterHeight = Math.max(topHeightOfBch, topHeightOfBchn, topHeightOfBchBchn) + 1
      this.blocks = await this.getBlocksByHeight()
    },
    async getBlocksByHeight () {
      let res = await axios.get('/api/mix/blocks?afterHeight='+this.afterHeight)
      let bchMap = this.getMap(res.data.bch)
      let bchnMap = this.getMap(res.data.bchn)
      let bchbchnMap = this.getMap(res.data.bchbchn)
      let blocks = []
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
    }
  },
  mounted() {
    this.getTopBlocks()
  }
}
</script>

<style scoped>
  .page_container {
    display: flex;
    flex-direction: row;
  }
  .chain_container {
    flex: 1;
    border-left-width: 8px;
    border-left-style: solid;
  }
  .chain  {
    margin: 50px;
  }
  .blockdata_container {
    flex: 1;
    margin: 50px;
  }
  .blockdata {
    position: fixed;
  }
</style>
