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

### Testing

1. First, start the `localFunctionsTestnet` with `npm run startLocalFunctionsTestnet`.

2.  Using the `localFunctionsTestnet`, deploy the consumer contract:

```
npx hardhat functions-deploy-consumer --network localFunctionsTestnet
```

3. Update the DON ID for the consumer contract that was just deployed (not sure if required?):

```
npx hardhat functions-set-donid --network localFunctionsTestnet --contract <contract-address>
```

4. Fund the subscription:

```
npx hardhat functions-sub-create --network localFunctionsTestnet --amount 10 --contract <contract-address>
```

5. Then, with the contract deployed and subid set it is possible to call it's address with a `sendRequest`, as follows.
It will

```
npx hardhat functions-request --network localFunctionsTestnet --contract <contract-address> --subid 1
```

6. Lastly, it is possible to read value sent to the contract:

```
npx hardhat functions-read	--network localFunctionsTestnet --contract _address
```

#### Important "gotchas" of testing

- **Notice that all the tests run with `npm run test` depend on the correct setup of all the scripts above.** The tests
  run specifically in the `localFunctionsTestnet` and nowhere else because it is hardcoded into this testnet.

- Another annoying thing on testing is that it is necessary to setup the env vars for every terminal with `npx env-enc set-pw`. So keep
  that in mind.

- Tests are "stackable", meaning that every time a test is rerun it is essentially running on the same `localFunctionsTestnet` sate.
  Usually, it is better to make a completely new fresh testing environment as the test is run, but this was kept for simplicity.
