import dynamic from "next/dynamic";
import React from "react";
import '../../globals.css';
import AppBar from '../../components/AppBar'; 

const DynamicMapComponent = dynamic(() => import("../../components/Map"), { ssr: false });

const Page = () => {
  return (
    <div>
      <AppBar />
      <DynamicMapComponent />
    </div>
  );
};

export default Page;
