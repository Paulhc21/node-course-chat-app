const expect = require( 'expect' );
const {generateMessage, generateLocationMessage} =require( './message' );

describe('generateMessage', () => {
    it('Should generate the correct message object', () => {
        var from = 'Emily';
        var text = 'Went to the store';
        var message = generateMessage( from, text );

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({
            from,
            text
        });
    });
});

describe('generateLocationMessage', () => {
    it('Should generate the correct location object', () => {
        var from = 'Emily';
        var latitude = 25;
        var longitude = -75;
        var url = 'https://www.google.com/maps?q=25,-75';
        var message = generateLocationMessage(from, latitude, longitude);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({
            from,
            url
        });
    });
});