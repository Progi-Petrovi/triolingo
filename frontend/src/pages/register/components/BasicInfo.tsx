import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type BasicInfoType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
};

export default function BasicInfo({ form }: BasicInfoType) {
  return (
    <>
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
    </>
  );
}
