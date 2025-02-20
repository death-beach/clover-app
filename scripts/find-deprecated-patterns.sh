#!/bin/bash

echo "Searching for deprecated Privy patterns..."

echo -e "\nSearching for getEthersProvider usage:"
grep -r "getEthersProvider" ./src

echo -e "\nSearching for getWeb3Provider usage:"
grep -r "getWeb3Provider" ./src

echo -e "\nSearching for waitForTransactionConfirmation usage:"
grep -r "waitForTransactionConfirmation" ./src

echo -e "\nSearching for direct Web3 provider initialization:"
grep -r "new Web3(" ./src

echo "Search complete. Review the results above to identify files requiring updates."