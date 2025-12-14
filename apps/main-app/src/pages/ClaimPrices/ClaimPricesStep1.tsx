import { Button, TextInput } from "@mantine/core";
import { useState } from "react";
import UploadBox from "../../components/UploadBox";

type Props = {
  onNext: () => void;
};

export default function ClaimPricesStep1({ onNext }: Props) {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);

  return (
    <div className="relative bg-white py-8">
      {/* Form Card */}
      <div className="bg-red-50 border-dashed border-2 border-red-300 rounded-md p-10 md:px-25 relative">
        {/* Arrow Icon */}
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

        <div className="space-y-4">
          {/* Full Name */}
          <TextInput
            label={
              <span className="text-[#030303] font-medium">Your Full Name</span>
            }
            placeholder="Adekunle, Ibrahim Olamide"
            value={fullName}
            onChange={(e) => setFullName(e.currentTarget.value)}
            required
          />

          {/* DOB */}
          <TextInput
            label={
              <span className="text-[#030303] font-medium">Date of birth</span>
            }
            placeholder="e.g. 01/01/1990"
            value={dob}
            onChange={(e) => setDob(e.currentTarget.value)}
            required
          />

          {/* Phone */}
          <TextInput
            label={
              <span className="text-[#030303] font-medium">Phone number</span>
            }
            placeholder="+234 903 953 7488"
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
            required
          />

          <div className="text-[#030303] mt-5">
            <p className="font-medium text-[#575757]">Uploads</p>

            {/* Court Issued ID Upload */}
            <label className="block text-sm mt-2 mb-1">
              Court issued id{" "}
              <span className="text-xs text-[#575757]">
                (NIN or drivers license)
              </span>{" "}
              <span className="text-red-500">*</span>
            </label>
            <UploadBox file={idFile} onFileSelect={setIdFile} />

            {/* Proof of Address Upload */}
            <label className="block text-sm mt-4 mb-1">
              Proof of address <span className="text-red-500">*</span>
            </label>
            <UploadBox file={proofFile} onFileSelect={setProofFile} />
          </div>
        </div>
      </div>
    </div>
  );
}
