"use client";

import gsap from "gsap";
import { useCallback, useEffect, useRef } from "react";

interface Props {
  isOver: boolean;
}

export default function BlurryCursor(props: Props) {
  const { isOver } = props;

  const circles = useRef<HTMLDivElement[]>([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const delayedMouse = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  const size = isOver ? 400 : 30;
  const delay = isOver ? 0.015 : 0.005;

  const colors = ["#c32d27", "#f5c63f", "#457ec4", "#356fdb"];

  // lerp: stands for linear interpolation -> basic concept in motion design
  // used to create a delayed value from the actual one
  const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

  const moveCircles = (x: number, y: number) => {
    if (circles.current.length < 1) return;
    circles.current.forEach((circle, i) => {
      gsap.set(circle, { x, y, xPercent: -50, yPercent: -50 });
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;

    mousePosition.current = {
      x: clientX,
      y: clientY,
    };
  };

  const animate = () => {
    const { x, y } = delayedMouse.current;

    delayedMouse.current = {
      x: lerp(x, mousePosition.current.x, 0.075),
      y: lerp(y, mousePosition.current.y, 0.075),
    };

    moveCircles(delayedMouse.current.x, delayedMouse.current.y);
    rafId.current = window.requestAnimationFrame(animate);
  };

  useEffect(() => {
    animate();
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) window.cancelAnimationFrame(rafId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOver]);

  return (
    <div className="relative h-screen">
      {[...Array(4)].map((_, i) => {
        return (
          <div
            key={i}
            ref={(ref) => {
              if (ref) circles.current[i] = ref;
            }}
            style={{
              border: isOver ? `10px solid ${colors[i]}` : "none",
              width: size,
              height: size,
              backgroundColor: isOver ? "unset" : "#ffffff36",
              filter: `blur(${isOver ? 20 : 2}px)`,
              transition: `transform ${
                (4 - i) * delay
              }s linear, height 0.3s ease-out, width 0.3s ease-out, filter 0.3s ease-out`,
            }}
            className="top-0 left-0 fixed rounded-full pointer-events-none"
          />
        );
      })}
    </div>
  );
}
