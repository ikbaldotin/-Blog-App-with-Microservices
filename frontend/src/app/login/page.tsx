"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppData, user_service } from "@/context/appContext";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";
const LoginPage = () => {
  const { isAuth, setIsAuth, loading, setLoading, setUser } = useAppData();
  if (isAuth) redirect("/");
  const responseGoogle = async (authResult: any) => {
    try {
      setLoading(true);
      const result: any = await axios.post(`${user_service}/api/v1/login`, {
        code: authResult["code"],
      });
      Cookies.set("token", result.data.token, {
        expires: 5,
        secure: true,
        path: "/",
      });
      toast.success(result.data.message);
      setIsAuth(true);
      setLoading(true);
      setUser(result.data.user);
    } catch (error) {
      console.log("error", error);
      toast.error("problem while login you");
      setLoading(false);
    }
  };
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full max-w-sm m-auto mt-[200px]">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-1.9xl">
                Login to The Reading Retreat
              </CardTitle>
              <CardDescription>your go to blog app</CardDescription>
              <CardAction></CardAction>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full" onClick={googleLogin}>
                Login with Google{" "}
                <img src={"/google.png"} className="w-6 h-6" alt="google img" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default LoginPage;
