import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAuthToken, verifyJWT } from "@/lib/auth";
import User from "@/models/user.models";
import connectDB from "@/lib/db";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  const token = await getAuthToken();
  if (token) {
    const payload = await verifyJWT(token);
    if (payload) {
      await connectDB();
      user = await User.findById((payload as any).id);
    }
  }

  return (
    <>
      <Navbar user={JSON.parse(JSON.stringify(user))} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}

