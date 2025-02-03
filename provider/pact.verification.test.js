const { Verifier } = require('@pact-foundation/pact');
const path = require('path');
const { spawn } = require('child_process');

// Start the provider service
let serverProcess;
beforeAll((done) => {
    serverProcess = spawn('node', ['provider.js'], {
        stdio: 'inherit'  // this will attach the child process’s stdio to the parent process
    });
	
    serverProcess.on('error', (error) => {
        console.error(`Error starting the provider: ${error}`);
        done(error);
    });

    // Give the server a little time to start
    setTimeout(done, 2000);
});

// Stop the provider service after tests are done
afterAll(() => {
    if (serverProcess) {
        return new Promise((resolve) => {
            serverProcess.kill();
            serverProcess.on('exit', () => {
                resolve();
            });
        });
    }
});

describe('Pact Verification with PactFlow', () => {
    it('validates the expectations of UserConsumer from PactFlow', async () => {
        const opts = {
            provider: 'UserProvider',
            providerBaseUrl: 'http://localhost:8081',
            //pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
            pactBrokerUrl: 'https://charnley-test.pactflow.io',
            //pactBrokerToken: process.env.PACT_BROKER_TOKEN,
            pactBrokerToken: 'P6L732CvvzVqOQeoIITVtg',
            publishVerificationResult: true,
            providerVersion: '1.0.0',
            providerVersionBranch: 'main',
            enablePending: true, // Allows verification of pending Pacts for evolving contracts
            consumerVersionSelectors: [
                { latest: true }  // fetches the latest version
            ]
        };

        return new Verifier(opts)
            .verifyProvider()
            .then((output) => {
                console.log('Pact Verification with PactFlow Complete!');
                console.log(output);
            })
            .catch((error) => {
                console.error('Pact verification failed:', error);
                throw error;
            });
    });
});
