declare module '*.svg' {
  import {ComponentType} from 'react';
  const content: ComponentType<{className?: string}>;
  export default content;
}
