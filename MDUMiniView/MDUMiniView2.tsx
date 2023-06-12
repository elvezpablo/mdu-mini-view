import * as React from 'react';
import styled from '@emotion/styled';
import { Layout } from './types';
import Exit from '../MDUMiniView/Exit';

type Props = {
  layout: Layout;
  data: Map<string, string>;
  active: number[];
  onChange: (selectedRacks: number[]) => void;
  multiSelect?: boolean;
  leftHanded: boolean;
};

const Container = styled.div`
  display: flex;
`;

const RacksContainer = styled.div`
  background-color: #999;
  border: 3px solid #999;
  padding: 3px;
  border-radius: .125rem;
  display: flex;  
  gap: 6px;
  width: 100%;
  &:focus {
    outline: 1px solid white;
  }
`;

const RackContainer = styled.div`
  background-color: #222;  
  
  border-radius: .125rem;
  display: grid;  
  gap: 1px;
  padding: 1px;
  &:focus {
    background-color: black;
    outline: 2px solid white;
  }
  &:hover {
    outline: 2px solid #ccc;
  }
`;

const Miner = styled.div`
  background-color: #666;
  min-width: 5px;
  min-height: 5px;
  aspect-ratio: 1.0;
`;

type Rack = {
  id: number;
  cols: number;
  rows: number;
};

const getNextFocusedIndex = (
  idx: number,
  length: number,
  forward: boolean = true
) => {
  if (forward) {
    return idx < length - 1 ? idx + 1 : 0;
  }
  return idx > 0 ? idx - 1 : length - 1;
};

const setFocused = (
  elements: HTMLCollectionOf<Element>,
  forward: boolean = true
) => {
  const activeElement = document.activeElement;
  const racks = Array.from(elements);
  const idx = racks.findIndex((r) => r === activeElement);

  const next = getNextFocusedIndex(idx, racks.length, forward);
  const rack = racks[next] as HTMLElement;
  rack.focus();
};

const getFocusedIndex = (elements: HTMLCollectionOf<Element>) =>
  Array.from(elements).findIndex((r) => r === document.activeElement);

export default function MDUMiniView2({
  layout,
  data,
  onChange,
  active,
  multiSelect = false,
  leftHanded = false,
}: Props) {
  const rackContainerRef = React.useRef<HTMLDivElement>();
  const [selected, setSelected] = React.useState(new Set<number>());
  const [hovered, setHovered] = React.useState<number | undefined>();
  const racks: Rack[] = layout.Racks.map((r, i) => ({
    id: r.Number,
    cols: r.Positions,
    rows: r.Shelves,
  }));
  const totalCols = racks.reduce((prev, cur) => prev + cur.cols, 0);
  return (
    <Container>
      {leftHanded && <Exit left={leftHanded} />}
      <RacksContainer
        tabIndex={1}
        ref={rackContainerRef}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            setFocused(rackContainerRef.current.children, false);
          }
          if (e.key === 'ArrowRight') {
            setFocused(rackContainerRef.current.children);
          }

          if (e.key === 'Enter') {
            const idx = getFocusedIndex(rackContainerRef.current.children);
            if (idx === -1) {
              return;
            }
            if (multiSelect) {
              if (selected.has(idx)) {
                selected.delete(idx);
              } else {
                selected.add(idx);
              }
            } else {
              selected.clear();
              selected.add(idx);
            }

            setSelected(new Set(selected));
            onChange([...selected].sort());
          }
        }}
        onBlur={() => {
          setHovered(undefined);
        }}
      >
        {racks.map((r, i) => (
          <RackContainer
            tabIndex={1}
            onMouseDown={(e) => {
              if (multiSelect && e.shiftKey) {
                const focusedIndex = getFocusedIndex(
                  rackContainerRef.current.children
                );
                if (focusedIndex === -1) {
                  return;
                }
                const start = Math.min(focusedIndex, hovered);
                const end = Math.max(focusedIndex, hovered);
                const shouldAdd = !selected.has(hovered);

                Array.from(rackContainerRef.current.children).forEach(
                  (e, i) => {
                    if (i >= start && i <= end) {
                      if (shouldAdd) {
                        selected.add(i);
                      } else {
                        selected.delete(i);
                      }
                      if (e instanceof HTMLElement) {
                        e.focus();
                      }
                    }
                  }
                );
                setSelected(new Set(selected));
                onChange([...selected].sort());
              } else {
                if (multiSelect) {
                  if (selected.has(i)) {
                    selected.delete(i);
                  } else {
                    selected.add(i);
                  }
                } else {
                  selected.clear();
                  selected.add(i);
                }
                setSelected(new Set(selected));
                onChange([...selected].sort());
                e.currentTarget.focus();
              }
            }}
            onMouseOver={() => {
              setHovered(i);
            }}
            onMouseOut={() => {
              setHovered(undefined);
            }}
            className="rack"
            style={{
              backgroundColor: selected.has(i) ? '#2F2' : '#222',
              width: `${Math.floor((r.cols / totalCols) * 100)}%`,
              gridTemplateColumns: `repeat(${r.cols}, 1fr)`,
              gridTemplateRows: `repeat(${r.rows}, 1fr)`,
            }}
          >
            {Array.from(Array(r.cols * r.rows)).map(() => (
              <Miner />
            ))}
          </RackContainer>
        ))}
      </RacksContainer>
      {!leftHanded && <Exit left={leftHanded} />}
    </Container>
  );
}
