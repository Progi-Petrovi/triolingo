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

const TabsTriggerValues = {
  ACCOUNT: "account",
  LANGUAGES: "languages",
  ADDITIONAL: "additional",
};

const formSchema = z.object({
  fullName: z.string().min(2).max(250),
  email: z.string().email(),
  password: z.string().min(8).max(250),
  repeatPassword: z.string().min(8).max(250),
});

export default function StudentRegister() {
  const [tab, setTab] = useState(TabsTriggerValues.ACCOUNT);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs
          value={tab}
          onValueChange={setTab}
          className="flex flex-col justify-center items-center w-[50vw]"
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
            className="flex flex-col gap-2 w-full my-10"
          >
            <p className="font-extrabold text-3xl my-4">Basic information</p>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
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
                  <FormLabel>Email</FormLabel>
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
                    <FormLabel>Password</FormLabel>
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
                name="repeatPassword"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Repeat password</FormLabel>
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
            <div className="flex justify-end my-4">
              <Button
                type="button"
                onClick={() => {
                  setTab(TabsTriggerValues.LANGUAGES);
                  console.log(tab);
                }}
              >
                Next
              </Button>
            </div>
          </TabsContent>
          <TabsContent value={TabsTriggerValues.LANGUAGES} className="w-full">
            <div className="flex justify-between w-full">
              <Button
                type="button"
                onClick={() => setTab(TabsTriggerValues.ACCOUNT)}
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={() => setTab(TabsTriggerValues.ADDITIONAL)}
              >
                Next
              </Button>
            </div>
          </TabsContent>
          <TabsContent value={TabsTriggerValues.ADDITIONAL} className="w-full">
            <div className="flex justify-between w-full">
              <Button
                type="button"
                onClick={() => setTab(TabsTriggerValues.LANGUAGES)}
              >
                Previous
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Register
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
