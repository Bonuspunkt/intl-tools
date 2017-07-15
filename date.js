const patterns = {};

const parameters = {
    weekday: ['narrow', 'short', 'long'],
    era: ['narrow', 'short', 'long'],
    year: ['numeric', '2-digit'],
    month: ['numeric', '2-digit', 'narrow', 'short', 'long'],
    day: ['numeric', '2-digit'],
    hour: ['numeric', '2-digit'],
    minute: ['numeric', '2-digit'],
    second: ['numeric', '2-digit'],
    timeZoneName: ['short', 'long']
}

const weekdayDates = Array.from({ length: 7 }).map((_, i) => new Date(2017, 0, i + 1));
const eraDates = [new Date(-1000, 0, 1), new Date(1000, 0, 1)];
const monthDates = Array.from({ length: 12 }).map((_, i) => new Date(2017, i, 1));
const dayperiodDates = Array.from({ length: 2 }).map((_, i) => new Date(2017, 0, 1, 12 * i + 6));

const skip = name => !['numeric', '2-digit'].includes(name);

const getPattern = (locale) => {

    return patterns[locale] || (() => {

        const weekdayMappings = parameters.weekday.filter(skip).map(weekday => {
            const dateTimeFormat = new Intl.DateTimeFormat(locale, { weekday });
            const weekdays = weekdayDates.map(
                date => dateTimeFormat.formatToParts(date)
                    .find(part => part.type === 'weekday').value
            );
            return { [weekday]: weekdays };
        });

        const eraMappings = parameters.era.filter(skip).map(era => {
            const dateTimeFormat = new Intl.DateTimeFormat(locale, { era });
            const eras = eraDates.map(
                date => dateTimeFormat.formatToParts(date)
                    .find(part => part.type === 'era').value
            );
            return { [era]: eras };
        });

        const monthMappings = parameters.month.filter(skip).map(month => {
            const dateTimeFormat = new Intl.DateTimeFormat(locale, { month });
            const months = monthDates.map(
                date => dateTimeFormat.formatToParts(date)
                    .find(part => part.type === 'month').value
            );
            return { [month]: months };
        });

        const dayperiodFormat = new Intl.DateTimeFormat(locale, { hour: '2-digit', hour12: true });
        const dayperiodMappings = dayperiodDates
            .map(date => dayperiodFormat.formatToParts(date)
                .find(part => part.type === 'dayperiod').value
            );

        const result = {
            weekday: Object.assign({}, ...weekdayMappings),
            era: Object.assign({}, ...eraMappings),
            month: Object.assign({}, ...monthMappings),
            dayTimeFormat: dayperiodMappings
        };

        patterns[locale] = result;
        return result;
    })();
};

module.exports = {
    getPattern,
};
