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

    const handleSubmit = () =>{
        if (preview) {
            const file = base64ToFile(preview, "pfp.png");
            //const file = toByteArray(preview);
            const formData = new FormData();
            formData.append("file", file);

            fetch("/teacher/update/profileImage", {
                method: "POST",
                body: formData,
            }).then((res) => {
                if (res.status == 201){
                    navigate(PathConstants.PROFILE); //mozda tu treba nesto drugacije
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

                <div>
                    <Avatar
                        width={400}
                        height={400}
                        onCrop={onCrop}
                        onClose={onClose}
                        onBeforeFileLoad={onBeforeFileLoad}
                        //exportAsSquare={true}
                        exportSize={256}
                        exportMimeType={"image/jpeg"}
                        backgroundColor={"red"} //TODO kako ovo povuć da je transparentno
                    />
                    <button onClick={handleSubmit}>Upload</button>
                    {preview && (   //TODO ovo zakomentiraj, smeta samo
                        <div>
                            <h3>Preview:</h3>
                            <img src={preview} alt="Cropped preview" style={{maxWidth: "100%"}}/>
                        </div>
                    )}
                </div>


            </DialogContent>


        </Dialog>

    );
};

export default Uploader;