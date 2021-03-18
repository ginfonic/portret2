const db = require('../../db');

//поиск города

//async function getCity(id){
//    let res = await db.query(`
//    select addr_city, count(*) c from sap.r_units
//    where dep_id = '${id}'
//    group by addr_city
//    order by c
//    desc limit 1
//     `);
//     if(res.rows.length > 0){
//         return res.rows[0].addr_city
//     }else{
//        let vill =  await db.query(`
//        select addr_punct, count(*) c from sap.r_units
//        where dep_id = '${id}'
//        group by addr_punct
//        order by c
//        desc limit 1
//         `);
//         if(vill.rows.length > 0){
//             return vill.rows[0].addr_punct
//         }else{
//             return 'не найден'
//         }
//     }
//}

//async function getDev(id) {
//    let dev_count = await db.query(`
//    select count(approved.dev_id) + count(dev.*) + count(match_err.*) + count(match_unit_err.*) as dev_count
//    from sap.deps as sap
//    left join deviations.approved_deps as approved on approved.dep_id = sap.id
//    left join deviations.dev as dev on dev.dep_id = sap.id
//    left join sap.errors_connections as match_err on match_err.sap_id = sap.id
//    inner join sap.a_units as unit on unit.dep_id = sap.id
//    left join sap.unit_errors_connections as match_unit_err on match_unit_err.unit_id = unit.id
//    where sap.id = '${id}'
//    group by sap.id
//    `);
//
//    if (dev_count.rows.length === 1) {
//        return dev_count.rows[0].dev_count > 0
//    }
//    else {
//        return false
//    }
//}
//
//async function getDevChild(id) {
//    let dev_child_count = await db.query(`
//    select sum(t.dev_count) as dev_child_count
//    from (select count(approved.dev_id) + count(dev.*) + count(match_err.*) + count(match_unit_err.*) as dev_count
//    from sap.deps as sap
//    left join deviations.approved_deps as approved on approved.dep_id = sap.id
//    left join deviations.dev as dev on dev.dep_id = sap.id
//    left join sap.errors_connections as match_err on match_err.sap_id = sap.id
//    inner join sap.a_units as unit on unit.dep_id = sap.id
//    left join sap.unit_errors_connections as match_unit_err on match_unit_err.unit_id = unit.id
//    where sap.id in (WiTH RECURSIVE r AS (
//            SELECT id
//            FROM sap.deps
//            WHERE id = '${id}'
//        UNION ALL
//        SELECT
//            sap.deps.id
//        FROM  sap.deps
//        JOIN r ON sap.deps.parent = r.id
//        )
//        SELECT * from r
//        ORDER BY id) and sap.id != '${id}'
//    group by sap.id) t`);
//
//    if (dev_child_count.rows.length === 1) {
//        return dev_child_count.rows[0].dev_child_count > 0
//    }
//    else {
//        return false
//    }
//}

