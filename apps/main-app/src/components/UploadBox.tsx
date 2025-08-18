import { Image } from "@mantine/core";
import uploadIcon from "../assets/upload-icon.png";

export default function UploadBox({
  file,
  onFileSelect,
}: {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}) {
  console.log(file);

  return (
    <div className="mt-1 border flex flex-col items-center border-gray-200 rounded-md p-4 bg-white text-center text-sm text-gray-500">
      <Image
        src={uploadIcon}
        alt="QR Code"
        className="!w-15 !h-15 mb-2"
      />
      <input
        type="file"
        onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
        className="hidden"
        id="upload-box"
      />
      <label htmlFor="upload-box" className="cursor-pointer block">
        <span className="text-[#6941C6] font-medium">Click to upload</span> or
        drag and drop
      </label>
      <p className="text-xs mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</p>
    </div>
  );
}
