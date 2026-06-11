// ─── PR2 · Ticket corpus + wrong-label pool ──────────────────────────
// Real input variety for the PR2 playground tools. Each entry is a
// support ticket / claim with a ground-truth category. Tools cycle
// through these so every "Next ticket" shows a fresh case, and the
// deterministic model output quotes specific phrases from the ticket
// so the response actually changes when the input changes.
//
// Builder track = clinical / claims context (Network/Database/Server
// re-cast as the IT side of a hospital workflow).
// Engineer track = SRE / backend context.
//
// Categories used by PromptBuilderTool + FewShotLabeler:
//   Network · Database · Server
//
// Categories used by claims-routing variant of FewShotLabeler:
//   Pre-Auth · Coverage Limit · Non-Emergent

import type { GenAITrack } from '@/components/genaiTypes';

export type ItCategory = 'Network' | 'Database' | 'Server';
export type ClaimsCategory = 'Pre-Auth' | 'Coverage Limit' | 'Non-Emergent';

export type ItTicket = {
  id: string;
  truth: ItCategory;
  text: string;
  /** Short phrase the deterministic model can quote when it half-answers. */
  signal: string;
};

export type ClaimsTicket = {
  id: string;
  truth: ClaimsCategory;
  text: string;
  signal: string;
};

// ─── Engineer track · ~120 IT support tickets ────────────────────────
const ENG_NETWORK: ItTicket[] = [
  { id: 'T-401', truth: 'Network',  text: 'Sales team in Chicago getting intermittent VPN drops every 10–15 min. Other offices unaffected. Started after lunch.', signal: 'VPN drops every 10–15 min, Chicago only' },
  { id: 'T-404', truth: 'Network',  text: 'Wi-Fi on the 4th-floor mesh is dropping every 4 minutes; iperf shows 240 ms jitter against the LAN gateway.', signal: '240 ms jitter on 4th-floor Wi-Fi' },
  { id: 'T-407', truth: 'Network',  text: 'Office firewall reports 3% packet loss to AWS us-east-1; transit provider acknowledged a peering flap at 09:12 UTC.', signal: '3% packet loss to us-east-1 after peering flap' },
  { id: 'T-410', truth: 'Network',  text: 'Branch site in Seattle cannot reach the SaaS billing endpoint; traceroute dies at hop 9, customer ISP last-mile.', signal: 'traceroute dies at hop 9 from Seattle' },
  { id: 'T-413', truth: 'Network',  text: 'DNS queries to internal.acme.corp return SERVFAIL every other request; recursive resolver thinks zone is lame.', signal: 'SERVFAIL on internal.acme.corp every other query' },
  { id: 'T-416', truth: 'Network',  text: 'WireGuard tunnel to the EU region keeps re-keying every 90 seconds; latency spikes from 8 ms to 220 ms during the handshake.', signal: 'WireGuard re-key every 90 s, latency 8→220 ms' },
  { id: 'T-419', truth: 'Network',  text: 'Office switch port for the conference camera is flapping every 6 seconds; STP topology change keeps clearing the MAC table.', signal: 'switch port flap every 6 s, STP topology change' },
  { id: 'T-422', truth: 'Network',  text: 'Engineers report SSH disconnects to staging boxes every 18 minutes; corporate proxy idle-timeout suspected.', signal: 'SSH idle disconnects every 18 min via corp proxy' },
  { id: 'T-425', truth: 'Network',  text: 'Cellular failover modem stuck on 3G during the morning storm; LTE signal -118 dBm, cannot hold a session.', signal: 'LTE -118 dBm during storm, stuck on 3G' },
  { id: 'T-428', truth: 'Network',  text: 'Customer-portal LB health-checks reported 503 for 4 min at 10:18 UTC; egress SNAT pool was exhausted.', signal: 'SNAT pool exhausted, 503 for 4 min at 10:18 UTC' },
  { id: 'T-431', truth: 'Network',  text: 'Slack desktop drops every 11 minutes on the Bangalore office; corp DNS resolver swap suspected as the trigger.', signal: 'Slack drop every 11 min after DNS resolver swap' },
  { id: 'T-434', truth: 'Network',  text: 'GitHub Actions self-hosted runners cannot reach the cache CDN; CGNAT carrier returned a new public IP this morning.', signal: 'runners blocked after CGNAT IP rotation' },
  { id: 'T-437', truth: 'Network',  text: 'Customer reports 30% TLS handshake failures on api.acme.com from APAC; intermediate cert was rotated overnight.', signal: '30% TLS handshake fail APAC after cert rotation' },
  { id: 'T-440', truth: 'Network',  text: 'Office router CPU pegged at 98% during the 1 pm payroll burst; QoS policy drops VoIP first and Zoom is unusable.', signal: 'router CPU 98% during 1 pm burst, VoIP drops first' },
  { id: 'T-443', truth: 'Network',  text: 'BGP session to ISP-B keeps flapping; the prefix-limit on their side was lowered to 12k and we are advertising 13k.', signal: 'BGP flap, ISP-B prefix-limit 12k vs 13k advertised' },
];

