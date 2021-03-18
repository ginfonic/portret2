var express = require('express');
var router = express.Router();
const {
    checkUser
} = require('../../middleware');
const {actionLogger} = require('../../middleware/actionsLogging');

const {
    getMain,
    getAll,
    getNotes,
    getUnits,
    getInfo,
    notes,
    unitAdd,
    unitUpdate,
    dellUser,
    getDeps,
    depNameUpdate,
    addDep,
    textUpdate,
    getAllDeps,
    changeParent,
    delDep,
    updateFlat,
    changeNote,
    footInfo,
    getOneDep,
} = require('./help');

router.post('/', checkUser, actionLogger, async function (req, res, next) {
    let mainId = await getMain(req.body.type);
    let all = await getAll(mainId);
    //get FootNotes
    for (let i of all) {
        i.notes = await getNotes(i.id);
    }
    let result = all.filter(i => !i.subpart);
    let sub = all.filter(i => i.subpart);
    res.json({all:result, sub});
});

router.post('/getunits', checkUser, actionLogger, async function (req, res, next) {
    let result = await getUnits(req.body.id, req.body.deps);
    res.json(result);
});

router.post('/getinfo', checkUser, actionLogger, async function (req, res, next) {
    let result = await getInfo(req.body.id);
    res.json(result);
});

router.post('/getmodify', checkUser, actionLogger, async function (req, res, next){
    //let units = await getUnits(req.body.id);
    let dep = await getInfo(req.body.id);
    res.json(dep)
});

router.post('/getnotes', checkUser, actionLogger, async function (req, res, next){
    let result = await notes(req.body.id, req.body.type)
    res.json(result)
});

router.post('/updateunit', checkUser, actionLogger, async function (req, res, next){
    await unitUpdate(req.body.id, req.body.color, req.body.color_ex, req.body.name)
    res.json([])
});
router.post('/deleteunit', checkUser, actionLogger, async function (req, res, next){
    await dellUser(req.body.id)
    res.json([])
});
router.post('/createuser', checkUser, actionLogger, async function (req, res, next){
    await unitAdd(req.body.id, req.body.color, req.body.color_ex, req.body.name)
    res.json([])
});

router.post('/getdeps', checkUser, async function (req, res, next){
    let result = await getDeps(req.body.id)
    res.json(result)
});

router.post('/getalldeps', checkUser, async function (req, res, next){
    let deps = await getAllDeps(req.body.type);
    res.json(deps)
});

router.post('/updatedep', checkUser, actionLogger, async function (req, res, next){
    await depNameUpdate(req.body.id, req.body.name)
    res.json([])
});

router.post('/createdep', checkUser, actionLogger, async function (req, res, next){
    await addDep(req.body.parentId, req.body.name)
    res.json([])
});

router.post('/updatedescription', checkUser, actionLogger, async function (req, res, next){
    await textUpdate(req.body.id, req.body.text)
    res.json([])
});

router.post('/changeparent', checkUser, actionLogger, async function (req, res, next){
    await changeParent(req.body.parentId, req.body.depID, req.body.type)
    res.json([])
});

router.post('/deldep', checkUser, actionLogger, async function (req, res, next){
    await delDep(req.body.id)
    res.json([])
});

router.post('/flatupdate', checkUser, actionLogger, async function (req, res, next){

    await updateFlat(req.body.id, req.body.flat, req.body.type)
    res.json([])
});

router.post('/notechanger', checkUser, actionLogger, async function (req, res, next){
    await changeNote(req.body.noteId, req.body.depId, req.body.type)
    res.json([])
});

router.post('/noteinfo', checkUser, actionLogger, async function (req, res, next){
    let result = await footInfo(req.body.name, req.body.arr, req.body.type)
    res.json(result)
});

router.post('/getdep', checkUser, async function (req, res, next){
    let result = await getOneDep(req.body.id);
    console.log(result)
    res.json(result)
});
module.exports = router;
