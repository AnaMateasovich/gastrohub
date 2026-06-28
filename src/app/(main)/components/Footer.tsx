"use client"
import Link from "next/link";
import { MessageCircle, MapPin, Clock, Focus } from "lucide-react";

const Footer = () => {
  return (
    <footer className="hidden md:block bg-[var(--color-primary-dark)] text-white mt-auto">
      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-10 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-bold italic mb-2">Sabores Naturales</h3>
          <p className="text-sm text-white/70 leading-relaxed">
            Panadería saludable y productos artesanales, hechos con ingredientes reales en Casilda.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold text-white/90 mb-1">Horarios y ubicación</p>
          <div className="flex items-center gap-2 text-white/70">
            <Clock size={16} />
            <span>Lun a sáb, 9:00 a 20:00</span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            <MapPin size={16} />
            <span>Casilda, Santa Fe</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold text-white/90 mb-1">Contacto</p>
          <a
            href="https://wa.me/5493413000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </a>
          
           <a href="https://instagram.com/saboresnaturales"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            
            <Focus size={16} />
            <span>Instagram</span>
          </a>
          <Link href="/productos" className="text-white/70 hover:text-white transition-colors mt-1">
            Ver productos →
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 px-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Sabores Naturales — Hecho con ❤️ en Casilda
      </div>
    </footer>
  );
};

export default Footer;