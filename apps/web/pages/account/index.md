import type { Account } from "@modules/account/domain/account";
import { Result } from "@utils/monads/result.monad";
import { request } from "@utils/request";
import type { NextPage } from "next";
/_ import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSwr from "swr"; _/

/\* const useAccount = ({
redirectTo,
redirectIfFound = false,
}: {
redirectTo: "/join";
redirectIfFound?: boolean;
}) => {
// https://nextjs.org/docs/authentication
// https://github.com/vercel/next.js/blob/canary/examples/with-iron-session/lib/useUser.ts
// Get token from local storage and fetch account info.
// If not, redirect
const { data: account, mutate: mutateAccount } = useSwr<Account>("/api/account");

    useEffect(() => {
    	if (!account) {
    		Router.push(redirectTo);
    	}
    }, [redirectTo]);

    return { account };

};
\*/
const AccountPage: NextPage = () => {
const router = useRouter();
const [accountInfo, setAccountInfo] = useState<Account | undefined>(undefined);
const [isLoading, setIsLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    const { account } = useAccount({ redirectTo: "/join" });

    const handleLoad = async () => {
    	setIsLoading(true);

    	const { id } = router.query;

    	if (!id) {
    		setErrorMessage("No account id provided");
    		return;
    	}

    	const result = await request<Account>(`/api/account/${id}`);
    	result.match({
    		ok: (value) => {
    			setAccountInfo(value);
    		},
    		fail: (err) => {
    			console.error(err);
    			setErrorMessage("Could not get account info at this time.");
    		},
    	});

    	setIsLoading(false);
    };

    return (
    	<main>
    		{!accountInfo && !errorMessage && (
    			<button onClick={() => handleLoad()}>
    				Get Profile{isLoading && <span>Loading...</span>}
    			</button>
    		)}
    		{accountInfo && <code>{JSON.stringify(accountInfo)}</code>}
    		{errorMessage && <h1>{errorMessage}</h1>}
    	</main>
    );

};

export default AccountPage;
