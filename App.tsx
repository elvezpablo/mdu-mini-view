import * as React from 'react';
import './style.css';
import layout from './racks.json';
import MDUMiniView2 from './MDUMiniView/MDUMiniView2';
import MDUScroller from './MDUScroller/MDUScroller';

const data = new Map<string, string>();
data.set('1_2_3', '#cc6600');
data.set('2_4_3', '#cc6600');
data.set('2_2_2', '#cc6600');
data.set('2_2_8', '#cc0000');
data.set('8_4_8', '#cc6600');
// console.log(data.values());

export default function App() {
  const [selected, setSelected] = React.useState([]);
  return (
    <div>
      <h1>MDUMiniView</h1>
      <h2>{`Selected: ${selected.join(',')}`}</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#111',
        }}
      >
        <div style={{ width: '440px' }}>
          <MDUMiniView2
            layout={layout}
            active={selected}
            data={data}
            leftHanded
            onChange={(selected) => {
              setSelected(selected);
            }}
          />
        </div>
      </div>
      <MDUScroller />
    </div>
  );
}
