# Smart contracts

This repo contains all solutions of the smart contracts.

For now, the consumer address is  `0xb1D0763964511f57e5d70362b283765b6159331` in Ethereum Sepoila
the subscription ID is: `2632`

Common used: 

```
npx hardhat functions-read --contract 0xb1D0763964511f57e5d70362b283765b61593310  --network ethereumSepolia 

npx hardhat functions-request --network ethereumSepolia --contract 0xb1D0763964511f57e5d70362b283765b61593310 --subid 2632
```


### other tools

If necessary, it is possible to mine Sepolia Eth here: https://www.ethereum-ecosystem.com/faucets/ethereum-sepolia



### Testing

Using the `localFunctionsTestnet`, first to deploy the consumer contract:

```
npx hardhat functions-deploy-consumer --network localFunctionsTestnet         
```

Update the DON ID for the consumer contract that was just deployed (not sure if required?): 

```
npx hardhat functions-set-donid --network localFunctionsTestnet --contract <contract-address>	
```

Fund the subscription:

```
npx hardhat functions-sub-create --network localFunctionsTestnet --amount 10 --contract <contract-address>	
```

Then, with the contract deployed and subid set it is possible to call it's address with a `sendRequest`, as follows.
It will 

```
npx hardhat functions-request --network localFunctionsTestnet --contract <contract-address> --subid 1
```


Lastly, it is possible to read value sent to the contract:

```
npx hardhat functions-read	--network localFunctionsTestnet --contract _address 
```

