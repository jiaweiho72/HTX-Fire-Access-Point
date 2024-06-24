
import dynamic from "next/dynamic";
import React from 'react';
// import Login from './pages/login_page/page'; // Adjust the path based on your actual folder structure

const DynamicLoginComponent = dynamic(() => import("./pages/login/page"), { ssr: false });

const Page = () => {
  return (
    <div>
      <DynamicLoginComponent />
      {/* Other content of your app page */}
    </div>
  );
};

export default Page;
