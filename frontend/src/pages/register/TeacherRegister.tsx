import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    Form,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import LanguageDialog from "./components/LanguageDialog";
import { useToast } from "@/hooks/use-toast";
import { TabsValues } from "./types/tabs-values";
import { TeachingStyle } from "../../types/teaching-style";
import BasicInfo from "./components/BasicInfo";
import TeachingStyleFormField from "../common/TeachingStyleFormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TeacherRegistration } from "./types/registration-types";
import { useFetch } from "@/hooks/use-fetch";
import useUserContext from "@/context/use-user-context";
import { useNavigate } from "react-router-dom";
import PathConstants from "@/routes/pathConstants";

const formSchema = z
    .object({
        fullName: z.string().min(2).max(250),
        email: z.string().email(),
        password: z.string().min(8).max(250),
        confirmPassword: z.string().min(8).max(250),
        teachingStyle: z.nativeEnum(TeachingStyle),
        yearsOfExperience: z.coerce.number().max(100),
        hourlyRate: z.coerce.number().min(0).max(100000),
        phoneNumber: z.string().min(0),
        qualifications: z.string().max(500),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ["confirmPassword"],
            });
        }
    });

export default function TeacherRegister() {
    const { toast } = useToast();
    const fetch = useFetch();
    const { fetchUser } = useUserContext();
    const navigate = useNavigate();

    const [teachingLanguages, setTeachingLanguages] = useState<string[]>([]);
    const [allLanguages, setAllLanguages] = useState<string[]>([]);

    useEffect(() => {
        fetch("language").then((res) => {
            setAllLanguages(res.body);
        });
    }, []);

    async function submitRegister(registrationData: TeacherRegistration) {
        fetch("teacher/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registrationData),
        }).then((res) => {
            if (res.status == 201) {
                fetchUser();
                navigate(PathConstants.VERIFY_REQUEST);
            } else
                toast({
                    title: "Registration failed.",
                    description: `${res.body}`,
                    variant: "destructive",
                });
        });
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            yearsOfExperience: 0,
            hourlyRate: 0,
            phoneNumber: "",
            qualifications: "",
            teachingStyle: TeachingStyle.FLEXIBLE,
        },
    });

    function addLanguage(language: string) {
        setTeachingLanguages([...teachingLanguages, language]);
    }

    function removeLanguage(language: string) {
        const newLanguages = teachingLanguages.filter(
            (lang) => lang != language
        );
        setTeachingLanguages(newLanguages);
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (teachingLanguages.length === 0) {
            toast({
                title: "You need to pick at least 1 language.",
                description: "You want to teach, right?",
                variant: "destructive",
            });

            return;
        }

        const totalValues: TeacherRegistration = {
            ...values,
            languages: teachingLanguages,
        };

        submitRegister(totalValues);
    }

    function onError() {
        toast({
            title: "Please fill out all of the mandatory fields",
            description: "Fields marked with *",
            variant: "destructive",
        });
    }

    function showPickedLanguages() {
        if (teachingLanguages.length === 0) return null;
        return (
            <div className="p-8 m-1 border overflow-scroll h-52">
                {teachingLanguages.map((lang) => {
                    return (
                        <div
                            key={lang}
                            className="flex justify-between items-center p-2"
                        >
                            <p>{lang}</p>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => removeLanguage(lang)}
                            >
                                Delete
                            </Button>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <p className="mx-auto text-3xl font-extrabold">Become a teacher</p>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit, onError)}
                    className="h-[75vh] p-8 md:h-[70vh] md:w-[50vw]"
                >
                    <Tabs
                        defaultValue={TabsValues.ACCOUNT}
                        className="flex flex-col justify-center items-center"
                    >
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value={TabsValues.ACCOUNT}>
                                {TabsValues.ACCOUNT}
                            </TabsTrigger>
                            <TabsTrigger value={TabsValues.LANGUAGES}>
                                {TabsValues.LANGUAGES}
                            </TabsTrigger>
                            <TabsTrigger value={TabsValues.ADDITIONAL}>
                                {TabsValues.ADDITIONAL}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value={TabsValues.ACCOUNT}
                            className="flex flex-col gap-2 w-full"
                        >
                            <BasicInfo form={form} />
                        </TabsContent>

                        <TabsContent
                            value={TabsValues.LANGUAGES}
                            className="flex flex-col gap-2 w-full"
                        >
                            <p className="text-2xl my-2">
                                Languages you would like to teach:
                            </p>
                            <LanguageDialog
                                addLanguage={addLanguage}
                                isStudent={false}
                                allLanguages={allLanguages}
                                pickedLanguages={teachingLanguages}
                            />
                            {showPickedLanguages()}
                        </TabsContent>

                        <TabsContent
                            value={TabsValues.ADDITIONAL}
                            className="flex flex-col gap-2 w-full"
                        >
                            <p className="text-2xl my-2">
                                Tell us more about your teaching history!
                            </p>
                            <TeachingStyleFormField form={form} />
                            <FormField
                                control={form.control}
                                name="yearsOfExperience"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Years of teaching experience
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hourlyRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Hourly rate (Euro €)
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone number</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="qualifications"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Qualifications</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Universities, past work, ceritificates..."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end">
                                <Button type="submit">Register</Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </form>
            </Form>
        </div>
    );
}