const ENG_DATABASE: ItTicket[] = [
  { id: 'T-402', truth: 'Database', text: 'Order-write API throwing "deadlock detected on row lock wait" on ~5% of requests since 10:30am. Read traffic fine.', signal: 'deadlock detected on row lock wait, 5% writes' },
  { id: 'T-405', truth: 'Database', text: 'Postgres replica lag on db-prod-02 is 14 seconds and rising; xlog ship has been stuck on the same WAL segment for 6 minutes.', signal: 'replica lag 14 s, WAL ship stuck on one segment' },
  { id: 'T-408', truth: 'Database', text: 'Production MySQL InnoDB buffer-pool hit-rate dropped from 99.8% to 91.4% after the marketing import job; reads are now 8× slower.', signal: 'InnoDB hit-rate 99.8→91.4% after marketing import' },
  { id: 'T-411', truth: 'Database', text: 'pgbouncer reports server_pool exhausted at 09:48 UTC; transaction-mode pool of 200 fully consumed by a runaway analytics query.', signal: 'pgbouncer transaction pool of 200 exhausted by analytics query' },
  { id: 'T-414', truth: 'Database', text: 'Snowflake virtual warehouse XSMALL hits queueing every weekday at 11:00 — the daily refresh job and the BI dashboards collide.', signal: 'Snowflake XSMALL queueing daily at 11:00' },
  { id: 'T-417', truth: 'Database', text: 'Mongo primary stepped down twice this morning; oplog window dropped from 36h to 4h after a bulk update of the users collection.', signal: 'Mongo primary stepped down, oplog 36h→4h' },
  { id: 'T-420', truth: 'Database', text: 'Customer-facing search returns stale results for 12 minutes after every full reindex of the products table; refresh interval set to 600 s.', signal: 'stale search 12 min post reindex, refresh 600 s' },
  { id: 'T-423', truth: 'Database', text: 'Redis cluster has a 2 GB hot key in the "leaderboard" namespace; CLUSTER COUNTKEYSINSLOT shows 88% of writes hashing to one slot.', signal: '2 GB hot key in leaderboard, 88% writes one slot' },
  { id: 'T-426', truth: 'Database', text: 'Aurora cluster failed over at 04:12; reader endpoint kept serving stale data for 70 seconds because DNS TTL is 60.', signal: 'Aurora failover, reader stale 70 s due to DNS TTL 60' },
  { id: 'T-429', truth: 'Database', text: 'Daily VACUUM on the events partition takes 4h longer this week; autovacuum_freeze_max_age was bumped without warning.', signal: 'VACUUM +4h after autovacuum_freeze_max_age bump' },
  { id: 'T-432', truth: 'Database', text: 'Customer reports "row not found" on orders updated less than a second ago; read-after-write hitting replica instead of primary.', signal: 'read-after-write hitting replica, orders missing' },
  { id: 'T-435', truth: 'Database', text: 'Foreign-key constraint violation on shipments → orders during the nightly archive; orphaned rows from a failed migration last week.', signal: 'FK violation shipments→orders during nightly archive' },
  { id: 'T-438', truth: 'Database', text: 'Cassandra repair on the events table killed itself after 14 hours; one node has 38% disk free and refused to compact.', signal: 'Cassandra repair killed, 38% disk free on one node' },
  { id: 'T-441', truth: 'Database', text: 'Time-series ingest into Influx dropped 12% of points overnight; series cardinality crossed 1.4M after the new tag was added.', signal: '12% points dropped, Influx cardinality 1.4M' },
  { id: 'T-444', truth: 'Database', text: 'New unique index on orders.email is failing to build; 230 rows have whitespace-only duplicates from the migration two months ago.', signal: 'unique index orders.email blocked by whitespace dupes' },
];

