export default function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return email; // fallback if invalid
  const visible = local.slice(0, 2); // show first 2 letters
  const hidden = "*".repeat(local.length - 2);
  return `${visible}${hidden}@${domain}`;
}