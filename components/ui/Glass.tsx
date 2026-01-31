"use client";

import React from 'react';

interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong';
}

export function Glass({ variant = 'default', className = '', children, ...rest }: GlassProps) {
  const cls = `${variant === 'strong' ? 'glass-strong' : 'glass'} ${className}`.trim();
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}

export default Glass;
