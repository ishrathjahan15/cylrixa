export type RiskLevel = 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK' | 'CRITICAL_RISK' | 'INCONCLUSIVE' | 'SCAN_UNAVAILABLE';

export type ConfidenceLevel = 'HIGH' | 'MODERATE' | 'LIMITED' | 'UNVERIFIED';

export type FindingSeverity = 'informational' | 'low' | 'medium' | 'high' | 'critical';

export interface Finding {
  id: string;
  category: 'threat_intel' | 'hostname_structure' | 'brand_impersonation' | 'redirect_anomaly' | 'protocol_tls' | 'content_context' | 'reputation';
  title: string;
  observation: string;
  significance: string;
  sourceRule: string;
  status: 'confirmed' | 'heuristic' | 'unavailable' | 'inconclusive';
  severity: FindingSeverity;
  recommendedAction: string;
}

export interface ProviderResult {
  name: string;
  displayName: string;
  category: 'threat_db' | 'reputation' | 'sandbox' | 'heuristics';
  status: 'connected' | 'not_configured' | 'manual_lookup_only' | 'rate_limited' | 'unavailable' | 'error';
  verdict?: 'clean' | 'suspicious' | 'malicious' | 'inconclusive';
  lastObserved?: string;
  externalLookupUrl?: string;
  notes?: string;
}

export interface LinkHop {
  step: number;
  url: string;
  hostname: string;
  isShortener: boolean;
  domainChanged?: boolean;
  status?: string;
}

export interface BrandComparison {
  detectedBrand: string;
  officialDomain: string;
  actualHostname: string;
  mismatchType: 'subdomain_deception' | 'typosquatting' | 'lookalike_tld' | 'keyword_stuffing' | 'exact_match';
  explanation: string;
}

export interface ScanResult {
  scanId: string;
  url: string;
  normalizedUrl: string;
  hostname: string;
  registrableDomain: string;
  status: RiskLevel;
  riskScore: number; // 0 to 100
  confidence: ConfidenceLevel;
  scannedAt: string;
  isDemo?: boolean;
  demoScenarioId?: string;
  coverage: {
    successful: number;
    failed: number;
    notConfigured: number;
    total: number;
  };
  brandComparison?: BrandComparison;
  findings: Finding[];
  providers: ProviderResult[];
  redirectJourney: LinkHop[];
  aiExplanation?: {
    summary: string;
    riskReasons: string[];
    consequences: string[];
    recommendedSteps: string[];
    language: 'en' | 'te' | 'hi';
  };
  recommendations: string[];
  safeToOpen: boolean;
}

export interface MessageAnalysisResult {
  originalMessage: string;
  extractedUrls: string[];
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detectedIndicators: {
    type: 'urgency' | 'credential_pressure' | 'financial_lure' | 'otp_request' | 'impersonation';
    phrase: string;
    reason: string;
    severity: FindingSeverity;
  }[];
  scannedUrls: ScanResult[];
  aiContextSummary?: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  role?: 'user' | 'admin';
  createdAt?: string;
}

export type AppointmentServiceType = 'incident_triage' | 'link_audit' | 'security_consultation' | 'enterprise_demo';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  serviceType: AppointmentServiceType;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status: AppointmentStatus;
  createdByAdmin?: boolean;
  createdAt: string;
}
