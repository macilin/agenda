'use strict';

class Meeting {
    constructor(sponsorName, participatorArray, startDate, endDate, title) {
        this.sponsor = sponsorName;
        this.participators = participatorArray;
        this.startDate = startDate;
        this.endDate = endDate;
        this.title = title;
    }

    get startDate() {
        if (this._startDate instanceof Date)
            return this._startDate;
        return new Date(this._startDate);
    }

    set startDate(newStartDate) {
        this._startDate = newStartDate;
    }

    get endDate() {
        if (this._endDate instanceof Date)
            return this._endDate;
        return new Date(this._endDate);
    }

    set endDate(newEndDate) {
        this._endDate = newEndDate;
    }
}

module.exports = Meeting;