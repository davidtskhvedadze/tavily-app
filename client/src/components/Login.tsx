import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import axios from "axios";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export default function Home() {

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  const navigate = useNavigate();

  function handleSubmit(values: z.infer<typeof formSchema>) {
    axios.post('http://localhost:3000/api/login', values)
      .then(response => {
        console.log('Login successful', response.data);
        navigate('/users');
      })
      .catch(error => {
        console.error('Login failed', error.response.data);
      });
  }

  return (
    <main>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-8">
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