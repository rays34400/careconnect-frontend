import Navbar from "@/components/components Principal/layout/Navbar";
import SideMenu from "@/components/components Principal/layout/SideMenu";
import HeroSection from "@/components/components Principal/common/HeroSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex flex-col md:flex-row">
        <SideMenu />

        <main className="flex-1 px-4 md:px-0">
          <HeroSection />
        </main>
      </div>
    </div>
  );
}