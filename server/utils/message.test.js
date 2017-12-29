const expect = require( 'expect' );
const {generateMessage} =require( './message' );

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