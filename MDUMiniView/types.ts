export interface Rack {
  Number: number;
  Shelves: number;
  Positions: number;
}

export interface RackLocation {
  Rack: number;
  Shelf: number;
  Position: number;
}

export interface Layout {
  NoDoor?: boolean;
  DoorLeft: boolean;
  Immersion?: boolean;
  Racks: Rack[];
}

export type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type RackBounds = {
  id: number;
  cols: number;
  rows: number;
} & Rect;
