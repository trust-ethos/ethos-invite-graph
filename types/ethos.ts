// Ethos API v2 Types
export interface EthosUser {
  id: number;
  profileId?: number | null;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  description?: string | null;
  score?: number;
  status?: string;
  userkeys?: string[];
  xpTotal?: number;
  xpStreakDays?: number;
  links?: {
    profile?: string;
    scoreBreakdown?: string;
  };
  networkStats?: {
    nodes: number;
    connections: number;
  };
  stats?: {
    review?: {
      received?: {
        negative?: number;
        neutral?: number;
        positive?: number;
      };
    };
    vouch?: {
      given?: {
        amountWeiTotal?: string;
        count?: number;
      };
      received?: {
        amountWeiTotal?: string;
        count?: number;
      };
    };
  };
}

export interface EthosUserSearchResponse {
  values: EthosUser[]; // Changed from 'users' to 'values'
  total: number;
  limit: number;
  offset: number;
}

export interface EthosScore {
  score: number;
  level: string;
}

export interface EthosInvitation {
  id: number;
  inviterUserKey: string;
  inviteeAddress: string;
  createdAt: string;
  status: string;
}

// Invitation activity types
export interface EthosInvitedUser {
  userkey: string;
  profileId?: number;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  score?: number;
  invitedAt: string;
  activityId: number;
}

export interface EthosInvitationsResponse {
  inviter: {
    profileId: number;
    userkey: string;
  };
  invitedUsers: EthosInvitedUser[];
  total: number;
}

// Network graph types
export interface NetworkNode {
  id: string;
  profileId: number;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  score?: number;
  level: number; // Distance from root node
}

export interface NetworkEdge {
  source: string;
  target: string;
  type: "invitation";
}

export interface NetworkGraphData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  rootProfileId: number;
  totalNodes: number;
  maxDepth: number;
}

// Ethos Profiles API v1 Types
export interface EthosProfile {
  id: number;
  archived: boolean;
  createdAt: number;
  updatedAt: number;
  invitesAvailable: number;
  invitedBy: number | null;
}

export interface EthosActor {
  userkey: string;
  avatar: string | null;
  name: string | null;
  username: string | null;
  description: string | null;
  score: number;
  scoreXpMultiplier: number;
  profileId: number;
  primaryAddress: string;
  // Additional fields from v2 API
  status?: string;
  xpTotal?: number;
  xpStreakDays?: number;
  userkeys?: string[];
  links?: {
    profile?: string;
    scoreBreakdown?: string;
  };
  stats?: {
    review?: {
      received?: {
        negative?: number;
        neutral?: number;
        positive?: number;
      };
    };
    vouch?: {
      given?: {
        amountWeiTotal?: string;
        count?: number;
      };
      received?: {
        amountWeiTotal?: string;
        count?: number;
      };
    };
  };
  // Fallback profile info from v1 when v2 data unavailable
  profileInfo?: {
    invitesAvailable?: number;
    createdAt?: number;
    updatedAt?: number;
  };
}

export interface EthosProfileWithActor extends EthosProfile {
  actor: EthosActor;
  inviterActor?: EthosActor;
}

export interface EthosProfilesResponse {
  ok: boolean;
  data: {
    values: EthosProfile[];
    limit: number;
    offset: number;
    total: number;
  };
}

export interface EthosProfilesDirectoryResponse {
  ok: boolean;
  data: {
    values: EthosProfileWithActor[];
    limit: number;
    offset: number;
    total: number;
  };
}
