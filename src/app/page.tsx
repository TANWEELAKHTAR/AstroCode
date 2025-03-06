import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container h-screen bg p-4 md:p-8 relative text-white overflow-hidden">
  <Navbar/>
  <section className="flex flex-col md:flex-row w-full h-full mt-16">
    <div className="w-full md:w-1/2 flex justify-center items-center py-8 md:py-0">
      <article className="w-full md:w-3/4">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl mb-4">Get ready for the new era of AI</h1>
        <p className="text-sm sm:text-base">Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse excepturi eaque harum eveniet iste. A itaque, ea officia quidem officiis hic delectus odio, quibusdam facere rem veniam, saepe assumenda aliquam.</p>
        <Link href={"/"} className="inline-block px-4 sm:px-6 py-2 mt-4 text-white bg-[#6E27E0] rounded-md hover:bg-[#6e27e0a5] capitalize">get started</Link>
      </article>
    </div>
    <div className="w-full md:w-1/2 flex items-center justify-center">
      <img className="w-full max-w-lg md:max-w-full object-cover" src="/images/robo.png" alt="robo" />
    </div>
  </section>
</main>
    
  )
}