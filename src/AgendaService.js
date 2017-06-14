'use strict';
const Storage = require('./Storage.js');
const Meeting = require('./Component/Meeting.js');
const User = require('./Component/User.js');
const listTypes = require('./Type.js').listMeetingsTypes;

class AgendaService {
    constructor() {
    }

    createUser(userLike) {
        if (this.storage.userArray.every(storageUser=> {
                return storageUser.name !== userLike.name;
            })) {
            let user = new User(userLike.name,
                userLike.password, userLike.email, userLike.phone);
            this.storage.userArray.push(user);
            this.storage.sync();
            return user;
        }
        return 'failed';

    }

    isRunning() {
        return this.name.length && this.password.length;
    }

    logOut() {
        try {
            this.name = '';
            this.password = '';
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    deleteAgendaAccount() {
        this.storage.userArray = this.storage.userArray.filter((user)=> {
            return user.name !== this.name;
        });
        this.storage.meetingArray = this.storage.meetingArray.filter(meeting=> {
            return meeting.sponsor !== this.name && meeting.participators.every(name=>name !== this.name);
        });
        this.storage.sync();
        return this.logOut();
    }

    listAllUsers() {
        return this.storage.userArray;
    }

    createMeeting(queryObj) {
        if (queryObj['participators[]'] && Array.isArray(queryObj['participators[]'])) {
            queryObj.participators = queryObj['participators[]'];
        } else if (queryObj['participators[]'] && typeof queryObj['participators[]'] === 'string') {
            queryObj.participators = [].concat(queryObj['participators[]']);
        }
        else{
            console.log(queryObj);
            return '[error] The participators is not a array.';
        }


        let SponsorNotInParticipator = queryObj.participators.every(participatorName=>this.name !== participatorName);
        if (typeof queryObj.startDate === 'string' && typeof queryObj.endDate === 'string') {
            console.log(`[convert] convert ${typeof queryObj.startDate} into Object`);
            queryObj.startDate = new Date(queryObj.startDate);
            queryObj.endDate = new Date(queryObj.endDate);
            console.log(`[convert result] query.startDate === ${queryObj.startDate}, instance = ${queryObj.startDate instanceof Date}`);
            console.log(`[convert result] query.endDate === ${queryObj.endDate}, instance = ${queryObj.endDate instanceof Date}`);
            console.log(`[assert] queryObj.startDate < queryObj.endDate: ${queryObj.startDate < queryObj.endDate}`);
        }
        let dateIsValid = queryObj.startDate instanceof Date &&
            queryObj.endDate instanceof Date &&
            queryObj.startDate < queryObj.endDate;

        let participatorIsExist = true;
        for (let name of queryObj.participators) {
            if (this.storage.userArray.some(user=>user.name === name)) {
                // ignore
            } else {
                participatorIsExist = false;
                break;
            }
        }

        let titleIsUnique = this.storage.meetingArray.every(meeting=> {
            return meeting.title !== queryObj.title;
        });

        let sponsorTimeOK = this.listMeetings(listTypes.All, this.name).every(meeting=> {
            console.log(`[assert] 对于会议 ${meeting.title}:`);
            console.log(`[assert] 查询起止时间在这个会议的开始前 ${queryObj.endDate <= meeting.startDate}`);
            console.log(`[assert] 查询起止时间在这个会议的开始后 ${queryObj.startDate >= meeting.endDate}`);
            console.log(`[assert] 查询时间是否合适？${queryObj.endDate <= meeting.startDate ||
            queryObj.startDate >= meeting.endDate}`);
            console.log(`[assert] 会议开始时间 ${meeting.startDate}`);
            console.log(`[assert] 会议是实例吗？${meeting instanceof Meeting}`);
            console.log(`[assert] 会议的时间是实例吗？${meeting.startDate instanceof Date}`);

            return queryObj.endDate <= meeting.startDate ||
                queryObj.startDate >= meeting.endDate;
        });

        let participatorsTimeOK = queryObj.participators.every(participatorName=> {
            return this.listMeetings(listTypes.All, participatorName).every(meeting=> {
                return queryObj.endDate <= meeting.startDate ||
                    queryObj.startDate >= meeting.endDate;
            });
        });

        if (SponsorNotInParticipator && dateIsValid && titleIsUnique && sponsorTimeOK && participatorsTimeOK) {
            let m = new Meeting(this.name, queryObj.participators, queryObj.startDate, queryObj.endDate, queryObj.title);
            this.storage.meetingArray.push(m);
            this.storage.sync();
            return this.storage.meetingArray;
        }
        return `[error] fail to create a meeting, the reason is
                <ul>
                    <li>Sponsor is not in participators : ${SponsorNotInParticipator}</li>
                    <li>Date is valid : ${dateIsValid}</li>
                    <li>participatorIsExist : ${participatorIsExist}</li>
                    <li>titleIsUnique : ${titleIsUnique}</li>
                    <li>sponsorTimeOK : ${sponsorTimeOK}</li>
                    <li>participatorsTimeOK : ${participatorsTimeOK}</li>
                </ul>`;
    }

    listMeetings(listType, relatedName) {
        switch (listType) {
            case listTypes.All:
                let result = this.storage.meetingArray.filter(meeting=> {
                    return meeting.sponsor === relatedName || meeting.participators.some(name=> {
                            return name === relatedName;
                        });
                });
                return result;
            case listTypes.Sponsor:
                return this.storage.meetingArray.filter(meeting=> {
                    return meeting.sponsor === relatedName;
                });
            case listTypes.Participator:
                return this.storage.meetingArray.filter(meeting=> {
                    return meeting.participators.some(name=> {
                        return name === relatedName;
                    });
                });
            default:
                return [];
        }
    }
}

AgendaService.prototype.name = '';
AgendaService.prototype.password = '';
AgendaService.prototype.storage = new Storage();

module.exports = AgendaService;