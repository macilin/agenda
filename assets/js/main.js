'use strict';
/**
 * baffle
 */

const characters = [
    '\u2588',
    '\u2593',
    '\u2592',
    '\u2591',
    '\u2588',
    '\u2593',
    '\u2592',
    '\u2591',
    '\u2588',
    '\u2593',
    '\u2592',
    '\u2591',
    '\u003c',
    '\u003e',
    '\u002f'
];
new Promise((resolve, reject)=> {
    setTimeout(()=> {
        resolve('.header-headline');
    }, 1000);
}).then((str)=> {
    new baffle(str, {
        characters,
        speed: 50
    }).reveal(4000);
});

/**
 * [Login] login area
 */
fetch('/am-i-logged').then(data=> {
    return data.text();
}).then(text=> {
    if (text !== 'no-log') {
        $('#log').html(text);
        $('#section-user').show();
        $('#section-register').hide();
    } else {
        $('#section-user').hide();
    }
});

const login = logInfo=> {
    return fetch(`/api/login?${logInfo}`).then(res=>res.text())
        .then(text=> {
            if (text !== 'no-log') {
                $('#log').html(text);
                $('#section-user').show();
                $('#section-register').hide();
            }
        });
};

$('#fm1-submit').click((e)=> {
    e.preventDefault();
    let queryString = $('#fm1').serialize();
    login(queryString);
});

/**
 * [Register] user register
 */
$('#fm-register-submit').click(e=> {
    e.preventDefault();
    let queryString = $('#fm-register').serialize();
    fetch(`/api/register?${queryString}`)
        .then(res=>res.json())
        .then(json=> {
            login($.param(json));
        }).catch(e=> {
        alert(`Fail to create!`);
    });
});

/**
 * [user] user operation
 */
$('#fm-user-submit').click(e=> {
    e.preventDefault();
    let queryString = $('#fm-user').serialize();
    fetch(`/api/operation?${queryString}`)
        .then(res=>res.text())
        .then(text=> {
            console.log(`[log out] you have logged out!`);
            $('#log').html(text);
            $('#fm1-submit').click((e)=> {
                e.preventDefault();
                let queryString = $('#fm1').serialize();
                login(queryString);
            });
            $('#section-user').hide();
            $('#section-register').show();
        }).catch(e=> {
        console.log(e);
    });
});


/**
 * [test 1] Method: GET with QueryString
 */
$('#t1-submit').click((e)=> {
    e.preventDefault();
    let queryString = $('#t1-fm').serialize();
    fetch(`/api/operation?${queryString}`).then(res=> {
        return res.text();
    }).then(text=> {
        $('#t1-r').html(text);
    }).catch(err=> {
        $('#t1-r').html(err);
    });
});

/**
 * [test 2] Create Meeting
 */
$('#t2-submit').click(e=> {
    e.preventDefault();
    let formArray = $('#t2-fm').serializeArray();
    let queryString = {};
    queryString.type = 'cm';
    queryString.title = formArray[0].value;
    queryString.participators = formArray[1].value.split(',');
    queryString.startDate = new Date(formArray[2].value);
    queryString.endDate = new Date(formArray[3].value);
    queryString = $.param(queryString);

    fetch(`/api/operation?${queryString}`)
        .then(res=>res.text())
        .then(text=> {
            $('#t2-r').html(text);
        })
        .catch(e=> {
            $('#t2-r').html(e);
        });
});

/**
 * [test 3] Query Meeting By Title
 */
$('#t3-submit').click(e=> {
    e.preventDefault();
    let queryString = {};
    queryString.type = $('#t3-type-select').val();
    switch (queryString.type) {
        case 'qt':
            queryString['start-date'] = $('#query-start').val();
            queryString['end-date'] = $('#query-end').val();
            break;
        case 'qm':
            queryString.title = $('#query-title-input').val();
            break;
    }
    fetch(`/api/operation?${$.param(queryString)}`)
        .then(res=>res.text())
        .then(text=> {
            $('#t3-r').html(text);
        }).catch(e=> {
        $('#t3-r').html(e);
    });

});

$('#t3-type-select').change((e)=> {
    let label = $('#t3-replace-label');
    let inputWrap = $('#t3-replace-input');
    switch (e.target.value) {
        case 'qt':
            label.html('Time Interval: ').attr('for', '');
            inputWrap.html(`<div class="form-group">
                <div class="col-sm-6">
                    <label class="sr-only" for="query-start"></label>
                    <input id="query-start" class="form-control" type="text" placeholder="Start Date"/>                
                </div>
                <div class="col-sm-6">
                    <label class="sr-only" for="query-end"></label>
                    <input id="query-end" class="form-control" type="text" placeholder="End Date"/>            
                </div>
                </div>`);
            break;
        case 'qm':
            label.html('Meeting Title: ').attr('for', 'query-title-input');
            inputWrap.html(`<input class="form-control" type="text" name="title"
                           id="query-title-input" value="How to learn Javascript"/>`);
            break;
    }
});