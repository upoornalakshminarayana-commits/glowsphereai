import React, { useState } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'motion/react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}

export default function GlowCard({ children, className = '', onClick, id }: GlowCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - left);
    mouseY.set(event.clientY - top);
  }

  // Subtle luxury radial glow gradient following the cursor
  const background = useMotionTemplate`
    radial-gradient(
      350px circle at ${mouseX}px ${mouseY}px,
      rgba(139, 92, 246, 0.12) 0%,
      rgba(236, 72, 153, 0.05) 50%,
      transparent 100%
    )
  `;

  return (
    <div
      id={id}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative group rounded-2xl border border-white/10 bg-zinc-950/30 overflow-hidden backdrop-blur-md transition-colors duration-300 ${className}`}
    >
      {/* Background radial gradient layer following cursor */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background }}
      />
      
      {/* Visual content container */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
