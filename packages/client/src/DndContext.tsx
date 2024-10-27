import {ReactElement, ReactNode} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {TouchBackend} from 'react-dnd-touch-backend';

const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

export default function DndContext({children}: {children: ReactNode}): ReactElement {
  return <DndProvider backend={isTouch ? TouchBackend : HTML5Backend}>{children}</DndProvider>;
}
