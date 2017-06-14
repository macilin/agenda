'use strict';

const actionTypes = {
    default: 'DEFAULT'
};

const listMeetingsTypes = {
    All: 'ALL',
    Sponsor: 'SPONSOR',
    Participator: 'PARTICIPATOR'
};

const logHTML = `<form method="post" action="/api/login" id="fm1" class="form-inline text-center">
    <label class="form-group">UserName: <input class="form-control" type="text" name="name"/></label>
    <label class="form-group">PassWord: <input class="form-control" type="text" name="password"/></label>
    <a href="#" id="fm1-submit" type="submit" class="btn">Submit</a>
</form>`;

class Action {
    constructor() {
        this.type = actionTypes.default;
    }
}

module.exports = {
    Action, actionTypes, listMeetingsTypes, logHTML
};