const ethers = await import("npm:ethers@6.10.0");

// This example shows how to handle a Checkin process with off-chain systems.
// The in contract data can be snt to an off-chain API, which will validate the on-chain data
// against it's own data. 


// Arguments are all in args array.
const orderId = args[0]


// TODO: setup back-end to achieve vald state! This is just a boilerplate code
const valid = true;
// ABI encoding
const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
    ["uint256", "bool"],
    [orderId, valid]
  );

// return the encoded data as Uint8Array
return ethers.getBytes(encoded);

