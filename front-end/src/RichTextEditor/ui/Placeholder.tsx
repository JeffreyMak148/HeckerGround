import './Placeholder.css';

import * as React from 'react';

export default function Placeholder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return <div className={className || 'Placeholder__root'}>{children}</div>;
}