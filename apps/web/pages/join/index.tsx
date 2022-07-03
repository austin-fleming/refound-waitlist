import { Profile } from "@modules/account/domain/profile";
import { request } from "@utils/request";
import type { NextPage } from "next";
import type { SyntheticEvent } from "react";
import { useState } from "react";

const JoinPage: NextPage = () => {
	const [desiredHandle, setDesiredHandle] = useState("");
	const [availability, setAvailability] = useState<"WAITING" | "AVAILABLE" | "TAKEN">("WAITING");

	const handleAvailabilityCheck = async (event: SyntheticEvent) => {
		event.preventDefault();

		// TODO: where should I validate the handle submitted? Currently this isn't running through any domain object.
		// Maybe make it a value object and use that?
		if (!desiredHandle) {
			window.alert("failed validation");
			return;
		}

		const exists = await request<{ exists: boolean }>(`/api/profile/${desiredHandle}/exists`);
		exists.match({
			ok: (response) => {
				console.log({ response });
				setAvailability(response.exists ? "TAKEN" : "AVAILABLE");
			},
			fail: (err) => {
				console.error(err);
				throw new Error("CRRRRAAASSSHHH");
			},
		});
	};

	return (
		<main className="flex flex-col items-center justify-center w-full min-h-screen">
			<section className="shadow-lg min-w-[300px] max-w-full flex flex-col p-8 items-center">
				<h1>Join</h1>

				<p>Mint it back to life</p>

				<p>Get your handle</p>
				<form>
					<input
						value={desiredHandle}
						onChange={(event) => setDesiredHandle(event.target.value)}
						className="border-2 border-black border-solid"
						type="text"
						required
					/>

					<div>
						{availability === "AVAILABLE" && <h1>AVAILABLE!</h1>}
						{availability === "TAKEN" && <h1>TAKEN!</h1>}
					</div>

					<button type="submit" onClick={handleAvailabilityCheck}>
						Send
					</button>
				</form>

				<p>Typed: {desiredHandle}</p>
			</section>
		</main>
	);
};

export default JoinPage;
