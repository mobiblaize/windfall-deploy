import { Card } from "@repo/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Hello World Next.js is awesome</h1>
      <Card title="Next.js" href="https://nextjs.org">
        Next.js is a library for web and native user interfaces.
      </Card>
    </div>
  );
}
