import './Placeholder.css';

import * as React from 'react';

export default function Placeholder({
  children,
  className,
}) {
  return <div className={className || 'Placeholder__root'}>{children}</div>;
}