import Link from "next/link";
import React from "react";

type LinkComponentProps = {
  href: string;
  className?: string;
  bgColor?: string
  textColor?: string
  children: React.ReactElement
  target?: string
};

const LinkComponent = ({ href, children, className,bgColor='bg-[var(--color-primary)]', textColor = 'text-[var(--color-background)]', target}: LinkComponentProps) => {
  return (
    <div className={`${bgColor} ${textColor} ${className}`}>  
      <Link
        href={href}
        target={target} 
      >
        {children}
      </Link>
    </div>
  );
};

export default LinkComponent;
