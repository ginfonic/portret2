var express = require('express');
const db = require('../../db/index');
var router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const upload = multer({
    dest:'uploads',
    limits:{fileSize: 81457280}
});
const uuid = require('uuid');
const fs = require('fs');
const wuzzy = require('wuzzy');
const {checkUser} = require('../../middleware');
const {uploadSap} = require('./uploadSap/uploadSap');
const {preLoad} = require('./uploadSap/preLoad');
const {
    pre_load_urm_fill, best_matches, sap_matching_update, pre_load_helpers, fieldsParse, file_fields_json
} = require('./help');
const {actionLogger, saveToTrash} = require('../../middleware/actionsLogging');
const {
    adminDataForBestMatchesTag,
    adminMatchFromSaveLoadTag,
    adminSetCutDepsTag,
    adminFileDeleteTag,
    adminUploadSapTag
} = require('../../middleware/logTags');
const {save_match} = require('../match/help/sap');
const {gosb_upr, tb_upr} = require('./countScript/uprCount');

/* GET home page. */
router.post('/test', function(req, res, next) {
    res.sendStatus(404);
});

router.get('/sap_files', checkUser, actionLogger, async function(req, res, next) {
    let files_data = await db.query(`
    select distinct date, array_agg(
        jsonb_build_object(
            'id', id,
            'filepath', filepath,
            'uploaded', uploaded,
            'name', name,
            'in_load', in_load,
            'last_matching_update', last_matching_update,
            'bank', bank,
            'load_progress', load_progress)) as files
    from sap.files
    group by date`);

    res.json({files: files_data.rows})
});

router.post('/sap_files_delete', checkUser, adminFileDeleteTag, actionLogger, async function(req, res, next) {
    const id = req.body.id;
    const path = req.body.path;

    await db.query(`delete from sap.files where id = '${id}'`);
    let deps = await db.query(`delete from sap.deps where fileid = '${id}' returning id`);
    let a_units = await db.query(`delete from sap.a_units where dep_id = ANY($1) returning id`,
        [deps.rows.map(item => item.id)]);
    await db.query(`delete from sap.r_units where unit_id = ANY($1)`,
        [a_units.rows.map(item => item.id)]);
    try {
        fs.unlinkSync(path);
    }
    catch {}

    let files_data = await db.query(`
    select distinct date, array_agg(
        jsonb_build_object(
            'id', id,
            'filepath', filepath,
            'uploaded', uploaded,
            'name', name,
            'in_load', in_load,
            'last_matching_update', last_matching_update,
            'bank', bank,
            'load_progress', load_progress)) as files
    from sap.files
    group by date`);

    res.json({files: files_data.rows})
});

router.post('/preload_init', upload.single('new_sap'), checkUser, actionLogger, async function(req, res, next) {
    //обнуляем лимит ожидания времени отправки ответа
    req.socket.setTimeout(0);
    //проверка формата файла
    if (req.file) {
        let fileCheck = req.file.originalname.match(/\.(.+)$/g);
        //Если формат верный
        if(fileCheck[0] === '.xlsx') {
            let workbook = XLSX.readFile(req.file.path);
            let sheet = workbook.SheetNames[0];
            let json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            const bank = json[0]._6;
            const id = uuid.v4();
            await db.query(`insert into sap.files (date, filepath, name, id, bank) values (
            '${req.body.date}',
            '${req.file.path}',
            '${req.file.originalname}',
            '${id}',
            '${bank}'
            )`);
            res.json({fileId: id, bank})
        }
        else {
            res.json({fileId: ''});
            fs.unlinkSync(req.file.path);
        }
    }
    else {
        res.json({fileId: ''});
    }
});

router.post('/preload_sap', checkUser, actionLogger, async function(req, res, next) {
    const fileId = req.body.fileId;

    let file_data = await db.query(`select * from sap.files where id = '${fileId}'`);
    const file = file_data.rows[0];
    if (file) {
        let operaion = new Promise(async function(resolve, reject) {
            let workbook = XLSX.readFile(file.filepath);
            let sheet = workbook.SheetNames[0];
            let json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            const bank = json[0]._6;
            json = await file_fields_json(json, bank);
            resolve({preLoad: preLoad(json), bank});
        });
        operaion.then(data => res.json(data))
    }
    else {
        res.status(200).json({errors: []});
    }
});