const ENG_SERVER: ItTicket[] = [
  { id: 'T-403', truth: 'Server',   text: 'Checkout service returning 502 Bad Gateway intermittently. Other services on the same cluster are healthy.', signal: '502s on checkout, sibling services healthy' },
  { id: 'T-406', truth: 'Server',   text: 'app-server-07 unresponsive; ping fails, console shows kernel panic on boot, no recent deploy.', signal: 'app-server-07 kernel panic, no recent deploy' },
  { id: 'T-409', truth: 'Server',   text: 'Inventory API pods restart every 9 minutes after the latest rollout; readinessProbe failing because heap is at 92%.', signal: 'inventory pod restart 9 min, heap 92%' },
  { id: 'T-412', truth: 'Server',   text: 'auth-service GC pauses spiked to 1.4 s after the JDK 21 upgrade; G1 collector is hitting full-GC during peak.', signal: 'auth-service GC pause 1.4 s post JDK 21' },
  { id: 'T-415', truth: 'Server',   text: 'NFS mount on the build host went read-only at 02:17; dmesg has "INFO: task hung for more than 120 seconds".', signal: 'NFS read-only, task hung 120 s at 02:17' },
  { id: 'T-418', truth: 'Server',   text: 'Worker fleet wedged after the cron rollout; systemd unit reports "result=core-dump" on every reload of the config.', signal: 'worker core-dump on every config reload' },
  { id: 'T-421', truth: 'Server',   text: 'API gateway 99p latency moved from 80 ms to 920 ms after a routing-config push; CPU normal, blocked on a syscall.', signal: 'gateway 99p 80→920 ms after routing push' },
  { id: 'T-424', truth: 'Server',   text: 'EKS node group is OOM-killing pods every 7 minutes; cgroup memory limit set to 4 GiB but the JVM is sized for 6 GiB.', signal: 'OOM kill every 7 min, cgroup 4 GiB vs JVM 6 GiB' },
  { id: 'T-427', truth: 'Server',   text: 'TLS termination on the public edge throws 525 when the origin sets a self-signed cert after the staging mistake.', signal: 'TLS 525 after origin self-signed cert' },
  { id: 'T-430', truth: 'Server',   text: 'CloudFront edge logs show 503 for 4 min during us-east-1 capacity event; origin was fine in the same window.', signal: '503 at CloudFront edge during us-east-1 capacity event' },
  { id: 'T-433', truth: 'Server',   text: 'Worker queue depth hit 80k after the deploy of the new schema; consumer is single-threaded on a row-locking SELECT.', signal: 'queue depth 80k after deploy, single-threaded consumer' },
  { id: 'T-436', truth: 'Server',   text: 'gunicorn workers killed by sigkill every 6 minutes when the SLA dashboard request runs — request body is 90 MB.', signal: 'gunicorn sigkill every 6 min on 90 MB dashboard request' },
  { id: 'T-439', truth: 'Server',   text: 'CD pipeline cannot connect to the QA cluster; control-plane RBAC token expired and rotation skipped in the renewal window.', signal: 'expired RBAC token on QA cluster control-plane' },
  { id: 'T-442', truth: 'Server',   text: 'Worker pod is logging "no space left on device" while only 38% of the PVC is used; inodes are exhausted on the small files volume.', signal: 'inode exhaustion on small-files volume' },
  { id: 'T-445', truth: 'Server',   text: 'Edge cache returns 5xx for 2% of requests after the firmware rollout; SoC random reboot every 3.5 hours.', signal: 'SoC reboot every 3.5 h, edge 5xx on 2% of requests' },
];

