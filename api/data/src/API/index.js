const azure = require('azure-storage')
const entGen = azure.TableUtilities.entityGenerator
const table = require('../table')
const indexNum = 100000000

class Monitor {
    constructor(chain) {
        this.chain = chain
        this.tableName = {
          block: chain + 'block',
          transaction: chain + 'transaction',
          chaintips: chain + 'chaintips',
          meta: chain + 'meta'
        }
    }

    // API functions
    async getRecentBlocksData (top, withTop, withTx, afterHeight) {

        let qry
        if (afterHeight) {
            qry = new azure.TableQuery().top(top).where('PartitionKey == ? and RowKey > ?', '0', `${indexNum - afterHeight}`)
        } else {
            qry = new azure.TableQuery().top(top).where('PartitionKey eq ?', '0')
        }

        let entities = await table.queryEntities(this.tableName.block, qry)
        let blocks = []
        let forkHeights = []
        for (let i = 0 ; i < entities.length ; i++) {
            let block = this.getFormattedBlock(entities[i], false)
    
            let tips = await table.queryEntities(this.tableName.chaintips, new azure.TableQuery().where('PartitionKey eq ?', `${indexNum - block.height}`))
    
            if (tips && tips.length > 0) {
                forkHeights.push(block.height)
            }
    
            if (withTx) {
                block.tx = await this.getTransactions(block.hash)
            }
    
            blocks.push(block)
        }
    
        let intervalNum = blocks.length - 1
        let intervals = 0
        for (let i = 0 ; i < blocks.length - 1 ; i++) {
            intervals += (blocks[i].mediantime - blocks[i + 1].mediantime)
        }
    
        let avg = Math.round(intervalNum > 0 ? (intervals / intervalNum) : 0)
        let res = {
            avgBlockMiningTimeSecs: avg,
            forkHeights: forkHeights,
            blocks: blocks
        }

        if (withTop) {
            res.top = top
        }
    
        return res
    }
    
    async getChainTips () {
        let entities = await table.queryEntities(this.tableName.chaintips, new azure.TableQuery())
    
        let avgBlockMiningTimeSinceForkSec = null
        
        try {
            avgBlockMiningTimeSinceForkSec = this.getFormattedAvgBlockMiningTimeSinceFork(await table.retrieveEntity(this.tableName.meta, '0', '0'))
        } catch (err) {
            if (err.statusCode != 404) {
                throw new Error(err)
            } else {
            }
        }
    
        let res = {
            avgBlockMiningTimeSinceForkSec: avgBlockMiningTimeSinceForkSec,
            tips: entities.map(entity => this.getFormattedChainTip(entity)),
        }
        return res
    }
    
    async getBlock (query) {
        let height = Number(query.height)
        if (isNaN(height)) {
            return {}
        }
    
        let block
    
        try {
            block = this.getFormattedBlock(await table.retrieveEntity(this.tableName.block, '0', `${indexNum - height}`), false)
            block.tx = await this.getTransactions(block.hash)
        } catch (err) {
            if (err.statusCode != 404) {
                throw new Error(err)
            } else {
                return {}
            }
        }
    
        return block
    }

    // Utility functions

    getFormattedTransactions (entities) {
        return entities.map(entity => entity.txid._)
    }

    getTransactionTableEntity (txid, partitionKey, rowKey) {
        return {
            PartitionKey: entGen.String(partitionKey),
            RowKey: entGen.String(rowKey.padStart(8, '0')),
            txid: entGen.String(txid)
        }
    }

    getBlockTableEntity (block, partitionKey) {
        return {
            PartitionKey: entGen.String(partitionKey),
            RowKey: entGen.String(`${indexNum - block.height}`.padStart(8, '0')),
            size: entGen.Int64(block.size),
            height: entGen.Int64(block.height),
            version: entGen.Int64(block.version),
            versionHex: entGen.String(block.versionHex),
            time: entGen.Int64(block.time),
            mediantime: entGen.Int64(block.mediantime),
            nonce: entGen.Int64(block.nonce),
            bits: entGen.String(block.bits),
            difficulty: entGen.Double(block.difficulty),
            chainwork: entGen.String(block.chainwork),
            nTx: entGen.Int32(block.nTx),
            previousblockhash: entGen.String(block.previousblockhash),
            hash: entGen.String(block.hash),
            merkleroot: entGen.String(block.merkleroot)
        }
    }

    getChainTipsTableEntity (chaintip) {
        let entity = {
            height: entGen.Int64(chaintip.height),
            branchlen: entGen.Int32(chaintip.branchlen),
            hash: entGen.String(chaintip.hash),
            status: entGen.String(chaintip.status)
        }

        if (chaintip.status == 'active') {
            entity.PartitionKey = entGen.String('0')
            entity.RowKey = entGen.String('0')
        } else {
            entity.PartitionKey = entGen.String(`${indexNum - chaintip.height}`.padStart(8, '0'))
            entity.RowKey = entGen.String(chaintip.hash)
        }

        return entity
    }

    getAvgBlockMiningTimeSinceForkEntity (time) {
        let entity = {
            PartitionKey: entGen.String('0'),
            RowKey: entGen.String('0'),
            avgMiningTimeSinceFork: entGen.Int64(time)
        }

        return entity
    }

    getFormattedBlock (entity, withKeys) {
        let block = {
            hash: entity.hash._,
            size: Number(entity.size._),
            height: Number(entity.height._),
            version: Number(entity.version._),
            versionHex: Number(entity.versionHex._),
            merkleroot: entity.merkleroot._,
            time: Number(entity.time._),
            mediantime: Number(entity.mediantime._),
            nonce: Number(entity.nonce._),
            bits: entity.bits._,
            difficulty: Number(entity.difficulty._),
            chainwork: entity.chainwork._,
            nTx: Number(entity.nTx._),
            previousblockhash: entity.previousblockhash._
        }

        if (withKeys) {
            block.PartitionKey = entity.PartitionKey._
            block.RowKey = entity.RowKey._
        }

        return block
    }

    getFormattedAvgBlockMiningTimeSinceFork (entity) {
        return Number(entity.avgBlockMiningTimeSinceFork._)
    }

    getFormattedChainTip (entity) {
        return {
            height: Number(entity.height._),
            hash: entity.hash._,
            branchlen: Number(entity.branchlen._),
            status: entity.status._
        }
    }
}

module.exports = Monitor