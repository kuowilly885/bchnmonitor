<template>
  <div>
    <blockComponent v-for="block in blocks" :key="block.height" :block="block"/>
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
      blocks: []
    }
  },
  methods: {
    async getTopBlocks () {
      let res = await axios.get('/api/mix/blocks')
      let topHeightOfBch = res.data.bch.blocks.length == 0 ? -1 : res.data.bch.blocks[0].height
      let topHeightOfBchn = res.data.bchn.blocks.length == 0 ? -1 : res.data.bchn.blocks[0].height
      let topHeightOfBchBchn = res.data.bchbchn.blocks.length == 0 ? -1 : res.data.bchbchn.blocks[0].height
      let afterHeight = Math.max(topHeightOfBch, topHeightOfBchn, topHeightOfBchBchn) + 1
      this.blocks = await this.getBlocksByHeight(afterHeight)
    },
    async getBlocksByHeight (afterHeight) {
      let res = await axios.get('/api/mix/blocks?afterHeight='+afterHeight)
      let blocks = []
      let height = afterHeight - 1
      for (let i = 0 ; i < 10 ; i++, height--)  {
        let block = {
          height: height,
          bch: res.data.bch.blocks[i] ? res.data.bch.blocks[i] : null,
          bchn: res.data.bchn.blocks[i] ? res.data.bchn.blocks[i] : null,
          bchbchn: res.data.bchbchn.blocks[i] ? res.data.bchbchn.blocks[i] : null
        }
        if (block.bch || block.bchn || block.bchbchn) {
          blocks.push(block)
        }
      }
      return blocks
    }
  },
  mounted() {
    this.getTopBlocks()
  }
};
</script>
