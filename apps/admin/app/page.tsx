import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <p className="text-sm text-zinc-500">KYO8 Admin</p>
      <Link href="/profile" className="text-sm underline underline-offset-4">
        Profile
      </Link>
    </div>
  );
}
