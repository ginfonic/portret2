const axios = require('axios');
const https = require('https');
const setting = require('../serverConfig');

const {
    getRoles,
    logPart
} = require('./help');

async function checkUser(req, res, next){
    try{
        let auth = req.headers.authorization;
        let user;
        if (setting.dev) {
            user = await axios.get(setting.sudir);
        }
        else {
            user = await axios.get(setting.sudir,{
                headers:{Authorization:auth},
                httpsAgent: new https.Agent({rejectUnauthorized: false})
            });
        }
        
        if(user.data.user.inactive){
            res.sendStatus(401);
            return
        }
        req.user = user.data;
        req.user.user.role = await getRoles(req.user.user.sudir_roles);
        await logPart(req.user);
        next()
    }catch(e){
        res.sendStatus(401)
    }
}

module.exports = {
    checkUser
};