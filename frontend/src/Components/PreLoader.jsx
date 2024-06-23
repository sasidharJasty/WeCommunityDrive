import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {BarLoader} from "react-spinners"
import Logo from "../assets/logo.png";

const PreLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="w-screen h-screen bg-black fixed top-0 z-[999]"
          animate={{ opacity: 1, y: "0%" }}
          exit={{ opacity: 0.85, y: "100%" }}
          transition={{ duration: 0.75 }}
        >
          <div className="w-fit mx-auto mt-[35vh] relative">
            <img
              src={Logo}
              className="w-[8vw] mx-auto mt-[4.75vh] "
              alt="Logo"
            />
            <BarLoader
            className="mx-auto mt-[2vh] "
  color="#36d7b7"
  loading={loading}
  width={"100%"}

  speedMultiplier={0.5}
/>
            <div className="flex text-white mt-[1vh] font-normal">
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 75 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate={"visible"}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                Volunteer,
              </motion.span>
              <motion.span
                className="ml-[0.5vw]"
                variants={{
                  hidden: { opacity: 0, y: 75 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate={"visible"}
                transition={{ duration: 0.5, delay: 0.75 }}
              >
                {" "}
                Encoruage,
              </motion.span>
              <motion.span
                className="ml-[0.5vw]"
                variants={{
                  hidden: { opacity: 0, y: 75 },
                  visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate={"visible"}
                transition={{ duration: 0.5, delay: 1.25 }}
              >
                {" "}
                Experience
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreLoader;
