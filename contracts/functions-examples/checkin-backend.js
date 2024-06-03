const ethers = await import("npm:ethers@6.10.0");

// This example shows how to handle a Checkin process with off-chain systems.
// The in contract data can be sent to an off-chain API, which will validate the on-chain data
// against its own data. 

// Arguments are all in args array.
const orderId = args[0];

// Call the API endpoint to check the order status
const response = await fetch('http://localhost:3000/api/handle-checkin-example', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ orderId }),
});

const data = await response.json();

if (!response.ok) {
  throw new Error(`Error: ${data.error}`);
}

// Use the status from the API response
const valid = data.status;

// ABI encoding
const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
  ["uint256", "bool"],
  [orderId, valid]
);

// return the encoded data as Uint8Array
return ethers.getBytes(encoded);
