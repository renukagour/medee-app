import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-full mt-16">
      <SignIn  afterSignOutUrl={"/"}/>
    </div>
  );
}
