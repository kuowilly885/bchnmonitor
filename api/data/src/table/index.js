const azure = require('azure-storage')
const tableSvc = azure.createTableService(process.env['storageConnStr'])

const retrieveEntity = (table, partitionKey, rowKey) => {
    return new Promise((resolve, reject) => {
        tableSvc.retrieveEntity(table, partitionKey, rowKey, (err, res) => {
            if (!err) resolve(res)
            else reject(err)
        })
    })
}

const queryEntities = (table, query) => {
    return new Promise((resolve, reject) => {
        tableSvc.queryEntities(table, query, null, (err, res) => {
            if (!err) resolve(res.entries)
            else reject(err)
        })
    })
}

const insertEntity = (table, entity) => {
    return new Promise((resolve, reject) => {
        tableSvc.insertEntity(table, entity, (err) => {
            if (!err) resolve()
            else reject(err)
        })
    })
}

const deleteEntity = (table, partitionKey, rowKey) => {
    return new Promise((resolve, reject) => {
        tableSvc.deleteEntity(table, { PartitionKey: {'_': partitionKey}, RowKey: {'_': rowKey} }, (err) => {
            if(!err) resolve()
            else reject(err)
        })
    })
}

const upsertEntity = (table, entity) => {
    return new Promise((resolve, reject) => {           
        tableSvc.insertOrReplaceEntity(table, entity, (err) => {
            if (!err) resolve()
            else reject(err)
        })
    })
}

const createTableIfNotExists = (tableName) => {
    return new Promise((resolve, reject) => {
        tableSvc.createTableIfNotExists(tableName, (err) => {
            if (!err) resolve()
            else reject(err)
        })
    })
}

module.exports = {
    retrieveEntity,
    queryEntities,
    insertEntity,
    deleteEntity,
    upsertEntity,
    createTableIfNotExists
}