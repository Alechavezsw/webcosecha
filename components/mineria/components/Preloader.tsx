import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  /** Monta el cinematic debajo antes del fade final (solape intro → video). */
  onHandoff?: () => void;
  /** Cuando el panel ya salió del todo (desmontar preloader). */
  onComplete?: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onHandoff, onComplete }) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const onHandoffRef = useRef(onHandoff);
  onCompleteRef.current = onComplete;
  onHandoffRef.current = onHandoff;

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => onCompleteRef.current?.(),
    });
    tl.to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.88,
      ease: 'power3.out',
    })
      .to(textRef.current, {
        opacity: 0,
        y: -14,
        duration: 0.62,
        delay: 0.35,
        ease: 'power3.in',
      })
      .add(() => {
        onHandoffRef.current?.();
      })
      .to(
        preloaderRef.current,
        {
          yPercent: -100,
          duration: 0.88,
          ease: 'power3.inOut',
        },
        '<',
      )
      .to(
        preloaderRef.current,
        {
          opacity: 0,
          duration: 0.48,
          ease: 'power2.inOut',
        },
        '-=0.48',
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#ffb800] via-[#f5b000] to-[#d9a000] will-change-transform"
    >
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 overflow-hidden pointer-events-none">
        <div className="h-full w-1/4 bg-gradient-to-r from-transparent via-black/25 to-transparent animate-preloader-scan" />
      </div>
      <div ref={textRef} className="opacity-0 translate-y-10 relative z-10">
        <span className="text-4xl md:text-7xl lg:text-8xl font-display uppercase italic tracking-tighter text-black drop-shadow-[0_2px_0_rgba(0,0,0,0.08)]">
          COSECHA <span className="text-black/35">CREATIVA</span>
        </span>
      </div>
    </div>
  );
};

export default Preloader;
