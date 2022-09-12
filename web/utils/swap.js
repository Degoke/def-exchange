import { Contract } from 'ethers';
import {
    EXCHANGE_CONTRACT_ABI,
    EXCHANGE_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI,
    TOKEN_CONTRACT_ADDRESS,
} from "../constants";

/**
 * getAmountOfTokensReceivedFromSwap: returns the number
 * of Eth/ Crypto Dev tokens that can be received when the user
 * swaps `_swapAmountWei` amount of Eth/Crypto Dev tokens
 */
export const getAmountOfTokensReceivedFromSwap = async (
    _swapAmountWei,
    provider,
    ethSelected,
    ethBalance,
    reserveCD
) => {
    const exchangeContract = new Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        provider
    );
    let amountOfTokens;

    if (ethSelected) {
        amountOfTokens = await exchangeContract.getAmountOfTokens(
            _swapAmountWei,
            ethBalance,
            reserveCD
        );
    } else {
        amountOfTokens = await exchangeContract.getAmountOfTokens(
            _swapAmountWei,
            reserveCD,
            ethBalance
        );
    }

    return amountOfTokens;
};

/**
 * swapTokens: swaps `swapAmountWei` of Eth/Crypto Dev tokes
 * with `tokenToBeReceivedAfterSwap` amount Eth/Crypto Dev tokens
 */
export const swapTokens = async (
    signer,
    swapAmountWei,
    tokenToBeReceivedAfterSwap,
    ethSelected
) => {
    const exchangeContract = new Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        signer
    );

    const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
    );

    let tx;

    if (ethSelected) {
        tx = await exchangeContract.ethToCryptoDevToken(
            tokenToBeReceivedAfterSwap,
            {
                value: swapAmountWei
            }
        );
    } else {
        tx = await tokenContract.approve(
            EXCHANGE_CONTRACT_ADDRESS,
            swapAmountWei.toString()
        );
        await tx.wait();

        tx = await exchangeContract.ethToCryptoDevToken(
            swapAmountWei,
            tokenToBeReceivedAfterSwap
        );
    }

    await tx.wait();
}