// ─── Builder track · ~120 hospital IT tickets ────────────────────────
const BLD_NETWORK: ItTicket[] = [
  { id: 'T-401', truth: 'Network',  text: 'Patient portal keeps timing out for staff on the 3rd floor; works fine on the 4th. Started after lunch.', signal: 'portal timeout on 3rd floor only, after lunch' },
  { id: 'T-404', truth: 'Network',  text: 'Bedside tablets in the south wing drop Wi-Fi every 6 minutes; mesh roam between APs takes 3 seconds.', signal: 'Wi-Fi drop every 6 min, mesh roam 3 s' },
  { id: 'T-407', truth: 'Network',  text: 'OR-3 vital-signs telemetry is intermittently lost; switch uplink port at 78% utilisation during shift change.', signal: 'OR-3 telemetry loss, uplink 78% at shift change' },
  { id: 'T-410', truth: 'Network',  text: 'Imaging review workstation in radiology cannot pull DICOM from the central PACS; only the 10 GbE link is degraded.', signal: 'DICOM unreachable, 10 GbE link degraded' },
  { id: 'T-413', truth: 'Network',  text: 'eFax outbound queue is backlogged; SIP trunk to the carrier flaps every 14 minutes since the firmware update.', signal: 'SIP trunk flap every 14 min after firmware' },
  { id: 'T-416', truth: 'Network',  text: 'Lab analyzer cannot reach the LIS interface engine; vlan 220 lost its trunk encapsulation after the core switch reload.', signal: 'lab analyzer offline, vlan 220 trunk lost' },
  { id: 'T-419', truth: 'Network',  text: 'Pharmacy tablet drops every 18 minutes during medication round; 2.4 GHz radio in that corridor is at 94% utilisation.', signal: '2.4 GHz pharmacy corridor 94% utilisation' },
  { id: 'T-422', truth: 'Network',  text: 'Tele-medicine session quality dropped to "poor" after the migration to the new VPN concentrator at 6 am.', signal: 'telemedicine poor after VPN concentrator migration' },
  { id: 'T-425', truth: 'Network',  text: 'Clinic in the satellite branch lost connectivity for 22 min; ISP confirmed last-mile fibre cut by a third-party contractor.', signal: 'clinic offline 22 min, last-mile fibre cut' },
  { id: 'T-428', truth: 'Network',  text: 'PACS uploads fail intermittently at the imaging centre; corporate firewall throttles uploads >500 MB to 12 Mbps.', signal: 'PACS uploads throttled >500 MB to 12 Mbps' },
  { id: 'T-431', truth: 'Network',  text: 'Front-desk thin clients can\'t reach the EHR; the desktop SSL VPN client gave up after the policy push.', signal: 'thin clients offline after SSL VPN policy push' },
  { id: 'T-434', truth: 'Network',  text: 'Smart-pump telemetry is missing for 14 of 60 devices in the ICU after the AP-software update overnight.', signal: '14/60 smart-pumps missing telemetry post AP update' },
];

