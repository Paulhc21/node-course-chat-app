const expect = require( 'expect' );

const { isRealString } = require( './validation' );

describe('isRealString', () => {
    it('should reject non-string values', () => {
        var res = isRealString(98);
        expect(res).toBe(false);
    });

    it('should reject string with only spaces', () => {
        var res = isRealString('     ');
        expect(res).toBe(false);
    });

    it('should allow string with none-space charactors', () => {
        var res = isRealString('   f o     ');
        expect(res).toBe(true);
    });
});