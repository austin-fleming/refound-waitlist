import { Profile } from "@modules/account/domain/profile";
import { Result } from "@utils/monads/result.monad";
import { request } from "@utils/request";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const ProfilePage: NextPage = () => {
	const router = useRouter();
	const [profileInfo, setProfileInfo] = useState<Profile | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

	const handleLoad = async () => {
		setIsLoading(true);

		const { handle } = router.query;

		if (!handle) {
			setErrorMessage("No profile handle provided");
			return;
		}

		const result = await request<{ data: Profile }>(`/api/profile/${handle}`);
		result.match({
			ok: (data) => {
				console.log(data.data);
				setProfileInfo(data.data);
			},
			fail: (err) => {
				console.error(err);
				setErrorMessage("Could not get profile info at this time.");
			},
		});

		setIsLoading(false);
	};

	return (
		<main>
			{!profileInfo && !errorMessage && (
				<button onClick={() => handleLoad()}>
					Get Profile{isLoading && <span>Loading...</span>}
				</button>
			)}
			{profileInfo && (
				<section>
					<h1>{profileInfo.handle}</h1>
					<p>Joined {profileInfo.createdAt.toString()}</p>

					<pre>{JSON.stringify(profileInfo, null, "\t")}</pre>
				</section>
			)}
			{errorMessage && <h1>{errorMessage}</h1>}
		</main>
	);
};

export default ProfilePage;
