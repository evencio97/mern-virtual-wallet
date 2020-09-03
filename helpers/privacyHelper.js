'use strict'

function userPrivacy(data){
    data.password= undefined;
    data.wallet= undefined;
    data.deposits= undefined;
    data.purchases= undefined;
    data.sessions= undefined;
    data.session= undefined;
    return data;
}

function sessionPrivacy(data){
    return data;
}

module.exports = {
    userPrivacy,
    sessionPrivacy,
};