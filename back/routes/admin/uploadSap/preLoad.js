const {kic_check, dep_kic_check} = require('./help');

let ok_check = (name) => {
    let regex = RegExp(".*доп.*офис.*", "i");
    return regex.test(name)
};

function preLoadDeps(json, startDeps, kic) {
    let unic_names = {empty: true};

    let a = 0;
    while (a + startDeps <= 18) {
        unic_names[`_${startDeps + a}`] = new Set();
        for (let item of json) {
            unic_names[`_${startDeps + a}`].add(item[`_${startDeps + a}`])
        }
        unic_names[`_${startDeps + a}`] = [...unic_names[`_${startDeps + a}`]]
            .filter(item => item !== 'Не присвоено' &&
                !(ok_check(item)) &&
                (!kic ? !dep_kic_check(item) : true)
            )
            .sort();
        if (unic_names[`_${startDeps + a}`].length > 0) {
            unic_names.empty = false;
        }
        a += 1;
    }
    unic_names.startDeps = startDeps;

    return unic_names.empty ? null : unic_names
}

function preLoad(json) {
    let startDepsTb = 9;
    let tb = json.filter(item => item._8 === 'Подразделения аппарата банка' || item._8 === 'ТОЕ РСЦ');
    let gosb = json.filter(item => item._7 === 'Отделения на правах филиалов' &&
        (item._9 === 'Аппарат отделения' || item._9 === 'Руководство' ||
            item._9 === 'Отделения на правах подразделений'));
    let headdep = json.filter(item => (item._8 === 'Головные отделения' || item._8 === 'Отделения') &&
        (item._10 === 'Аппарат отделения' || item._10 === 'Руководство'  || item._10 === 'ТОЕ РСЦ'));
    let vsp_gosb = json.filter(item => item._20 === 'ВСП' && item._7 === 'Отделения на правах филиалов');
    let vsp_head = json.filter(item => item._20 === 'ВСП' && item._7 === 'Аппарат банка');
    let vsp_msk = json.filter(item => item._20 === 'ВСП' && (item._7 === 'Аппарат банка' ||
        item._7 === 'Отделения МБ (на правах управлений)') && item._6 === 'Московский банк');
    let kic_tb = json.filter(item => kic_check(item._8) && item._7 === 'Аппарат банка');
    let kic_tb_broken = json.filter(item => dep_kic_check(item._10) && item._7 === 'Аппарат банка');
    let kic_gosb = json.filter(item => kic_check(item._9) && item._7 === 'Отделения на правах филиалов');

    if (tb.length === 0 && gosb.length === 0 && headdep.length === 0) {
        tb = json.filter(item => item._8 === 'Подразделения МБ');
        startDepsTb = 10;
    }

    let kic_tb_pre = preLoadDeps(kic_tb, 9, true);
    let kic_tb_pre_broken = preLoadDeps(kic_tb_broken, 10, true);
    if (kic_tb_pre === null) {
        kic_tb_pre = kic_tb_pre_broken;
    }
    else {
        if (kic_tb_pre_broken !== null) {
            let index = 0;
            while (index + 10 <= 18) {
                let obj_index = `_${index + 10}`;
                kic_tb_pre[obj_index] = [...kic_tb_pre[obj_index], ...kic_tb_pre_broken[obj_index]];
                index += 1;
            }
        }
    }

    return {
        tb: preLoadDeps(tb, startDepsTb),
        gosb: preLoadDeps(gosb, 10, false),
        head: preLoadDeps(headdep, 11, false),
        vsp_head: preLoadDeps(vsp_head, 11, false),
        vsp_gosb: preLoadDeps(vsp_gosb, 10, false),
        vsp_msk: preLoadDeps(vsp_msk, 10, false),
        kic_tb: kic_tb_pre,
        kic_gosb: preLoadDeps(kic_gosb, 10, true),
    }
}

module.exports = {
    preLoad,
};