"use client";

import SiteContext from "./SiteContext";
import { useEffect, useState } from "react";


interface Props {
  children: React.ReactNode;
}

export const SiteProvider: React.FC<Props> = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  //     const setcouponType ={
  //         couponDesc:{},
  // isFeatured:boolean,
  // minSpend:number,
  // name:string,
  // price:string,
  // productCat:string,
  // deliveryDis:{},
  // setdeliveryDis:(e)=>{return e}

  //  }

 
  const [openBargerMenu, setOpenBargerMenu] = useState<boolean>(false);
  
 
 


  function bargerMenuToggle(e:boolean) {
     setOpenBargerMenu(e);
  }
 

  return (
    <SiteContext.Provider
      value={{
      
       
        openBargerMenu,
       
        bargerMenuToggle,
       
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
