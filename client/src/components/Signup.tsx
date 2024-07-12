import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import axios from "axios";

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export default function Signup() {

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    axios.post('http://localhost:3000/api/signup', values)
      .then(response => {
        console.log('Signup successful', response.data);
      })
      .catch(error => {
        console.error('Signup failed', error.response.data);
      });
  }

  return (
    <main>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="enter your name" type="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            }}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="enter your email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            }}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="enter your password" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            }}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>

    </main>
  );
}