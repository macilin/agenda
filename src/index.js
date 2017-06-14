'use strict';

const Koa = require('koa');
const co = require('co');
const path = require('path');
const server = require('koa-static');
const logger = require('koa-logger');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');

const logHTML = require('./Type.js').logHTML;
const listTypes = require('./Type.js').listMeetingsTypes;


let app = new Koa();
const AgendaService = require('./AgendaService.js');
let Agenda = new AgendaService();

/**
 * APP Config
 */
const PORT = 3000;
app.use(bodyParser());
app.use(logger());


/**
 * ========================  router  ========================
 */

/**
 * return the current account name
 */
router.get('/api', (ctx, next)=> {
    ctx.body = Agenda.name;
});

/**
 * create a user
 */
router.get('/api/register', (ctx, next)=> {
    if (Agenda.isRunning()) {
        ctx.body = 'You have been logged in!';
    } else {
        let registerInfo = ctx.query;
        ctx.body = Agenda.createUser(registerInfo);
    }
});

/**
 * user login
 */
router.get('/api/login', (ctx, next)=> {
    let userSimpleInfo = ctx.query;
    // if succeed to login
    if (Agenda.storage.userArray.some((user)=> {
            return userSimpleInfo.name === user.name && userSimpleInfo.password === user.password;
        })) {
        console.log(`[Login] @${userSimpleInfo.name} log in!`);
        Agenda.name = userSimpleInfo.name;
        Agenda.password = userSimpleInfo.password;
        ctx.body = `<h3>I'm ${Agenda.name}.</h3>`;
    } else {
        ctx.body = 'no-log';
    }
});

/**
 * every time fresh the page, check if you have logged in
 */
router.get('/am-i-logged', (ctx, next)=> {
    console.log('[receive] /am-i-logged');
    if (Agenda.isRunning())
        ctx.body = `<h3>I'm ${Agenda.name}.</h3>`;
    else
        ctx.body = 'no-log';
});

/**
 * User general operation
 */
router.get('/api/operation', (ctx, next)=> {
    if (Agenda.isRunning())
        switch (ctx.query['type']) {
            case 'o':
                if (Agenda.logOut()) {
                    ctx.body = logHTML;
                }
                break;
            case 'dc':
                if (Agenda.deleteAgendaAccount()) {
                    ctx.body = logHTML + '<br/>your account has been deleted!!';
                }
                break;
            case 'lu':
                ctx.body = Agenda.listAllUsers();
                break;
            case 'cm':
                ctx.body = Agenda.createMeeting(ctx.query);
                break;
            case 'la':
                ctx.body = Agenda.listMeetings(listTypes.All, Agenda.name);
                break;
            case 'las':
                ctx.body = Agenda.listMeetings(listTypes.Sponsor, Agenda.name);
                break;
            case 'lap':
                ctx.body = Agenda.listMeetings(listTypes.Participator, Agenda.name);
                break;
            case 'qm':
                ctx.body = Agenda.listMeetings(listTypes.All, Agenda.name).filter((meeting)=> {
                    let title = ctx.query.title || '';
                    return meeting.title === title;
                });
                break;
            case 'qt':
                ctx.body = Agenda.listMeetings(listTypes.All, Agenda.name).filter((meeting)=> {
                    let start = new Date(ctx.query['start-date']);
                    let end = new Date(ctx.query['end-date']);
                    return !(end < meeting.startDate || meeting.endDate < start);
                });
                break;
            case 'dm':
                break;
            case 'da':
                break;
            default:
                ctx.body = 'Your query string is not Valid!'
        }
    else
        ctx.body = '[error] Please Sign In !';
});


app.use(router.routes()).use(router.allowedMethods());

/**
 * =========================== check logged ============================
 */
app.use(co.wrap(function *(ctx, next) {

    if (Agenda.isRunning()) {
        console.log('Running checked!');
    } else {
        console.log('unRunning checked!');
    }
    yield next();

}));

/**
 * =========================== static src ============================
 */
app.use(server('./assets'));

try {
    app.listen(PORT);
} catch (error) {
    console.log(`[error] ${e}`);
}

console.log(`The server is running at port: ${PORT}`);