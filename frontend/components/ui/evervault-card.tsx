"use client";
import { useMotionValue, useMotionTemplate, motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function EvervaultBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);
  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    setRandomString(generateRandomString(2000));
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
    setRandomString(generateRandomString(2000));
  }

  return (
    <div
      onMouseMove={onMouseMove}
      className={cn(
        "group/card relative overflow-hidden flex items-center justify-center w-full",
        className
      )}
    >
      <CardPattern mouseX={mouseX} mouseY={mouseY} randomString={randomString} />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}

export const EvervaultCard = ({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) => {
  return (
    <EvervaultBackground className={cn("p-0.5 bg-transparent aspect-square rounded-3xl", className)}>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="relative h-44 w-44 rounded-full flex items-center justify-center text-white font-bold text-4xl">
          <div className="absolute w-full h-full bg-white/[0.8] dark:bg-black/[0.8] blur-sm rounded-full" />
          <span className="dark:text-white text-black z-20">{text}</span>
        </div>
      </div>
    </EvervaultBackground>
  );
};

export function CardPattern({ mouseX, mouseY, randomString }: any) {
  let maskImage = useMotionTemplate`radial-gradient(400px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute inset-0 [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-50"></div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/10 opacity-0 group-hover/card:opacity-100 backdrop-blur-3xl transition duration-500"
        style={style}
      />
      <motion.div
        className="absolute inset-0 opacity-0 mix-blend-overlay group-hover/card:opacity-100 overflow-hidden"
        style={style}
      >
        <p className="absolute inset-x-0 text-xs h-full break-all whitespace-pre-wrap text-gray-400/50 dark:text-white/10 font-mono font-bold transition duration-500">
          {randomString.repeat(15)}
        </p>
      </motion.div>
    </div>
  );
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