const BLD_DATABASE: ItTicket[] = [
  { id: 'T-402', truth: 'Database', text: 'EHR refuses to save new visit notes — error says "deadlock detected on row lock wait." Started ~10:30am.', signal: 'deadlock on row lock wait, EHR save fails' },
  { id: 'T-405', truth: 'Database', text: 'Daily census report runs against the EDW; query has been running for 4h vs the usual 12 min — vacuum was skipped overnight.', signal: 'census report 4h vs 12 min, vacuum skipped' },
  { id: 'T-408', truth: 'Database', text: 'Medication-order audit table is missing 11 rows from the last 24h; archive job logged "constraint violation" twice.', signal: 'audit missing 11 rows, constraint violation in archive' },
  { id: 'T-411', truth: 'Database', text: 'Lab results portal shows stale values for 8 minutes after the daily ETL refresh; cache invalidation never fired.', signal: 'lab portal stale 8 min, cache invalidation missed' },
  { id: 'T-414', truth: 'Database', text: 'EHR search is returning duplicate patient records for two MRNs; merge job paused mid-batch after a node restart.', signal: 'duplicate MRN search, merge job paused' },
  { id: 'T-417', truth: 'Database', text: 'Insurance eligibility lookups time out at 30 s; the cached eligibility table grew to 92 GB and the index bloat is 41%.', signal: 'eligibility lookup timeout, table 92 GB, 41% bloat' },
  { id: 'T-420', truth: 'Database', text: 'Pharmacy interface is dropping HL7 messages with "ORA-00060 deadlock detected" every 9 minutes since the schema migration.', signal: 'HL7 drop, ORA-00060 every 9 min' },
  { id: 'T-423', truth: 'Database', text: 'Discharge summary cannot save: trigger on encounter_summary is firing 4× per row because of the duplicate AFTER UPDATE rule.', signal: 'trigger firing 4× per row, save fails' },
  { id: 'T-426', truth: 'Database', text: 'Master patient index search latency rose from 80 ms to 1.4 s after the index rebuild; statistics are stale.', signal: 'MPI search 80 ms→1.4 s, stale stats' },
  { id: 'T-429', truth: 'Database', text: 'EHR replication lag to the read-only reporting node hit 28 minutes during the noon ingest of overnight HL7.', signal: 'replication lag 28 min during noon HL7 ingest' },
  { id: 'T-432', truth: 'Database', text: 'Scheduler showing yesterday\'s appointments; nightly partition swap on appointments_2025 silently failed at 02:14.', signal: 'partition swap failed 02:14, scheduler stale' },
];

const BLD_SERVER: ItTicket[] = [
  { id: 'T-403', truth: 'Server',   text: 'Appointment scheduler is returning 502 Bad Gateway every few minutes. Other apps on the same domain are fine.', signal: 'scheduler 502 intermittent, sibling apps fine' },
  { id: 'T-406', truth: 'Server',   text: 'EHR application server "ehr-app-04" has been unresponsive since 09:14; ping fails and the IPMI console shows a kernel oops.', signal: 'ehr-app-04 unresponsive, kernel oops on IPMI' },
  { id: 'T-409', truth: 'Server',   text: 'Imaging viewer keeps restarting; pod readinessProbe is failing because the JVM keeps OOM-killing after the new GE plugin.', signal: 'imaging pod OOM-kill after GE plugin' },
  { id: 'T-412', truth: 'Server',   text: 'eMAR refresh times jumped from 0.4 s to 3.8 s after the patch window; CPU steal is at 22% on the shared host.', signal: 'eMAR 0.4→3.8 s, CPU steal 22%' },
  { id: 'T-415', truth: 'Server',   text: 'NFS share that backs the radiology PACS went read-only at 02:17; dmesg shows tasks hung for 120 seconds.', signal: 'PACS NFS read-only, task hung 120 s' },
  { id: 'T-418', truth: 'Server',   text: 'Lab order ingest service keeps crash-looping after the schema migration; sysctl says core_pattern is unwritable.', signal: 'ingest crash-loop, core_pattern unwritable' },
  { id: 'T-421', truth: 'Server',   text: 'Patient portal login latency rose from 90 ms to 1.2 s after the routing-config push at 4:30 am; CPU normal, syscall blocked.', signal: 'login 90 ms→1.2 s, syscall blocked' },
  { id: 'T-424', truth: 'Server',   text: 'Telemetry collector pods are being OOM-killed every 7 minutes after the new dashboard rolled; memory limit set to 4 GiB.', signal: 'collector OOM-kill 7 min, 4 GiB limit' },
  { id: 'T-427', truth: 'Server',   text: 'Imaging viewer throws TLS 525 after the upstream PACS was rebuilt with a self-signed cert by mistake.', signal: 'TLS 525 after PACS self-signed cert' },
  { id: 'T-430', truth: 'Server',   text: 'Inbound HL7 listener queued 60k messages overnight; the single-threaded handler is row-lock SELECTing on encounters.', signal: 'HL7 queue 60k, single-threaded SELECT' },
  { id: 'T-433', truth: 'Server',   text: 'Billing batch job blocks every Sunday at 03:00; gunicorn workers are SIGKILLed because the export body is 110 MB.', signal: 'gunicorn SIGKILL on 110 MB Sunday export' },
];

