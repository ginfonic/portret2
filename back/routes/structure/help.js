const db = require('../../db');

async function getDeps(){
    let res = await db.query(`select name, type from dictionaries.deps`)
    return res.rows
}

async function getUpr(dep, date){

    let variants = [
        'Председатель банка',
        'Вице-президент-председатель банка',
        'Председатель',
        'Управляющий отделением',
        'Управляющий',
        'Заместитель председателя-управляющий',
        'управляющий'
    ];

    let res = await db.query(`
        select *, connectedto as connect from sap.deps where
        depname = ANY(($1::text[]))
        and date = '${date}'
        and bank = '${dep}'
        `, [variants])

    return res.rows[0]
}


async function getZam(num, dep, date){
    let variants = [
        'Зам.председателя–руководитель РСЦ',
        'Зам.управляющего-руководитель РСЦ',
        'Заместитель председателя',
        'Заместитель управляющего',
        'Заместитель председателя банка',
        'HR директор'
    ]

    let zam = await db.query(`
        select *, connectedto as connect from sap.deps where
        depname = ANY(($1::text[]))
        and date = '${date}'
        and bank = '${dep}'
        and funcblock in (select fnblock from dictionaries.fnblock where type = ${num})
    `,[variants])
    if(zam.rows.length > 0){
        return zam.rows[0]
    }else{
        return null;
    }
}

async function getAll(dep, date){
    let include = [
        'gosb',
        'head',
        'tb'
    ]

    let res = await db.query(`
    select id, depname, parent, lvl, dictionaries.fnblock.type
    from sap.deps
    join dictionaries.fnblock ON dictionaries.fnblock.fnblock = funcblock
    where date = '${date}' and bank ='${dep}' and sap.deps.type = any(($1::text[]))
    `, [include]);
    return res.rows
}

async function getAssistant(bank, date){
    let arr = [];
    let assistant = [
        'Помощник Председателя',
        'Помощник управляющего ГОСБ',
        'Помощник управляющего',
        'Советник председателя',
        'Помощник заместителя председателя',
        'Директор по развитию цифровых сервисов',
    ];

    let res = await db.query(`
        select * from sap.deps where
        depname = ANY(($1::text[]))
        and date = '${date}'
        and bank = '${bank}'
        and lvl = 2
        `, [assistant])

    return res.rows
}

async function getChild(id){
    let res = await db.query(`
        WiTH RECURSIVE r AS (
            SELECT depname, id, type, connectedto as connect
            FROM sap.deps
            WHERE id = '${id}'

        UNION ALL

        SELECT 
            sap.deps.depname,
            sap.deps.id,
            sap.deps.type,
            sap.deps.connectedto as connect
        FROM  sap.deps
        JOIN r ON sap.deps.parent = r.id
        )
        SELECT * from r
        ORDER BY id
    `);
    return res.rows.map(i => i.id)
}


async function changeDeps(id, block, depname){
    let chailds = await getChild(id);
    let check = await db.query(`select * from dictionaries.move where name = '${depname}'`)
    if(check.rows.length > 0){
        await db.query(`update dictionaries.move set newblock = '${block}' where name = '${depname}'`)
    }else{
        await db.query(`insert into dictionaries.move (name, oldblock, newblock) values ('${depname}', '-', '${block}')`)
    }

    for(let i of chailds){
        await db.query(`update sap.deps set funcblock = '${block}' where id = '${i}'`)
    }
    
}
module.exports = {
    getDeps,
    getUpr,
    getZam,
    getAll,
    getAssistant,
    changeDeps
}