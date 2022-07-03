import LoginView from "components/login/Login/Login";
import type { NextPage } from "next";
import { useState } from "react";
import { useWeb3Auth } from "services/web3auth/context/web3-auth.context";

const LoginPage: NextPage = () => {
	return <LoginView />;
	/* const { login, logout, getUserInfo, getAccounts, provider, chain, network } = useWeb3Auth();
	const [details, setDetails] = useState("");
	const [accounts, setAccounts] = useState("");

	const handleShowDetails = async () => {
		const maybeAccounts = await getAccounts();
		maybeAccounts.match({
			ok: (accounts) => {
				setAccounts(JSON.stringify(accounts, null, "\t"));
			},
			fail: (err) => {
				setAccounts("Failed to load accounts: " + err);
			},
		});

		const maybeUserInfo = await getUserInfo();
		maybeUserInfo.match({
			ok: (info) => {
				setDetails(JSON.stringify(info, null, "\t"));
			},
			fail: (err) => {
				setDetails("Failed to load due to error: " + err.message);
			},
		});
	};
	return (
		<main>
			<section>
				<h1>LogIn</h1>
				<h2>You are: {provider ? "logged in" : "logged out"}</h2>

				{provider ? (
					<button onClick={logout}>Log Out</button>
				) : (
					<button type="button" onClick={login}>
						Log In
					</button>
				)}
			</section>
			<section>
				<h1>Data:</h1>
				{provider && <button onClick={handleShowDetails}>Show Details</button>}
				{details && <pre>User info: {details}</pre>}
				{accounts && (
					<pre>
						Accounts: {accounts} || chain: {chain} || network: {network}
					</pre>
				)}
			</section>
		</main>
	); */
};

export default LoginPage;
