import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LanguageDialog from "./LanguageDialog";
import { LanguageLevel } from "@/types/languageLevel";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StudentRegistration } from "@/types/studentRegistration";
import { useToast } from "@/hooks/use-toast";

const TabsTriggerValues = {
  ACCOUNT: "account",
  LANGUAGES: "languages",
  ADDITIONAL: "additional",
};

const formSchema = z
  .object({
    fullName: z.string().min(2).max(250),
    email: z.string().email(),
    password: z.string().min(8).max(250),
    confirmPassword: z.string().min(8).max(250),
    teachingStyle: z.enum(["Individual", "Group", "Flexible"]),
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
      teachingStyle: "Flexible",
    },
  });

  function addLanguage(language: string, level?: string) {
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
    learningLanguage: LanguageLevel,
    level: string
  ) {
    const newLanguages = learningLanguages.map((lang) =>
      lang === learningLanguage ? { language: lang.language, level } : lang
    );

    setLearningLanguages(newLanguages);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (learningLanguages.length === 0) {
      toast({
        title: "You need to pick atleast 1 language.",
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
                <Select
                  onValueChange={(val) => changeKnowledgeLevel(lang, val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={lang.level} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="h-[50vh] w-[50vw] relative"
      >
        <Tabs
          defaultValue={TabsTriggerValues.ACCOUNT}
          className="flex flex-col justify-center items-center"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value={TabsTriggerValues.ACCOUNT}>Account</TabsTrigger>
            <TabsTrigger value={TabsTriggerValues.LANGUAGES}>
              Languages
            </TabsTrigger>
            <TabsTrigger value={TabsTriggerValues.ADDITIONAL}>
              Additional
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value={TabsTriggerValues.ACCOUNT}
            className="flex flex-col gap-2 w-full"
          >
            <p className="font-extrabold text-3xl my-4">Basic information</p>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Hrvoje Horvat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Hrvoje.Horvat@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>* Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="aVeryStrongPassword123!!"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>* Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="aVeryStrongPassword123!!"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent
            value={TabsTriggerValues.LANGUAGES}
            className="flex flex-col gap-2 w-full"
          >
            <p className="font-extrabold text-2xl my-4">
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
            value={TabsTriggerValues.ADDITIONAL}
            className="flex flex-col gap-2 w-full"
          >
            <p className="font-extrabold text-2xl my-4">
              We'd love to hear about your preferred teaching style and your
              goals!
            </p>
            <FormField
              control={form.control}
              name="teachingStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Preffered Teaching Style</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Group">Group</SelectItem>
                        <SelectItem value="Flexible">Flexible</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
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
  );
}
