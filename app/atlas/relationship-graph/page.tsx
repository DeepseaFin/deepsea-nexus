'use client';

import Link from 'next/link';
import { useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type WheelEvent as ReactWheelEvent } from 'react';
import {
  ArrowRight,
  Building2,
  FileText,
  Search,
  Users,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

type NodeType =
  | 'Client'
  | 'Buyer'
  | 'Seller'
  | 'Facility'
  | 'Bank'
  | 'Guarantor'
  | 'Director'
  | 'Shareholder'
  | 'Insurance Company'
  | 'Collection Account'
  | 'Document'
  | 'Legal Case';

type RiskRating = 'Low' | 'Medium' | 'High';

type RelationshipType =
  | 'Owns'
  | 'Guarantees'
  | 'Funds'
  | 'Purchases'
  | 'Assigns'
  | 'Collects'
  | 'Manages'
  | 'Controls'
  | 'Represents'
  | 'Insures';

type GraphNode = {
  id: string;
  name: string;
  type: NodeType;
  country: string;
  industry: string;
  riskRating: RiskRating;
  exposure: number;
  openFacility?: boolean;
  activeBank?: boolean;
  pendingGuarantee?: boolean;
};

type GraphEdge = {
  id: string;
  from: string;
  to: string;
  relation: RelationshipType;
  strength: 1 | 2 | 3 | 4 | 5;
};

type Position = { x: number; y: number };
type ViewBox = { x: number; y: number; w: number; h: number };

type ExposureBand = 'All' | 'Small' | 'Medium' | 'Large';

const NODE_TYPES: NodeType[] = [
  'Client',
  'Buyer',
  'Seller',
  'Bank',
  'Director',
  'Shareholder',
  'Guarantor',
  'Insurance Company',
  'Facility',
  'Document',
  'Collection Account',
  'Legal Case',
];

const NODE_COLOR: Record<NodeType, string> = {
  Client: '#0ea5e9',
  Buyer: '#34d399',
  Seller: '#f59e0b',
  Facility: '#818cf8',
  Bank: '#f97316',
  Guarantor: '#e879f9',
  Director: '#22d3ee',
  Shareholder: '#a3e635',
  'Insurance Company': '#14b8a6',
  'Collection Account': '#10b981',
  Document: '#eab308',
  'Legal Case': '#fb7185',
};

const RELATION_COLOR: Record<RelationshipType, string> = {
  Owns: '#6366f1',
  Guarantees: '#e879f9',
  Funds: '#f97316',
  Purchases: '#34d399',
  Assigns: '#22d3ee',
  Collects: '#10b981',
  Manages: '#38bdf8',
  Controls: '#a3e635',
  Represents: '#facc15',
  Insures: '#14b8a6',
};

const NODES: GraphNode[] = [
  { id: 'client-abc', name: 'ABC Limited', type: 'Client', country: 'UAE', industry: 'Trade Finance', riskRating: 'Medium', exposure: 12_800_000, openFacility: true },
  { id: 'buyer-orion', name: 'Orion Retail Group', type: 'Buyer', country: 'Saudi Arabia', industry: 'Retail', riskRating: 'High', exposure: 4_100_000 },
  { id: 'seller-apex', name: 'Apex Commodities', type: 'Seller', country: 'UAE', industry: 'Commodities', riskRating: 'Medium', exposure: 3_750_000 },
  { id: 'facility-rf001', name: 'Facility RF-001', type: 'Facility', country: 'UAE', industry: 'Receivables', riskRating: 'Medium', exposure: 8_700_000, openFacility: true },
  { id: 'facility-rf045', name: 'Facility RF-045', type: 'Facility', country: 'Qatar', industry: 'Structured Finance', riskRating: 'Low', exposure: 5_500_000, openFacility: true },
  { id: 'bank-adcb', name: 'ADCB Treasury', type: 'Bank', country: 'UAE', industry: 'Banking', riskRating: 'Low', exposure: 9_300_000, activeBank: true },
  { id: 'bank-snb', name: 'SNB Institutional', type: 'Bank', country: 'Saudi Arabia', industry: 'Banking', riskRating: 'Low', exposure: 6_900_000, activeBank: true },
  { id: 'guarantor-gth', name: 'Gulf Trade Holdings', type: 'Guarantor', country: 'Bahrain', industry: 'HoldCo', riskRating: 'Medium', exposure: 7_900_000, pendingGuarantee: true },
  { id: 'director-lina', name: 'Lina Al Noor', type: 'Director', country: 'UAE', industry: 'Corporate Governance', riskRating: 'Low', exposure: 0 },
  { id: 'director-omar', name: 'Omar Al Basri', type: 'Director', country: 'Saudi Arabia', industry: 'Corporate Governance', riskRating: 'Medium', exposure: 0 },
  { id: 'shareholder-nexus', name: 'Nexus Investment SPV', type: 'Shareholder', country: 'UAE', industry: 'Investment', riskRating: 'Low', exposure: 11_000_000 },
  { id: 'insurance-marine', name: 'Mariner Insurance', type: 'Insurance Company', country: 'UAE', industry: 'Insurance', riskRating: 'Low', exposure: 2_400_000 },
  { id: 'collection-ac01', name: 'Collections Account AC-01', type: 'Collection Account', country: 'UAE', industry: 'Collections', riskRating: 'Medium', exposure: 5_900_000 },
  { id: 'doc-rpa', name: 'Receivables Purchase Agreement', type: 'Document', country: 'UAE', industry: 'Legal', riskRating: 'Medium', exposure: 8_700_000 },
  { id: 'doc-guarantee', name: 'Corporate Guarantee Pack', type: 'Document', country: 'Bahrain', industry: 'Legal', riskRating: 'Medium', exposure: 7_900_000 },
  { id: 'legal-lc88', name: 'Legal Case LC-88', type: 'Legal Case', country: 'Saudi Arabia', industry: 'Dispute', riskRating: 'High', exposure: 1_800_000 },
];

const EDGES: GraphEdge[] = [
  { id: 'e1', from: 'shareholder-nexus', to: 'client-abc', relation: 'Owns', strength: 5 },
  { id: 'e2', from: 'director-lina', to: 'client-abc', relation: 'Manages', strength: 4 },
  { id: 'e3', from: 'director-omar', to: 'client-abc', relation: 'Controls', strength: 3 },
  { id: 'e4', from: 'client-abc', to: 'facility-rf001', relation: 'Assigns', strength: 5 },
  { id: 'e5', from: 'client-abc', to: 'facility-rf045', relation: 'Assigns', strength: 4 },
  { id: 'e6', from: 'bank-adcb', to: 'facility-rf001', relation: 'Funds', strength: 5 },
  { id: 'e7', from: 'bank-snb', to: 'facility-rf045', relation: 'Funds', strength: 4 },
  { id: 'e8', from: 'guarantor-gth', to: 'facility-rf001', relation: 'Guarantees', strength: 5 },
  { id: 'e9', from: 'buyer-orion', to: 'seller-apex', relation: 'Purchases', strength: 3 },
  { id: 'e10', from: 'facility-rf001', to: 'collection-ac01', relation: 'Collects', strength: 4 },
  { id: 'e11', from: 'doc-rpa', to: 'facility-rf001', relation: 'Represents', strength: 4 },
  { id: 'e12', from: 'doc-guarantee', to: 'guarantor-gth', relation: 'Represents', strength: 5 },
  { id: 'e13', from: 'insurance-marine', to: 'facility-rf001', relation: 'Insures', strength: 4 },
  { id: 'e14', from: 'legal-lc88', to: 'buyer-orion', relation: 'Represents', strength: 2 },
  { id: 'e15', from: 'facility-rf045', to: 'collection-ac01', relation: 'Collects', strength: 3 },
  { id: 'e16', from: 'client-abc', to: 'doc-rpa', relation: 'Controls', strength: 3 },
  { id: 'e17', from: 'client-abc', to: 'doc-guarantee', relation: 'Controls', strength: 2 },
];

const INITIAL_POSITIONS: Record<string, Position> = {
  'shareholder-nexus': { x: 180, y: 90 },
  'director-lina': { x: 410, y: 95 },
  'director-omar': { x: 590, y: 100 },
  'client-abc': { x: 360, y: 250 },
  'buyer-orion': { x: 780, y: 260 },
  'seller-apex': { x: 980, y: 240 },
  'facility-rf001': { x: 330, y: 430 },
  'facility-rf045': { x: 570, y: 460 },
  'bank-adcb': { x: 90, y: 420 },
  'bank-snb': { x: 120, y: 590 },
  'guarantor-gth': { x: 650, y: 580 },
  'insurance-marine': { x: 900, y: 560 },
  'collection-ac01': { x: 390, y: 650 },
  'doc-rpa': { x: 810, y: 430 },
  'doc-guarantee': { x: 1020, y: 520 },
  'legal-lc88': { x: 1130, y: 350 },
};

const DEFAULT_VIEWBOX: ViewBox = { x: 0, y: 0, w: 1300, h: 780 };

function money(amount: number): string {
  return `AED ${Math.round(amount).toLocaleString('en-US')}`;
}

function relationshipScore(entityCount: number, edgeCount: number): number {
  if (entityCount === 0) return 0;
  const density = edgeCount / Math.max(entityCount * (entityCount - 1), 1);
  return Math.round(Math.min(100, density * 220 + 48));
}

function exposureBand(exposure: number): ExposureBand {
  if (exposure >= 8_000_000) return 'Large';
  if (exposure >= 3_000_000) return 'Medium';
  if (exposure > 0) return 'Small';
  return 'All';
}

function nodeRadius(type: NodeType): number {
  if (type === 'Client' || type === 'Facility') return 18;
  if (type === 'Bank' || type === 'Guarantor') return 16;
  return 13;
}

export default function RelationshipGraphPage() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<Record<NodeType, boolean>>(() => {
    return NODE_TYPES.reduce((acc, type) => {
      acc[type] = true;
      return acc;
    }, {} as Record<NodeType, boolean>);
  });
  const [countryFilter, setCountryFilter] = useState('All');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState<'All' | RiskRating>('All');
  const [minRelationshipStrength, setMinRelationshipStrength] = useState(1);
  const [exposureSizeFilter, setExposureSizeFilter] = useState<ExposureBand>('All');
  const [positions, setPositions] = useState<Record<string, Position>>(INITIAL_POSITIONS);
  const [viewBox, setViewBox] = useState<ViewBox>(DEFAULT_VIEWBOX);

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('client-abc');

  const [isPanning, setIsPanning] = useState(false);

  const draggingNodeRef = useRef<string | null>(null);
  const dragAnchorRef = useRef<Position>({ x: 0, y: 0 });
  const panStartRef = useRef<Position>({ x: 0, y: 0 });
  const panViewBoxRef = useRef<ViewBox>(DEFAULT_VIEWBOX);

  const countries = useMemo(() => ['All', ...Array.from(new Set(NODES.map((node) => node.country))).sort()], []);
  const industries = useMemo(() => ['All', ...Array.from(new Set(NODES.map((node) => node.industry))).sort()], []);

  const filteredNodes = useMemo(() => {
    const q = search.trim().toLowerCase();

    return NODES.filter((node) => {
      const typeAllowed = typeFilter[node.type];
      if (!typeAllowed) return false;

      if (countryFilter !== 'All' && node.country !== countryFilter) return false;
      if (industryFilter !== 'All' && node.industry !== industryFilter) return false;
      if (riskFilter !== 'All' && node.riskRating !== riskFilter) return false;

      if (exposureSizeFilter !== 'All') {
        const band = exposureBand(node.exposure);
        if (band !== exposureSizeFilter) return false;
      }

      if (!q) return true;

      return (
        node.name.toLowerCase().includes(q)
        || node.type.toLowerCase().includes(q)
        || node.country.toLowerCase().includes(q)
        || node.industry.toLowerCase().includes(q)
      );
    });
  }, [search, typeFilter, countryFilter, industryFilter, riskFilter, exposureSizeFilter]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((node) => node.id)), [filteredNodes]);

  const filteredEdges = useMemo(() => {
    return EDGES.filter((edge) => {
      if (!filteredNodeIds.has(edge.from) || !filteredNodeIds.has(edge.to)) return false;
      return edge.strength >= minRelationshipStrength;
    });
  }, [filteredNodeIds, minRelationshipStrength]);

  const selectedNode = useMemo(() => NODES.find((node) => node.id === selectedNodeId) ?? null, [selectedNodeId]);
  const hoveredNode = useMemo(() => NODES.find((node) => node.id === hoveredNodeId) ?? null, [hoveredNodeId]);

  const selectedNodeConnections = useMemo(() => {
    if (!selectedNode) return [];

    return filteredEdges
      .filter((edge) => edge.from === selectedNode.id || edge.to === selectedNode.id)
      .map((edge) => {
        const peerId = edge.from === selectedNode.id ? edge.to : edge.from;
        const peer = NODES.find((node) => node.id === peerId);
        return {
          edge,
          peer,
        };
      })
      .filter((entry) => Boolean(entry.peer));
  }, [selectedNode, filteredEdges]);

  const kpis = useMemo(() => {
    const exposure = filteredNodes.reduce((sum, node) => sum + node.exposure, 0);
    const countriesCount = new Set(filteredNodes.map((node) => node.country)).size;
    const activeBanks = filteredNodes.filter((node) => node.type === 'Bank' && node.activeBank).length;
    const pendingGuarantees = filteredNodes.filter((node) => node.type === 'Guarantor' && node.pendingGuarantee).length;

    const connectedDirectorIds = new Set(
      filteredEdges
        .flatMap((edge) => [edge.from, edge.to])
        .filter((id) => NODES.find((node) => node.id === id)?.type === 'Director'),
    );

    return [
      { label: 'Total Entities', value: filteredNodes.length.toString() },
      { label: 'Relationships', value: filteredEdges.length.toString() },
      { label: 'Open Facilities', value: filteredNodes.filter((node) => node.type === 'Facility' && node.openFacility).length.toString() },
      { label: 'Exposure', value: money(exposure) },
      { label: 'Countries', value: countriesCount.toString() },
      { label: 'Active Banks', value: activeBanks.toString() },
      { label: 'Pending Guarantees', value: pendingGuarantees.toString() },
      { label: 'Connected Directors', value: connectedDirectorIds.size.toString() },
    ];
  }, [filteredNodes, filteredEdges]);

  const bottomStats = useMemo(() => {
    const degreeMap = new Map<string, number>();
    filteredNodes.forEach((node) => degreeMap.set(node.id, 0));

    filteredEdges.forEach((edge) => {
      degreeMap.set(edge.from, (degreeMap.get(edge.from) ?? 0) + 1);
      degreeMap.set(edge.to, (degreeMap.get(edge.to) ?? 0) + 1);
    });

    const mostConnectedId = Array.from(degreeMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
    const mostConnected = filteredNodes.find((node) => node.id === mostConnectedId);

    const highestExposure = [...filteredNodes].sort((a, b) => b.exposure - a.exposure)[0];
    const weakestCounterparty = [...filteredNodes]
      .filter((node) => node.type === 'Buyer' || node.type === 'Seller')
      .sort((a, b) => {
        const riskWeight = { High: 3, Medium: 2, Low: 1 };
        return riskWeight[b.riskRating] - riskWeight[a.riskRating] || b.exposure - a.exposure;
      })[0];

    const largestBankEdge = filteredEdges
      .filter((edge) => {
        const from = NODES.find((n) => n.id === edge.from);
        const to = NODES.find((n) => n.id === edge.to);
        return from?.type === 'Bank' || to?.type === 'Bank';
      })
      .sort((a, b) => b.strength - a.strength)[0];

    const largestBankRelLabel = largestBankEdge
      ? `${NODES.find((n) => n.id === largestBankEdge.from)?.name ?? 'N/A'} -> ${NODES.find((n) => n.id === largestBankEdge.to)?.name ?? 'N/A'}`
      : 'N/A';

    const countryCount = new Map<string, number>();
    filteredNodes.forEach((node) => {
      countryCount.set(node.country, (countryCount.get(node.country) ?? 0) + 1);
    });

    const topCountry = Array.from(countryCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';

    const industryCount = new Map<string, number>();
    filteredNodes.forEach((node) => {
      industryCount.set(node.industry, (industryCount.get(node.industry) ?? 0) + 1);
    });

    const topIndustry = Array.from(industryCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';
    const density = filteredNodes.length <= 1 ? 0 : filteredEdges.length / (filteredNodes.length * (filteredNodes.length - 1));

    return {
      mostConnected: mostConnected?.name ?? 'N/A',
      highestExposure: highestExposure ? `${highestExposure.name} (${money(highestExposure.exposure)})` : 'N/A',
      weakestCounterparty: weakestCounterparty ? `${weakestCounterparty.name} (${weakestCounterparty.riskRating})` : 'N/A',
      largestBankingRelationship: largestBankRelLabel,
      mostCommonCountry: topCountry,
      topIndustry,
      networkDensity: density.toFixed(3),
      relationshipScore: `${relationshipScore(filteredNodes.length, filteredEdges.length)}/100`,
    };
  }, [filteredNodes, filteredEdges]);

  const getSvgCoords = (clientX: number, clientY: number): Position | null => {
    const svg = svgRef.current;
    if (!svg) return null;

    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;

    const x = viewBox.x + ((clientX - rect.left) / rect.width) * viewBox.w;
    const y = viewBox.y + ((clientY - rect.top) / rect.height) * viewBox.h;
    return { x, y };
  };

  const onNodeMouseDown = (nodeId: string, event: ReactMouseEvent<SVGGElement>) => {
    event.stopPropagation();
    const point = getSvgCoords(event.clientX, event.clientY);
    if (!point) return;

    draggingNodeRef.current = nodeId;
    dragAnchorRef.current = point;
    setSelectedNodeId(nodeId);
  };

  const onGraphMouseDown = (event: ReactMouseEvent<SVGSVGElement>) => {
    if (draggingNodeRef.current) return;

    setIsPanning(true);
    panStartRef.current = { x: event.clientX, y: event.clientY };
    panViewBoxRef.current = viewBox;
  };

  const onGraphMouseMove = (event: ReactMouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;

    if (draggingNodeRef.current) {
      const nodeId = draggingNodeRef.current;
      const point = getSvgCoords(event.clientX, event.clientY);
      if (!point) return;

      const dx = point.x - dragAnchorRef.current.x;
      const dy = point.y - dragAnchorRef.current.y;
      dragAnchorRef.current = point;

      setPositions((prev) => {
        const current = prev[nodeId];
        if (!current) return prev;

        return {
          ...prev,
          [nodeId]: {
            x: current.x + dx,
            y: current.y + dy,
          },
        };
      });
      return;
    }

    if (isPanning) {
      const rect = svg.getBoundingClientRect();
      const scaleX = viewBox.w / rect.width;
      const scaleY = viewBox.h / rect.height;
      const dx = (event.clientX - panStartRef.current.x) * scaleX;
      const dy = (event.clientY - panStartRef.current.y) * scaleY;

      setViewBox({
        x: panViewBoxRef.current.x - dx,
        y: panViewBoxRef.current.y - dy,
        w: panViewBoxRef.current.w,
        h: panViewBoxRef.current.h,
      });
    }
  };

  const onGraphMouseUp = () => {
    draggingNodeRef.current = null;
    setIsPanning(false);
  };

  const onGraphWheel = (event: ReactWheelEvent<SVGSVGElement>) => {
    event.preventDefault();

    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const zoomFactor = event.deltaY > 0 ? 1.08 : 0.92;
    const nextW = Math.max(520, Math.min(2200, viewBox.w * zoomFactor));
    const nextH = Math.max(320, Math.min(1600, viewBox.h * zoomFactor));

    const ratioX = mouseX / rect.width;
    const ratioY = mouseY / rect.height;

    const pointX = viewBox.x + ratioX * viewBox.w;
    const pointY = viewBox.y + ratioY * viewBox.h;

    const nextX = pointX - ratioX * nextW;
    const nextY = pointY - ratioY * nextH;

    setViewBox({ x: nextX, y: nextY, w: nextW, h: nextH });
  };

  const connectedByType = useMemo(() => {
    if (!selectedNode) return new Map<NodeType, number>();

    const map = new Map<NodeType, number>();
    selectedNodeConnections.forEach((entry) => {
      if (!entry.peer) return;
      const current = map.get(entry.peer.type) ?? 0;
      map.set(entry.peer.type, current + 1);
    });
    return map;
  }, [selectedNode, selectedNodeConnections]);

  const timeline = useMemo(() => {
    if (!selectedNode) return [];

    return [
      `${selectedNode.name} onboarded in ${selectedNode.country}`,
      `Risk rating set to ${selectedNode.riskRating}`,
      `Exposure updated to ${money(selectedNode.exposure)}`,
      `Latest relationship review completed for ${selectedNode.type}`,
    ];
  }, [selectedNode]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] p-4 sm:p-6">
      <div className="mx-auto max-w-[1900px] space-y-4">
        <SectionCard title="Relationship Intelligence Graph" iconKey="network">
          <p className="text-sm text-slate-300">Institutional Entity Mapping &amp; Exposure Analysis</p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
            {kpis.map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-cyan-300" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search Client, Buyer, Seller, Bank, Director, Facility..."
                className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-4 xl:grid-cols-[300px_1fr_360px]">
          <div className="space-y-4">
            <SectionCard title="Filters" iconKey="shield-alert">
              <div className="space-y-3">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Entity Types</p>
                  <div className="space-y-1.5 text-sm">
                    {NODE_TYPES.map((type) => (
                      <label key={type} className="flex items-center gap-2 text-slate-300">
                        <input
                          type="checkbox"
                          checked={typeFilter[type]}
                          onChange={() => {
                            setTypeFilter((prev) => ({
                              ...prev,
                              [type]: !prev[type],
                            }));
                          }}
                          className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-500"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Country Filter</label>
                  <select value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">
                    {countries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Industry Filter</label>
                  <select value={industryFilter} onChange={(event) => setIndustryFilter(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Risk Rating</label>
                  <select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value as 'All' | RiskRating)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">
                    <option value="All">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Relationship Strength</label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={minRelationshipStrength}
                    onChange={(event) => setMinRelationshipStrength(Number(event.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-400">Minimum strength: {minRelationshipStrength}</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Exposure Size</label>
                  <select value={exposureSizeFilter} onChange={(event) => setExposureSizeFilter(event.target.value as ExposureBand)} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">
                    <option value="All">All</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard title="Institutional Network Graph" iconKey="globe-2">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300">Drag nodes</span>
                <span className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300">Scroll to zoom</span>
                <span className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300">Drag background to pan</span>
                <button
                  type="button"
                  onClick={() => {
                    setViewBox(DEFAULT_VIEWBOX);
                    setPositions(INITIAL_POSITIONS);
                  }}
                  className="rounded border border-cyan-700/40 bg-cyan-950/20 px-2 py-1 text-cyan-200"
                >
                  Reset Layout
                </button>
              </div>

              {hoveredNode && (
                <div className="mb-2 rounded-lg border border-cyan-900/40 bg-cyan-950/20 px-3 py-2 text-xs text-cyan-100 transition-all duration-200">
                  {hoveredNode.name} | {hoveredNode.type} | {hoveredNode.country} | Exposure {money(hoveredNode.exposure)}
                </div>
              )}

              <div className="h-[620px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80">
                <svg
                  ref={svgRef}
                  viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
                  className="h-full w-full cursor-grab"
                  onMouseDown={onGraphMouseDown}
                  onMouseMove={onGraphMouseMove}
                  onMouseUp={onGraphMouseUp}
                  onMouseLeave={onGraphMouseUp}
                  onWheel={onGraphWheel}
                >
                  <defs>
                    <marker id="arrowHead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                  </defs>

                  <rect x={viewBox.x} y={viewBox.y} width={viewBox.w} height={viewBox.h} fill="#020617" />

                  {filteredEdges.map((edge) => {
                    const from = positions[edge.from];
                    const to = positions[edge.to];
                    if (!from || !to) return null;

                    const midX = (from.x + to.x) / 2;
                    const midY = (from.y + to.y) / 2;

                    return (
                      <g key={edge.id}>
                        <line
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          stroke={RELATION_COLOR[edge.relation]}
                          strokeWidth={1.5 + edge.strength * 0.45}
                          strokeOpacity={0.88}
                          markerEnd="url(#arrowHead)"
                        />
                        <text x={midX} y={midY - 5} textAnchor="middle" fill="#94a3b8" fontSize={11}>
                          {edge.relation}
                        </text>
                      </g>
                    );
                  })}

                  {filteredNodes.map((node) => {
                    const position = positions[node.id];
                    if (!position) return null;

                    const radius = nodeRadius(node.type);
                    const selected = selectedNodeId === node.id;

                    return (
                      <g
                        key={node.id}
                        onMouseDown={(event) => onNodeMouseDown(node.id, event)}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        onClick={() => setSelectedNodeId(node.id)}
                        className="cursor-pointer transition-all duration-200"
                      >
                        <circle
                          cx={position.x}
                          cy={position.y}
                          r={radius + (selected ? 4 : 0)}
                          fill={selected ? '#f8fafc' : NODE_COLOR[node.type]}
                          fillOpacity={selected ? 0.95 : 0.86}
                          stroke={selected ? '#0ea5e9' : '#0f172a'}
                          strokeWidth={selected ? 3 : 2}
                        />
                        <text x={position.x} y={position.y + radius + 14} textAnchor="middle" fill="#e2e8f0" fontSize={11}>
                          {node.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </SectionCard>

            <SectionCard title="Relationship Statistics" iconKey="bar-chart-3">
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Most Connected Entity</p><p className="mt-1 text-sm text-slate-100">{bottomStats.mostConnected}</p></div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Highest Exposure</p><p className="mt-1 text-sm text-slate-100">{bottomStats.highestExposure}</p></div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Weakest Counterparty</p><p className="mt-1 text-sm text-slate-100">{bottomStats.weakestCounterparty}</p></div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Largest Banking Relationship</p><p className="mt-1 text-sm text-slate-100">{bottomStats.largestBankingRelationship}</p></div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Most Common Country</p><p className="mt-1 text-sm text-slate-100">{bottomStats.mostCommonCountry}</p></div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Top Industry</p><p className="mt-1 text-sm text-slate-100">{bottomStats.topIndustry}</p></div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Network Density</p><p className="mt-1 text-sm text-slate-100">{bottomStats.networkDensity}</p></div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Relationship Score</p><p className="mt-1 text-sm text-slate-100">{bottomStats.relationshipScore}</p></div>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard title="Entity Details" iconKey="users">
              {!selectedNode && (
                <p className="text-sm text-slate-400">Select an entity to see details.</p>
              )}

              {selectedNode && (
                <div className="space-y-3 text-sm">
                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-lg font-semibold text-slate-100">{selectedNode.name}</p>
                    <p className="text-xs text-slate-400">{selectedNode.type}</p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Country</p><p className="text-slate-100">{selectedNode.country}</p></div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Industry</p><p className="text-slate-100">{selectedNode.industry}</p></div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Risk Rating</p><p className="text-slate-100">{selectedNode.riskRating}</p></div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Exposure</p><p className="text-slate-100">{money(selectedNode.exposure)}</p></div>
                  </div>

                  <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs">
                    <p className="text-slate-200">Connected Facilities: {connectedByType.get('Facility') ?? 0}</p>
                    <p className="text-slate-200">Connected Banks: {connectedByType.get('Bank') ?? 0}</p>
                    <p className="text-slate-200">Connected Directors: {connectedByType.get('Director') ?? 0}</p>
                    <p className="text-slate-200">Connected Documents: {connectedByType.get('Document') ?? 0}</p>
                    <p className="text-slate-200">Connected Legal Matters: {connectedByType.get('Legal Case') ?? 0}</p>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                    <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">Timeline</p>
                    <div className="space-y-1">
                      {timeline.map((item) => (
                        <p key={item} className="text-xs text-slate-300">{item}</p>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/atlas/clients" className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><Users className="h-3.5 w-3.5" />Open Client</Link>
                    <Link href="/atlas/deals" className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><Building2 className="h-3.5 w-3.5" />Open Deal</Link>
                    <Link href="/atlas/documents" className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200"><FileText className="h-3.5 w-3.5" />Open Documents</Link>
                    <Link href="/atlas/reports" className="inline-flex items-center justify-center gap-1 rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-2 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-200"><ArrowRight className="h-3.5 w-3.5" />Generate Report</Link>
                  </div>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Node Legend" iconKey="wallet">
              <div className="grid gap-2 text-xs text-slate-300">
                {NODE_TYPES.map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: NODE_COLOR[type] }} />
                    <span>{type}</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Relationship Legend" iconKey="hand-coins">
              <div className="grid gap-2 text-xs text-slate-300">
                {Object.entries(RELATION_COLOR).map(([relation, color]) => (
                  <div key={relation} className="flex items-center gap-2">
                    <span className="h-[2px] w-5" style={{ backgroundColor: color }} />
                    <span>{relation}</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Risk Alerts" iconKey="alert-triangle">
              <div className="space-y-2 text-xs">
                <div className="rounded-lg border border-rose-900/40 bg-rose-950/20 p-2 text-rose-100">Buyer Orion Retail Group has elevated dispute risk exposure.</div>
                <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-2 text-amber-100">Pending guarantee review for Gulf Trade Holdings.</div>
                <div className="rounded-lg border border-cyan-900/40 bg-cyan-950/20 p-2 text-cyan-100">Funding concentration detected in ADCB line allocation.</div>
              </div>
            </SectionCard>

            <SectionCard title="Jurisdiction Snapshot" iconKey="gavel">
              <div className="space-y-1 text-xs text-slate-300">
                <p>UAE entities: {filteredNodes.filter((node) => node.country === 'UAE').length}</p>
                <p>Saudi entities: {filteredNodes.filter((node) => node.country === 'Saudi Arabia').length}</p>
                <p>Cross-border legal links: {filteredEdges.filter((edge) => {
                  const a = NODES.find((n) => n.id === edge.from);
                  const b = NODES.find((n) => n.id === edge.to);
                  return a && b && a.country !== b.country;
                }).length}</p>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
