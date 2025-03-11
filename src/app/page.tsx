import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full h-screen bg p-4 md:p-8 relative text-white overflow-hidden">
      <Navbar />
      <section className="flex flex-col md:flex-row w-full h-full mt-16">
        <div className="w-full lg:w-1/2 flex justify-center items-center py-8 md:py-0">
          <article className="w-full max-w-lg text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl mb-4">
            🚀 Get Ready for the New Era of AI-Powered Code Reviews!
            </h1>
            <p className="text-sm sm:text-base">
              Welcome to AstroCode, where AI meets innovation to revolutionize
              the way you write and review code. Enhance quality, fix bugs, and
              optimize performance—faster than ever before.
            </p>
            <p className="text-sm mt-4">
              🔍 AI-Powered Insights | ⚡ Instant Code Reviews | 🔒 Secure &
              Smart
            </p>
            <Link
              href={"/code-review"}
              className="inline-block px-4 sm:px-6 py-2 mt-4 text-white bg-[#6E27E0] rounded-md hover:bg-[#6e27e0a5] capitalize"
            >
              get started
            </Link>
          </article>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            className="w-full max-w-lg md:max-w-full object-cover"
            src="/images/robo.png"
            alt="robo"
          />
        </div>
      </section>
    </main>
  );
}
