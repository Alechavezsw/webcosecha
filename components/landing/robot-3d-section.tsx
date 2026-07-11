"use client";

import React from 'react';

export function Robot3dSection() {
  // Construimos la URL con todos los parámetros para "apagar" la interfaz de Sketchfab
  // autostart=1 : Inicia sin pedir click
  // transparent=1 : Permite que nuestro fondo se vea
  // ui_...=0 : Apaga todos los elementos de la interfaz (botones, títulos, controles, ayuda)
  const sketchfabUrl = "https://sketchfab.com/models/c9de125cb9d8407abed1dc8f6a4676a8/embed?autostart=1&transparent=1&ui_animations=0&ui_infos=0&ui_stop=0&ui_inspector=0&ui_watermark_link=0&ui_watermark=0&ui_hint=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_controls=0&dnt=1";

  return (
    <div className="relative flex items-center justify-center w-full h-screen overflow-hidden bg-black">
      
      {/* Texto de fondo - Se ubica detrás del Iframe (z-0) */}
      <h1 className="absolute z-0 text-[12vw] font-display font-black text-white/5 uppercase tracking-tighter text-center leading-none pointer-events-none select-none">
        Cosecha<br/>Creativa
      </h1>

      {/* 
        El contenedor del Iframe tiene un tamaño deliberadamente mayor al 100% de la pantalla.
        Al hacer esto y usar posiciones negativas (-top, -left), "recortamos" los bordes
        del widget de Sketchfab donde suelen forzar su logo de marca de agua,
        dejando únicamente el modelo visible en el centro.
      */}
      <div 
        className="absolute z-10" 
        style={{
          top: '-80px',      // Empuja el borde superior fuera de la vista
          bottom: '-80px',   // Empuja el borde inferior (donde está el logo) fuera de la vista
          left: '-40px',     // Empuja el borde izquierdo
          right: '-40px',    // Empuja el borde derecho
          width: 'calc(100% + 80px)', 
          height: 'calc(100% + 160px)'
        }}
      >
        <iframe
          title="Little robot"
          frameBorder="0"
          allowFullScreen
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          xr-spatial-tracking="true"
          execution-while-out-of-viewport="true"
          execution-while-not-rendered="true"
          web-share="true"
          src={sketchfabUrl}
          className="w-full h-full object-cover"
          style={{
            // pointer-events: auto permite que sigas rotando el modelo con el ratón
            pointerEvents: 'auto'
          }}
        />
      </div>

      {/* Capa invisible para asegurar que el usuario no pueda hacer click en enlaces residuales invisibles en los bordes */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] z-20"></div>
      
    </div>
  );
}
