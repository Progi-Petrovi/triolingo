import React, { useState } from "react";
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
import PathConstants from "@/routes/pathConstants.ts";
import { useNavigate } from "react-router-dom";
import base64js, {toByteArray} from "base64-js";

const Uploader = () =>{

    const fetch = useFetch();
    const { toast } = useToast();
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const onClose = () => {
        setPreview(null);
    };

    const onCrop = (view: string) => {
        setPreview(view);
    };

    const onBeforeFileLoad = (elem:React.ChangeEvent<HTMLInputElement>) => {
        if (elem.target.files[0].size > 716800) {
            alert("Slika je prevelika!");
            elem.target.value = "";
        }
    };

    const base64ToFile = (base64String: string, filename: string) => {
        const arr = base64String.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    };

    function noviBase64ToFile(base64String: string, fileName: string) {
        const base64PrefixPattern = /^data:(.*?);base64,/;
        const base64Data = base64String.replace(base64PrefixPattern, '');

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
        const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
        return new File([uint8Array], fileName, { type: mimeType });
    }

    {/*const stringToFile = (base64String: string, fileName: string) => {
        const base64Prefix = 'data:image/jpeg;base64';
        let data = base64String;
        if (base64String.startsWith(base64Prefix)) {
            data = base64String.substring(base64Prefix.length);
            console.log("ima prefix");
        }

        const binaryString = atob(data);
        const length = binaryString.length;
        const u8arr = new Uint8Array(length);

        for(let i=0; i<length; i++) {
            u8arr[i] = binaryString.charCodeAt(i);
        }

        return new File([u8arr], fileName, { type: 'image/jpeg'} );
    }*/}

    function stringToFile(base64String: string, fileName: string) {
        const base64PrefixPattern = /^data:(.*?);base64,/;
        const base64Data = base64String.replace(base64PrefixPattern, '');

        function fixBase64Padding(base64: string) {
            while (base64.length % 4 !== 0) {
                base64 += "=";
            }
            return base64;
        }

        try {
            const fixedBase64 = fixBase64Padding(base64Data);
            const binaryString = atob(fixedBase64);

            const length = binaryString.length;
            const u8arr = new Uint8Array(length);

            for (let i = 0; i < length; i++) {
                u8arr[i] = binaryString.charCodeAt(i);
            }

            const mimeMatch = base64String.match(base64PrefixPattern);
            const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
            return new File([u8arr], fileName, { type: mimeType });

        } catch (error) {
            console.error("Greška kod pretvorbe iz base64 u File:", error.message);
            return null;
        }
    }



    const handleSubmit = () =>{
        if (preview) {
            //console.log(preview);
            //const file = base64ToFile(preview, "profileImage");
            //const file = toByteArray(preview);
            //const file = stringToFile(preview, "profileImage");
            //const file = new File(preview, "file");
            //const file = preview;

            console.log("preview: ", typeof(preview));

            const file = noviBase64ToFile(preview, "profileImage");
            console.log("file:", file.name, file.type, file.size);

            const formData = new FormData();
            formData.append("file", file);
            console.log("formData: file: ", formData.get("file"));

            fetch("/teacher/update/profileImage", {
                method: "POST",
                body: formData,
            }).then((res) => {
                if (res.status == 200 || res.status == 201){ //TODO: 200 ili 201?
                    navigate(PathConstants.PROFILE); //TODO: mozda tu treba nesto drugacije, polako
                }
                else
                    toast({
                        title: "Upload failed...",
                        description: "Please, try again.",
                        variant: "destructive",
                    });
            }).catch(() => {
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
                <a>Upload new profile picture</a>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload new profile picture</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-5">
                    <Avatar
                        width="100%"
                        height={400}
                        onCrop={onCrop}
                        onClose={onClose}
                        onBeforeFileLoad={onBeforeFileLoad}
                        exportAsSquare={true}
                        exportSize={256}
                        exportMimeType={"image/jpeg"}
                        backgroundColor={"none"} //TODO kako ovo povuć da je transparentno
                        label={"Click to load image"}
                        labelStyle={{color: "white", textDecoration: "underline", cursor: "pointer"}}
                        className="flex justify-center"
                    />
                    <button onClick={handleSubmit} className="flex justify-center">Upload</button>
                    {/*preview && (   //TODO ovo zakomentiraj, smeta samo
                        <div>
                            <h3>Preview:</h3>
                            <img src={preview} alt="Cropped preview" style={{maxWidth: "100%"}}/>
                        </div>
                    )*/}
                </div>


            </DialogContent>


        </Dialog>

    );
};

export default Uploader;