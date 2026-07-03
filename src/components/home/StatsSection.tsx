"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const stats = [
  { value: 10000, suffix: "+", label: "Usuarios por año" },
  { value: 16,    suffix: "",  label: "Años de experiencia" },
  { value: 40000, suffix: "+", label: "Familias satisfechas" },
  { value: 19,    suffix: "",  label: "Entidades en convenio" },
];

export function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        document.querySelectorAll<HTMLElement>(".stat-number").forEach((el, i) => {
          el.textContent = stats[i].value.toLocaleString("es-CO");
        });
        return;
      }

      stats.forEach((stat, i) => {
        const el = document.querySelectorAll<HTMLElement>(".stat-number")[i];
        if (!el) return;
        const obj = { val: 0 };

        gsap.to(obj, {
          val: stat.value,
          duration: 2.2,
          ease: "power1.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          onUpdate() {
            el.textContent = Math.floor(obj.val).toLocaleString("es-CO");
          },
        });
      });

      gsap.from(".stat-card", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-8 md:py-10"
      style={{
        background: "linear-gradient(to right, var(--color-azul-700) 0%, var(--color-azul-900) 60%, var(--color-azul-900) 100%)",
      }}
      aria-label="Cifras del Cardiocentro"
    >
      <Image
        src="/images/logo-watermark.png"
        alt=""
        width={112}
        height={112}
        aria-hidden="true"
        className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 w-24 h-24 md:w-28 md:h-28 pointer-events-none select-none opacity-[0.12]"
      />

      <div className="container-main relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
          {stats.map(({ suffix, label }) => (
            <div key={label} className="stat-card">
              <p className="font-heading font-black text-3xl sm:text-4xl md:text-[2.75rem] text-white leading-none">
                <span className="stat-number">0</span>
                {suffix && (
                  <span style={{ color: "var(--color-rojo-500)" }}>{suffix}</span>
                )}
              </p>
              <p
                className="font-body text-base sm:text-lg mt-2 leading-snug"
                style={{ color: "rgba(255,255,255,0.88)" }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