router.post('/upload_sap', checkUser, adminUploadSapTag, actionLogger, async function(req, res, next) {
    const fileId = req.body.fileId;
    const cutDeps = req.body.cutDeps;

    let file_data = await db.query(`select * from sap.files where id = '${fileId}'`);
    const file = file_data.rows[0];
    if (file) {
        res.status(200);
        res.json({});
        let workbook = XLSX.readFile(file.filepath);
        let sheet = workbook.SheetNames[0];
        let json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        uploadSap(json, file, cutDeps).then(async () => {
            await db.query(`update sap.files set uploaded = true, in_load = false where id = '${fileId}'`);
        });
    }
});

router.post('/pre_load_cutdeps', checkUser, actionLogger, async function(req, res, next) {
    const tb = req.body.preLoad.tb;
    const gosb = req.body.preLoad.gosb;
    const head = req.body.preLoad.head;
    const vsp_gosb = req.body.preLoad.vsp_gosb;
    const vsp_head = req.body.preLoad.vsp_head;
    const vsp_msk = req.body.preLoad.vsp_msk;
    const kic_tb = req.body.preLoad.kic_tb;
    const kic_gosb = req.body.preLoad.kic_gosb;
    const bank = req.body.bank;

    let cutDeps = {
        tb: {},
        gosb: {},
        head: {},
        vsp_gosb: {},
        vsp_head: {},
        vsp_msk: {},
        kic_tb: {},
        kic_gosb: {},
    };
    for (let index in cutDeps) {
        cutDeps[index] = {
            _9: [],
            _10: [],
            _11: [],
            _12: [],
            _13: [],
            _14: [],
            _15: [],
            _16: [],
            _17: [],
            _18: [],
        };
    }

    let db_cutdeps = await db.query(`select index, name, type from sap.cut_deps where bank = '${bank}'`);
    for (let item of db_cutdeps.rows) {
        cutDeps[item.type][item.index].push(item.name);
    }

    if (tb !== null) {
        cutDeps = pre_load_urm_fill(cutDeps, tb, 'tb');
    }
    if (gosb !== null) {
        cutDeps = pre_load_urm_fill(cutDeps, gosb, 'gosb');
    }
    if (head !== null) {
        cutDeps = pre_load_urm_fill(cutDeps, head, 'head');
    }
    if (vsp_gosb !== null) {
        cutDeps = pre_load_urm_fill(cutDeps, vsp_gosb, 'vsp_gosb');
    }
    if (vsp_head !== null) {
        cutDeps = pre_load_urm_fill(cutDeps, vsp_head, 'vsp_head');
    }
    if (vsp_msk !== null) {
        cutDeps = pre_load_urm_fill(cutDeps, vsp_msk, 'vsp_msk');
    }
    if (kic_tb !== null) {
        cutDeps = pre_load_urm_fill(cutDeps, kic_tb, 'kic_tb');
    }
    if (kic_gosb !== null) {
        cutDeps = pre_load_urm_fill(cutDeps, kic_gosb, 'kic_gosb');
    }

    res.json({cutDeps})
});

router.post('/pre_load_helpers', checkUser, actionLogger, async function(req, res, next) {
    const tb = req.body.preLoad.tb;
    const gosb = req.body.preLoad.gosb;
    const head = req.body.preLoad.head;
    const vsp_gosb = req.body.preLoad.vsp_gosb;
    const vsp_head = req.body.preLoad.vsp_head;
    const vsp_msk = req.body.preLoad.vsp_msk;
    const kic_tb = req.body.preLoad.kic_tb;
    const kic_gosb = req.body.preLoad.kic_gosb;

    const fileId = req.body.fileId;

    let file_data = await db.query(`select * from sap.files where id = '${fileId}'`);
    const file = file_data.rows[0];
    let json = [];
    if (file) {
        let workbook = XLSX.readFile(file.filepath);
        let sheet = workbook.SheetNames[0];
        json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        json = await file_fields_json(json, file.bank);
    }

    let helpers = {
        tb: {},
        gosb: {},
        head: {},
        vsp_gosb: {},
        vsp_head: {},
        vsp_msk: {},
        kic_tb: {},
        kic_gosb: {},
    };
    for (let index in helpers) {
        helpers[index] = {
            _9: [],
            _10: [],
            _11: [],
            _12: [],
            _13: [],
            _14: [],
            _15: [],
            _16: [],
            _17: [],
            _18: [],
        };
    }

    if (tb !== null) {
        helpers = pre_load_helpers(helpers, tb, json, 'tb');
    }
    if (gosb !== null) {
        helpers = pre_load_helpers(helpers, gosb, json, 'gosb');
    }
    if (head !== null) {
        helpers = pre_load_helpers(helpers, head, json, 'head');
    }
    if (vsp_gosb !== null) {
        helpers = pre_load_helpers(helpers, vsp_gosb, json, 'vsp_gosb');
    }
    if (vsp_head !== null) {
        helpers = pre_load_helpers(helpers, vsp_head, json, 'vsp_head');
    }
    if (vsp_msk !== null) {
        helpers = pre_load_helpers(helpers, vsp_msk, json, 'vsp_msk');
    }

    res.json({helpers})
});

