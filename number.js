const patterns = {};

const getPattern = (locale) => {

    return patterns[locale] || (() => {
        const numberString = new Intl.NumberFormat(locale, { useGrouping: true }).format(12345.6);
        const seperator = numberString.substr(-2, 1);
        const group = Array.from(numberString.replace(/\d/g, ''))
            .filter(char => char !== seperator)
            .find(() => true);

        return (patterns[locale] = { group, seperator });
    })();
};

const exports = {
    parse(string, locale = 'en-US') {
        if (string === '') { return null; }
        const { group, seperator } = getPattern(locale);

        return Number(string.replace(group, '').replace(seperator, '.'));
    },

    significantDigits(number) {
        const numberString = String(Math.abs(number))
            .replace('.', '')
            .replace(/e(\+|-)?\d+$/, '')
            .replace(/0+$/, ''); // ~ meh

        if (numberString === '') { return 0; }

        const pure = Number(numberString);
        return Math.floor(Math.log10(pure)) + 1;
    }
};


if (typeof module !== 'undefined') {
    module.exports = exports;
} else {
    this.number = exports;
}
