"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export const AnimatedTooltip = ({
  items,
  setVoice,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
  }[];
  setVoice: React.Dispatch<React.SetStateAction<Voice>>;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const xRef = useRef<number>(0);

  const springConfig = { stiffness: 100, damping: 5 };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    xRef.current = event.nativeEvent.offsetX - halfWidth;
  };

  const handleItemClick = (item: any) => {
    if (clickedIndex === item.id) {
      setClickedIndex(null);
    } else {
      console.log("clicked");
      setVoice(item);
      setClickedIndex(item.id);
    }
  };

  return (
    <>
      {items.map((item, idx) => (
        <div
          className="relative group"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => handleItemClick(item)}
        >
          <AnimatePresence>
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: xRef.current,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2"
              >
                <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px " />
                <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px " />
                <div className="font-bold text-white relative z-30 text-base">
                  {item.name}
                </div>
                <div className="text-white text-xs">{item.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <Image
            onMouseMove={handleMouseMove}
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            className={`object-cover  !m-0 !p-0 object-top rounded-full h-14 w-14 ${
              clickedIndex === item.id || (item.id === 1 && !clickedIndex)
                ? "border-2 border-pink-500"
                : "border-2 border-white"
            } relative transition duration-500`}
          />
        </div>
      ))}
    </>
  );
};
