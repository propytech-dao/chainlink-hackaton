# Smart contracts

This repo contains all solutions of the smart contracts. For clarification, we copied the
code from [ReNFT sylvester-v1](https://github.com/re-nft/contracts-sylvester) to showcase
an example using their protocol. But we also defined a simpler renting protocol called `SimpleRent`, which is 
the contract the front-end is integrated to.

Ideally, our solution would not depend on the lending protocol being used to rent. However, depending
on the lending protocol, it is necessary to change the `FunctionsConsumer` to make the adequate checks.



### Common and reusable commands

For now, the consumer address is `0xb1D0763964511f57e5d70362b283765b6159331` in Ethereum Sepoila
the subscription ID is: `2632`

1. To interact with deployed functions consumer

```
npx hardhat functions-read --contract 0xb1D0763964511f57e5d70362b283765b61593310  --network ethereumSepolia

npx hardhat functions-request --network ethereumSepolia --contract 0xb1D0763964511f57e5d70362b283765b61593310 --subid 2632
```

### other tools

If necessary, it is possible to mine Sepolia Eth here: https://www.ethereum-ecosystem.com/faucets/ethereum-sepolia

## Testing

### setting up all contracts in a testnet

This guide shows how to set it all up in the `localFunctionsTestnet`, but it should be similar
to set it up on any testnet or mainnet.

The testing process below is a bit long. There is a single script that runs it all, printing along the way 
the pertinent information in `test.sh`. Just remember to at least execute step 1 because the script assumes the step 1 os done.


1. First, start the `localFunctionsTestnet` with `npm run startLocalFunctionsTestnet`, and set the encryption variables with `npx env-enc set`. If they are already set, load it all with `npx env-enc set-pw` 

2. The next step is to deploy the the `SimpleRent` and the `SimpleRentCheckin` contracts into this local testnet. First,
the `SimpleRent` contract:

```
➜  npx hardhat deploy-renter --network localFunctionsTestnet                                                                    
secp256k1 unavailable, reverting to browser version
Deploying SimpleRent contract to  localFunctionsTestnet

__Compiling Contracts__
Nothing to compile

Waiting 1 blocks for transaction 0xc555a8eba3da4a42d067460b493becd4c18203dc7b33d95a7896abf9368fd942 to be confirmed...

 deployed SimpleRent 0x18B4Dd97C06dE2BB6C9fc2f20b3C32C1E589d0B4 on localFunctionsTestnet
```

Then, use the address of the `SimpleRent` deploy for the `SimpleCheckin`:

```
➜  npx hardhat deploy-checkin --simple-rent-address  0x18B4Dd97C06dE2BB6C9fc2f20b3C32C1E589d0B4 --network localFunctionsTestnet     
secp256k1 unavailable, reverting to browser version
Deploying checkin contract to  localFunctionsTestnet

__Compiling Contracts__
Nothing to compile

Waiting 1 blocks for transaction 0xf6642e6536521fed284ceb165c1a9f1068db56e9cc99184d19d865b51db12402 to be confirmed...

 deployed SimpleRentCheckin 0x5714A58654688dA90433aa9458258cc30fECb341 on localFunctionsTestnet
```

3. The integration tests can now be run over these contracts. Notice that there is an environment variable called `.env.test`.
Pertinent contract addresses and RPC Url are provided there, to keep all variables easy to change from networks used.
By default, it is applied to the `localFunctionsTestnet`.

First tests to run, are the `simpleRent_integration.spec.js` to "fatten" the rental protocol with data:
```
npx hardhat test ./test/integration/simpleRent_integration.spec.js                                                                         06/01/24 - 11:07 
```

4. Fund subscription, passing the checkin contract as param (it is the consumer):

```
npx hardhat functions-sub-create --network localFunctionsTestnet --amount 10 --contract <contract-address>
```

5. Then, with the contract deployed and subid set it is possible to call it's address with a `sendRequest`, as follows. Remember to set the `subid` to be subId generated from the `functions-sub-create` script from before. 

```
npx hardhat request-checkin --network localFunctionsTestnet --contract <address>  --subid <number>    
```

6. Lastly, it is possible to read value sent to the contract:

```
npx hardhat read-checkin --network localFunctionsTestnet --contract <address>
```


### Testing SimpleRent against Chainlink Functions

To test only the script that is going to answer the contract, try `npx hardhat functions-simulate-script` after configuring the `Functions-request-config.js`.
There are two script examples in `/functoins-examples` folder. 


#### Important "gotchas" of testing

- **Notice that all the tests run with `npm run test` depend on the correct setup of all the scripts above.** The tests
  run specifically in the `localFunctionsTestnet` and nowhere else because it is hardcoded into this testnet.

- Another annoying thing on testing is that it is necessary to setup the env vars for every terminal with `npx env-enc set-pw`. So keep
  that in mind.

- Tests are "stackable", meaning that every time a test is rerun it is essentially running on the same `localFunctionsTestnet` sate.
  Usually, it is better to make a completely new fresh testing environment as the test is run, but this was kept for simplicity.
