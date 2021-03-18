const axios = require('axios');
const https = require('https');
const setting = require('../serverConfig');

const {
    getRoles,
    logPart
} = require('./help');

async function checkUser(req, res, next){
    // try{
        // let auth = req.headers.authorization;
        let user={data:{"user":{"user":{"id":"17847852","directory":"DOMAIN","name":"Иркабаев Ильдар Нургалеевич","qlik_roles":[],"sudir_roles":["VPO_SP_QS_PRBR_Writer_CA_DEV"],"attributes":{"login":"irkabaev-in","FullName":"Иркабаев Ильдар Нургалеевич","EmployeeNumber":"irkabaev-in"},"tb_id":0,"gosb_id":0,"inactive":false,"role":{"name":"guest","desc":"Гость","id":0}}},"colorMain":{"1":{"color":"#d28279","name":"Управление, внедрение и контроль стандартов, реализция HR цикла.","num":1},"2":{"color":"#79d27a","name":"ДУБЛИКАТ (при переносе бд не смог восстановить название, во всех остатках таблицы были только дубликаты).","num":2},"3":{"color":"#d5e6b3","name":"Анализ, планирование, поддержка руководства","num":3},"4":{"color":"#7ed279","name":"Клиентский фронт","num":4},"5":{"color":"#79d2c6","name":"Смешанная функция: Внедрение стандартов (Управление) + Анализ и планирование","num":5},"6":{"color":"#40acbf","name":"Сервисная поддержка клиентских функций","num":6},"7":{"color":"#7999d2","name":"Обеспечение деятельности Банка (сервисаня поддержка внетреннего клиента)","num":7},"8":{"color":"#d279cd","name":"Не опред","num":8},"9":{"color":"#b8bf40","name":"Упраздненные должности","num":9}},"colorEx":{"1":{"color":"#40bebf","name":"Иная должность","num":1},"2":{"color":"#40bf52","name":"Участвующий во взаимодействии с клиентом","num":2}},"date":"2020-11-01"}};
       
        // if (setting.dev) {
        //     user = await axios.get(setting.sudir);
        // }
        // else {
        //     user = await axios.get(setting.sudir,{
        //         headers:{Authorization:auth},
        //         httpsAgent: new https.Agent({rejectUnauthorized: false})
        //     });
        // }
        
        // if(user.data.user.inactive){
        //     res.sendStatus(401);
        //     return
        // }
        req.user = user.data;
        req.user.user.role = await getRoles(req.user.user.sudir_roles);
        await logPart(req.user);
        next()
    // }catch(e){
    //     res.sendStatus(401)
    // }
}

module.exports = {
    checkUser
};