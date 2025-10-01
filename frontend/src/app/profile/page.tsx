"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppData, user_service } from "@/context/appContext";
import React, { useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/loading";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { redirect, useRouter } from "next/navigation";
import { Facebook, Instagram, Linkedin } from "lucide-react";
const ProfilePage = () => {
  const { user, setUser, LogoutUser } = useAppData();
  if (!user) redirect("/login");
  const LogoutHandler = () => {
    LogoutUser();
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    instagram: user?.instagram || "",
    facebook: user?.facebook || "",
    linkdin: user?.linkdin || "",
    bio: user?.bio || "",
  });
  const router = useRouter();
  const clickHandler = () => {
    inputRef.current?.click();
  };
  const changeHandler = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const { data } = await axios.post(
          `${user_service}/api/v1/user/updatepic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Type assertion for data to access message property
        toast.success((data as { message: string }).message);
        setLoading(false);
        Cookies.set("token", (data as { token: string }).token, {
          expires: 5,
          secure: true,
          path: "/",
        });
        setUser((data as { user: any }).user);
        Cookies.set("token", (data as { token: string }).token, {
          expires: 5,
          secure: true,
          path: "/",
        });
      } catch (error) {
        toast.error("Image Update filed");
        setLoading(false);
      }
    }
  };
  const handlerFormSubmit = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${user_service}/api/v1/user/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success((data as { message: string }).message);
      setOpen(false);
    } catch (error) {
      toast.error("Update filed");
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {loading ? (
        <Loading />
      ) : (
        <Card className="w-full max-w-xl shadow-lg border rounded-2xl p-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Profile</CardTitle>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar
                className="w-28 h-28 border-4 border-gray-200 shadow-md cursor-pointer"
                onClick={clickHandler}
              >
                <AvatarImage src={user?.image} alt="profile pic" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={inputRef}
                  onChange={changeHandler}
                />
              </Avatar>
              <div className="w-full space-y-2 text-center">
                <label className="font-medium">Name</label>
                <p>{user?.name}</p>
              </div>
              {user?.bio && (
                <div className="w-full space-y-2 text-center">
                  <label className="font-medium">Bio</label>
                  <p>{user.bio}</p>
                </div>
              )}
              <div className="flex gap-4 mt-3">
                {user?.instagram && (
                  <a
                    href={user.instagram}
                    target="_blank"
                    rel="noopner noreferrer"
                  >
                    <Instagram className="text-pink-500 text-2xl" />
                  </a>
                )}
                {user?.facebook && (
                  <a
                    href={user.facebook}
                    target="_blank"
                    rel="noopner noreferrer"
                  >
                    <Facebook className="text-blue-500 text-2xl" />
                  </a>
                )}
                {user?.linkdin && (
                  <a
                    href={user.linkdin}
                    target="_blank"
                    rel="noopner noreferrer"
                  >
                    <Linkedin className="text-blue-700 text-2xl" />
                  </a>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-6 w-full justify-center">
                <Button onClick={LogoutHandler}>Logout</Button>
                <Button onClick={() => router.push("/blog/new")}>
                  Add Blog
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant={"outline"}>Edit</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Edit profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Bio</Label>
                        <Input
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData({ ...formData, bio: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Instagram</Label>
                        <Input
                          value={formData.instagram}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              instagram: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Facebook</Label>
                        <Input
                          value={formData.facebook}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              facebook: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Linkdin</Label>
                        <Input
                          value={formData.linkdin}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              linkdin: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button
                        onClick={handlerFormSubmit}
                        className="w-full mt-4"
                      >
                        Save Change
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
