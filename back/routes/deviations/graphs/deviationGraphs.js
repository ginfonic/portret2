let express = require('express');
let router = express.Router();
const {actionLogger} = require('../../../middleware/actionsLogging');
const { checkUser } = require('../../../middleware');
const matchGraphData = require('./help/matchGraphData');
const matchUnitGraphData = require('./help/matchUnitGraphData');
const urmCountSameDepGraphData = require('./help/urmCountSameDepGraphData');
const approvedGraphData = require('./help/approvedGraphData');
const globalGraphData = require('./help/globalGraphData');

router.post('/data', checkUser, actionLogger, async function(req, res, next) {
    const selected = req.body.selected;
    const tb_gosb = req.body.tb_gosb;
    const parameter = req.body.parameter;

    let data = [];

    if (selected === 'sameDep') {
        data = await urmCountSameDepGraphData(tb_gosb, parameter, 'samedep')
    }
    else if (selected === 'match') {
        data = await matchGraphData(tb_gosb, parameter)
    }
    else if (selected === 'matchUnit') {
        data = await matchUnitGraphData(tb_gosb, parameter)
    }
    else if (selected === 'count') {
        data = await urmCountSameDepGraphData(tb_gosb, parameter, 'count')
    }
    else if (selected === 'urm') {
        data = await urmCountSameDepGraphData(tb_gosb, parameter, 'urm')
    }
    else if (selected === 'approved') {
        data = await approvedGraphData(parameter)
    }
    else if (selected === 'global') {
        data = await globalGraphData(parameter)
    }
 
    if (data) {
        for (let [index, row] of data.entries()) {
            data[index].fill = `#${Math.random().toString(16).substr(-6)}`
        }
    }

    res.status(200).json({data: data ? data : []});
});

module.exports = router;
