// ─── PR4 · CredentialCard dataset ────────────────────────────────────
// Each entry is one Credentials page: a row of N credentials with
// pre-authored risk verdicts and explanations.

import type { GenAITrack } from '@/components/genaiTypes';

export type Cred = {
  id: string; name: string; provider: string; logo: string; logoBg: string;
  scope: string; owner: string; rotated: string; type: 'api' | 'oauth' | 'service';
  correctRisk: 'low' | 'medium' | 'high';
  explain: string;
};

export type CredScenario = {
  id: string;
  track: GenAITrack | 'both';
  label: string;
  creds: Cred[];
};

export const CRED_DATASET: CredScenario[] = [
  {
    id: 'default-northstar',
    track: 'both',
    label: 'Northstar · default credentials page',
    creds: [
      { id: 'api', name: 'openai-classifier-key', provider: 'OpenAI', logo: '◯', logoBg: '#10A37F',
        scope: 'project:exception-classifier', owner: 'team-ai (team vault)', rotated: '14 d ago', type: 'api',
        correctRisk: 'low',
        explain: 'Team vault + project-scoped key. Compromise only affects this workflow; anyone on the team can rotate without breaking it.' },
      { id: 'oauth', name: 'personal-oauth-aarav', provider: 'Google', logo: 'G', logoBg: '#4285F4',
        scope: 'sheets.read, sheets.write', owner: 'aarav@northstar.com', rotated: 'Never rotated', type: 'oauth',
        correctRisk: 'high',
        explain: 'Personal OAuth on a single account is a single point of failure. Password reset, 2FA change, or offboarding silently invalidates the token at 7am Monday.' },
      { id: 'svc', name: 'team-automation', provider: 'Google IAM', logo: 'G', logoBg: '#4285F4',
        scope: 'sheets.* gmail.send', owner: 'team-automation@northstar.iam', rotated: '6 d ago', type: 'service',
        correctRisk: 'low',
        explain: 'Service account — team-owned, not tied to any individual. Survives password changes, 2FA updates, and offboarding. The right pattern for automation.' },
    ],
  },
  {
    id: 'finance-stack',
    track: 'engineer',
    label: 'Engineer · finance automation creds',
    creds: [
      { id: 'stripe', name: 'stripe-live-restricted', provider: 'Stripe', logo: '$', logoBg: '#6772E5',
        scope: 'charges.read, refunds.write', owner: 'team-finance (vault)', rotated: '21 d ago', type: 'api',
        correctRisk: 'medium',
        explain: 'Restricted key — but refunds.write is real money. Medium risk: rotation is fine, but the key must live in a sealed vault, never the editor.' },
      { id: 'svc-bq', name: 'bigquery-readonly', provider: 'Google IAM', logo: 'G', logoBg: '#4285F4',
        scope: 'bigquery.dataViewer', owner: 'svc-finance@…iam', rotated: '3 d ago', type: 'service',
        correctRisk: 'low',
        explain: 'Service account, scoped to a single read role. Rotated weekly. Compromise affects nothing beyond read access.' },
      { id: 'oauth-cfo', name: 'oauth-cfo-personal', provider: 'NetSuite', logo: 'N', logoBg: '#0F766E',
        scope: 'erp.* (full)', owner: 'cfo@acme.com', rotated: 'Never rotated', type: 'oauth',
        correctRisk: 'high',
        explain: 'A personal OAuth token with full ERP scope is the textbook nightmare. One offboarding and every finance workflow breaks at 9am.' },
      { id: 'static-token', name: 'static-quickbooks-token', provider: 'QuickBooks', logo: 'Q', logoBg: '#2CA01C',
        scope: 'transactions.read', owner: 'team-finance', rotated: 'Never rotated', type: 'api',
        correctRisk: 'medium',
        explain: 'Read-only, but never rotated. Static tokens with no rotation policy are a slow leak; pick up Vault rotation on the next sprint.' },
    ],
  },
  {
    id: 'gtm-stack',
    track: 'builder',
    label: 'Builder · GTM automation creds',
    creds: [
      { id: 'slack-bot', name: 'slack-bot-token', provider: 'Slack', logo: '#', logoBg: '#4A154B',
        scope: 'chat:write, channels:read', owner: 'team-gtm (vault)', rotated: '9 d ago', type: 'service',
        correctRisk: 'low',
        explain: 'Bot token scoped narrowly, team-owned, recently rotated. Healthy pattern.' },
      { id: 'sf-personal', name: 'salesforce-rhea-oauth', provider: 'Salesforce', logo: '☁', logoBg: '#00A1E0',
        scope: 'leads.*, opportunities.*', owner: 'rhea@acme.com', rotated: 'Never rotated', type: 'oauth',
        correctRisk: 'high',
        explain: 'Personal OAuth into Salesforce. When Rhea changes teams the workflow silently stops creating leads. Replace with a service user before this becomes a fire.' },
      { id: 'mailchimp', name: 'mailchimp-api', provider: 'Mailchimp', logo: 'M', logoBg: '#FFE01B',
        scope: 'lists.read, campaigns.write', owner: 'team-gtm (vault)', rotated: '40 d ago', type: 'api',
        correctRisk: 'medium',
        explain: 'API key, team-owned, but rotation has slipped past the 30-day policy. Not yet bleeding — set a calendar reminder.' },
      { id: 'webhook', name: 'webhook-signing-secret', provider: 'HubSpot', logo: 'H', logoBg: '#FF7A59',
        scope: 'verify webhooks', owner: 'team-gtm (vault)', rotated: '4 d ago', type: 'api',
        correctRisk: 'low',
        explain: 'Signing secret — the right pattern. Rotated this week. Nothing else to do.' },
    ],
  },
];

export function filterCredScenarios(track: GenAITrack): CredScenario[] {
  return CRED_DATASET.filter(c => c.track === 'both' || c.track === track);
}
