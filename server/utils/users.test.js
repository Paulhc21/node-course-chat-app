const expect = require( 'expect' );
const {Users} =require( './users' );

describe('users', () => {
    var users;
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'emily',
            room: 'fluffyness'
        },
        {
            id: '2',
            name: 'geoff',
            room: 'sticky'
        },
        {
            id: '3',
            name: 'frank',
            room: 'fluffyness'
        }];
    });

    it('should add a new user', () => {
        var users = new Users();
        var user = {
            id: '12345',
            name: 'Emily',
            room: 'Furry animals'
        };
        var resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        var userId = '1';
        var user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove user', () => {
        var userId = '99';
        var user = users.removeUser(userId);

        expect(user).toNotExist();
        expect(users.users.length).toBe(3);

    });

    it('should find user', () => {
        var userId = '2';
        var user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });

    it('should NOT find user', () => {
        var userId = '99';
        var user = users.getUser(userId);

        expect(user).toNotExist();
    });

    it('should return names for fluffyness', () => {
        var userList = users.getUserList('fluffyness');

        expect(userList).toEqual(['emily', 'frank']);
    });

    it('should return names for sticky', () => {
        var userList = users.getUserList('sticky');

        expect(userList).toEqual(['geoff']);
    });
});
