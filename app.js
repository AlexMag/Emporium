class Calendar {

    constructor() {

        this.template()
    }

    template() {

        let c = document.getElementById('calendar')

        c.addEventListener('change', (e) => {

            let el = document.getElementById('days')

            el.innerHTML = '' // clear

            // day start
            this.shift(e.target.value, el)


            if (e.target.value >= 0) {

                // days in month
                let daysInMonth = new Date(2022, (parseInt(e.target.value) + 1), 0).getDate();

                if (daysInMonth) {
                    for (let i = 1; i <= daysInMonth; i++) {
                        el.insertAdjacentHTML('beforeend', '<div class="day" id="day_' + i + '">' + i + '</div>')
                    }
                }
            }

            this.showNameOfWeek(e.target.value)
        });
    }

    /**
     * Shift for week
     *
     * @param num
     * @param el
     */
    shift(num, el) {

        // Note: JavaScript counts months from 0 to 11
        let shift = new Date(2022, parseInt(num), 1).getDay()

        //Su (0) - add 6
        for (let j = 1; j <= (shift > 0 ? shift - 1 : 6); j++) {
            el.insertAdjacentHTML('beforeend', '<div class="day_empty"> &nbsp; </div>')
        }
    }

    /**
     * Show/hide week days when month selected
     *
     * @param dayOfWeek
     */
    showNameOfWeek(dayOfWeek) {

        let days_name = document.getElementsByClassName('days_name')[0]

        if (dayOfWeek == '') {

            // hide
            days_name.classList.add('hide')
        } else {

            days_name.classList.remove('hide')
        }
    }
}

new Calendar();


class Launches {

    launches = {}
    start = this.toTimestamp('01/01/2022')
    end = this.toTimestamp(new Date(2022, 11, 31, 23, 59, 59)) // full day
    today = this.toTimestamp(new Date())


    constructor() {

        this.addToDiv()
        this.selectMonth()
    }


    /**
     * Set a month
     */
    selectMonth() {

        let el = document.querySelector("#calendar");

        el.addEventListener('change', (e) => {

            if (e.target.value != '') {
                // set date range
                this.start = this.toTimestamp(new Date(2022, e.target.value, 1))
                this.end = this.toTimestamp(new Date(2022, e.target.value, this.daysInMonth(2022, e.target.value), 23, 59, 59))

            } else { // reset for show all

                this.start = this.toTimestamp('01/01/2022')
                this.end = this.toTimestamp(new Date(2022, 11, 31, 23, 59, 59))
            }

            this.addToDiv()

        });
    }

    daysInMonth(year, month) {

        return new Date(year, (parseInt(month) + 1), 0).getDate();
    }

    /**
     * Add to div
     *
     * @returns {Promise<void>}
     */
    async addToDiv() {

        // load object
        await this.getData()

        let container = document.getElementById('container')

        container.innerHTML = ''

        // loop launches object
        Object.keys(this.launches).forEach(key => {

            // filter
            if (this.launches[key].date_unix >= this.start && this.launches[key].date_unix <= this.end) {

                let date = new Date(this.launches[key].date_unix * 1000)

                this.markCalendar(date)

                container.insertAdjacentHTML('beforeend', '<div class=" ' + (this.launches[key].date_unix >= this.today ? 'cardWillLaunch' : 'card') + ' ">' +

                    '<strong>' + this.launches[key].name + '</strong><br><hr>' + date.toLocaleDateString("en-US") +

                    '<span class="status">' +
                    (this.launches[key].success == true ? 'Success 😀' : '') +
                    (this.launches[key].success == false ? 'Fail 😫' : '') +
                    (this.launches[key].success == null ? 'Soon 🚀' : '') +
                    '</span>' +
                    ' <p class="muted">' + (this.launches[key].details ? this.launches[key].details : '') + '</p>' +
                    ' <p>' + (this.launches[key].links.article ? '<a target="_blank" href="' + this.launches[key].links.article + '">article</a>' : '') + '</p>' +
                    '</div>')
            }
        })
    }

    markCalendar(date) {

        let el = document.getElementById('day_' + date.getDate())

        // mark
        if (el) {
            el.classList.add('day_mark')
        }
    }

    /**
     * Convert Date to timestamp
     *
     * @param strDate{string}
     * @returns {number}
     */
    toTimestamp(strDate) {
        let d = Date.parse(strDate);
        return d / 1000;
    }

    /**
     * Get data from SpaceX-API
     *
     * @returns {Promise<string>}
     */
    async getData() {

        const response = await fetch('https://api.spacexdata.com/v5/launches', {
            method: 'GET'
        }).catch(function (e) {
            console.log("Error: " + e);
        });

        this.launches = await response.json();
    }
}

new Launches();

