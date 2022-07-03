import type { Profile } from "@modules/account/domain/profile";
import type { AddProfileResponse } from "@modules/account/usecases/add-profile";
import type { GetProfileHandleExistsResponse } from "@modules/account/usecases/get-profile-handle-exists";
import { cloin } from "@utils/css/cloin";
import { isHandle } from "@utils/validation/is-handle";
import axios from "axios";
import type { SyntheticEvent } from "react";
import { useState } from "react";
import { toast } from "services/toast/toast";
import { useWeb3Auth } from "services/web3auth/context/web3-auth.context";
import { v4 as uuidV4 } from "uuid";

type HandleAvailability = "WAITING" | "AVAILABLE" | "TAKEN";

export const CreateHandleModal = () => {
	const { account, setProfile } = useWeb3Auth();

	const [availability, setAvailability] = useState<HandleAvailability>("WAITING");
	const [desiredHandle, setDesiredHandle] = useState("");
	const [isValid, setIsValid] = useState(false);
	const [isChecking, setIsChecking] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	if (!account) return null;

	const handleInput = (str: string) => {
		setDesiredHandle(str);
		setIsValid(isHandle(str));
		setAvailability("WAITING");
	};

	const handleAvailabilityCheck = async (event: SyntheticEvent) => {
		event.preventDefault();

		try {
			// TODO: where should I validate the handle submitted? Currently this isn't running through any domain object.
			// Maybe make it a value object and use that?
			if (!desiredHandle) {
				return;
			}
			setIsChecking(true);

			await axios
				.get<GetProfileHandleExistsResponse>(`/api/profile/${desiredHandle}/exists`)
				.then((response) => {
					if (!response.data.exists) {
						setAvailability("AVAILABLE");
						return;
					}

					setAvailability("TAKEN");
				})
				.catch((err) => {
					throw new Error(err);
				});
		} catch (err) {
			toast.error("Could not check handle availability.");
		}

		setIsChecking(false);
	};

	const handleUpdateProfileHandle = async (event: SyntheticEvent) => {
		event.preventDefault();
		setIsSubmitting(true);

		try {
			const profileData: Profile = {
				id: uuidV4(),
				accountId: account.id,
				handle: desiredHandle,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			const newProfile = await axios
				.post<AddProfileResponse>(`/api/profile/create`, profileData)
				.then((response) => {
					if (response.data.data) {
						return response.data.data;
					}

					throw new Error("Could not create handle");
				})
				.catch((err) => {
					throw new Error(err);
				});

			setProfile(newProfile);
		} catch (err) {
			console.error(err);
			toast.error("Could not create handle at this time.");
		}

		setIsSubmitting(false);
	};

	return (
		<section className="relative flex flex-col items-center w-full gap-4 pt-12 text-center px-contentPadding pb-contentPadding text-background bg-primary">
			<h2 className="text-2xl">Claim your handle</h2>
			<form
				className={cloin(
					"flex flex-col items-center w-full gap-4 max-w-container-narrow",
					isSubmitting && "pointer-events-none",
				)}
			>
				<label className="sr-only" htmlFor="username">
					Username
				</label>
				<input
					id="username"
					name="username"
					value={desiredHandle}
					placeholder="your-new-handle"
					onChange={(event) => handleInput(event.target.value)}
					className="w-full p-2 text-lg text-center border-b-2 border-solid opacity-75 bg-primary border-background text-background focus:outline-none focus:text-background focus:opacity-100"
					type="text"
					required
				/>

				<div
					className={cloin(availability !== "WAITING" || isChecking ? "opacity-100" : "opacity-0")}
				>
					<span>{isChecking ? "Checking..." : availability}</span>
				</div>

				<button
					className="border-2 border-background border-solid rounded-full px-[1.5em] py-[0.6em] min-w-[50%] disabled:opacity-25"
					type="submit"
					onClick={
						availability === "AVAILABLE" ? handleUpdateProfileHandle : handleAvailabilityCheck
					}
					disabled={!isValid || availability === "TAKEN"}
				>
					{availability === "AVAILABLE" ? "CLAIM" : "CHECK"}
				</button>

				<div className={cloin("flex flex-col gap-0", isValid ? "opacity-0" : "opacity-100")}>
					<span className="text-sm text-background-lesser">Must be 3-15 characters long.</span>
					<span className="text-sm text-background-lesser">Can contain a-z, 0-9, -, and _</span>
				</div>
			</form>

			{isSubmitting && (
				<div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center bg-primary text-background">
					<span>SUBMITTING</span>
				</div>
			)}
		</section>
	);
};