// ─── Builder track · 30 claims tickets (FewShotLabeler claims variant) ─
const BUILDER_CLAIMS: ClaimsTicket[] = [
  { id: 'C-501', truth: 'Pre-Auth',       text: 'Pre-authorised cardiac MRI denied at adjudication — reviewer wrote "does not meet medical necessity criteria."', signal: 'cardiac MRI, "medical necessity" denial' },
  { id: 'C-502', truth: 'Coverage Limit', text: 'Outpatient PT claim denied at session 9 of 12 — EOB says "annual benefit cap reached."', signal: 'PT session 9 of 12, annual cap' },
  { id: 'C-503', truth: 'Non-Emergent',   text: 'Urgent-care visit for sore throat denied — insurer flagged as "non-emergent presentation."', signal: 'urgent care sore throat, non-emergent flag' },
  { id: 'C-504', truth: 'Pre-Auth',       text: 'Hospitalist orders inpatient PET-CT — payer denial reads "no pre-authorisation on file" despite the IP-only flag.', signal: 'PET-CT, "no pre-authorisation on file"' },
  { id: 'C-505', truth: 'Coverage Limit', text: 'Speech-therapy invoice rejected after the 30th hour — plan limit is 30 hours/year per CPT 92507.', signal: 'speech therapy past 30-hour cap' },
  { id: 'C-506', truth: 'Non-Emergent',   text: 'Late-night ER visit for ankle sprain denied — payer applied the "could have waited 24h" non-emergent rule.', signal: 'ER ankle sprain, "could have waited 24h"' },
  { id: 'C-507', truth: 'Pre-Auth',       text: 'Outpatient surgery for septoplasty denied — pre-auth was filed but lacked the required ENT specialist sign-off.', signal: 'septoplasty pre-auth missing ENT sign-off' },
  { id: 'C-508', truth: 'Coverage Limit', text: 'Continuous glucose monitor supply denied — patient already received the annual allowance of 12 sensors.', signal: 'CGM annual 12 sensors exhausted' },
  { id: 'C-509', truth: 'Non-Emergent',   text: 'Walk-in clinic copay denied for medication refill — labelled "non-urgent encounter, refer back to PCP."', signal: 'refill copay denied, refer to PCP' },
  { id: 'C-510', truth: 'Pre-Auth',       text: 'Robotic prostatectomy claim denied — pre-authorisation was approved for laparoscopic, not robotic, approach.', signal: 'robotic prostatectomy off pre-auth scope' },
  { id: 'C-511', truth: 'Coverage Limit', text: 'Mental-health teletherapy claim denied — patient passed the 26-visit annual cap on 23 March.', signal: 'teletherapy 26-visit cap' },
  { id: 'C-512', truth: 'Non-Emergent',   text: 'Patient visited the ER for chronic back pain, no new injury — denial cites "non-emergent presentation, refer PT."', signal: 'chronic back pain ER, refer PT' },
  { id: 'C-513', truth: 'Pre-Auth',       text: 'IV chemo cycle 4 denied — the original pre-auth covered only cycles 1–3, no renewal filed.', signal: 'chemo cycle 4, pre-auth lapsed' },
  { id: 'C-514', truth: 'Coverage Limit', text: 'CPAP supplies denied — plan only covers two replacement masks per calendar year and the third was billed in November.', signal: 'CPAP third mask past 2/year cap' },
  { id: 'C-515', truth: 'Non-Emergent',   text: 'After-hours phone consult billed and denied — coded as "non-emergent telephonic encounter" by the carrier.', signal: 'after-hours phone, non-emergent telephonic' },
];

