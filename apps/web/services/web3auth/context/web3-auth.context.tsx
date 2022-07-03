import type { Result } from "@utils/monads/result.monad";
import type { Nullable } from "@utils/types/nullable";
import type { Web3Auth } from "@web3auth/web3auth";
import type { ReactNode } from "react";
import type { Web3AuthChainConfigType, Web3AuthNetworkConfigType } from "../config";
import type { IWalletProvider } from "./wallet-provider";
import type { SafeEventEmitterProvider } from "@web3auth/base";
import type { User } from "./domain/user";
import { fail, ok } from "@utils/monads/result.monad";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { WEB3AUTH_CHAIN_CONFIG } from "../config";
import { getWalletProvider } from "./wallet-provider";
import { ADAPTER_EVENTS } from "@web3auth/base";
import { toast } from "services/toast/toast";

interface IWeb3AuthContext {
	web3Auth: Nullable<Web3Auth>;
	provider: Nullable<IWalletProvider>;
	chain: Nullable<string>;
	network: Nullable<string>;
	user: User;
	connectionStatus: "DISCONNECTED" | "CONNECTING" | "CONNECTED";
	isLoading: boolean;
	login: () => Promise<void>;
	logout: () => Promise<void>;
	getUserInfo: () => Promise<Result<Partial<User>>>;
	getAccounts: () => Promise<Result<string[]>>;
	getBalance: IWalletProvider["getBalance"];
	signMessage: IWalletProvider["signMessage"];
}

const initialState: IWeb3AuthContext = {
	web3Auth: null,
	provider: null,
	chain: null,
	network: null,
	user: null,
	connectionStatus: "DISCONNECTED",
	isLoading: false,
	login: async () => {},
	logout: async () => {},
	getUserInfo: async () => fail(new Error("No provider selected yet")),
	getAccounts: async () => fail(new Error("No provider selected yet")),
	getBalance: async () => fail(new Error("No provider selected yet")),
	signMessage: async () => fail(new Error("No provider selected yet")),
};

export const Web3AuthContext = createContext(initialState);
export const useWeb3Auth = () => useContext(Web3AuthContext);

export const Web3AuthProvider = ({
	children,
	web3AuthNetwork,
	chain,
}: {
	children?: ReactNode;
	web3AuthNetwork: Web3AuthNetworkConfigType;
	chain: Web3AuthChainConfigType;
}) => {
	const [web3Auth, setWeb3Auth] = useState<IWeb3AuthContext["web3Auth"]>(null);
	const [connectionStatus, setConnectionStatus] =
		useState<IWeb3AuthContext["connectionStatus"]>("DISCONNECTED");
	const [isLoading, setIsLoading] = useState<IWeb3AuthContext["isLoading"]>(false);
	const [user, setUser] = useState<IWeb3AuthContext["user"]>(null);
	const [provider, setProvider] = useState<IWeb3AuthContext["provider"]>(null);

	const setWalletProvider = useCallback(
		(web3authProvider: SafeEventEmitterProvider) => {
			getWalletProvider({ chain, provider: web3authProvider }).match({
				ok: (result) => setProvider(result),
				fail: (err) => {
					toast.error(err.message);
					setProvider(null);
				},
			});
		},
		[chain],
	);

	const resetState = () => {
		setConnectionStatus("DISCONNECTED");
		setIsLoading(false);
		setUser(null);
		setProvider(null);
	};

	useEffect(() => {
		const subscribeAuthEvents = (web3AuthInstance: Web3Auth) => {
			// TODO: type data
			web3AuthInstance.on(ADAPTER_EVENTS.CONNECTED, (data: unknown) => {
				if (!data) {
					toast.error("No user data found");
					return;
				}
				if (!web3AuthInstance.provider) {
					toast.error("No login provider found");
					return;
				}
				setConnectionStatus("CONNECTED");
				setUser(data);
				setWalletProvider(web3AuthInstance.provider);
			});

			web3AuthInstance.on(ADAPTER_EVENTS.CONNECTING, () => {
				setConnectionStatus("CONNECTING");
			});

			web3AuthInstance.on(ADAPTER_EVENTS.DISCONNECTED, () => {
				resetState();
			});

			web3AuthInstance.on(ADAPTER_EVENTS.ERRORED, (err) => {
				console.error(err);
				toast.error("Login request was cancelled either by user or a problem.");
				resetState();
			});
		};

		const currentChainConfig = WEB3AUTH_CHAIN_CONFIG[`${chain}`];

		const init = async () => {
			try {
				const { Web3Auth } = await import("@web3auth/web3auth");
				const { OpenloginAdapter } = await import("@web3auth/openlogin-adapter");

				setIsLoading(true);

				// const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
				// if (!clientId) throw new Error("ClientId environmental variable is missing.");
				const clientId = "1234";

				const adapter = new OpenloginAdapter({
					adapterSettings: { network: web3AuthNetwork, clientId },
				});
				const web3AuthInstance = new Web3Auth({
					chainConfig: currentChainConfig,
					clientId: clientId,
				});
				web3AuthInstance.configureAdapter(adapter);

				subscribeAuthEvents(web3AuthInstance);

				setWeb3Auth(web3AuthInstance);
				await web3AuthInstance.initModal();

				setIsLoading(false);
			} catch (err) {
				resetState();
				toast.error("An unexpected error occurred when trying to log in.");
				console.log(err);
			}
		};

		init();
	}, [web3AuthNetwork, chain, setWalletProvider]);

	const login = async () => {
		if (!web3Auth) {
			console.log("Cannot log in before Web3Auth initializes.");
			return;
		}

		const localProvider = await web3Auth.connect();
		if (!localProvider) {
			toast.error("Was not able to connect to login provider.");
			return;
		}

		setWalletProvider(localProvider);
	};

	const logout = async () => {
		if (!web3Auth) {
			console.log("Cannot log out before Web3Auth initializes.");
			return;
		}

		await web3Auth.logout();
		resetState();
	};

	/**
	 * If the typeOfLogin is a social, this returns related account data.
	 */
	const getUserInfo: IWeb3AuthContext["getUserInfo"] = async () => {
		if (!web3Auth) return fail(new Error("Cannot get user info before Web3Auth initializes"));

		const user = await web3Auth.getUserInfo();
		return ok(user);
	};

	const getAccounts: IWeb3AuthContext["getAccounts"] = async () => {
		if (!provider) return fail(new Error("Cannot get accounts before a provider is established."));

		return provider.getAccounts();
	};

	const getBalance: IWeb3AuthContext["getBalance"] = async () => {
		if (!provider) return fail(new Error("Cannot get accounts before a provider is established."));

		return provider.getBalance();
	};

	const signMessage: IWeb3AuthContext["signMessage"] = async (message: string) => {
		if (!provider) return fail(new Error("Cannot sign message before a provider is established."));

		return provider.signMessage(message);
	};

	return (
		<Web3AuthContext.Provider
			value={{
				web3Auth,
				provider,
				chain,
				network: web3AuthNetwork,
				user,
				connectionStatus,
				isLoading,
				login,
				logout,
				getUserInfo,
				getAccounts,
				getBalance,
				signMessage,
			}}
		>
			{children}
		</Web3AuthContext.Provider>
	);
};
