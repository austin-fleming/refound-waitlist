import { Account } from "@modules/account/domain/account";
import { Nullable } from "@utils/types/nullable";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWeb3Auth } from "services/web3auth/context/web3-auth.context";
import { CreateHandleModal } from "../CreateHandleModal/CreateHandleModal";
import S from "./AccountView.module.css";

export const AccountView = () => {
	const { provider, account, profile, logout } = useWeb3Auth();
	const router = useRouter();

	useEffect(() => {
		if (!provider) {
			router.push("/");
		}
	}, [provider]);

	return (
		<>
			<div className="w-full">{!profile && <CreateHandleModal />}</div>
			<section className="flex flex-row w-full mx-auto flex-nowrap p-contentPadding max-w-container-narrow">
				<div className="flex flex-col items-center w-full gap-8 text-center">
					<h1 className="text-4xl">Your Account</h1>

					<button type="button" onClick={logout}>
						Log Out
					</button>

					<div>
						<p className="max-w-[35ch]">
							Thank you for registering your interest in Refound. Over the coming months, we{"'"}ll
							be rolling out features as we prepare this platform for submission in{" "}
							<a
								className="underline"
								href="https://web3athon.xyz/"
								target="_blank"
								rel="noreferrer"
							>
								Web3athon
							</a>
							.
						</p>
					</div>

					<div className={S.accountDetail}>
						<span className={S.accountDetail_label}>Handle</span>
						{profile?.handle ? <span>@{profile.handle}</span> : <span>-</span>}
					</div>

					<div className={S.accountDetail}>
						<span className={S.accountDetail_label}>Joined</span>
						<span>{new Date(account?.createdAt).toDateString()}</span>
					</div>

					<div className={S.accountDetail}>
						<span className={S.accountDetail_label}>Address</span>
						<span className="break-all">{account?.wallet.address}</span>
					</div>

					{account?.provider.email && (
						<div className={S.accountDetail}>
							<span className={S.accountDetail_label}>Email</span>
							<span>{account.provider.email}</span>
						</div>
					)}
				</div>
			</section>
		</>
	);
};