const ENG_CLAIMS: ClaimsTicket[] = [
  { id: 'C-501', truth: 'Pre-Auth',       text: 'Pre-authorised cardiac procedure denied at adjudication — service does not meet medical necessity for the CPT code.', signal: 'cardiac procedure, medical-necessity denial' },
  { id: 'C-502', truth: 'Coverage Limit', text: 'Physical therapy claim denied — exceeds coverage limits despite physician order for 12 sessions.', signal: 'PT 12 sessions, exceeds coverage' },
  { id: 'C-503', truth: 'Non-Emergent',   text: 'ER visit for moderate abdominal pain denied — insurer marked the encounter as non-emergent after review.', signal: 'ER abdominal pain, non-emergent' },
  { id: 'C-504', truth: 'Pre-Auth',       text: 'Outpatient MRI of the spine denied — pre-auth filed but ICD codes don\'t match the approved diagnosis on file.', signal: 'MRI spine, ICD mismatch on pre-auth' },
  { id: 'C-505', truth: 'Coverage Limit', text: 'Specialty drug refill denied — annual lifetime cap exceeded; no exception waiver on file.', signal: 'specialty drug, annual lifetime cap' },
  { id: 'C-506', truth: 'Non-Emergent',   text: 'After-hours urgent-care visit denied — payer applied "could have been seen by PCP next day" non-emergent rule.', signal: 'urgent care, could-have-waited rule' },
  { id: 'C-507', truth: 'Pre-Auth',       text: 'Inpatient knee replacement claim denied — pre-auth referenced wrong laterality (left vs right).', signal: 'knee replacement, wrong laterality on pre-auth' },
  { id: 'C-508', truth: 'Coverage Limit', text: 'Home-health nursing visits denied at visit 26 — annual cap is 25 per benefit year.', signal: 'home health visit 26, annual 25 cap' },
  { id: 'C-509', truth: 'Non-Emergent',   text: 'ER visit for routine medication refill denied — coded "non-emergent presentation, refer ambulatory."', signal: 'ER refill, non-emergent ambulatory' },
];

// ─── Convenience exports ─────────────────────────────────────────────
export const ENG_IT_TICKETS: ItTicket[] = [...ENG_NETWORK, ...ENG_DATABASE, ...ENG_SERVER];
export const BLD_IT_TICKETS: ItTicket[] = [...BLD_NETWORK, ...BLD_DATABASE, ...BLD_SERVER];

export function getItTickets(track: GenAITrack): ItTicket[] {
  return track === 'engineer' ? ENG_IT_TICKETS : BLD_IT_TICKETS;
}

export function getClaimsTickets(track: GenAITrack): ClaimsTicket[] {
  return track === 'engineer' ? ENG_CLAIMS : BUILDER_CLAIMS;
}

// ─── Wrong-label pools so the "model hallucinates" branch varies per ticket ─
// When the learner gives a vague prompt that doesn't list the label set,
// the model invents a category. We rotate through a real pool so the
// invented label changes with the ticket — instead of always "Connectivity".
export const ENG_FAKE_CATEGORIES = [
  'Connectivity', 'Latency', 'Auth', 'Capacity', 'Throughput',
  'Stability', 'Performance', 'Reliability', 'Operations', 'Infrastructure',
  'Compute', 'Storage', 'Routing', 'Configuration', 'Cluster',
];
export const BLD_FAKE_CATEGORIES = [
  'Connectivity', 'Workflow', 'Access', 'Performance', 'Clinical Systems',
  'Authentication', 'Integration', 'Latency', 'Capacity', 'Imaging',
  'Records', 'Pharmacy', 'Configuration', 'Operations', 'Reliability',
];

export function fakeCategoryFor(track: GenAITrack, ticketId: string): string {
  const pool = track === 'engineer' ? ENG_FAKE_CATEGORIES : BLD_FAKE_CATEGORIES;
  // Stable hash of the ticket id so the same ticket always gets the same
  // hallucinated label — but every ticket picks a different one.
  let h = 0;
  for (let i = 0; i < ticketId.length; i++) h = (h * 31 + ticketId.charCodeAt(i)) >>> 0;
  return pool[h % pool.length];
}

// ─── Snippets the deterministic model can quote from a ticket ────────
// Used by the "label buried in prose" branch so each ticket produces a
// different sentence (instead of every ticket triggering the same canned
// "the symptoms point to X" line).
export function quoteSnippet(ticket: ItTicket): string {
  // Prefer the curated signal phrase; fall back to the first 50 chars
  return ticket.signal || ticket.text.slice(0, 50);
}

export function lowerLabel(c: ItCategory): string {
  return c === 'Network' ? 'network' : c === 'Database' ? 'database' : 'server';
}
