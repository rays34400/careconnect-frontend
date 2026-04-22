import Navbar from "@/components/components Principal/layout/Navbar";
import SideMenu from "@/components/components Principal/layout/SideMenu";
import HeroSection from "@/components/components Principal/common/HeroSection";
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <SideMenu />

        <main className="flex-1">
          <HeroSection />
        </main>
        

        
      </div>
    </div>
  );
}