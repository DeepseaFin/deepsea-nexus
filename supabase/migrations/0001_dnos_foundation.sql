-- DNOS Foundation Migration
-- Migration: 0001_dnos_foundation
-- Purpose: Establish baseline PostgreSQL extensions required by Deepsea Nexus Operating System.

-- pgcrypto is required for cryptographic primitives and UUID generation helpers
-- used by DNOS foundational and future domain schemas.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- pg_trgm is required for trigram similarity indexing and fuzzy text matching,
-- enabling performant search and relevance features across DNOS modules.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
