import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PathConstants from "@/routes/pathConstants";
import { FormEvent } from "react";

export default function Login() {
	async function submitLogin(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const body = new FormData(event.currentTarget);
		console.log(PathConstants.API_URL);
		fetch(new URL("login", PathConstants.API_URL), {
			method: "POST",
			body,
		}).then((res) => {
			if (res.redirected) window.location.href = res.url; //Instead of forcefully redirecting use react router somehow?
		});
	}

	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Login</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form className="grid gap-4" onSubmit={submitLogin}>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="m@example.com"
							required
						/>
					</div>
					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">Password</Label>
							<Link
								to={"#"}
								className="ml-auto inline-block text-sm underline"
							>
								Forgot your password?
							</Link>
						</div>
						<Input
							id="password"
							name="password"
							type="password"
							required
						/>
					</div>
					<div className="grid gap-2">
						<div className="flex items-end">
							<Input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								className="w-fit h-fit mr-1"
							/>
							<Label htmlFor="remember-me">
								Remember me
							</Label>
						</div>
					</div>
					<Button type="submit" className="w-full">
						Login
					</Button>
				</form>
				<div className="flex flex-col justify-center items-center pt-2">
					<Button variant="outline" className="w-full">
						<Link
							to="http://localhost:8080/oauth2/authorization/github"
							className="text-white"
						>
							Log in with Github
						</Link>
					</Button>
				</div>
				<div className="flex flex-col justify-center items-center pt-2">
					<p>Don&apos;t have an account?</p>
					<Link
						to={PathConstants.STUDENT_REGISTER}
						className="underline"
					>
						Register
					</Link>
					<Link
						to={PathConstants.TEACHER_REGISTER}
						className="underline"
					>
						Become a teacher
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
