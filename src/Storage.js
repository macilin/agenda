'use strict';
const fs = require('fs');
const Meeting = require('./Component/Meeting.js');
const User = require('./Component/User.js');
const Path = {
    User: './json/User.json',
    Meeting: './json/Meeting.json'
};

class Storage {
    constructor() {
        if (isEmpty(this.userArray)) {
            console.log(`[read] User succeed to sync from ${Path.User}`);
            this.userArray = this.readFromFile(Path.User);
            console.log(this.userArray);
        }

        if (isEmpty(this.meetingArray)) {
            console.log(`[read] Meeting succeed to sync from ${Path.Meeting}`);
            this.meetingArray = this.readFromFile(Path.Meeting).map(convertToMeeting);
        }
    }

    sync() {
        this.writeToFile(Path.User, this.userArray).then(()=> {
            console.log(`[sync] User succeed to sync into ${Path.User}`);
        });

        console.log(`[write] JSON.stringfy = ${JSON.stringify(this.meetingArray)}`);
        this.writeToFile(Path.Meeting, this.meetingArray).then(()=> {
            console.log(`[sync] Meeting succeed to sync into ${Path.Meeting}`);
        });
    }

    writeToFile(path, data) {
        return new Promise((resolve, reject)=> {
            fs.writeFile(path, JSON.stringify(data), (err)=> {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }

    readFromFile(path) {
        return JSON.parse(fs.readFileSync(path, 'utf-8'));
    }


}

Storage.prototype.userArray = [];
Storage.prototype.meetingArray = [];
Storage.prototype.isDirty = false;

function convertToMeeting(meetingLike) {
    console.log(meetingLike);
    return new Meeting(meetingLike.sponsor, meetingLike.participators,
        meetingLike._startDate, meetingLike._endDate, meetingLike.title);
}


function isEmpty(array) {
    return !array.length;
}
module.exports = Storage;