var express = require('express');
var router = express.Router();
const path = require('path');
const { publicPath } = require('../../public/public');
const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const {
  checkUser
} = require('../../middleware');
const {actionLogger} = require('../../middleware/actionsLogging');

const {
  tbGet,
  typeGet,
  getGosbs,
  addFileInfo,
  getFiles,
  sendOnefile,
  fileDel
} = require('./help');

const upload = multer({
    dest:`${publicPath}`,
    limits:{fileSize: 81457280},
    rename: function(fieldName, filename){
     
    }
  });

router.post('/tbget', checkUser, actionLogger, upload.single('filedata'), async function(req, res, next) {
 let tb = await tbGet();
 let type = await typeGet();
res.json({tb, type});
});

router.post('/gosbget', checkUser, actionLogger, upload.single('filedata'), async function(req, res, next) {
  let gosbs = await getGosbs(req.body.id);
  let files = await getFiles(req.body.id);
 res.json({gosbs, files});
 });

router.post('/up', checkUser, actionLogger,  upload.single('filedata'), async function(req, res, next) {
    let rawdeginDate = new Date(Date.parse(req.body.dateBegin));
    let rawDateDone = new Date(Date.parse(req.body.dateDone));
    let begin = `${rawdeginDate.getFullYear()}-${('0'+(rawdeginDate.getMonth()+1)).slice(-2)}-${('0'+rawdeginDate.getDate()).slice(-2)}`;
    let done = `${rawDateDone.getFullYear()}-${('0'+(rawDateDone.getMonth()+1)).slice(-2)}-${('0'+rawDateDone.getDate()).slice(-2)}`;
    let subfolder = uuidv4();
    let user = `${req.user.user.name}`;
    fs.mkdirSync(`${publicPath}/${subfolder}`);
    fs.renameSync(`${publicPath}/${req.file.filename}`, `${publicPath}/${subfolder}/${req.file.originalname}`);
    await addFileInfo(
      user, req.body.gosb, `${publicPath}/${subfolder}`, req.file.originalname, req.body.typeId, req.body.tbSelected, req.body.koname, begin, done, req.body.fio,
      req.body.comment
      );
  res.json([]);
});

router.post('/down', checkUser, actionLogger, async function(req, res, next) {
  let fileData = await sendOnefile(req.body.id);
  let file = `${fileData.file_path}/${fileData.filename}`;
res.download(file);
});

router.post('/delete', checkUser, actionLogger, async function(req, res, next) {
  let fileData = await sendOnefile(req.body.id);
  fs.rmdirSync(`${fileData.file_path}`,{recursive:true});
  await fileDel(req.body.id);
res.json([]);
});

module.exports = router;