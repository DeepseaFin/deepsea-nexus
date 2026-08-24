'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type WheelEvent as ReactWheelEvent } from 'react';
import {
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import {
  EDGE_TYPES,
  NODE_TYPES,
  type EdgeType,
  type EntityNode,
  type NodeType,
  type RelationshipEdge,
  type RiskRating,
  money,
} from './data';

type Position = { x: number; y: number };
type ViewBox = { x: number; y: number; w: number; h: number };

type Props = {
  nodes: EntityNode[];
  edges: RelationshipEdge[];
  searchQuery: string;
};

type ExposureFilter = 'All' | '0-1M' | '1M-5M' | '5M+';
type VisualizationMode =
  | 'Entity Focus'
  | 'Exposure View'
  | 'Banking View'
  | 'Legal View'
  | 'Collections View'
  | 'Ownership View'
  | 'AI Investigation';
type InspectorTab =
  | 'Overview'
  | 'Exposure'
  | 'Facilities'
  | 'Collections'
  | 'Treasury'
  | 'Legal'
  | 'Risk'
  | 'Documents'
  | 'Timeline'
  | 'AI Intelligence';

const STORAGE_KEYS = {
  viewBox: 'atlas.relint.viewbox',
  selectedId: 'atlas.relint.selectedId',
  inspectorTab: 'atlas.relint.inspectorTab',
  rightPanelWidth: 'atlas.relint.rightPanelWidth',
  leftPanelCollapsed: 'atlas.relint.leftPanelCollapsed',
  rightPanelCollapsed: 'atlas.relint.rightPanelCollapsed',
  filters: 'atlas.relint.filters',
  hideLabels: 'atlas.relint.hideLabels',
  riskOverlay: 'atlas.relint.riskOverlay',
} as const;

const VISUALIZATION_MODES: VisualizationMode[] = [
  'Entity Focus',
  'Exposure View',
  'Banking View',
  'Legal View',
  'Collections View',
  'Ownership View',
  'AI Investigation',
];

const INSPECTOR_TABS: InspectorTab[] = [
  'Overview',
  'Exposure',
  'Facilities',
  'Collections',
  'Treasury',
  'Legal',
  'Risk',
  'Documents',
  'Timeline',
  'AI Intelligence',
];

const NODE_COLORS: Record<NodeType, string> = {
  Client: '#22d3ee',
  Buyer: '#34d399',
  Seller: '#f59e0b',
  Counterparty: '#f97316',
  Bank: '#60a5fa',
  'Collection Account': '#10b981',
  Facility: '#818cf8',
  Invoice: '#eab308',
  Director: '#38bdf8',
  Shareholder: '#a3e635',
  'Parent Company': '#c084fc',
  Subsidiary: '#f472b6',
  'Ultimate Beneficial Owner': '#fb7185',
  Guarantor: '#d946ef',
  'Insurance Company': '#14b8a6',
  'Legal Counsel': '#fbbf24',
  Auditor: '#2dd4bf',
  Broker: '#fb923c',
  'Collection Agent': '#4ade80',
  SPV: '#a78bfa',
  Trust: '#bef264',
  Document: '#facc15',
  'Legal Case': '#f43f5e',
  'Court Matter': '#ef4444',
};

const EDGE_COLORS: Record<EdgeType, string> = {
  Owns: '#6366f1',
  Controls: '#7c3aed',
  Guarantees: '#d946ef',
  Funds: '#0ea5e9',
  Purchases: '#22c55e',
  Sells: '#f59e0b',
  Assigns: '#38bdf8',
  Collects: '#10b981',
  Represents: '#facc15',
  Insures: '#14b8a6',
  Audits: '#2dd4bf',
  Finances: '#60a5fa',
  'Reports To': '#94a3b8',
  'Related Party': '#fb7185',
  'Family Relationship': '#f472b6',
  'Board Member': '#a3e635',
};

function edgeDash(type: EdgeType): string {
  if (type === 'Reports To' || type === 'Related Party') return '4 3';
  if (type === 'Family Relationship' || type === 'Board Member') return '2 3';
  return '0';
}

function nodeRadius(type: NodeType): number {
  if (type === 'Client' || type === 'Facility' || type === 'Bank') return 15;
  if (type === 'Guarantor' || type === 'Buyer' || type === 'Seller') return 13;
  return 11;
}

function buildInitialPositions(nodes: EntityNode[]): Record<string, Position> {
  const centerX = 980;
  const centerY = 560;
  const ringA = 260;
  const ringB = 440;
  const ringC = 620;

  return nodes.reduce((acc, node, index) => {
    const ring = index % 3 === 0 ? ringA : index % 3 === 1 ? ringB : ringC;
    const angle = (index / Math.max(nodes.length, 1)) * Math.PI * 2;
    acc[node.id] = {
      x: centerX + Math.cos(angle) * ring,
      y: centerY + Math.sin(angle) * ring,
    };
    return acc;
  }, {} as Record<string, Position>);
}

function buildClusteredPositions(nodes: EntityNode[]): Record<string, Position> {
  const groups = new Map<NodeType, EntityNode[]>();
  NODE_TYPES.forEach((type) => groups.set(type, []));

  nodes.forEach((node) => {
    groups.get(node.type)?.push(node);
  });

  const orderedTypes = NODE_TYPES.filter((type) => (groups.get(type)?.length ?? 0) > 0);
  const centerX = 980;
  const centerY = 560;
  const outerRadius = 500;

  const result: Record<string, Position> = {};

  orderedTypes.forEach((type, idx) => {
    const entities = groups.get(type) ?? [];
    const angle = (idx / Math.max(orderedTypes.length, 1)) * Math.PI * 2;
    const cx = centerX + Math.cos(angle) * outerRadius;
    const cy = centerY + Math.sin(angle) * outerRadius;

    entities.forEach((entity, index) => {
      const localAngle = (index / Math.max(entities.length, 1)) * Math.PI * 2;
      result[entity.id] = {
        x: cx + Math.cos(localAngle) * 90,
        y: cy + Math.sin(localAngle) * 90,
      };
    });
  });

  return result;
}

function inExposureRange(value: number, filter: ExposureFilter): boolean {
  if (filter === 'All') return true;
  if (filter === '0-1M') return value <= 1_000_000;
  if (filter === '1M-5M') return value > 1_000_000 && value <= 5_000_000;
  return value > 5_000_000;
}

function fitViewToNodes(activeNodes: EntityNode[], positions: Record<string, Position>): ViewBox {
  if (activeNodes.length === 0) return { x: 0, y: 0, w: 1960, h: 1120 };

  const xs = activeNodes.map((node) => positions[node.id]?.x ?? 0);
  const ys = activeNodes.map((node) => positions[node.id]?.y ?? 0);
  const minX = Math.min(...xs) - 220;
  const maxX = Math.max(...xs) + 220;
  const minY = Math.min(...ys) - 160;
  const maxY = Math.max(...ys) + 160;

  return {
    x: minX,
    y: minY,
    w: Math.max(960, maxX - minX),
    h: Math.max(620, maxY - minY),
  };
}

function readSavedFilters() {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEYS.filters);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as {
      country: string;
      industry: string;
      risk: 'All' | RiskRating;
      exposure: ExposureFilter;
      currency: 'All' | EntityNode['currency'];
      relation: EdgeType | 'All';
      legal: 'All' | EntityNode['legalStatus'];
      collection: 'All' | EntityNode['collectionStatus'];
      funding: 'All' | EntityNode['fundingStatus'];
      bank: 'All' | string;
      strength: number;
    };
  } catch {
    return null;
  }
}

function haloColor(node: EntityNode): string {
  if (node.riskRating === 'High' && (node.legalStatus === 'Disputed' || node.collectionStatus === 'Overdue')) return '#ef4444';
  if (node.riskRating === 'High') return '#f97316';
  if (node.riskRating === 'Medium') return '#facc15';
  return '#22c55e';
}

function getModeNodeTypes(mode: VisualizationMode): Set<NodeType> | null {
  if (mode === 'Banking View') {
    return new Set(['Bank', 'Client', 'Facility', 'Guarantor', 'Collection Account', 'Document', 'SPV']);
  }
  if (mode === 'Legal View') {
    return new Set(['Legal Case', 'Court Matter', 'Document', 'Legal Counsel', 'Guarantor', 'Client', 'Facility', 'Trust']);
  }
  if (mode === 'Collections View') {
    return new Set(['Collection Account', 'Collection Agent', 'Client', 'Buyer', 'Seller', 'Facility', 'Bank', 'Invoice']);
  }
  if (mode === 'Ownership View') {
    return new Set(['Client', 'Parent Company', 'Subsidiary', 'Shareholder', 'Ultimate Beneficial Owner', 'Director', 'Trust', 'SPV']);
  }
  return null;
}

