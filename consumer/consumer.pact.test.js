const { Pact } = require('@pact-foundation/pact');
const path = require('path');
const { getUser } = require('./consumer');
const { like } = require('@pact-foundation/pact').Matchers;

const provider = new Pact({
    consumer: 'UserConsumer',
    provider: 'UserProvider',
    port: 8081,
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: 'INFO',
    spec: 2
});

describe('User API Pact', () => {
    beforeAll(() => provider.setup());
    afterAll(() => provider.finalize());

    describe('when a request to get a user by ID is made', () => {
        beforeAll(() =>
            provider.addInteraction({
                state: 'a user with ID 1 exists',
                uponReceiving: 'a request for user with ID 1',
                withRequest: {
                    method: 'GET',
                    path: '/user/1',
                    headers: {
                        Accept: 'application/json'
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: {
                        id: like(1),
                        name: like('John Doe'),
                        age: like(30)
                    }
                }
            })
        );

        it('should return the correct user data', async () => {
            const user = await getUser(1);
            expect(user).toEqual({
                id: 1,
                name: 'John Doe',
                age: 30
            });
        });

        afterEach(() => provider.verify());
    });
});
