import { useEffect, useId, useRef, useState } from 'react';
import { geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import landData from './land-110m.json';
import type { VisualState } from './storyData.js';
import { MUTED, ORANGE, SEA_700, SKY, SMOKE, TIMBERWOLF } from './palette.js';

// Natural Earth public-domain land geometry, distributed by world-atlas 2.0.2.
const topology = landData as unknown as Topology<{land: GeometryCollection}>;
const land = feature(topology, topology.objects.land);
const port: [number, number] = [135.86, -34.72]; // Illustrative departure near Port Lincoln.
const park: [number, number] = [133.6, -53.6];
export function SeaMap({ state }: {state: VisualState}) {
  const id = useId().replace(/:/g,'');
  const ref = useRef<SVGSVGElement>(null);
  const [size,setSize] = useState(500);
  useEffect(() => { const ro = new ResizeObserver(e => setSize(e[0]!.contentRect.width)); if(ref.current) ro.observe(ref.current); return () => ro.disconnect(); },[]);
  const font = 11 * Math.max(1,500/Math.max(280,size));
  const route = state === 'outbound' || state === 'return';
  const returning = state === 'return';
  const projection = geoOrthographic().rotate([-132, route ? 39 : 30, 0]).translate([250,250]).scale(237).clipAngle(90);
  const path = geoPath(projection);
  const p = projection(port)!; const s = projection(park)!;
  const transfer = projection([135.82,-35.17])!;
  const belt = { type: 'Polygon' as const, coordinates: [[...Array.from({length: 73},(_,i) => [-180+i*5,-40]),...Array.from({length:73},(_,i)=>[180-i*5,-60]),[-180,-40]]] };
  return <svg ref={ref} viewBox="0 0 500 500" role="img" aria-label={route ? 'Illustrative route from southern Australia to the model reference sea park at 53.6 degrees south, 133.6 degrees east.' : 'Globe centered on Australia and the Southern Ocean. The reference location is marked south of Australia.'}>
    <defs><clipPath id={`${id}-clip`}><circle cx="250" cy="250" r="237"/></clipPath><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 1L8 5L0 9" fill="none" stroke={SMOKE} strokeWidth="1.6"/></marker></defs>
    <circle cx="250" cy="250" r="237" fill={SEA_700}/>
    <g clipPath={`url(#${id}-clip)`}>
      <path d={path(belt) || ''} fill={SKY} opacity=".45"/>
      <path d={path(geoGraticule10()) || ''} fill="none" stroke={SMOKE} strokeWidth=".65" opacity=".12"/>
      <path d={path(land) || ''} fill={TIMBERWOLF} fillOpacity=".22" stroke={TIMBERWOLF} strokeOpacity=".55" strokeWidth=".7"/>
      <text x="240" y={route ? 185 : 205} textAnchor="middle" fill={SMOKE} fontSize={font+1} letterSpacing="3">AUSTRALIA</text>
      <text x="115" y="410" fill={MUTED} fontSize={font} letterSpacing="3" transform="rotate(12 115 410)">SOUTHERN OCEAN</text>
      {route && <>
        <path d={`M${p[0]},${p[1]} L${s[0]},${s[1]}`} stroke={SMOKE} strokeOpacity=".4" strokeWidth="1.5" strokeDasharray="3 5" fill="none"/>
        <path d={returning ? `M${s[0]+7},${s[1]-12} L${p[0]+7},${p[1]+14}` : `M${transfer[0]},${transfer[1]} L${s[0]},${s[1]-13}`} stroke={SMOKE} strokeWidth="1.8" fill="none" markerEnd={`url(#${id}-arrow)`}/>
        <path d={`M${p[0]},${p[1]} L${transfer[0]},${transfer[1]}`} stroke={ORANGE} strokeWidth="4"/>
        <circle cx={p[0]} cy={p[1]} r="4" fill={ORANGE}/>
        <text x={p[0]+18} y={p[1]-8} fill={SMOKE} fontSize={font}>{returning ? 'Maintenance in port' : 'Illustrative port'}</text>
        <path d={`M${transfer[0]-4},${transfer[1]} L${transfer[0]-44},${transfer[1]+6}`} stroke={SMOKE} strokeOpacity=".5" strokeWidth=".6"/>
        <text x={transfer[0]-49} y={transfer[1]+10} textAnchor="end" fill={SMOKE} fontSize={font}>Tug · 50 km</text>
        <text x={p[0]+22} y={(p[1]+s[1])/2+6} fill={SMOKE} fontSize={font}>Self-propulsion</text>
      </>}
      <circle cx={s[0]} cy={s[1]} r="11" fill="none" stroke={SMOKE} opacity=".5"/>
      <circle cx={s[0]} cy={s[1]} r="3.5" fill={SMOKE}/>
      <text x={s[0]-20} y={s[1]+28} textAnchor="middle" fill={SMOKE} fontSize={font}>Model sea park</text>
      <text x={s[0]-20} y={s[1]+28+font*1.55} textAnchor="middle" fill={MUTED} fontSize={font}>53.6°S, 133.6°E</text>
    </g>
    <circle cx="250" cy="250" r="237" fill="none" stroke={SMOKE} strokeWidth=".7" opacity=".2"/>
  </svg>;
}
