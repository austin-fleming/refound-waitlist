import { cloin } from "@utils/css/cloin";
import Router from "next/router";
import { useWeb3Auth } from "services/web3auth/context/web3-auth.context";
import S from "./Login.module.css";

const LoginView = () => {
	const { login, provider } = useWeb3Auth();

	// Check if account exists. If so, get info and populate.
	// If not, create account and move to profile creation.
	if (provider) {
		Router.push("/account");
	}

	return (
		<section className="flex flex-col items-center justify-center max-w-screen-md min-h-[calc(100vh-36px)] sm:min-h-[calc(100vh-96px)] gap-12 mx-auto text-center">
			<h1 className="text-4xl">
				Join our waitlist
				<br />
				to claim a username
			</h1>
			<div className="flex flex-col items-stretch gap-4">
				<button
					type="button"
					className={cloin(S["btn"], S["btn--large"], S["btn--solid"])}
					onClick={login}
				>
					Join
				</button>
				<button type="button" className={cloin(S["btn"], S["btn--large"])} onClick={login}>
					Log In
				</button>
			</div>
		</section>
	);
};

export default LoginView;
