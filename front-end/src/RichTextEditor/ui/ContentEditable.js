import './ContentEditable.css';

import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import * as React from 'react';

export default function LexicalContentEditable({
  className,
}) {
  return <ContentEditable className={className || 'ContentEditable__root'} />;
}