#!/bin/bash

# Run the first script and capture its output
output=$(npx hardhat deploy-renter --network localFunctionsTestnet)

# Extract the deployed contract address using grep and sed
address=$(echo "$output" | grep -oP 'deployed SimpleRent \K(0x[a-fA-F0-9]{40})')

# Check if the address was successfully extracted
if [ -z "$address" ]; then
  echo "Failed to extract the deployed contract address."
  exit 1
fi

echo "deployed simpleRent: $address"

# Run the second script and capture its output
output2=$(npx hardhat deploy-checkin --simple-rent-address  $address --network localFunctionsTestnet)


# Extract the deployed SimpleRentCheckin contract address using grep and sed
simple_rent_checkin_address=$(echo "$output2" | grep -oP 'deployed SimpleRentCheckin \K(0x[a-fA-F0-9]{40})')

echo "deployed SimpleRentCheckin: $simple_rent_checkin_address"


# Check if the SimpleRentCheckin address was successfully extracted
if [ -z "$simple_rent_checkin_address" ]; then
  echo "Failed to extract the deployed SimpleRentCheckin contract address."
  exit 1
fi

# run the feed script
feed_out=$(npx hardhat feed-rent --network localFunctionsTestnet --contract  $address)
echo  "$feed_out"


# rn the sub create

expect <<EOF
spawn npx hardhat functions-sub-create --network localFunctionsTestnet --amount 10 --contract $simple_rent_checkin_address
expect "Continue? Enter (y) Yes / (n) No" 
send "y\r"  
expect eof
EOF