async function getUpr(dep, date){
    let obj = {};
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
        select main_sap.*, main_sap.connectedto as connect,
        CASE
            when ((select sum(t.dev_count) as dev_child_count
    from (select count(approved.dev_id) + count(dev.*) + count(match_err.*) + count(match_unit_err.*) as dev_count
    from sap.deps as sap
    left join deviations.approved_deps as approved on approved.dep_id = sap.id
    left join deviations.dev as dev on dev.dep_id = sap.id
    left join sap.errors_connections as match_err on match_err.sap_id = sap.id
    inner join sap.a_units as unit on unit.dep_id = sap.id
    left join sap.unit_errors_connections as match_unit_err on match_unit_err.unit_id = unit.id
    where sap.id in (WiTH RECURSIVE r AS (
            SELECT id
            FROM sap.deps
            WHERE id = main_sap.id
        UNION ALL
        SELECT 
            sap.deps.id
        FROM  sap.deps
        JOIN r ON sap.deps.parent = r.id
        )
        SELECT * from r
        ORDER BY id) and sap.id != main_sap.id
    group by sap.id) t) > 0) = true then true
            else false
            END as dev_child, CASE
            when ((select count(approved.dev_id) + count(dev.*) + count(match_err.*) + count(match_unit_err.*) as dev_count
    from sap.deps as sap
    left join deviations.approved_deps as approved on approved.dep_id = sap.id
    left join deviations.dev as dev on dev.dep_id = sap.id
    left join sap.errors_connections as match_err on match_err.sap_id = sap.id
    inner join sap.a_units as unit on unit.dep_id = sap.id
    left join sap.unit_errors_connections as match_unit_err on match_unit_err.unit_id = unit.id
    where sap.id = main_sap.id
    group by sap.id) > 0) = true then true
            else false
            END as dev
        from sap.deps as main_sap
        where
        main_sap.depname = ANY(($1::text[]))
        and main_sap.date = '${date}'
        and main_sap.bank = '${dep}'
        `, [variants]);

    obj.upr = res.rows[0];

    let uprCount = await db.query(`
        select SUM(state_count)::int  AS statecount, SUM(actual_count)::int  AS stavkacount, COUNT (vacancy_date) AS vacancy
        from sap.r_units
        where
        dep_id in (select id from sap.deps where bank = '${dep}' and date = '${date}')
    `);
    obj.uprCount = uprCount.rows[0];

    return obj
}

async function getZam(num, dep, date){
    let obj = {};
    let variants = [
        'Зам.председателя–руководитель РСЦ',
        'Зам.управляющего-руководитель РСЦ',
        'Заместитель председателя',
        'Заместитель управляющего',
        'Заместитель председателя банка',
        'Заместитель председателя банка',
        'HR директор'
    ];

    let zam = await db.query(`
        select main_sap.*, main_sap.connectedto as connect, 
        CASE
            when ((select sum(t.dev_count) as dev_child_count
    from (select count(approved.dev_id) + count(dev.*) + count(match_err.*) + count(match_unit_err.*) as dev_count
    from sap.deps as sap
    left join deviations.approved_deps as approved on approved.dep_id = sap.id
    left join deviations.dev as dev on dev.dep_id = sap.id
    left join sap.errors_connections as match_err on match_err.sap_id = sap.id
    inner join sap.a_units as unit on unit.dep_id = sap.id
    left join sap.unit_errors_connections as match_unit_err on match_unit_err.unit_id = unit.id
    where sap.id in (WiTH RECURSIVE r AS (
            SELECT id
            FROM sap.deps
            WHERE id = main_sap.id
        UNION ALL
        SELECT 
            sap.deps.id
        FROM  sap.deps
        JOIN r ON sap.deps.parent = r.id
        )
        SELECT * from r
        ORDER BY id) and sap.id != main_sap.id
    group by sap.id) t) > 0) = true then true
            else false
            END as dev_child, CASE
            when ((select count(approved.dev_id) + count(dev.*) + count(match_err.*) + count(match_unit_err.*) as dev_count
    from sap.deps as sap
    left join deviations.approved_deps as approved on approved.dep_id = sap.id
    left join deviations.dev as dev on dev.dep_id = sap.id
    left join sap.errors_connections as match_err on match_err.sap_id = sap.id
    inner join sap.a_units as unit on unit.dep_id = sap.id
    left join sap.unit_errors_connections as match_unit_err on match_unit_err.unit_id = unit.id
    where sap.id = main_sap.id
    group by sap.id) > 0) = true then true
            else false
            END as dev
        from sap.deps as main_sap
        where
        main_sap.depname = ANY(($1::text[]))
        and main_sap.date = '${date}'
        and main_sap.bank = '${dep}'
        and main_sap.funcblock in (select fnblock from dictionaries.fnblock where type = ${num})
    `,[variants]);
    if(zam.rows.length > 0){
        obj.zam = zam.rows[0];
    }else{
        obj.zam = null;
    }

    let count = await db.query(`
        select SUM(state_count)::int  AS statecount, SUM(actual_count)::int  AS stavkacount, COUNT(vacancy_date) AS vacancy
        from sap.r_units
        where
        dep_id in (select id from sap.deps where bank = '${dep}' and date = '${date}'
        and funcblock in (select fnblock from dictionaries.fnblock where type = ${num}) )
    `);
    obj.count = count.rows[0];
    return obj
}

//async function getChild(id, date, lvl){
//    let res = await db.query(`
//        WiTH RECURSIVE r AS (
//            SELECT depname, id, type, connectedto as connect
//            FROM sap.deps
//            WHERE id = '${id}'
//
//        UNION ALL
//
//        SELECT
//            sap.deps.depname,
//            sap.deps.id,
//            sap.deps.type,
//            sap.deps.connectedto as connect
//        FROM  sap.deps
//        JOIN r ON sap.deps.parent = r.id
//        )
//        SELECT * from r
//        ORDER BY id
//    `);
//    return res.rows.map(i => i.id)
//}

//async function getCount(arr){
//    let res = await db.query(`
//    select SUM(state_count)::int AS statecount, SUM(actual_count)::int AS stavkacount, COUNT(vacancy_date)::int AS vacancy
//    from sap.r_units
//    where
//    dep_id = ANY(($1::uuid[]))
//    `,[arr]);
//    return res.rows[0]
//}

async function getDepsID(num, date, dep, lvl){
    let res = await db.query(`
    select main_sap.id, main_sap.depname, main_sap.type, main_sap.connectedto as connect, CASE
            when ((select sum(t.dev_count) as dev_child_count
    from (select count(approved.dev_id) + count(dev.*) + count(match_err.*) + count(match_unit_err.*) as dev_count
    from sap.deps as sap
    left join deviations.approved_deps as approved on approved.dep_id = sap.id
    left join deviations.dev as dev on dev.dep_id = sap.id
    left join sap.errors_connections as match_err on match_err.sap_id = sap.id
    inner join sap.a_units as unit on unit.dep_id = sap.id
    left join sap.unit_errors_connections as match_unit_err on match_unit_err.unit_id = unit.id
    where sap.id in (WiTH RECURSIVE r AS (
            SELECT id
            FROM sap.deps
            WHERE id = main_sap.id
        UNION ALL
        SELECT 
            sap.deps.id
        FROM  sap.deps
        JOIN r ON sap.deps.parent = r.id
        )
        SELECT * from r
        ORDER BY id) and sap.id != main_sap.id
    group by sap.id) t) > 0) = true then true
            else false
            END as dev_child, CASE
            when ((select count(approved.dev_id) + count(dev.*) + count(match_err.*) + count(match_unit_err.*) as dev_count
    from sap.deps as sap
    left join deviations.approved_deps as approved on approved.dep_id = sap.id
    left join deviations.dev as dev on dev.dep_id = sap.id
    left join sap.errors_connections as match_err on match_err.sap_id = sap.id
    inner join sap.a_units as unit on unit.dep_id = sap.id
    left join sap.unit_errors_connections as match_unit_err on match_unit_err.unit_id = unit.id
    where sap.id = main_sap.id
    group by sap.id) > 0) = true then true
            else false
            END as dev,
\t\t\t
\t\t\t(select jsonb_build_object('statecount', SUM(state_count)::int, 'stavkacount', SUM(actual_count)::int, 'vacancy', COUNT(vacancy_date)::int) as count
    from sap.r_units
    where
    dep_id = ANY((WiTH RECURSIVE r AS (
            SELECT id
            FROM sap.deps
            WHERE id = main_sap.id
        UNION ALL
        SELECT 
            sap.deps.id
        FROM  sap.deps
        JOIN r ON sap.deps.parent = r.id
        )
        SELECT * from r
        ORDER BY id))),

        COALESCE((select CASE 
 when LENGTH(addr_city) > 0 then addr_city
 when LENGTH(addr_punct) > 0 then addr_punct
 else 'не найден'
 end
 from sap.r_units
    where dep_id = main_sap.id
    group by addr_city, addr_punct
    order by addr_city, addr_punct
    desc limit 1), 'не найден') as city

from sap.deps as main_sap
    where
    (type = 'tb' or type = 'head' or type = 'gosb') and
    main_sap.lvl = ${lvl}
    and main_sap.date = '${date}'
    and main_sap.bank = '${dep}'
    and main_sap.funcblock in (select fnblock from dictionaries.fnblock where type = ${num})
    order by main_sap.depname
    `);

    return res.rows;
}

async function getOutstate(bank, date, num){
    let res = await db.query(`
        select depname, sap.a_units.state_name as unit, dictionaries.fnblock.type as fnblock, sap.r_units.state_count as unitid,
        sap.deps.lvl
        from sap.deps
        join sap.r_units ON sap.r_units.dep_id = sap.deps.id
        join sap.a_units ON sap.a_units.dep_id = sap.deps.id
        join dictionaries.fnblock ON dictionaries.fnblock.fnblock = sap.deps.funcblock
        where
        sap.r_units.outstate = true
        and sap.deps.bank = '${bank}'
        and sap.deps.date = '${date}'
    `);
    return res.rows
}

async function getVspCount(bank, date) {
    const count = await db.query(`
    select SUM(state_count)::int as statecount,
    SUM(actual_count)::int as stavkacount,
    COUNT(vacancy_date)::int as vacancy
    from sap.r_units
    where
    dep_id in (
    select id from sap.deps 
    where type ilike '%vsp%' and bank = '${bank}' and date = '${date}' 
    )`);
    if (count.rows.length === 1) {
        if (count.rows[0].statecount === null) {
            return null
        }
        return count.rows[0];
    }
}

async function getKicCount(bank, date) {
    const count = await db.query(`
    select SUM(state_count)::int as statecount,
    SUM(actual_count)::int as stavkacount,
    COUNT(vacancy_date)::int as vacancy,
    count(distinct sap.deps.id)::int as kic_count
    from sap.r_units
    inner join sap.deps on sap.deps.id = sap.r_units.dep_id
    where sap.deps.type ilike '%kic%' and sap.deps.bank = '${bank}' and sap.deps.date = '${date}'`);
    if (count.rows.length === 1) {
        if (count.rows[0].kic_count === 0) {
            return null
        }
        return count.rows[0];
    }
}

async function getVsp(bank, date) {
    let res = await db.query(`select main_sap.*,
    (select jsonb_build_object('statecount', SUM(state_count)::int, 'stavkacount', SUM(actual_count)::int, 'vacancy', COUNT(vacancy_date)::int) as count
    from sap.r_units
    where
    dep_id = ANY((WiTH RECURSIVE r AS (
            SELECT id
            FROM sap.deps
            WHERE id = main_sap.id
        UNION ALL
        SELECT 
            sap.deps.id
        FROM  sap.deps
        JOIN r ON sap.deps.parent = r.id
        )
        SELECT * from r
        ORDER BY id)))

    from sap.deps as main_sap
    where type ilike '%vsp%' and bank = '${bank}' and date = '${date}'`);

    return res.rows;
}

async function getKic(bank, date) {
    let res = await db.query(`select main_sap.*,
    (select jsonb_build_object('statecount', SUM(state_count)::int, 'stavkacount', SUM(actual_count)::int, 'vacancy', COUNT(vacancy_date)::int) as count
    from sap.r_units
    where
    dep_id = ANY((WiTH RECURSIVE r AS (
            SELECT id
            FROM sap.deps
            WHERE id = main_sap.id
        UNION ALL
        SELECT 
            sap.deps.id
        FROM  sap.deps
        JOIN r ON sap.deps.parent = r.id
        )
        SELECT * from r
        ORDER BY id)))

    from sap.deps as main_sap
    where type ilike '%kic%' and bank = '${bank}' and date = '${date}'`);

    return res.rows;
}

async function getAssistant(bank, date){
    let assistant = [
        'Помощник Председателя',
        'Помощник управляющего ГОСБ',
        'Помощник управляющего',
        'Советник председателя',
        'Помощник заместителя председателя',
        'Директор по развитию цифровых сервисов',
    ];

    let res = await db.query(`
        select main_sap.*, 
         CASE
            when ((select sum(t.dev_count) as dev_child_count
    from (select count(approved.dev_id) + count(dev.*) + count(match_err.*) + count(match_unit_err.*) as dev_count
    from sap.deps as sap
    left join deviations.approved_deps as approved on approved.dep_id = sap.id
    left join deviations.dev as dev on dev.dep_id = sap.id
    left join sap.errors_connections as match_err on match_err.sap_id = sap.id
    inner join sap.a_units as unit on unit.dep_id = sap.id
    left join sap.unit_errors_connections as match_unit_err on match_unit_err.unit_id = unit.id
    where sap.id in (WiTH RECURSIVE r AS (
            SELECT id
            FROM sap.deps
            WHERE id = main_sap.id
        UNION ALL
        SELECT 
            sap.deps.id
        FROM  sap.deps
        JOIN r ON sap.deps.parent = r.id
        )
        SELECT * from r
        ORDER BY id) and sap.id != main_sap.id
    group by sap.id) t) > 0) = true then true
            else false
            END as dev_child, CASE
            when ((select count(approved.dev_id) + count(dev.*) + count(match_err.*) + count(match_unit_err.*) as dev_count
    from sap.deps as sap
    left join deviations.approved_deps as approved on approved.dep_id = sap.id
    left join deviations.dev as dev on dev.dep_id = sap.id
    left join sap.errors_connections as match_err on match_err.sap_id = sap.id
    inner join sap.a_units as unit on unit.dep_id = sap.id
    left join sap.unit_errors_connections as match_unit_err on match_unit_err.unit_id = unit.id
    where sap.id = main_sap.id
    group by sap.id) > 0) = true then true
            else false
            END as dev,

(select jsonb_build_object('statecount', SUM(state_count)::int, 'stavkacount', SUM(actual_count)::int, 'vacancy', COUNT(vacancy_date)::int) as count
    from sap.r_units
    where
    dep_id = ANY((WiTH RECURSIVE r AS (
            SELECT id
            FROM sap.deps
            WHERE id = main_sap.id
        UNION ALL
        SELECT 
            sap.deps.id
        FROM  sap.deps
        JOIN r ON sap.deps.parent = r.id
        )
        SELECT * from r
        ORDER BY id)))

from sap.deps as main_sap
        where
        main_sap.depname = ANY(($1::text[]))
        and main_sap.date = '${date}'
        and main_sap.bank = '${bank}'
        and main_sap.lvl = 2
        `, [assistant]);

    return res.rows;
}

module.exports = {
    getUpr,
    getZam,
    getDepsID,
    getOutstate,
    getAssistant,
    getVspCount,
    getVsp,
    getKicCount,
    getKic
};