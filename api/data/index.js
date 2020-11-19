const API = require('./src/API')
const APIS = {
    bch: new API('bch'),
    bchn: new API('bchn'),
    bchbchn: new API('bchbchn')
}

module.exports = async (context, req) => {
    let res = {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {
        let bch, bchn, bchbchn,
            withTx = req.query.withTx == 'true',
            tempTop = Number(req.query.top),
            tempAfterHeight = Number(req.query.afterHeight),
            top = (isNaN(tempTop) || tempTop >= 100) ? 10 : tempTop,
            afterHeight = isNaN(tempAfterHeight) ? null : tempAfterHeight
        if (context.bindingData.chain == 'mix') {
            switch (context.bindingData.method) {
                case 'blocks':
                    bch = await APIS['bch'].getRecentBlocksData(top, false, withTx, afterHeight)
                    bchn = await APIS['bchn'].getRecentBlocksData(top, false, withTx, afterHeight)
                    bchbchn = await APIS['bchbchn'].getRecentBlocksData(top, false, withTx, afterHeight)
                    res.body = { top, bchn, bch, bchbchn }
                    break
                case 'block':
                    bch = await APIS['bch'].getBlock(req.query)
                    bchn = await APIS['bchn'].getBlock(req.query)
                    bchbchn = await APIS['bchn'].getBlock(req.query)
                    res.body = { bchn, bch, bchbchn }
                    break
                case 'tips':
                    bch = await APIS['bch'].getChainTips(req.query)
                    bchn = await APIS['bchn'].getChainTips(req.query)
                    bchbchn = await APIS['bchbchn'].getChainTips(req.query)
                    res.body = { bchn, bch, bchbchn  }
                    break
            }
        } else {
            switch (context.bindingData.method) {
                case 'blocks':
                    res.body = await APIS[context.bindingData.chain].getRecentBlocksData(top, true, withTx, afterHeight)
                    break
                case 'block':
                    res.body = await APIS[context.bindingData.chain].getBlock(req.query)
                    break
                case 'tips':
                    res.body = await APIS[context.bindingData.chain].getChainTips(req.query)
                    break
            }
        }
    } catch (err) {
        console.log(err)
        res.status = 400
    }

    context.res = res
}
