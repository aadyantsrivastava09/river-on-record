import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import RiverStrip from "@/components/RiverStrip";
import Scoreboard from "@/components/Scoreboard";
import DrainMap from "@/components/DrainMap";
import DataCharts from "@/components/DataCharts";
import Forecast from "@/components/Forecast";
import People from "@/components/People";
import Verify from "@/components/Verify";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <RiverStrip />
        <Scoreboard />
        <DrainMap />
        <People />
        <Forecast />
        <Verify />
        <DataCharts />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
