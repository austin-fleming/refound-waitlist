import type { Result } from "@utils/monads/result.monad";
import { ok } from "@utils/monads/result.monad";
import type { SafeEventEmitterProvider } from "@web3auth/base";
import { fail } from "assert";
import Web3 from "web3";

/* 
TODO:
This comes from an example where the only thing done with these methods
is printing their values to the screen.
*/

export interface IWalletProvider {
	getAccounts: () => Promise<Result<string[]>>;
	getBalance: () => Promise<Result<string>>;
	getChainId: () => Promise<Result<number>>;
	signMessage: (message: string) => Promise<Result<any>>;
}

export const evmProvider = (provider: SafeEventEmitterProvider): IWalletProvider => {
	const getAccounts: IWalletProvider["getAccounts"] = async () => {
		try {
			const web3 = new Web3(provider as any);
			const accounts = await web3.eth.getAccounts();
			return ok(accounts);
		} catch (err) {
			// TODO: use custom error type
			console.error(err);
			return fail(new Error("Could not get accounts"));
		}
	};

	const getBalance: IWalletProvider["getBalance"] = async () => {
		try {
			const web3 = new Web3(provider as any);
			const accounts = await web3.eth.getAccounts();
			const balance = await web3.eth.getBalance(accounts[0]);
			return ok(balance);
		} catch (err) {
			console.error(err);
			return fail(new Error("Could not get balance"));
		}
	};

	const getChainId: IWalletProvider["getChainId"] = async () => {
		try {
			const web3 = new Web3(provider as any);
			const chainId = await web3.eth.getChainId();
			return ok(chainId);
		} catch (err) {
			console.error(err);
			return fail(new Error("Could not get chain id"));
		}
	};

	const signMessage: IWalletProvider["signMessage"] = async (message: string) => {
		try {
			const web3 = new Web3(provider as any);
			const accounts = await web3.eth.getAccounts();

			const currentProvider = web3.currentProvider as any;
			if (!currentProvider?.send) {
				return fail(new Error("Could not sign message"));
			}

			currentProvider.send(
				{
					method: "eth_sign",
					params: [accounts[0], message],
					from: accounts[0],
				},
				(err: Error, result: any) => {
					if (err) {
						console.error(err);
						return fail(new Error("Could not sign message"));
					}
					return ok(result);
				},
			);
		} catch (err) {
			console.error(err);
			return fail(new Error("Could not sign message"));
		}
	};

	return {
		getAccounts,
		getBalance,
		getChainId,
		signMessage,
	};
};

export const getWalletProvider = ({
	chain,
	provider,
}: {
	chain: string;
	provider: SafeEventEmitterProvider;
}): Result<IWalletProvider> => {
	if (chain === "polygon") {
		return ok(evmProvider(provider));
	}
	return fail(new Error(`${chain} is not yet supported`));
};
