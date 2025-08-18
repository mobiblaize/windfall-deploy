import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Card,
  Flex,
} from "@mantine/core";
import { IconLogin } from "@tabler/icons-react";
import CustomButton from "../../components/Buttons/CustomButton";
import loginMain from "../../assets/admin-login-main.png";
import loginBL from "../../assets/admin-login-b-l.png";
import loginBR from "../../assets/admin-login-b-r.png";
import leftImg from "../../assets/legit.png";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}

      <Card className="!bg-white !rounded-4xl !my-10 !mx-10 !border !relative !border-[#C0C0C5] !flex-1 !flex !flex-col !justify-center !px-8 md:!px-16 lg:!px-24">
        <div className="mt-20 mb-40">
          {/* Login icon */}
          <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full mb-4">
            <IconLogin className="text-red-500" size={20} />
          </div>

          {/* Welcome Text */}
          <h2 className="text-[#818181] text-lg mb-0">Welcome Back</h2>
          <h1 className="text-red-500 font-bold text-3xl mb-2">
            Dairo Issac --- Admin
          </h1>
          <p className="text-[#818181] mb-3">Log into your account with ease</p>

          {/* Form */}
          <form className="space-y-4">
            <TextInput
              required
              className="!text-primary-text"
              label="Email Address"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              className="!text-primary-text"
              required
              label="Enter Password"
              placeholder="Confirm your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Flex justify="space-between" align="center">
              <div className="flex justify-between items-center">
                <a className="text-red-500 cursor-pointer text-sm hover:underline">
                  Forget Password?
                </a>
              </div>

              <CustomButton
                border={false}
                size="md"
                className="!bg-primary-red hover:!bg-primary-red !text-white"
              >
                Login
              </CustomButton>
            </Flex>
          </form>

          {/* Bottom building illustration */}
          <div className="mt-auto absolute bottom-0 left-4">
            <img src={loginBL} alt="building" className="w-full opacity-50" />
          </div>
        </div>
      </Card>

      {/* Divider */}
      <div className="hidden md:block w-[4px] bg-[length:4px_4px] bg-gradient-to-b from-transparent via-red-500 to-transparent"></div>

      {/* Right Section */}
      <div className="flex-1 bg-light-red p-8 flex flex-col justify-center items-center relative">
        <div className="max-w-md">
          <div className="relative mb-12">
            <img src={loginMain} alt="bedroom" className="rounded-xl" />
            <img src={leftImg} alt="bedroom" className="rounded-xl absolute right-0 -bottom-16" />
          </div>

          <Flex align="center" gap={20} className="!mt-4 !mb-20">
            <h2 className="text-red-500 font-bold text-5xl sm:text-4xl md:text-4xl lg:text-5xl grow text-nowrap">
              Live In <br /> Rent Out <br /> Sell Up
            </h2>

            <p className="text-gray-600">
              Whether you choose to live in it, rent it out for income, or sell
              it for cash — Windfall gives you real options with every prize.
            </p>
          </Flex>
        </div>

        {/* Bottom right house icon */}
        <img
          src={loginBR}
          alt="house"
          className="absolute bottom-0 right-0 w-40"
        />
      </div>
    </div>
  );
}
