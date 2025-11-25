import { Avatar, type AvatarProps } from "@mantine/core";

interface UserAvatarProps extends Omit<AvatarProps, "children"> {
  image?: string | null;
  subString?: string | null;
}

export default function UserAvatar({
  image,
  subString,
  ...props
}: UserAvatarProps) {
  // Get initials from subString (first 2 letters)
  const getInitials = (str: string): string => {
    if (!str) return "";
    const words = str.trim().split(/\s+/);
    if (words.length >= 2) {
      // First letter of first word + first letter of second word
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    // If only one word, take first 2 letters
    return str.substring(0, 2).toUpperCase();
  };

  // If image exists, use it
  if (image) {
    return <Avatar src={image} alt="Profile" {...props} />;
  }

  // If no image but subString exists, show initials
  if (subString) {
    const initials = getInitials(subString);
    return (
      <Avatar alt="Profile" {...props}>
        <span className="!text-primary-red pt-1">{initials}</span>
      </Avatar>
    );
  }

  // Fallback: no image and no subString
  return <Avatar alt="Profile" {...props} />;
}