router.post('/set_cutdeps', checkUser, adminSetCutDepsTag, actionLogger, async function(req, res, next) {
    const cutDep = req.body.cutDep;
    const obj_index = req.body.obj_index;
    const value = req.body.value;
    const bank = req.body.bank;
    const type = req.body.type;

    const index = cutDep.indexOf(value);
    if (index === -1) {
        cutDep.push(value);
        await db.query(`
        insert into sap.cut_deps (index, name, bank, type) values (
        '${obj_index}',
        '${value}',
        '${bank}',
        '${type}'
        )`)
    }
    else {
        cutDep.splice(index);
        await db.query(`
        delete from sap.cut_deps 
        where name = '${value}' and index = '${obj_index}' and bank = '${bank}' and type = '${type}'`)
    }

    res.json({cutDep})
});

router.post('/fields_validation', checkUser, actionLogger, async function(req, res, next) {
    const fileId = req.body.fileId;

    let file_data = await db.query(`select * from sap.files where id = '${fileId}'`);
    const file = file_data.rows[0];
    if (file) {
        let workbook = XLSX.readFile(file.filepath);
        let sheet = workbook.SheetNames[0];
        let json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        const errors = await fieldsParse(json, file.bank);
        res.status(200).json({errors});
    }
    else {
        res.status(200).json({errors: []});
    }
});

router.post('/fields_validation_set', checkUser, actionLogger, async function(req, res, next) {
    const bank = req.body.bank;
    const type = req.body.type;
    const name = req.body.name;
    const index = req.body.index;
    const changeTo = req.body.changeTo;

    await db.query(`
    delete from sap.file_fields_change where bank = '${bank}' and name = '${name}' and index = '${index}';
    insert into sap.file_fields_change (bank, name, index, type, change_to) values (
    '${bank}',
    '${name}',
    '${index}',
    '${type}',
    '${changeTo}'
    ) `);

    res.status(200).json({});
});

router.post('/fields_validation_get', checkUser, actionLogger, async function(req, res, next) {
    const name = req.body.name;
    const index = req.body.index;
    const bank = req.body.bank;

    let result = await db.query(`
    select type, change_to from sap.file_fields_change
    where bank = '${bank}' and name = '${name}' and index = '${index}'
    `);

    if (result.rows.length === 1) {
        res.status(200).json({action: result.rows[0].type, changeTo: result.rows[0].change_to});
    }
    else {
        res.status(200).json({action: 0, changeTo: ''});
    }
});

router.post('/sap_files_matching_update', checkUser, adminMatchFromSaveLoadTag, actionLogger, async function(req, res, next) {
    const id = req.body.id;

    await sap_matching_update(id);

    let files_data = await db.query(`select distinct date, array_agg(
        jsonb_build_object(
            'id', id,
            'filepath', filepath,
            'uploaded', uploaded,
            'name', name,
            'in_load', in_load,
            'last_matching_update', last_matching_update,
            'bank', bank,
            'load_progress', load_progress)) as files
    from sap.files
    group by date`);

    res.json({files: files_data.rows})
});

router.get('/best_matches', checkUser, adminDataForBestMatchesTag, actionLogger, async function(req, res, next) {
    await best_matches();
    res.status(200).json({});
});

router.get('/auto_units_intern_error', checkUser, actionLogger, async function(req, res, next) {
    const units = await db.query(`select * from sap.a_units`);
    const error = await db.query(`select * from sap.unit_errors where name = 'Должность стажера'`);
    if (error.rows.length === 1) {
        for (let unit of units.rows) {
            if (wuzzy.levenshtein('Стажер', unit.unit_name) > 0.8) {
                let added = await db.query(`INSERT INTO sap.unit_errors_connections (unit_id, error_id) VALUES ('${unit.id}', '${error.rows[0].id}') returning *`);
                save_match([unit.dep_id]).then(() => {});
                if (added.rows.length > 0) {
                    await saveToTrash(req.log_id_promise, `match.sap.unit_errors_connections`, null, added.rows, 1);
                }
            }
        }
    }
    res.status(200).json({});
});

router.get('/tb_upr_count', checkUser, actionLogger, async function(req, res, next) {
    let table = await tb_upr();
    res.status(200).json({table});
});

router.get('/gosb_upr_count', checkUser, actionLogger, async function(req, res, next) {
    let table = await gosb_upr();
    res.status(200).json({table});
});

module.exports = router;