export default function RelationshipIntelligenceGraph({ nodes, edges, searchQuery }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rightPanelResizerRef = useRef<HTMLDivElement | null>(null);
  const [collapsedTypes, setCollapsedTypes] = useState<Record<NodeType, boolean>>(() => {
    return NODE_TYPES.reduce((acc, type) => {
      acc[type] = false;
      return acc;
    }, {} as Record<NodeType, boolean>);
  });

  const [mode, setMode] = useState<VisualizationMode>('Entity Focus');
  const [focusDepth, setFocusDepth] = useState(1);
  const [shortestPathTarget, setShortestPathTarget] = useState<string>('');
  const [riskOverlay, setRiskOverlay] = useState(true);
  const [hideIsolated, setHideIsolated] = useState(false);
  const [highlightCritical, setHighlightCritical] = useState(false);
  const [freezeLayout, setFreezeLayout] = useState(false);
  const [clusterByType, setClusterByType] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>(() => {
    if (typeof window === 'undefined') return 'Overview';
    const saved = window.localStorage.getItem(STORAGE_KEYS.inspectorTab) as InspectorTab | null;
    return saved ?? 'Overview';
  });
  const [hideLabels, setHideLabels] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEYS.hideLabels) === '1';
  });
  const [leftCollapsed, setLeftCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEYS.leftPanelCollapsed) === '1';
  });
  const [rightCollapsed, setRightCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEYS.rightPanelCollapsed) === '1';
  });
  const [rightPanelWidth, setRightPanelWidth] = useState(() => {
    if (typeof window === 'undefined') return 420;
    return Number(window.localStorage.getItem(STORAGE_KEYS.rightPanelWidth) ?? '420');
  });
  const [darkCanvas, setDarkCanvas] = useState(true);
  const [graphError, setGraphError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [favoriteSearches, setFavoriteSearches] = useState<string[]>([]);
  const [recentEntities, setRecentEntities] = useState<string[]>([]);
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchIndex, setSearchIndex] = useState(0);
  const [searchInput, setSearchInput] = useState(() => searchQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [sectionOpen, setSectionOpen] = useState<Record<string, boolean>>({
    profile: true,
    connections: true,
    actions: true,
  });

  const savedFilters = readSavedFilters();
  const [countryFilter, setCountryFilter] = useState(savedFilters?.country ?? 'All');
  const [industryFilter, setIndustryFilter] = useState(savedFilters?.industry ?? 'All');
  const [riskFilter, setRiskFilter] = useState<'All' | RiskRating>(savedFilters?.risk ?? 'All');
  const [exposureFilter, setExposureFilter] = useState<ExposureFilter>(savedFilters?.exposure ?? 'All');
  const [currencyFilter, setCurrencyFilter] = useState<'All' | EntityNode['currency']>(savedFilters?.currency ?? 'All');
  const [relationshipTypeFilter, setRelationshipTypeFilter] = useState<EdgeType | 'All'>(savedFilters?.relation ?? 'All');
  const [legalStatusFilter, setLegalStatusFilter] = useState<'All' | EntityNode['legalStatus']>(savedFilters?.legal ?? 'All');
  const [collectionStatusFilter, setCollectionStatusFilter] = useState<'All' | EntityNode['collectionStatus']>(savedFilters?.collection ?? 'All');
  const [fundingStatusFilter, setFundingStatusFilter] = useState<'All' | EntityNode['fundingStatus']>(savedFilters?.funding ?? 'All');
  const [bankFilter, setBankFilter] = useState<'All' | string>(savedFilters?.bank ?? 'All');
  const [minStrength, setMinStrength] = useState(savedFilters?.strength ?? 1);

  const [positions, setPositions] = useState<Record<string, Position>>(() => buildInitialPositions(nodes));
  const [viewBox, setViewBox] = useState<ViewBox>(() => {
    if (typeof window === 'undefined') return { x: 0, y: 0, w: 1960, h: 1120 };
    const raw = window.localStorage.getItem(STORAGE_KEYS.viewBox);
    if (!raw) return { x: 0, y: 0, w: 1960, h: 1120 };
    try {
      return JSON.parse(raw) as ViewBox;
    } catch {
      return { x: 0, y: 0, w: 1960, h: 1120 };
    }
  });
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return 'client-abc';
    return window.localStorage.getItem(STORAGE_KEYS.selectedId) ?? 'client-abc';
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const draggingNodeRef = useRef<string | null>(null);
  const dragAnchorRef = useRef<Position>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<Position>({ x: 0, y: 0 });
  const panViewRef = useRef<ViewBox>({ x: 0, y: 0, w: 1960, h: 1120 });

  const countries = useMemo(() => ['All', ...new Set(nodes.map((n) => n.country))], [nodes]);
  const industries = useMemo(() => ['All', ...new Set(nodes.map((n) => n.industry))], [nodes]);
  const banks = useMemo(() => ['All', ...nodes.filter((n) => n.type === 'Bank').map((n) => n.name)], [nodes]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 180);

    return () => window.clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEYS.viewBox, JSON.stringify(viewBox));
  }, [viewBox]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (selectedId) window.localStorage.setItem(STORAGE_KEYS.selectedId, selectedId);
  }, [selectedId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEYS.inspectorTab, inspectorTab);
  }, [inspectorTab]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEYS.rightPanelWidth, String(rightPanelWidth));
  }, [rightPanelWidth]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEYS.leftPanelCollapsed, leftCollapsed ? '1' : '0');
    window.localStorage.setItem(STORAGE_KEYS.rightPanelCollapsed, rightCollapsed ? '1' : '0');
    window.localStorage.setItem(STORAGE_KEYS.hideLabels, hideLabels ? '1' : '0');
    window.localStorage.setItem(STORAGE_KEYS.riskOverlay, riskOverlay ? '1' : '0');
  }, [leftCollapsed, rightCollapsed, hideLabels, riskOverlay]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      STORAGE_KEYS.filters,
      JSON.stringify({
        country: countryFilter,
        industry: industryFilter,
        risk: riskFilter,
        exposure: exposureFilter,
        currency: currencyFilter,
        relation: relationshipTypeFilter,
        legal: legalStatusFilter,
        collection: collectionStatusFilter,
        funding: fundingStatusFilter,
        bank: bankFilter,
        strength: minStrength,
      }),
    );
  }, [
    countryFilter,
    industryFilter,
    riskFilter,
    exposureFilter,
    currencyFilter,
    relationshipTypeFilter,
    legalStatusFilter,
    collectionStatusFilter,
    fundingStatusFilter,
    bankFilter,
    minStrength,
  ]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'f') {
        event.preventDefault();
        setSearchPanelOpen(true);
      }
      if (event.key === 'Escape') {
        setSearchPanelOpen(false);
      }
      if (event.key === '+') {
        event.preventDefault();
        setViewBox((prev) => ({ ...prev, w: prev.w * 0.9, h: prev.h * 0.9 }));
      }
      if (event.key === '-') {
        event.preventDefault();
        setViewBox((prev) => ({ ...prev, w: prev.w * 1.1, h: prev.h * 1.1 }));
      }
      if (event.key === '0') {
        event.preventDefault();
        setViewBox({ x: 0, y: 0, w: 1960, h: 1120 });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const resizer = rightPanelResizerRef.current;
    if (!resizer) return;

    const startDrag = (event: MouseEvent) => {
      event.preventDefault();
      const onMove = (moveEvent: MouseEvent) => {
        const viewportWidth = window.innerWidth;
        const next = Math.min(560, Math.max(320, viewportWidth - moveEvent.clientX - 24));
        setRightPanelWidth(next);
      };
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    };

    resizer.addEventListener('mousedown', startDrag);
    return () => resizer.removeEventListener('mousedown', startDrag);
  }, []);

  const adjacency = useMemo(() => {
    const map = new Map<string, string[]>();
    nodes.forEach((node) => map.set(node.id, []));
    edges.forEach((edge) => {
      map.get(edge.from)?.push(edge.to);
      map.get(edge.to)?.push(edge.from);
    });
    return map;
  }, [nodes, edges]);

  const filteredNodes = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const modeTypes = getModeNodeTypes(mode);

    return nodes.filter((node) => {
      if (collapsedTypes[node.type]) return false;
      if (modeTypes && !modeTypes.has(node.type)) return false;
      if (countryFilter !== 'All' && node.country !== countryFilter) return false;
      if (industryFilter !== 'All' && node.industry !== industryFilter) return false;
      if (riskFilter !== 'All' && node.riskRating !== riskFilter) return false;
      if (!inExposureRange(node.exposure, exposureFilter)) return false;
      if (currencyFilter !== 'All' && node.currency !== currencyFilter) return false;
      if (legalStatusFilter !== 'All' && node.legalStatus !== legalStatusFilter) return false;
      if (collectionStatusFilter !== 'All' && node.collectionStatus !== collectionStatusFilter) return false;
      if (fundingStatusFilter !== 'All' && node.fundingStatus !== fundingStatusFilter) return false;
      if (bankFilter !== 'All' && node.type === 'Bank' && node.name !== bankFilter) return false;

      if (mode === 'Exposure View' && node.exposure <= 0) return false;
      if (mode === 'AI Investigation') {
        const flagged = node.riskRating === 'High'
          || node.legalStatus === 'Disputed'
          || node.collectionStatus === 'Overdue'
          || node.relationshipScore < 66;
        if (!flagged) return false;
      }

      if (!q) return true;

      return [
        node.name,
        node.type,
        node.country,
        node.industry,
        node.currency,
        node.recentActivity,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [
    nodes,
    mode,
    collapsedTypes,
    countryFilter,
    industryFilter,
    riskFilter,
    exposureFilter,
    currencyFilter,
    legalStatusFilter,
    collectionStatusFilter,
    fundingStatusFilter,
    bankFilter,
    debouncedQuery,
  ]);

  const filteredIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  const baseEdges = useMemo(() => {
    return edges.filter((edge) => {
      if (!filteredIds.has(edge.from) || !filteredIds.has(edge.to)) return false;
      if (edge.strength < minStrength) return false;
      if (relationshipTypeFilter !== 'All' && edge.type !== relationshipTypeFilter) return false;
      if (mode === 'AI Investigation' && edge.type !== 'Related Party' && edge.type !== 'Family Relationship' && edge.type !== 'Guarantees') {
        return false;
      }
      return true;
    });
  }, [edges, filteredIds, minStrength, relationshipTypeFilter, mode]);

  const focusVisibleIds = useMemo(() => {
    if (mode !== 'Entity Focus' || !selectedId || !filteredIds.has(selectedId)) return filteredIds;

    const visited = new Set<string>([selectedId]);
    let frontier = new Set<string>([selectedId]);

    for (let level = 0; level < focusDepth; level += 1) {
      const next = new Set<string>();
      frontier.forEach((id) => {
        baseEdges.forEach((edge) => {
          if (edge.from === id && !visited.has(edge.to)) {
            next.add(edge.to);
            visited.add(edge.to);
          }
          if (edge.to === id && !visited.has(edge.from)) {
            next.add(edge.from);
            visited.add(edge.from);
          }
        });
      });
      frontier = next;
      if (frontier.size === 0) break;
    }

    return visited;
  }, [mode, selectedId, filteredIds, baseEdges, focusDepth]);

  const modeFilteredNodes = useMemo(() => {
    const ids = mode === 'Entity Focus' ? focusVisibleIds : filteredIds;
    return filteredNodes.filter((node) => ids.has(node.id));
  }, [mode, focusVisibleIds, filteredIds, filteredNodes]);

  const modeIds = useMemo(() => new Set(modeFilteredNodes.map((node) => node.id)), [modeFilteredNodes]);

  const modeEdges = useMemo(() => {
    let active = baseEdges.filter((edge) => modeIds.has(edge.from) && modeIds.has(edge.to));

    if (hideIsolated) {
      const connected = new Set<string>();
      active.forEach((edge) => {
        connected.add(edge.from);
        connected.add(edge.to);
      });
      active = active.filter((edge) => connected.has(edge.from) && connected.has(edge.to));
    }

    return active;
  }, [baseEdges, modeIds, hideIsolated]);

  const renderNodes = useMemo(() => {
    if (modeFilteredNodes.length <= 700) return modeFilteredNodes;
    return [...modeFilteredNodes]
      .sort((a, b) => b.exposure - a.exposure)
      .slice(0, 700);
  }, [modeFilteredNodes]);

  const renderIds = useMemo(() => new Set(renderNodes.map((n) => n.id)), [renderNodes]);
  const renderEdges = useMemo(() => modeEdges.filter((edge) => renderIds.has(edge.from) && renderIds.has(edge.to)), [modeEdges, renderIds]);

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedId) ?? null, [nodes, selectedId]);
  const hoveredNode = useMemo(() => nodes.find((n) => n.id === hoveredId) ?? null, [nodes, hoveredId]);

  const connections = useMemo(() => {
    if (!selectedNode) return [] as EntityNode[];
    const connectedIds = new Set<string>();
    renderEdges.forEach((edge) => {
      if (edge.from === selectedNode.id) connectedIds.add(edge.to);
      if (edge.to === selectedNode.id) connectedIds.add(edge.from);
    });
    return nodes.filter((node) => connectedIds.has(node.id));
  }, [selectedNode, renderEdges, nodes]);

  const neighborIds = useMemo(() => {
    if (!selectedId) return new Set<string>();
    const ids = new Set<string>([selectedId]);
    renderEdges.forEach((edge) => {
      if (edge.from === selectedId) ids.add(edge.to);
      if (edge.to === selectedId) ids.add(edge.from);
    });
    return ids;
  }, [selectedId, renderEdges]);

  const shouldShowLabel = (node: EntityNode): boolean => {
    if (hideLabels) return false;
    if (viewBox.w > 2300) return false;
    if (selectedId === node.id || hoveredId === node.id) return true;
    if (neighborIds.has(node.id)) return true;
    const point = positions[node.id];
    if (!point) return false;
    const centerX = viewBox.x + viewBox.w / 2;
    const centerY = viewBox.y + viewBox.h / 2;
    const distance = Math.hypot(point.x - centerX, point.y - centerY);
    return distance < Math.max(viewBox.w, viewBox.h) * 0.2;
  };

  const pathEdgeIds = useMemo(() => {
    if (!selectedId || !shortestPathTarget || selectedId === shortestPathTarget) return new Set<string>();

    const queue: string[] = [selectedId];
    const prev = new Map<string, string>();
    const visited = new Set<string>([selectedId]);

    while (queue.length > 0) {
      const current = queue.shift() as string;
      if (current === shortestPathTarget) break;

      (adjacency.get(current) ?? []).forEach((next) => {
        if (!modeIds.has(next) || visited.has(next)) return;
        visited.add(next);
        prev.set(next, current);
        queue.push(next);
      });
    }

    if (!visited.has(shortestPathTarget)) return new Set<string>();

    const nodePath = new Set<string>();
    let cursor = shortestPathTarget;
    nodePath.add(cursor);
    while (prev.has(cursor)) {
      cursor = prev.get(cursor) as string;
      nodePath.add(cursor);
    }

    const edgePath = new Set<string>();
    renderEdges.forEach((edge) => {
      if (nodePath.has(edge.from) && nodePath.has(edge.to)) edgePath.add(edge.id);
    });
    return edgePath;
  }, [selectedId, shortestPathTarget, adjacency, modeIds, renderEdges]);

  const timeline = useMemo(() => {
    if (!selectedNode) return [] as string[];
    return [
      `${selectedNode.name}: onboarding completed in ${selectedNode.country}`,
      `${selectedNode.name}: facility and credit profile linked to network`,
      `${selectedNode.name}: funding state now ${selectedNode.fundingStatus}`,
      `${selectedNode.name}: collection state ${selectedNode.collectionStatus}`,
      `${selectedNode.name}: legal state ${selectedNode.legalStatus}`,
      `${selectedNode.name}: guarantee dependencies refreshed`,
      `${selectedNode.name}: KYC and governance review checkpoint logged`,
      `${selectedNode.name}: board and ownership map update recorded`,
    ];
  }, [selectedNode]);

  const aiFindings = useMemo(() => {
    const highRisk = modeFilteredNodes.filter((node) => node.riskRating === 'High').length;
    const disputed = modeFilteredNodes.filter((node) => node.legalStatus === 'Disputed').length;
    const bankNodes = modeFilteredNodes.filter((node) => node.type === 'Bank').length;
    const sharedDirectorSignal = modeFilteredNodes.filter((node) => node.type === 'Director').length;

    return [
      `Hidden relationships detected in ${Math.max(1, Math.round(modeEdges.length * 0.08))} indirect paths.`,
      `Concentration risk elevated: ${highRisk} high-risk entities in active network view.`,
      `Shared directors linked across ${Math.max(sharedDirectorSignal - 1, 1)} ownership clusters.`,
      `Cross-default risk flagged around ${Math.max(disputed, 1)} disputed legal entities.`,
      `Bank dependency warning: ${bankNodes} banks support current filtered graph scope.`,
      `Related-party exposure edges detected in board and family relationship tracks.`,
      'Recommended action: diversify bank line concentration and prioritize legal clearance path.',
    ];
  }, [modeFilteredNodes, modeEdges]);

  const selectedProfile = useMemo(() => {
    if (!selectedNode) return null;
    const scoreBase = selectedNode.relationshipScore;
    const trustScore = Math.min(99, Math.max(42, scoreBase + (selectedNode.riskRating === 'Low' ? 8 : selectedNode.riskRating === 'Medium' ? 2 : -8)));
    const kycStatus = trustScore >= 80 ? 'Valid' : trustScore >= 65 ? 'Refresh Due' : 'Escalated';
    const amlStatus = selectedNode.riskRating === 'High' ? 'Enhanced Monitoring' : 'Clear';
    const sanctionsStatus = selectedNode.country === 'UK' || selectedNode.country === 'Singapore' ? 'No Match' : 'Screened';
    const pepStatus = selectedNode.type === 'Director' || selectedNode.type === 'Shareholder' ? 'Under Review' : 'No Match';

    return {
      trustScore,
      kycStatus,
      amlStatus,
      sanctionsStatus,
      pepStatus,
      activeSince: `${2018 + (selectedNode.name.length % 6)}-0${(selectedNode.name.length % 9) + 1}-15`,
      portfolioOwner: selectedNode.country === 'UAE' ? 'MENA Portfolio Office' : 'Cross Border Desk',
      relationshipManager: `RM-${(selectedNode.name.length * 7) % 31}`,
    };
  }, [selectedNode]);

  const exposureBreakdown = useMemo(() => {
    if (!selectedNode) return null;
    const current = selectedNode.exposure;
    const historical = Math.round(current * 1.22);
    const peak = Math.round(current * 1.38);
    const funded = Math.round(current * 0.66);
    const unfunded = current - funded;
    const expectedCollections = Math.round(selectedNode.outstandingCollections * 0.74);
    const availableLimit = Math.round(current * 0.52 + 1_200_000);
    const utilization = Math.min(100, Math.round((current / Math.max(current + availableLimit, 1)) * 100));
    const avgYield = (6.4 + (selectedNode.relationshipScore % 7) * 0.55).toFixed(2);
    const crossBorderExposure = Math.round(current * (selectedNode.country === 'UAE' ? 0.34 : 0.57));
    const concentration = Math.min(95, Math.round((selectedNode.connectedDeals + selectedNode.facilities) * 5 + 18));

    return {
      current,
      historical,
      peak,
      funded,
      unfunded,
      outstanding: selectedNode.outstandingCollections,
      expectedCollections,
      availableLimit,
      utilization,
      avgYield,
      largestFacility: `FAC-${selectedNode.name.slice(0, 3).toUpperCase()}-${selectedNode.facilities + 100}`,
      largestBuyer: connections.find((item) => item.type === 'Buyer')?.name ?? 'N/A',
      largestSeller: connections.find((item) => item.type === 'Seller')?.name ?? 'N/A',
      largestBank: connections.find((item) => item.type === 'Bank')?.name ?? 'N/A',
      currencyExposure: `${selectedNode.currency} ${Math.round(current * 0.71).toLocaleString('en-US')}`,
      crossBorderExposure,
      concentration,
      trend: [
        Math.round(current * 0.74),
        Math.round(current * 0.81),
        Math.round(current * 0.86),
        Math.round(current * 0.92),
        Math.round(current * 0.95),
        current,
      ],
      fundingVsCollections: {
        funding: funded,
        collections: expectedCollections,
      },
      byCurrency: [
        { label: selectedNode.currency, value: Math.round(current * 0.62) },
        { label: 'USD', value: Math.round(current * 0.24) },
        { label: 'EUR', value: Math.round(current * 0.14) },
      ],
      byCountry: [
        { label: selectedNode.country, value: Math.round(current * 0.58) },
        { label: 'UAE', value: Math.round(current * 0.23) },
        { label: 'Saudi Arabia', value: Math.round(current * 0.19) },
      ],
      byFacility: [
        { label: 'Facility A', value: Math.round(current * 0.42) },
        { label: 'Facility B', value: Math.round(current * 0.31) },
        { label: 'Facility C', value: Math.round(current * 0.27) },
      ],
    };
  }, [selectedNode, connections]);

  const facilitiesRows = useMemo(() => {
    if (!selectedNode || !exposureBreakdown) return [] as Array<{ facility: string; status: string; funding: number; outstanding: number; yield: string; risk: string; collections: number; maturity: string; rm: string }>;

    const rows = Math.max(3, Math.min(8, selectedNode.facilities + 2));
    return Array.from({ length: rows }, (_, idx) => ({
      facility: `${selectedNode.name.slice(0, 3).toUpperCase()}-FAC-${idx + 1}`,
      status: idx % 3 === 0 ? 'Active' : idx % 3 === 1 ? 'Monitoring' : 'Scheduled',
      funding: Math.round(exposureBreakdown.current * (0.12 + idx * 0.04)),
      outstanding: Math.round(exposureBreakdown.outstanding * (0.11 + idx * 0.07)),
      yield: `${(6.8 + idx * 0.45).toFixed(2)}%`,
      risk: idx === 0 && selectedNode.riskRating === 'High' ? 'High' : idx % 2 === 0 ? 'Medium' : 'Low',
      collections: Math.round(exposureBreakdown.expectedCollections * (0.16 + idx * 0.05)),
      maturity: `202${7 + (idx % 2)}-0${(idx % 9) + 1}-20`,
      rm: selectedProfile?.relationshipManager ?? 'RM-12',
    }));
  }, [selectedNode, exposureBreakdown, selectedProfile]);

  const collectionsMetrics = useMemo(() => {
    if (!selectedNode || !exposureBreakdown) return null;
    const dueToday = Math.round(exposureBreakdown.expectedCollections * 0.18);
    const overdue = Math.round(exposureBreakdown.outstanding * 0.37);
    const expectedWeek = Math.round(exposureBreakdown.expectedCollections * 0.61);
    const expectedMonth = Math.round(exposureBreakdown.expectedCollections * 2.24);
    const recovery = Math.min(99, Math.max(42, 68 + (selectedNode.relationshipScore % 17)));
    const dso = 28 + (selectedNode.name.length % 16);
    const promiseToPay = Math.max(1, Math.round(overdue / 900_000));
    const disputes = selectedNode.legalMatters;

    const ageing = [
      { label: 'Current', value: Math.round(exposureBreakdown.outstanding * 0.36), tone: 'bg-emerald-500' },
      { label: '30', value: Math.round(exposureBreakdown.outstanding * 0.22), tone: 'bg-cyan-500' },
      { label: '60', value: Math.round(exposureBreakdown.outstanding * 0.17), tone: 'bg-amber-500' },
      { label: '90', value: Math.round(exposureBreakdown.outstanding * 0.14), tone: 'bg-orange-500' },
      { label: '120+', value: Math.round(exposureBreakdown.outstanding * 0.11), tone: 'bg-rose-500' },
    ];

    return {
      invoicesOutstanding: Math.max(4, Math.round(selectedNode.documents * 1.6)),
      dueToday,
      overdue,
      expectedWeek,
      expectedMonth,
      recovery,
      dso,
      promiseToPay,
      disputes,
      ageing,
    };
  }, [selectedNode, exposureBreakdown]);

  const treasuryMetrics = useMemo(() => {
    if (!selectedNode || !exposureBreakdown) return null;
    return {
      fundingHistory: [
        `T-3: ${money(Math.round(exposureBreakdown.funded * 0.28), selectedNode.currency)} disbursed`,
        `T-2: ${money(Math.round(exposureBreakdown.funded * 0.24), selectedNode.currency)} disbursed`,
        `T-1: ${money(Math.round(exposureBreakdown.funded * 0.18), selectedNode.currency)} disbursed`,
      ],
      fundingQueue: Math.max(1, selectedNode.facilities),
      availableLimits: exposureBreakdown.availableLimit,
      utilization: exposureBreakdown.utilization,
      bankUsed: connections.find((item) => item.type === 'Bank')?.name ?? 'ADCB Institutional',
      settlementAccount: `SETT-${selectedNode.name.slice(0, 3).toUpperCase()}-01`,
      virtualIban: `AE47DNOS${selectedNode.name.slice(0, 2).toUpperCase()}004928`,
      upcomingFunding: Math.round(exposureBreakdown.unfunded * 0.46),
      cashflowForecast: Math.round(exposureBreakdown.expectedCollections - exposureBreakdown.unfunded * 0.22),
      liquidityImpact: selectedNode.riskRating === 'High' ? 'Moderate Negative' : 'Neutral Positive',
    };
  }, [selectedNode, exposureBreakdown, connections]);

  const legalMetrics = useMemo(() => {
    if (!selectedNode) return null;
    const completion = Math.min(100, Math.max(42, 78 + selectedNode.documents - selectedNode.legalMatters * 5));
    return {
      rpa: Math.max(1, Math.round(selectedNode.facilities * 0.8)),
      assignments: Math.max(1, selectedNode.facilities),
      guarantees: Math.max(1, selectedNode.banks),
      corporateGuarantees: Math.max(0, selectedNode.facilities - 1),
      personalGuarantees: selectedNode.type === 'Client' ? 1 : 0,
      powerOfAttorney: 1,
      securityAssignments: Math.max(1, selectedNode.facilities - 1),
      insurance: Math.max(1, Math.round(selectedNode.facilities * 0.7)),
      courtCases: selectedNode.legalStatus === 'Disputed' ? Math.max(1, selectedNode.legalMatters) : 0,
      disputes: selectedNode.legalMatters,
      legalOpinions: Math.max(1, Math.round(selectedNode.documents * 0.25)),
      missingDocuments: Math.max(0, 14 - selectedNode.documents),
      completion,
    };
  }, [selectedNode]);

  const riskMetrics = useMemo(() => {
    if (!selectedNode) return null;
    const base = selectedNode.riskRating === 'High' ? 78 : selectedNode.riskRating === 'Medium' ? 58 : 34;
    return {
      countryRisk: base + 5,
      industryRisk: base - 2,
      buyerRisk: base + 8,
      sellerRisk: base + 4,
      bankRisk: base - 6,
      concentrationRisk: base + 9,
      fraudRisk: base + 6,
      legalRisk: base + (selectedNode.legalStatus === 'Disputed' ? 12 : 3),
      operationalRisk: base + 2,
      esgRisk: base - 4,
      internalScore: selectedNode.relationshipScore,
      externalRating: selectedNode.riskRating === 'High' ? 'B+' : selectedNode.riskRating === 'Medium' ? 'BB' : 'A-',
      stressTest: selectedNode.riskRating === 'High' ? 'Fails mild downturn scenario' : 'Passes base stress scenario',
      policyBreaches: selectedNode.riskRating === 'High' ? 3 : selectedNode.riskRating === 'Medium' ? 1 : 0,
    };
  }, [selectedNode]);

  const documentsData = useMemo(() => {
    if (!selectedNode) return null;
    const rows = Math.max(5, Math.min(14, selectedNode.documents + 2));
    return {
      rows: Array.from({ length: rows }, (_, idx) => ({
        id: `DOC-${selectedNode.name.slice(0, 3).toUpperCase()}-${idx + 1}`,
        name: idx % 3 === 0 ? 'Receivables Purchase Agreement' : idx % 3 === 1 ? 'Guarantee Addendum' : 'KYC Package',
        status: idx % 4 === 0 ? 'Missing' : idx % 4 === 1 ? 'Pending Review' : idx % 4 === 2 ? 'Approved' : 'Expired',
        expiry: `202${7 + (idx % 2)}-1${idx % 2}-2${idx % 8}`,
      })),
    };
  }, [selectedNode]);

  const minimapBounds = useMemo(() => {
    if (renderNodes.length === 0) {
      return { minX: 0, minY: 0, maxX: 1960, maxY: 1120 };
    }

    const xs = renderNodes.map((node) => positions[node.id]?.x ?? 0);
    const ys = renderNodes.map((node) => positions[node.id]?.y ?? 0);

    return {
      minX: Math.min(...xs) - 60,
      minY: Math.min(...ys) - 60,
      maxX: Math.max(...xs) + 60,
      maxY: Math.max(...ys) + 60,
    };
  }, [renderNodes, positions]);

  const minimapScaleX = 220 / Math.max(minimapBounds.maxX - minimapBounds.minX, 1);
  const minimapScaleY = 120 / Math.max(minimapBounds.maxY - minimapBounds.minY, 1);

  const getPoint = (clientX: number, clientY: number): Position | null => {
    const svg = svgRef.current;
    if (!svg) return null;

    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;

    return {
      x: viewBox.x + ((clientX - rect.left) / rect.width) * viewBox.w,
      y: viewBox.y + ((clientY - rect.top) / rect.height) * viewBox.h,
    };
  };

  const onNodeDragStart = (nodeId: string, event: ReactMouseEvent<SVGGElement>) => {
    if (freezeLayout) return;
    event.stopPropagation();
    const point = getPoint(event.clientX, event.clientY);
    if (!point) return;
    draggingNodeRef.current = nodeId;
    dragAnchorRef.current = point;
    selectEntity(nodeId);
  };

  const onSvgMouseDown = (event: ReactMouseEvent<SVGSVGElement>) => {
    if (draggingNodeRef.current) return;
    setIsPanning(true);
    panStartRef.current = { x: event.clientX, y: event.clientY };
    panViewRef.current = viewBox;
  };

  const onSvgMouseMove = (event: ReactMouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;

    if (draggingNodeRef.current) {
      const point = getPoint(event.clientX, event.clientY);
      if (!point) return;
      const dx = point.x - dragAnchorRef.current.x;
      const dy = point.y - dragAnchorRef.current.y;
      dragAnchorRef.current = point;

      setPositions((prev) => {
        const activeId = draggingNodeRef.current;
        if (!activeId) return prev;
        const current = prev[activeId];
        if (!current) return prev;
        return {
          ...prev,
          [activeId]: {
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
        x: panViewRef.current.x - dx,
        y: panViewRef.current.y - dy,
        w: panViewRef.current.w,
        h: panViewRef.current.h,
      });
    }
  };

  const onSvgMouseUp = () => {
    draggingNodeRef.current = null;
    setIsPanning(false);
  };

  const onWheel = (event: ReactWheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const ratioX = (event.clientX - rect.left) / rect.width;
    const ratioY = (event.clientY - rect.top) / rect.height;
    const pivotX = viewBox.x + ratioX * viewBox.w;
    const pivotY = viewBox.y + ratioY * viewBox.h;

    const zoom = event.deltaY > 0 ? 1.08 : 0.92;
    const nextW = Math.min(3600, Math.max(640, viewBox.w * zoom));
    const nextH = Math.min(2200, Math.max(420, viewBox.h * zoom));

    setViewBox({
      x: pivotX - ratioX * nextW,
      y: pivotY - ratioY * nextH,
      w: nextW,
      h: nextH,
    });
  };

  const centerSelected = () => {
    if (!selectedNode) return;
    const point = positions[selectedNode.id];
    if (!point) return;

    setViewBox((prev) => ({
      x: point.x - prev.w / 2,
      y: point.y - prev.h / 2,
      w: prev.w,
      h: prev.h,
    }));
  };

  const autoArrange = () => {
    setPositions((prev) => {
      const targetNodes = clusterByType ? buildClusteredPositions(nodes) : buildInitialPositions(nodes);
      return { ...prev, ...targetNodes };
    });
  };

  const fitToScreen = () => {
    setViewBox(fitViewToNodes(renderNodes, positions));
  };

  const resetAllFilters = () => {
    setCountryFilter('All');
    setIndustryFilter('All');
    setRiskFilter('All');
    setExposureFilter('All');
    setCurrencyFilter('All');
    setRelationshipTypeFilter('All');
    setLegalStatusFilter('All');
    setCollectionStatusFilter('All');
    setFundingStatusFilter('All');
    setBankFilter('All');
    setMinStrength(1);
    setCollapsedTypes(
      NODE_TYPES.reduce((acc, type) => {
        acc[type] = false;
        return acc;
      }, {} as Record<NodeType, boolean>),
    );
  };

  const clearAllTypes = () => {
    setCollapsedTypes(
      NODE_TYPES.reduce((acc, type) => {
        acc[type] = true;
        return acc;
      }, {} as Record<NodeType, boolean>),
    );
  };

  const selectAllTypes = () => {
    setCollapsedTypes(
      NODE_TYPES.reduce((acc, type) => {
        acc[type] = false;
        return acc;
      }, {} as Record<NodeType, boolean>),
    );
  };

  const selectEntity = (id: string | null) => {
    setSelectedId(id);
    if (!id) return;
    const match = nodes.find((node) => node.id === id);
    if (!match) return;
    const point = positions[id];
    if (point) {
      setViewBox((prev) => ({
        ...prev,
        x: point.x - prev.w / 2,
        y: point.y - prev.h / 2,
      }));
    }
    setRecentEntities((prev) => [match.name, ...prev.filter((name) => name !== match.name)].slice(0, 8));
  };

  const criticalIds = useMemo(() => {
    return new Set(
      modeFilteredNodes
        .filter((node) => node.riskRating === 'High' || node.legalStatus === 'Disputed' || node.collectionStatus === 'Overdue')
        .map((node) => node.id),
    );
  }, [modeFilteredNodes]);

  return (
    <div ref={containerRef} className="grid gap-4 xl:grid-cols-[auto_1fr_auto]">
      <div className={`${leftCollapsed ? 'w-[56px]' : 'w-full xl:w-[320px]'} space-y-4 transition-all duration-200`}>
        <button
          type="button"
          onClick={() => setLeftCollapsed((prev) => !prev)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-300"
          aria-label="Toggle left filter panel"
        >
          {leftCollapsed ? 'Open Filters' : 'Collapse Filters'}
        </button>

        {!leftCollapsed && (
        <>
        <SectionCard title="Visualization Modes" iconKey="network">
          <div className="grid gap-2">
            {VISUALIZATION_MODES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMode(item);
                  if (item !== 'Entity Focus') setFocusDepth(2);
                }}
                className={`rounded-lg px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide ${
                  mode === item
                    ? 'border border-cyan-700/40 bg-cyan-950/30 text-cyan-200'
                    : 'border border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-700/30'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Left Filter Panel" iconKey="network">
          <div className="space-y-3 text-sm">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">Entity Type</p>
              <div className="grid gap-1">
                {NODE_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={!collapsedTypes[type]}
                      onChange={() => {
                        setCollapsedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
                      }}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-500"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-slate-200" value={countryFilter} onChange={(event) => setCountryFilter(event.target.value)}>
              {countries.map((country) => <option key={country} value={country}>{country}</option>)}
            </select>

            <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-slate-200" value={industryFilter} onChange={(event) => setIndustryFilter(event.target.value)}>
              {industries.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
            </select>

            <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-slate-200" value={riskFilter} onChange={(event) => setRiskFilter(event.target.value as 'All' | RiskRating)}>
              <option value="All">All Risk Ratings</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-slate-200" value={exposureFilter} onChange={(event) => setExposureFilter(event.target.value as ExposureFilter)}>
              <option value="All">All Exposure</option>
              <option value="0-1M">0-1M</option>
              <option value="1M-5M">1M-5M</option>
              <option value="5M+">5M+</option>
            </select>

            <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-slate-200" value={currencyFilter} onChange={(event) => setCurrencyFilter(event.target.value as 'All' | EntityNode['currency'])}>
              <option value="All">All Currency</option>
              <option value="AED">AED</option>
              <option value="USD">USD</option>
              <option value="SAR">SAR</option>
              <option value="QAR">QAR</option>
            </select>

            <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-slate-200" value={relationshipTypeFilter} onChange={(event) => setRelationshipTypeFilter(event.target.value as EdgeType | 'All')}>
              <option value="All">All Relationship Types</option>
              {EDGE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>

            <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-slate-200" value={legalStatusFilter} onChange={(event) => setLegalStatusFilter(event.target.value as 'All' | EntityNode['legalStatus'])}>
              <option value="All">All Legal Status</option>
              <option value="Clear">Clear</option>
              <option value="Pending">Pending</option>
              <option value="Disputed">Disputed</option>
            </select>

            <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-slate-200" value={collectionStatusFilter} onChange={(event) => setCollectionStatusFilter(event.target.value as 'All' | EntityNode['collectionStatus'])}>
              <option value="All">All Collection Status</option>
              <option value="Current">Current</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Overdue">Overdue</option>
            </select>

            <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-slate-200" value={fundingStatusFilter} onChange={(event) => setFundingStatusFilter(event.target.value as 'All' | EntityNode['fundingStatus'])}>
              <option value="All">All Funding Status</option>
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Paused">Paused</option>
            </select>

            <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-slate-200" value={bankFilter} onChange={(event) => setBankFilter(event.target.value)}>
              {banks.map((bank) => <option key={bank} value={bank}>{bank === 'All' ? 'All Banks' : bank}</option>)}
            </select>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Relationship Strength</p>
              <input type="range" min={1} max={5} value={minStrength} onChange={(event) => setMinStrength(Number(event.target.value))} className="w-full" />
              <p className="text-xs text-slate-400">Min strength: {minStrength}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button type="button" onClick={selectAllTypes} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300">Select All</button>
              <button type="button" onClick={clearAllTypes} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300">Clear All</button>
              <button type="button" onClick={resetAllFilters} className="rounded border border-cyan-700/40 bg-cyan-950/20 px-2 py-1 text-xs text-cyan-200">Reset</button>
            </div>
          </div>
        </SectionCard>
        </>
        )}
      </div>

      <div className="space-y-4">
        <SectionCard title="Interactive Force Relationship Graph" iconKey="network">
          <div className="sticky top-0 z-20 mb-3 rounded-lg border border-slate-700 bg-slate-950/90 p-2 backdrop-blur">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
              <button type="button" onClick={autoArrange} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300">Auto Arrange</button>
              <button type="button" onClick={fitToScreen} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300">Fit to Screen</button>
              <button type="button" onClick={centerSelected} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300">Center Selected</button>
              <button type="button" onClick={() => setHideIsolated((prev) => !prev)} className={`rounded border px-2 py-1 ${hideIsolated ? 'border-cyan-700/40 bg-cyan-950/30 text-cyan-200' : 'border-slate-700 bg-slate-900 text-slate-300'}`}>Hide Isolated</button>
              <button type="button" onClick={() => setHighlightCritical((prev) => !prev)} className={`rounded border px-2 py-1 ${highlightCritical ? 'border-rose-700/40 bg-rose-950/30 text-rose-200' : 'border-slate-700 bg-slate-900 text-slate-300'}`}>Critical</button>
              <button type="button" onClick={() => setRiskOverlay((prev) => !prev)} className={`rounded border px-2 py-1 ${riskOverlay ? 'border-cyan-700/40 bg-cyan-950/30 text-cyan-200' : 'border-slate-700 bg-slate-900 text-slate-300'}`}>Risk Overlay</button>
              <button type="button" onClick={() => setHideLabels((prev) => !prev)} className={`rounded border px-2 py-1 ${hideLabels ? 'border-amber-700/40 bg-amber-950/30 text-amber-200' : 'border-slate-700 bg-slate-900 text-slate-300'}`}>Labels</button>
              <button type="button" onClick={() => setFreezeLayout((prev) => !prev)} className={`rounded border px-2 py-1 ${freezeLayout ? 'border-amber-700/40 bg-amber-950/30 text-amber-200' : 'border-slate-700 bg-slate-900 text-slate-300'}`}>Freeze</button>
              <button type="button" onClick={() => setClusterByType((prev) => !prev)} className={`rounded border px-2 py-1 ${clusterByType ? 'border-fuchsia-700/40 bg-fuchsia-950/30 text-fuchsia-200' : 'border-slate-700 bg-slate-900 text-slate-300'}`}>Cluster</button>
              <button type="button" onClick={() => setDarkCanvas((prev) => !prev)} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300">Canvas</button>
              <span className="ml-auto rounded border border-cyan-700/40 bg-cyan-950/20 px-2 py-1 text-cyan-200">Rendered: {renderNodes.length}/{modeFilteredNodes.length}</span>
            </div>

            <div className="grid gap-2 md:grid-cols-[1fr_auto]">
              <div>
                <label htmlFor="rel-search" className="sr-only">Search entities</label>
                <input
                  id="rel-search"
                  value={searchInput}
                  onFocus={() => setSearchPanelOpen(true)}
                  onChange={(event) => {
                    setSearchInput(event.target.value);
                    setSearchPanelOpen(true);
                    setSearchIndex(0);
                  }}
                  onKeyDown={(event) => {
                    const maxIndex = Math.max(0, renderNodes.length - 1);
                    if (event.key === 'ArrowDown') {
                      event.preventDefault();
                      setSearchIndex((prev) => Math.min(maxIndex, prev + 1));
                    }
                    if (event.key === 'ArrowUp') {
                      event.preventDefault();
                      setSearchIndex((prev) => Math.max(0, prev - 1));
                    }
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      const hit = renderNodes[searchIndex];
                      if (hit) {
                        selectEntity(hit.id);
                        setSearchHistory((prev) => [hit.name, ...prev.filter((name) => name !== hit.name)].slice(0, 8));
                        setSearchPanelOpen(false);
                      }
                    }
                    if (event.key === 'Escape') {
                      setSearchPanelOpen(false);
                    }
                  }}
                  placeholder="Search node, type, country, or use Ctrl/Cmd+F"
                  className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-200"
                />
                {searchPanelOpen && (
                  <div className="mt-1 max-h-48 overflow-y-auto rounded border border-slate-700 bg-slate-950 p-1 text-xs">
                    {renderNodes.slice(0, 8).map((node, idx) => (
                      <div
                        key={node.id}
                        className={`mb-1 flex items-center justify-between rounded px-2 py-1 ${idx === searchIndex ? 'bg-cyan-950/40 text-cyan-100' : 'text-slate-300 hover:bg-slate-900'}`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            selectEntity(node.id);
                            setSearchHistory((prev) => [node.name, ...prev.filter((name) => name !== node.name)].slice(0, 8));
                            setSearchPanelOpen(false);
                          }}
                          className="flex-1 text-left"
                        >
                          <span>{node.name}</span>
                          <span className="ml-2 text-[10px] text-slate-500">{node.type}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFavoriteSearches((prev) =>
                              prev.includes(node.name) ? prev.filter((item) => item !== node.name) : [node.name, ...prev].slice(0, 8),
                            );
                          }}
                          className="rounded border border-slate-700 px-1 text-[10px]"
                        >
                          {favoriteSearches.includes(node.name) ? 'Unsave' : 'Save'}
                        </button>
                      </div>
                    ))}
                    {renderNodes.length === 0 && <p className="px-2 py-1 text-slate-500">No matching entities.</p>}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-start gap-2 text-xs">
                <select
                  id="shortestPath"
                  value={shortestPathTarget}
                  onChange={(event) => setShortestPathTarget(event.target.value)}
                  className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-200"
                >
                  <option value="">Shortest Path Target</option>
                  {renderNodes.slice(0, 200).map((node) => (
                    <option key={node.id} value={node.id}>{node.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {(searchHistory.length > 0 || favoriteSearches.length > 0 || recentEntities.length > 0) && (
              <div className="mt-2 grid gap-2 text-[11px] text-slate-400 lg:grid-cols-3">
                <p>History: {searchHistory.slice(0, 4).join(' | ') || 'None'}</p>
                <p>Favorites: {favoriteSearches.slice(0, 4).join(' | ') || 'None'}</p>
                <p>Recent: {recentEntities.slice(0, 4).join(' | ') || 'None'}</p>
              </div>
            )}
          </div>

          {graphError && (
            <div className="mb-3 flex items-center justify-between rounded-lg border border-rose-800/40 bg-rose-950/20 px-3 py-2 text-xs text-rose-100">
              <p>{graphError}</p>
              <button type="button" onClick={() => setGraphError(null)} className="rounded border border-rose-700/60 px-2 py-0.5">Dismiss</button>
            </div>
          )}

          {hoveredNode && (
            <div className="mb-3 rounded-lg border border-cyan-900/40 bg-cyan-950/20 px-3 py-2 text-xs text-cyan-100">
              {hoveredNode.name} | {hoveredNode.type} | {hoveredNode.country} | Exposure {money(hoveredNode.exposure, hoveredNode.currency)}
            </div>
          )}

          <div className="relative h-[700px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70">
            <svg
              ref={svgRef}
              viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
              className="h-full w-full"
              onMouseDown={onSvgMouseDown}
              onMouseMove={onSvgMouseMove}
              onMouseUp={onSvgMouseUp}
              onMouseLeave={onSvgMouseUp}
              onWheel={onWheel}
            >
              <defs>
                <marker id="relArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" viewBox="0 0 8 8">
                  <path d="M0,0 L8,4 L0,8 z" fill="#64748b" />
                </marker>
              </defs>
              <rect x={viewBox.x} y={viewBox.y} width={viewBox.w} height={viewBox.h} fill={darkCanvas ? '#020617' : '#0f172a'} />

              {renderEdges.map((edge, edgeIndex) => {
                const source = positions[edge.from];
                const target = positions[edge.to];
                if (!source || !target) return null;
                const mx = (source.x + target.x) / 2;
                const my = (source.y + target.y) / 2;
                const highlightPath = pathEdgeIds.has(edge.id);
                const highlightCriticalEdge = highlightCritical && (criticalIds.has(edge.from) || criticalIds.has(edge.to));
                const neighborEdge = !selectedId || edge.from === selectedId || edge.to === selectedId || (neighborIds.has(edge.from) && neighborIds.has(edge.to));
                const offset = ((edgeIndex % 5) - 2) * 8;
                const dx = target.x - source.x;
                const dy = target.y - source.y;
                const length = Math.max(Math.hypot(dx, dy), 1);
                const nx = -dy / length;
                const ny = dx / length;
                const cx = mx + nx * offset;
                const cy = my + ny * offset;

                return (
                  <g key={edge.id}>
                    <path
                      d={`M ${source.x} ${source.y} Q ${cx} ${cy} ${target.x} ${target.y}`}
                      stroke={highlightPath ? '#e2e8f0' : highlightCriticalEdge ? '#fb7185' : EDGE_COLORS[edge.type]}
                      strokeWidth={highlightPath ? 3.6 : 1.2 + edge.strength * 0.4}
                      strokeDasharray={edgeDash(edge.type)}
                      markerEnd="url(#relArrow)"
                      strokeOpacity={highlightPath ? 1 : neighborEdge ? (mode === 'Exposure View' ? 0.68 : 0.9) : 0.14}
                      fill="none"
                    />
                    {(viewBox.w < 2100 || highlightPath) && (
                      <text x={mx} y={my - 4} textAnchor="middle" fill="#94a3b8" fontSize={10} opacity={neighborEdge ? 0.95 : 0.35}>{edge.type}</text>
                    )}
                  </g>
                );
              })}

              {renderNodes.map((node) => {
                const position = positions[node.id];
                if (!position) return null;
                const radius = nodeRadius(node.type);
                const isSelected = selectedId === node.id;
                const isCritical = criticalIds.has(node.id);
                const nearSelection = !selectedId || neighborIds.has(node.id);

                return (
                  <g
                    key={node.id}
                    onMouseDown={(event) => onNodeDragStart(node.id, event)}
                    onMouseEnter={() => setHoveredId(node.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => {
                      selectEntity(node.id);
                      if (mode === 'Entity Focus') setFocusDepth(1);
                    }}
                    className="cursor-pointer"
                  >
                    {riskOverlay && (
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r={radius + 7}
                        fill={haloColor(node)}
                        fillOpacity={0.2}
                        stroke="none"
                      />
                    )}
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r={isSelected ? radius + 3 : radius}
                      fill={isSelected ? '#f8fafc' : NODE_COLORS[node.type]}
                      fillOpacity={nearSelection ? 0.92 : 0.2}
                      stroke={highlightCritical && isCritical ? '#fb7185' : isSelected ? '#0ea5e9' : '#0f172a'}
                      strokeWidth={highlightCritical && isCritical ? 3 : isSelected ? 3 : 2}
                    />
                    {shouldShowLabel(node) && (
                      <text x={position.x} y={position.y + radius + 12} textAnchor="middle" fill="#e2e8f0" fontSize={10} opacity={nearSelection ? 1 : 0.4}>{node.name}</text>
                    )}
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-3 right-3 rounded-lg border border-slate-700 bg-slate-900/90 p-2">
              <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">Minimap Navigator</p>
              <svg
                viewBox="0 0 220 120"
                className="h-[120px] w-[220px] rounded border border-slate-800 bg-slate-950"
                onClick={(event) => {
                  const rect = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
                  const x = (event.clientX - rect.left) / rect.width;
                  const y = (event.clientY - rect.top) / rect.height;
                  const worldX = minimapBounds.minX + x * (minimapBounds.maxX - minimapBounds.minX);
                  const worldY = minimapBounds.minY + y * (minimapBounds.maxY - minimapBounds.minY);
                  setViewBox((prev) => ({ x: worldX - prev.w / 2, y: worldY - prev.h / 2, w: prev.w, h: prev.h }));
                }}
              >
                <rect x={0} y={0} width={220} height={120} fill="#020617" />
                {renderEdges.map((edge) => {
                  const source = positions[edge.from];
                  const target = positions[edge.to];
                  if (!source || !target) return null;
                  return (
                    <line
                      key={edge.id}
                      x1={(source.x - minimapBounds.minX) * minimapScaleX}
                      y1={(source.y - minimapBounds.minY) * minimapScaleY}
                      x2={(target.x - minimapBounds.minX) * minimapScaleX}
                      y2={(target.y - minimapBounds.minY) * minimapScaleY}
                      stroke="#334155"
                      strokeWidth={0.8}
                    />
                  );
                })}
                {renderNodes.map((node) => {
                  const point = positions[node.id];
                  if (!point) return null;
                  return (
                    <circle
                      key={node.id}
                      cx={(point.x - minimapBounds.minX) * minimapScaleX}
                      cy={(point.y - minimapBounds.minY) * minimapScaleY}
                      r={1.5}
                      fill={NODE_COLORS[node.type]}
                    />
                  );
                })}
                <rect
                  x={(viewBox.x - minimapBounds.minX) * minimapScaleX}
                  y={(viewBox.y - minimapBounds.minY) * minimapScaleY}
                  width={viewBox.w * minimapScaleX}
                  height={viewBox.h * minimapScaleY}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth={1.2}
                />
              </svg>
            </div>

            {renderNodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70">
                <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300">
                  No entities match the current filters. Reset filters or broaden search.
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {NODE_TYPES.slice(0, 12).map((type) => (
              <div key={type} className="inline-flex items-center gap-2 rounded border border-slate-800 bg-slate-950/70 px-2 py-1 text-xs text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: NODE_COLORS[type] }} />
                {type}
                <button type="button" onClick={() => setCollapsedTypes((prev) => ({ ...prev, [type]: !prev[type] }))} className="ml-auto rounded border border-slate-700 px-1 text-[10px] text-slate-400">
                  {collapsedTypes[type] ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid gap-4 xl:grid-cols-2">
          <SectionCard title="Relationship Timeline" iconKey="route">
            <div className="space-y-2 text-xs text-slate-300">
              {timeline.map((item) => (
                <div key={item} className="rounded-lg border border-slate-800 bg-slate-950/70 p-2">{item}</div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="AI Findings" iconKey="sparkles">
            <div className="space-y-2 text-xs">
              {aiFindings.map((item) => (
                <div key={item} className="rounded-lg border border-cyan-900/30 bg-cyan-950/15 p-2 text-cyan-100">{item}</div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="relative space-y-4" style={{ width: rightCollapsed ? 56 : rightPanelWidth }}>
        <button
          type="button"
          onClick={() => setRightCollapsed((prev) => !prev)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-300"
          aria-label="Toggle right inspector panel"
        >
          {rightCollapsed ? 'Open Inspector' : 'Collapse Inspector'}
        </button>

        {!rightCollapsed && (
        <>
        <div ref={rightPanelResizerRef} className="absolute -left-2 top-16 h-[70%] w-1.5 cursor-col-resize rounded bg-slate-700/60" aria-hidden />
        <SectionCard title="Entity Inspector" iconKey="network">
          {!selectedNode && <p className="text-sm text-slate-400">Select a node to inspect relationship intelligence.</p>}

          {selectedNode && (
            <div className="space-y-3 text-sm text-slate-200">
              {sectionOpen.profile && (
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-base font-semibold text-slate-100">{selectedNode.name}</p>
                <p className="text-xs text-slate-400">{selectedNode.type}</p>
              </div>
              )}

              <div className="flex gap-2 text-[10px] uppercase tracking-wide">
                <button type="button" onClick={() => setSectionOpen((prev) => ({ ...prev, profile: !prev.profile }))} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300">Profile</button>
                <button type="button" onClick={() => setSectionOpen((prev) => ({ ...prev, connections: !prev.connections }))} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300">Connections</button>
                <button type="button" onClick={() => setSectionOpen((prev) => ({ ...prev, actions: !prev.actions }))} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300">Actions</button>
              </div>

              <div className="grid gap-1 sm:grid-cols-3">
                {INSPECTOR_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setInspectorTab(tab)}
                    className={`rounded px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide ${
                      inspectorTab === tab
                        ? 'border border-cyan-700/40 bg-cyan-950/30 text-cyan-200'
                        : 'border border-slate-700 bg-slate-900 text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {inspectorTab === 'Overview' && selectedProfile && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Entity Name</p><p>{selectedNode.name}</p></div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Entity Type</p><p>{selectedNode.type}</p></div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Country</p><p>{selectedNode.country}</p></div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Industry</p><p>{selectedNode.industry}</p></div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Risk Rating</p><p>{selectedNode.riskRating}</p></div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Trust Score</p><p>{selectedProfile.trustScore}/100</p></div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Relationship Score</p><p>{selectedNode.relationshipScore}/100</p></div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">KYC Status</p><p>{selectedProfile.kycStatus}</p></div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">AML Status</p><p>{selectedProfile.amlStatus}</p></div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Sanctions Status</p><p>{selectedProfile.sanctionsStatus}</p></div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">PEP Status</p><p>{selectedProfile.pepStatus}</p></div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Active Since</p><p>{selectedProfile.activeSince}</p></div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Portfolio Owner</p><p>{selectedProfile.portfolioOwner}</p></div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Relationship Manager</p><p>{selectedProfile.relationshipManager}</p></div>
                </div>
              )}

              {inspectorTab === 'Exposure' && exposureBreakdown && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Current Exposure</p><p>{money(exposureBreakdown.current, selectedNode.currency)}</p></div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Historical Exposure</p><p>{money(exposureBreakdown.historical, selectedNode.currency)}</p></div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Peak Exposure</p><p>{money(exposureBreakdown.peak, selectedNode.currency)}</p></div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Funded Exposure</p><p>{money(exposureBreakdown.funded, selectedNode.currency)}</p></div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Unfunded Exposure</p><p>{money(exposureBreakdown.unfunded, selectedNode.currency)}</p></div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Outstanding Collections</p><p>{money(exposureBreakdown.outstanding, selectedNode.currency)}</p></div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Expected Collections</p><p>{money(exposureBreakdown.expectedCollections, selectedNode.currency)}</p></div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Available Limit</p><p>{money(exposureBreakdown.availableLimit, selectedNode.currency)}</p></div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Utilization %</p><p>{exposureBreakdown.utilization}%</p></div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Average Yield</p><p>{exposureBreakdown.avgYield}%</p></div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Largest Facility</p><p>{exposureBreakdown.largestFacility}</p></div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Largest Buyer</p><p>{exposureBreakdown.largestBuyer}</p></div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Largest Seller</p><p>{exposureBreakdown.largestSeller}</p></div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Largest Bank</p><p>{exposureBreakdown.largestBank}</p></div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Currency Exposure</p><p>{exposureBreakdown.currencyExposure}</p></div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Cross Border Exposure</p><p>{money(exposureBreakdown.crossBorderExposure, selectedNode.currency)}</p></div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Concentration %</p><p>{exposureBreakdown.concentration}%</p></div>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2">
                    <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">Exposure Trend Chart</p>
                    <div className="flex h-16 items-end gap-1">
                      {exposureBreakdown.trend.map((value, idx) => (
                        <div key={`${value}-${idx}`} className="flex-1 rounded-t bg-cyan-500/70" style={{ height: `${Math.max(16, Math.round((value / Math.max(...exposureBreakdown.trend)) * 100))}%` }} />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Funding vs Collections</p><p>Funding {money(exposureBreakdown.fundingVsCollections.funding, selectedNode.currency)} | Collections {money(exposureBreakdown.fundingVsCollections.collections, selectedNode.currency)}</p></div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Exposure by Currency</p><p>{exposureBreakdown.byCurrency.map((item) => `${item.label} ${money(item.value, selectedNode.currency)}`).join(' | ')}</p></div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Exposure by Country</p><p>{exposureBreakdown.byCountry.map((item) => `${item.label} ${money(item.value, selectedNode.currency)}`).join(' | ')}</p></div>
                    <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2"><p className="text-[10px] uppercase text-slate-500">Exposure by Facility</p><p>{exposureBreakdown.byFacility.map((item) => `${item.label} ${money(item.value, selectedNode.currency)}`).join(' | ')}</p></div>
                  </div>
                </div>
              )}

              {inspectorTab === 'Facilities' && (
                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/70">
                  <table className="min-w-full text-xs text-slate-200">
                    <thead className="bg-slate-900 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      <tr>
                        <th className="px-2 py-2 text-left">Facility</th>
                        <th className="px-2 py-2 text-left">Status</th>
                        <th className="px-2 py-2 text-left">Funding</th>
                        <th className="px-2 py-2 text-left">Outstanding</th>
                        <th className="px-2 py-2 text-left">Yield</th>
                        <th className="px-2 py-2 text-left">Risk</th>
                        <th className="px-2 py-2 text-left">Collections</th>
                        <th className="px-2 py-2 text-left">Maturity</th>
                        <th className="px-2 py-2 text-left">RM</th>
                        <th className="px-2 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facilitiesRows.map((row) => (
                        <tr key={row.facility} className="border-t border-slate-800">
                          <td className="px-2 py-2">{row.facility}</td>
                          <td className="px-2 py-2">{row.status}</td>
                          <td className="px-2 py-2">{money(row.funding, selectedNode.currency)}</td>
                          <td className="px-2 py-2">{money(row.outstanding, selectedNode.currency)}</td>
                          <td className="px-2 py-2">{row.yield}</td>
                          <td className="px-2 py-2">{row.risk}</td>
                          <td className="px-2 py-2">{money(row.collections, selectedNode.currency)}</td>
                          <td className="px-2 py-2">{row.maturity}</td>
                          <td className="px-2 py-2">{row.rm}</td>
                          <td className="px-2 py-2"><a href="/atlas/deals" className="rounded border border-slate-700 bg-slate-900 px-2 py-1">Open Deal</a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {inspectorTab === 'Collections' && collectionsMetrics && (
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Invoices Outstanding: {collectionsMetrics.invoicesOutstanding}</div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Collections Due Today: {money(collectionsMetrics.dueToday, selectedNode.currency)}</div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Overdue: {money(collectionsMetrics.overdue, selectedNode.currency)}</div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Expected This Week: {money(collectionsMetrics.expectedWeek, selectedNode.currency)}</div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Expected This Month: {money(collectionsMetrics.expectedMonth, selectedNode.currency)}</div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Recovery %: {collectionsMetrics.recovery}%</div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2">DSO: {collectionsMetrics.dso}</div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Promise To Pay: {collectionsMetrics.promiseToPay}</div>
                    <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Disputes: {collectionsMetrics.disputes}</div>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-2">
                    <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">Ageing Buckets</p>
                    <div className="space-y-1">
                      {collectionsMetrics.ageing.map((bucket) => (
                        <div key={bucket.label}>
                          <div className="mb-0.5 flex justify-between text-[11px] text-slate-300"><span>{bucket.label}</span><span>{money(bucket.value, selectedNode.currency)}</span></div>
                          <div className="h-2 rounded bg-slate-800"><div className={`h-2 rounded ${bucket.tone}`} style={{ width: `${Math.round((bucket.value / Math.max(collectionsMetrics.overdue, 1)) * 100)}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {inspectorTab === 'Treasury' && treasuryMetrics && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2 col-span-2"><p className="text-[10px] uppercase text-slate-500">Funding History</p><p>{treasuryMetrics.fundingHistory.join(' | ')}</p></div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Funding Queue: {treasuryMetrics.fundingQueue}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Available Limits: {money(treasuryMetrics.availableLimits, selectedNode.currency)}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Utilization: {treasuryMetrics.utilization}%</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Bank Used: {treasuryMetrics.bankUsed}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Settlement Account: {treasuryMetrics.settlementAccount}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Virtual IBAN: {treasuryMetrics.virtualIban}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Upcoming Funding: {money(treasuryMetrics.upcomingFunding, selectedNode.currency)}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Cashflow Forecast: {money(treasuryMetrics.cashflowForecast, selectedNode.currency)}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Liquidity Impact: {treasuryMetrics.liquidityImpact}</div>
                </div>
              )}

              {inspectorTab === 'Legal' && legalMetrics && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Receivables Purchase Agreements: {legalMetrics.rpa}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Assignments: {legalMetrics.assignments}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Guarantees: {legalMetrics.guarantees}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Corporate Guarantees: {legalMetrics.corporateGuarantees}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Personal Guarantees: {legalMetrics.personalGuarantees}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Power of Attorney: {legalMetrics.powerOfAttorney}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Security Assignments: {legalMetrics.securityAssignments}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Insurance: {legalMetrics.insurance}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Court Cases: {legalMetrics.courtCases}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Disputes: {legalMetrics.disputes}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Legal Opinions: {legalMetrics.legalOpinions}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Missing Documents: {legalMetrics.missingDocuments}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2 col-span-2">Document Completion %: {legalMetrics.completion}%</div>
                </div>
              )}

              {inspectorTab === 'Risk' && riskMetrics && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Country Risk: {riskMetrics.countryRisk}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Industry Risk: {riskMetrics.industryRisk}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Buyer Risk: {riskMetrics.buyerRisk}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Seller Risk: {riskMetrics.sellerRisk}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Bank Risk: {riskMetrics.bankRisk}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Concentration Risk: {riskMetrics.concentrationRisk}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Fraud Risk: {riskMetrics.fraudRisk}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Legal Risk: {riskMetrics.legalRisk}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Operational Risk: {riskMetrics.operationalRisk}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">ESG Risk: {riskMetrics.esgRisk}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Internal Score: {riskMetrics.internalScore}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">External Rating: {riskMetrics.externalRating}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Stress Test: {riskMetrics.stressTest}</div>
                  <div className="rounded border border-slate-800 bg-slate-950/70 p-2">Policy Breaches: {riskMetrics.policyBreaches}</div>
                </div>
              )}

              {inspectorTab === 'Documents' && documentsData && (
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Search documents" className="rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-slate-200" />
                    <select className="rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-slate-200">
                      <option>All Status</option>
                      <option>Approved</option>
                      <option>Pending Review</option>
                      <option>Missing</option>
                      <option>Expired</option>
                    </select>
                  </div>
                  <div className="max-h-52 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/70">
                    {documentsData.rows.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between border-b border-slate-800 px-2 py-2 last:border-b-0">
                        <div>
                          <p className="text-slate-200">{doc.id} | {doc.name}</p>
                          <p className="text-[10px] text-slate-500">Status {doc.status} | Expiry {doc.expiry}</p>
                        </div>
                        <div className="flex gap-1">
                          <button type="button" className="rounded border border-slate-700 bg-slate-900 px-2 py-1">Download</button>
                          <button type="button" className="rounded border border-cyan-700/40 bg-cyan-950/30 px-2 py-1 text-cyan-200">Preview</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {inspectorTab === 'Timeline' && (
                <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs">
                  {timeline.map((item) => <p key={item}>{item}</p>)}
                  <p className="mt-1 rounded border border-cyan-700/40 bg-cyan-950/20 px-2 py-1 text-cyan-200">Current Date Marker: {new Date().toISOString().slice(0, 10)}</p>
                </div>
              )}

              {inspectorTab === 'AI Intelligence' && (
                <div className="space-y-2 rounded-lg border border-cyan-900/30 bg-cyan-950/15 p-3 text-xs text-cyan-100">
                  <p>AI Confidence %: {Math.min(99, 72 + selectedNode.relationshipScore / 3).toFixed(0)}%</p>
                  <p>Risk Trend: {selectedNode.riskRating === 'High' ? 'Rising' : selectedNode.riskRating === 'Medium' ? 'Stable' : 'Improving'}</p>
                  <p>Expected Outcome: {selectedNode.riskRating === 'High' ? 'Requires intervention' : 'Within managed tolerance'}</p>
                  <p className="font-semibold">Recommended Actions</p>
                  {[
                    'Exposure exceeds policy threshold for one connected buyer cluster.',
                    'Collections slowing in overdue bucket. Trigger recovery workflow.',
                    'Funding dependency on one bank line remains elevated.',
                    'Recommend reducing exposure concentration by 12%.',
                    'Recommend additional guarantee for next committee cycle.',
                    'Recommend committee review for policy exceptions.',
                  ].map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              )}

              {sectionOpen.connections && (
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-slate-500">Connected Entities</p>
                <div className="max-h-32 space-y-1 overflow-y-auto text-xs">
                  {connections.slice(0, 14).map((entity) => (
                    <p key={entity.id} className="text-slate-300">{entity.name} | {entity.type}</p>
                  ))}
                  {connections.length === 0 && <p className="text-slate-500">No visible connections in current filter scope.</p>}
                </div>
              </div>
              )}

              {sectionOpen.actions && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a href="/atlas/clients" className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-center font-semibold uppercase tracking-wide text-slate-200">Open Client</a>
                <a href="/atlas/deals" className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-center font-semibold uppercase tracking-wide text-slate-200">Open Deal</a>
                <a href="/atlas/documents" className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-center font-semibold uppercase tracking-wide text-slate-200">Open Legal</a>
                <a href="/atlas/treasury" className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-center font-semibold uppercase tracking-wide text-slate-200">Open Treasury</a>
                <a href="/atlas/reports" className="col-span-2 rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-2 py-2 text-center font-semibold uppercase tracking-wide text-cyan-200">Generate Due Diligence</a>
              </div>
              )}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Risk Overlay Legend" iconKey="alert-triangle">
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-500" />Low</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-yellow-400" />Moderate</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-orange-500" />High</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500" />Critical</div>
          </div>
        </SectionCard>
        </>
        )}
      </div>
    </div>
  );
}
