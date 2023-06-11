import * as React from 'react';
import './MDUMiniView.css';
import { Rack, RackLocation, Layout, Rect, RackBounds } from './types';

type Props = {
  layout: Layout;
  data: Map<string, string>;
  onSelected: (rack: number) => void;
};

const rackRize = {
  width: 40,
  height: 80,
};

const PADDING = 5;

const drawRack = (
  context: CanvasRenderingContext2D,
  bounds: RackBounds,
  cols: number,
  rows: number,
  color: (id: number, col: number, row: number) => string // color
) => {
  context.fillStyle = '#330000';
  context.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);

  const width = Math.round(bounds.width / cols);
  const height = Math.round(bounds.height / rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      context.fillStyle = color(bounds.id, i + 1, j + 1);
      context.fillRect(
        bounds.left + i * width,
        bounds.top + j * height,
        width - 1,
        height - 1
      );
    }
  }
};

const isInBounds = (x: number, y: number, r: Rect) =>
  x >= r.left && x <= r.left + r.width && y >= r.top && y <= r.top + r.height;

export default function MDUMiniView({ layout, data, onSelected }: Props) {
  const canvasRef = React.useRef(null);

  const canvasSize = {
    width: layout.Racks.length * (rackRize.width + PADDING) + PADDING,
    height: 80,
  };

  React.useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');
    // background
    context.fillStyle = '#000000';

    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    // parse map
    // const valueLookup = new Map<string, string>();
    // data.forEach((value, key) => {
    //   console.log('data', data);
    //   valueLookup.set(`${key.Rack}_${key.Position}_${key.Shelf}}`, value);
    // });
    // racks
    const rackBounds: RackBounds[] = layout.Racks.map((r, i) => ({
      id: r.Number,
      cols: r.Positions,
      rows: r.Shelves,
      top: PADDING,
      left: rackRize.width * i + PADDING * i + PADDING,
      width: rackRize.width,
      height: rackRize.height - 2 * PADDING,
    }));

    const colorCallback = (valueLookup: Map<string, string>) => {
      // TODO: various color factories here
      return (id: number, col: number, row: number) => {
        const position = [id, col, row].join('_');

        const value = valueLookup.get(position);

        if (value) {
          // console.log(valueLookup);
          // console.log(position);
          // console.log(value);
          return value;
        }

        return '#003300';
      };
    };

    const tempCallback = colorCallback(data);

    rackBounds.forEach((r) => {
      drawRack(context, r, r.cols, r.rows, tempCallback);
    });
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      rackBounds.forEach((r) => {
        if (isInBounds(x, y, r)) {
          onSelected(r.id);
        }
      });
    });
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      rackBounds.forEach((r) => {
        if (isInBounds(x, y, r)) {
          context.fillStyle = 'rgba(0,200,200,.1)';
          context.fillRect(r.left, r.top, r.width, r.height);
        }
      });
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
    />
  );
}
