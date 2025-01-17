import { SetStateAction, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import Avatar from "react-avatar-edit";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "@/hooks/use-toast";
const Uploader = () => {
	const fetch = useFetch();
	const { toast } = useToast();
	const [preview, setPreview] = useState(null);
	const [open, setOpen] = useState(false);

	const onClose = () => {
		setPreview(null);
	};

	const onCrop = (view: string) => {
		setPreview(view as unknown as SetStateAction<null>);
	};

	//const onBeforeFileLoad = (elem:React.ChangeEvent<HTMLInputElement>) => {
	//    if (elem.target.files[0].size > 716800) {
	//        alert("Slika je prevelika!");
	//        elem.target.value = "";
	//    }
	//};

	function base64ToFile(base64String: string, fileName: string) {
		const base64PrefixPattern = /^data:(.*?);base64,/;
		let base64Data = base64String.replace(base64PrefixPattern, "");

		while (base64Data.length % 4 !== 0) {
			base64Data += "=";
		}

		const binaryString = atob(base64Data);
		const length = binaryString.length;
		const uint8Array = new Uint8Array(length);
		for (let i = 0; i < length; i++) {
			uint8Array[i] = binaryString.charCodeAt(i);
		}

		const mimeMatch = base64String.match(base64PrefixPattern);
		const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";
		return new File([uint8Array], fileName, { type: mimeType });
	}

	const handleSubmit = () => {
		if (preview) {
			const file = base64ToFile(preview, "profileImage");
			const formData = new FormData();
			formData.append("file", file);

			fetch("/teacher/update/profileImage", {
				method: "POST",
				body: formData,
			})
				.then((res) => {
					if (res.status == 201) {
						window.location.reload();
					} else
						toast({
							title: "Upload failed...",
							description: "Please, try again.",
							variant: "destructive",
						});
				})
				.catch(() => {
					toast({
						title: "Network error...",
						description: "Could not upload the image.",
						variant: "destructive",
					});
				});
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="bg-inherit">
				<a>Upload new profile image</a>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Upload new profile image</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-5">
					<Avatar
						width={"100%" as unknown as number}
						height={400}
						imageWidth={400}
						onCrop={onCrop}
						onClose={onClose}
						//onBeforeFileLoad={onBeforeFileLoad}   not needed because of exportSize
						exportAsSquare={true}
						exportSize={256}
						exportMimeType={"image/jpeg"}
						backgroundColor={"none"}
						label={"Click to load image"}
						labelStyle={{
							color: "white",
							textDecoration: "underline",
							cursor: "pointer",
						}}
					/>
					<button
						onClick={handleSubmit}
						className="flex justify-center"
					>
						Upload
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default Uploader;
