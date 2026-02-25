import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function TiltedCard({
  imageSrc,
  alt = "Image",
  caption = "Card",
  rotate = 12,
  scaleOnHover = 1.15,
}) {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(0, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 20 });

  const scale = useSpring(1, { stiffness: 200, damping: 10 });
  const opacity = useSpring(0);

  function handleMove(e) {
    const rect = ref.current.getBoundingClientRect();

    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    rotateX.set((-offsetY / (rect.height / 2)) * rotate);
    rotateY.set((offsetX / (rect.width / 2)) * rotate);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }

  function handleEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleLeave() {
    scale.set(1);
    opacity.set(0);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <figure
      ref={ref}
      className="relative w-[300px] h-[300px] mx-auto [perspective:800px]"
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Card */}
      <motion.div
        className="w-full h-full rounded-xl overflow-hidden shadow-xl bg-gray-200 [transform-style:preserve-3d]"
        style={{ rotateX, rotateY, scale }}
      >
      <img
  src="/asset/images/Gallery/Pressure Cooker.png"
  alt="Pressure Cooker"
  className="bg-no-repeat h-full w-full rounded-2xl object-cover bg-white"
/>

      </motion.div>

      {/* Tooltip */}
      {/* <motion.figcaption
        className="absolute top-0 left-0 px-2 py-1 text-xs bg-white rounded shadow pointer-events-none hidden sm:block"
        style={{ x, y, opacity }}
      >
        
      </motion.figcaption> */}
    </figure>
  );
}
