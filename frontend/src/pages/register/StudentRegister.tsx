import { useState } from "react";
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
import { LanguageLevel, KnowledgeLevel } from "@/types/language-level";
import { Textarea } from "@/components/ui/textarea";
import { StudentRegistration } from "@/pages/register/types/registration-types";
import { useToast } from "@/hooks/use-toast";
import { TabsValues } from "./types/tabs-values";
import { PreferredTeachingStyle } from "../../types/teaching-style";
import BasicInfo from "./components/BasicInfo";
import PreferredTeachingStyleFormField from "./components/PreferredTeachingStyleFormField";
import KnowledgeSelect from "./components/KnowledgeSelect";

const formSchema = z
  .object({
    fullName: z.string().min(2).max(250),
    email: z.string().email(),
    password: z.string().min(8).max(250),
    confirmPassword: z.string().min(8).max(250),
    preferredTeachingStyle: z.nativeEnum(PreferredTeachingStyle),
    goals: z.string().min(0).max(250, {
      message: "Can't be over 250 characters, keep it nice and short :)",
    }),
    isVerified: z.boolean().optional(),
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

export default function StudentRegister() {
  //TODO: get languages from backend
  const allLanguages = ["English", "Spanish", "French", "Croatian"];
  const { toast } = useToast();
  const [learningLanguages, setLearningLanguages] = useState<LanguageLevel[]>(
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      goals: "",
      preferredTeachingStyle: PreferredTeachingStyle.FLEXIBLE,
    },
  });

  function addLanguage(language: string, level?: KnowledgeLevel) {
    if (language && level)
      setLearningLanguages([...learningLanguages, { language, level }]);
  }

  function removeLanguage(learningLanguage: LanguageLevel) {
    const newLanguages = learningLanguages.filter(
      (lang) => lang != learningLanguage
    );
    setLearningLanguages(newLanguages);
  }

  function changeKnowledgeLevel(
    language: LanguageLevel,
    level: KnowledgeLevel
  ) {
    const newLanguages = learningLanguages.map((lang) =>
      lang === language ? { language: lang.language, level } : lang
    );

    setLearningLanguages(newLanguages);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (learningLanguages.length === 0) {
      toast({
        title: "You need to pick at least 1 language.",
        description: "That's why we are here :)",
        variant: "destructive",
      });

      return;
    }

    const totalValues: StudentRegistration = {
      ...values,
      languages: learningLanguages,
    };

    console.log(totalValues);
  }

  function onError() {
    toast({
      title: "Please fill out all of the mandatory fields",
      description: "Fields marked with *",
      variant: "destructive",
    });
  }

  function showPickedLanguages() {
    if (learningLanguages.length == 0) return null;
    return (
      <div className="p-8 m-1 border overflow-scroll h-52">
        {learningLanguages.map((lang) => {
          return (
            <div
              key={lang.language}
              className="flex justify-between items-center p-2"
            >
              <p>{lang.language}</p>
              <div>
                <KnowledgeSelect
                  onValueChange={(val: KnowledgeLevel) =>
                    changeKnowledgeLevel(lang, val)
                  }
                  placeholder={lang.level}
                />
              </div>
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
      <p className="mx-auto text-3xl font-extrabold">Register</p>
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
                Languages you would like to learn:
              </p>
              <LanguageDialog
                addLanguage={addLanguage}
                isStudent={true}
                allLanguages={allLanguages}
                pickedLanguages={learningLanguages.map(
                  ({ language }) => language
                )}
              />
              {showPickedLanguages()}
            </TabsContent>

            <TabsContent
              value={TabsValues.ADDITIONAL}
              className="flex flex-col gap-2 w-full"
            >
              <p className="text-2xl my-2">
                We'd love to hear about your preferred teaching style and your
                goals!
              </p>
              <PreferredTeachingStyleFormField form={form} />
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="I want to speak proficient Spanish!"
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
