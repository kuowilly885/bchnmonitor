<template>
  <div class="block">
    <div class="title">{{ bdata.tag }}</div>
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
      <!-- <span>{{ `${bdata.time} (${this.getTime(bdata.time)})` }}</span> -->
      <span>{{ `${bdata.time}` }}</span>
    </div>
    <div class="item">
      <span>Median Time:</span>
      <!-- <span>{{ `${bdata.mediantime} (${this.getTime(bdata.mediantime)})` }}</span> -->
      <span>{{ `${bdata.mediantime}` }}</span>
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
      <copyTextComponent :showingText="getLastHash(bdata.chainwork)" :text="bdata.chainwork"/>
    </div>
    <div class="item">
      <span>Prev Hash:</span>
      <copyTextComponent :showingText="getLastHash(bdata.previousblockhash)" :text="bdata.previousblockhash"/>
    </div>
    <div class="item">
      <span>Merkle Root:</span>
      <copyTextComponent :showingText="getLastHash(bdata.merkleroot)" :text="bdata.merkleroot"/>
    </div>
    <div class="item">
      <span>Hash:</span>
      <copyTextComponent :showingText="getLastHash(bdata.hash)" :text="bdata.hash"/>
    </div>
  </div>
</template>

<script scoped>
import copyTextComponent from './copyTextComponent'
export default {
  name: "BlockData",
  components: {
    copyTextComponent
  },
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
    },
    getLastHash(hash) {
      return '... ' + hash.substring(hash.length-10, hash.length)
    }
  }
}
</script>

<style scoped>
  .title {
    margin: 10px;
    font-weight: bold;
  }

  @media screen and (max-width: 500px) { /* size equals or less to mobile */
    .title {
      font-size: small;
    }
  }
  @media screen and (min-width: 501px) and (max-width: 950px) { /* size equals to tablet */
    .title {
      font-size: large;
    }
  }
  @media screen and (min-width: 951px) { /* pc */
    .title {
      font-size: xx-large;
    }
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


  @media screen and (max-width: 500px) { /* size equals or less to mobile */
    .item span:nth-child(1) {
      font-size: x-small;
    }

    .item span:nth-child(2) {
      font-size: x-small;
    }
  }
  @media screen and (min-width: 501px) and (max-width: 950px) { /* size equals to tablet */
    .item span:nth-child(1) {
      font-size: small;
    }

    .item span:nth-child(2) {
      font-size: small;
    }
  }
  @media screen and (min-width: 951px) { /* pc */
    .item span:nth-child(1) {
      font-size: medium;
    }

    .item span:nth-child(2) {
      font-size: medium;
    }
  }

  .block {
    margin: 10px;
    border-radius: 10px 10px;
    border: 2px dotted #000000;
  }

</style>
