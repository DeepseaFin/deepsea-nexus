'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type SearchEntity = {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  keywords?: string[];
  href: string;
};

type SearchRegistryContextValue = {
  entities: SearchEntity[];
  registerEntity: (entity: SearchEntity) => void;
  unregisterEntity: (id: string) => void;
  search: (query: string) => SearchEntity[];
};

const SearchRegistryContext = createContext<SearchRegistryContextValue | null>(null);

const seedEntities: SearchEntity[] = [
  { id: 'dashboard', type: 'Workspace', title: 'Dashboard', href: '/atlas/dashboard', keywords: ['overview', 'executive'] },
  { id: 'deals', type: 'Workspace', title: 'Deals', href: '/atlas/deals', keywords: ['transactions', 'facilities'] },
  { id: 'clients', type: 'Workspace', title: 'Clients', href: '/atlas/clients', keywords: ['relationships', 'profiles'] },
  { id: 'counterparties', type: 'Workspace', title: 'Counterparties', href: '/atlas/counterparties', keywords: ['buyers', 'obligors'] },
  { id: 'work-queue', type: 'Workspace', title: 'Work Queue', href: '/atlas/work-queue', keywords: ['operations', 'pipeline'] },
  { id: 'treasury', type: 'Workspace', title: 'Treasury', href: '/atlas/treasury', keywords: ['funding', 'liquidity', 'bank lines'] },
];

export function SearchRegistryProvider({ children }: { children: React.ReactNode }) {
  const [entities, setEntities] = useState<SearchEntity[]>(seedEntities);

  const registerEntity = useCallback((entity: SearchEntity) => {
    setEntities((current) => {
      const existing = current.find((item) => item.id === entity.id);
      if (existing) {
        return current.map((item) => (item.id === entity.id ? entity : item));
      }
      return [...current, entity];
    });
  }, []);

  const unregisterEntity = useCallback((id: string) => {
    setEntities((current) => current.filter((item) => item.id !== id));
  }, []);

  const search = useCallback(
    (query: string) => {
      const q = query.trim().toLowerCase();
      if (!q) return entities;

      return entities.filter((item) => {
        const haystack = [item.title, item.subtitle ?? '', item.type, ...(item.keywords ?? [])]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      });
    },
    [entities],
  );

  const value = useMemo(
    () => ({ entities, registerEntity, unregisterEntity, search }),
    [entities, registerEntity, unregisterEntity, search],
  );

  return <SearchRegistryContext.Provider value={value}>{children}</SearchRegistryContext.Provider>;
}

export function useSearchRegistry() {
  const context = useContext(SearchRegistryContext);
  if (!context) {
    throw new Error('useSearchRegistry must be used within SearchRegistryProvider');
  }
  return context;
}
