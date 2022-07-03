import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3AuthProvider } from "services/web3auth/context/web3-auth.context";
import { Layout } from "components/Layout/Layout";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Web3AuthProvider chain="polygon" web3AuthNetwork="mainnet">
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</Web3AuthProvider>
	);
}

export default MyApp;
