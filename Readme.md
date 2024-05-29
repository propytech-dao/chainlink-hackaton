# Propytech

Opportunity: The [ReNFT protocol](https://www.renft.io/) implemented a rental solution which abstracts the complexity of handling rentals of
non-fungible tokens on-chain. By building on top of the rental infrastructure of ReNFT, In this project we wanted to solve the problem of renting real estate via smart contracts, while keeping the legacy tech components and compliance of the rental tied to the blockchain.

Our idea: a real estate renting platform, with a front-end UX that is familiar to most people that rented on AirBNB, but renting the property is done on the smart contract while the KYC verification, attestation of NFC cards to unlock doors, and other post check-in rules are handled off-chain in the renter system. All in a easy way to tie on-chain and off-chain systems.


## What it does

TLDR: Rent the real estate on-chain while the Property Management System (PMS) off-chain can be triggered by the smart contract using a Chainlink Function to
verify user data before check-in, assign physical NFC keys to open the doors and so on.

Using the front-end, users are able to rent paying in cryptocurrency and to check-in after the payment is done. The check-in calls a Chainlink Function to interact
with the off-chain PMS. Notice that the PMS being able to be synced with the contract means that the same property could be rented both in legacy systems and smart contracts, without ending up in a "duplicate buy" scenario, since 