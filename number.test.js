const QUnit = require('qunitjs');
const number = require('./number')

QUnit.module('number', hooks => {

    ['de', 'de-AT', 'ko', 'jp', 'hi-IN'].forEach(locale => {

        QUnit.test(`parse '${ locale }'`, assert => {
            const numberFormat = new Intl.NumberFormat(locale, {
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 3
            });

            [
                123.456,
                -123.456,
                1234.56,
                -1234.56
            ].forEach(expected => {
                const string = numberFormat.format(expected);
                const actual = number.parse(string, locale)
                assert.equal(actual, expected);
            });

            assert.equal(number.parse('', locale), null);

            assert.ok(Number.isNaN(number.parse('1a', locale)));
        });

        QUnit.test(`scientific '${ locale }'`, assert => {
            const numberFormat = new Intl.NumberFormat(locale, {
                minimumSignificantDigits: 2,
                maximumSignificantDigits: 2
            });
            const format = number => numberFormat.format(number);

            assert.equal(number.parse(`${ format(1.3) }e5`, locale), 1.3e5);
            assert.equal(number.parse(`${ format(-1.3) }e5`, locale), -1.3e5);
            assert.equal(number.parse(`${ format(1.3) }e+5`, locale), 1.3e5);
            assert.equal(number.parse(`${ format(1.3) }e-5`, locale), 1.3e-5);
        });

    });


    QUnit.test('significantDigits', assert => {
        assert.equal(number.significantDigits(0), 0);
        assert.equal(number.significantDigits(2), 1);
        assert.equal(number.significantDigits(1234), 4);
        assert.equal(number.significantDigits(2.34), 3);
        assert.equal(number.significantDigits(3000), 1);
        assert.equal(number.significantDigits(0.0034), 2);
        assert.equal(number.significantDigits(120.5e50), 4);
        assert.equal(number.significantDigits(1120.5e+50), 5);
        assert.equal(number.significantDigits(120.52e-50), 5);
        assert.equal(number.significantDigits(Math.PI), 16);
    });
});
