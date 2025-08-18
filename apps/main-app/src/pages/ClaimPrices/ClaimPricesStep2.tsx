import { Button, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { IconCircleCheck } from "@tabler/icons-react";
import UploadBox from "../../components/UploadBox";

type Props = {
  onNext: () => void;
};

export default function ClaimPricesStep2({ onNext }: Props) {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);

  return (
    <div className="relative bg-white py-8">
      <div className="bg-red-50 border-dashed border-2 border-red-300 rounded-md p-10 md:px-25 relative">
        {/* Navigation Arrow Button */}
        <Button
          variant="filled"
          color="#FFE3E4"
          size="lg"
          radius="xl"
          onClick={onNext}
          className="!absolute !right-5 !top-5 !text-xl !font-bold !w-10 !h-10 !p-0 !text-primary-red"
        >
          »
        </Button>

        <div className="space-y-5">
          {/* Legal Full Name */}
          <TextInput
            label={
              <span className="text-[#030303] font-medium">
                Legal Full Name{" "}
                <span className="text-xs text-[#575757]">
                  (for property title)
                </span>
              </span>
            }
            placeholder="Adekunle, Ibrahim Olamide"
            value={fullName}
            onChange={(e) => setFullName(e.currentTarget.value)}
            required
          />

          {/* Passport Photo */}
          <div className="mt-1">
            <label className="block text-sm font-medium text-[#030303] mb-1">
              Passport photo
            </label>
            <UploadBox file={passportPhoto} onFileSelect={setPassportPhoto} />
          </div>

          {/* Address */}
          <TextInput
            label={
              <span className="text-[#030303] font-medium">
                Address
              </span>
            }
            placeholder="Adekunle, Ibrahim Olamide"
            value={address}
            onChange={(e) => setAddress(e.currentTarget.value)}
            required
          />

          {/* Email Address */}
          <TextInput
            label={
              <span className="text-[#030303] font-medium">
                Email address
              </span>
            }
            placeholder="Adekunle, Ibrahim Olamide"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />

          {/* Confirmation Text */}
          <div className="flex items-center gap-2 pt-2">
            <IconCircleCheck size={18} className="!text-primary-red" />
            <Text className="!text-primary-red !font-medium">
              I confirm that the information I provided is true and accurate
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
