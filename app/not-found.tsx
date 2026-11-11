import Link from "next/link";
import { StatusScreen } from "@/components/ui/status-screen";

export default function NotFound() {
  return (
    <StatusScreen
      title={<span className="text-6xl">404</span>}
      message="Page not found. The page you're looking for doesn't exist."
      action={
        <Link href="/" className="btn-solid px-4 py-2">
          Go home
        </Link>
      }
    />
  );
}
