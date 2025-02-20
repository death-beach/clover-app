#!/bin/bash

echo "Searching for deprecated Privy patterns..."

echo -e "\nFiles using getEthersProvider:"
find ./src -type f -exec grep -l "getEthersProvider" {} \;

echo -e "\nFiles using sendTransaction without hash handling:"
find ./src -type f -exec grep -l "sendTransaction" {} \;

echo -e "\nFiles using waitForTransactionConfirmation:"
find ./src -type f -exec grep -l "waitForTransactionConfirmation" {} \;

echo -e "\nFiles potentially using old Web3 patterns:"
find ./src -type f -exec grep -l "new Web3(" {} \;