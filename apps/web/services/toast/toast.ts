interface IToast {
	message: (message: string) => void;
	success: (message: string) => void;
	warning: (message: string) => void;
	error: (message: string) => void;
}

export const toast: IToast = {
	message: (message: string) => {
		window.alert(`Message: ${message}`);
	},
	success: (message: string) => {
		window.alert(`Success! ${message}`);
	},
	warning: (message: string) => {
		window.alert(`Warning! ${message}`);
	},
	error: (message: string) => {
		window.alert(`Error! ${message}`);
	},
};
