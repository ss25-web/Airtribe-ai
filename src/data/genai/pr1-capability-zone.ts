// ─── PR1 · CapabilityZoneCard dataset ────────────────────────────────
// Each entry is a real task that the AI either CAN, CAN-with-retrieval,
// or CANNOT reliably do. The learner types a task (or picks from a
// preset), a fuzzy matcher finds the closest entry, and the tool streams
// the model's reasoning + verdict in proper English. Zones map to the
// existing Linear-style kanban: Reliable · Extended · Unreliable.
//
// Pedagogy: every reasoning line names WHY the task lands in that zone
// (language vs lookup vs arithmetic vs binding decision), so learners
// build the mental model — not memorise the example.

export type CapZone = 'reliable' | 'extended' | 'unreliable';

export type CapabilityEntry = {
  id: string;
  domain: 'general' | 'engineering' | 'operations' | 'healthcare' | 'product';
  task: string;
  zone: CapZone;
  confidence: number; // 0-100
  signals: string[];  // detected task types
  reasoning: string;  // streamed as the model's explanation
};

export const CAPABILITY_DATASET: CapabilityEntry[] = [
  // ─── RELIABLE · pure language work ────────────────────────────────
  {
    id: 'cap-r-1',
    domain: 'general',
    task: 'Summarise a customer support email in three sentences.',
    zone: 'reliable',
    confidence: 92,
    signals: ['summarisation', 'language'],
    reasoning: 'Summarisation is a textbook language task — the model maps input text to a shorter output that preserves key claims. Input and output are both text, no external data is required, and the output is judged on coherence rather than factual lookup. Sits firmly in the reliable zone.',
  },
  {
    id: 'cap-r-2',
    domain: 'operations',
    task: 'Classify a support ticket into one of four categories from its body text.',
    zone: 'reliable',
    confidence: 89,
    signals: ['classification', 'language'],
    reasoning: 'Classification with a closed label set and language-only inputs is what models do best. As long as the labels are defined in the system prompt, the model picks one consistently. Stable in production with calibration runs.',
  },
  {
    id: 'cap-r-3',
    domain: 'healthcare',
    task: 'Draft a discharge note in plain language from clinical bullet points.',
    zone: 'reliable',
    confidence: 87,
    signals: ['drafting', 'language', 'tone'],
    reasoning: 'Drafting from supplied structured input is a strong reliability case — the model is rewriting, not retrieving. As long as the bullets contain every fact the note needs, the language model will turn them into a readable paragraph in a consistent voice.',
  },
  {
    id: 'cap-r-4',
    domain: 'product',
    task: 'Rewrite a feature description for an enterprise audience versus a developer audience.',
    zone: 'reliable',
    confidence: 90,
    signals: ['rewriting', 'audience-adaptation', 'language'],
    reasoning: 'Audience-adaptation is pure language work — same input, different register. Models track tone, jargon density, and structure very well when the audience is named in the prompt. Reliable for both directions.',
  },
  {
    id: 'cap-r-5',
    domain: 'engineering',
    task: 'Extract structured fields (name, date, amount) from an unstructured invoice email.',
    zone: 'reliable',
    confidence: 84,
    signals: ['extraction', 'structured-output', 'language'],
    reasoning: 'Extraction from messy text into named fields is a model strength. Add response_format JSON schema and confidence rises further. Watch for ambiguous dates or international number formats — but the core task is reliable.',
  },
  {
    id: 'cap-r-6',
    domain: 'general',
    task: 'Translate a paragraph from Spanish to English keeping the original tone.',
    zone: 'reliable',
    confidence: 91,
    signals: ['translation', 'language', 'tone'],
    reasoning: 'Translation between high-resource languages is among the most reliable LLM tasks. Tone preservation is the main quality knob, and naming the desired register in the prompt produces consistent output. No external retrieval needed.',
  },
  {
    id: 'cap-r-7',
    domain: 'operations',
    task: 'Rephrase an internal Slack update so it reads as a polished customer-facing announcement.',
    zone: 'reliable',
    confidence: 88,
    signals: ['rewriting', 'tone', 'language'],
    reasoning: 'This is rewriting with an audience and tone shift, which the model handles consistently. The input contains all the facts; the model only needs to adjust register, structure, and word choice. Reliable.',
  },

  // ─── EXTENDED · reliable WITH retrieval ───────────────────────────
  {
    id: 'cap-e-1',
    domain: 'healthcare',
    task: 'Answer a policy question with citations to the right handbook section.',
    zone: 'extended',
    confidence: 78,
    signals: ['question-answering', 'retrieval', 'citation'],
    reasoning: 'Without retrieval the model will invent plausible-sounding policy. With a RAG pipeline that retrieves the right handbook section first, this becomes reliable — the model paraphrases the supplied passage and cites the section. Extended zone: needs the retrieval layer to be correct.',
  },
  {
    id: 'cap-e-2',
    domain: 'operations',
    task: 'Look up the current coverage rate for a customer plan, then answer their question.',
    zone: 'extended',
    confidence: 80,
    signals: ['lookup', 'retrieval', 'answering'],
    reasoning: 'The lookup is a deterministic database query; the answering is a language task. With a function-calling tool that queries the plans database first and passes the row to the model, the answer is reliable. The model alone would invent the number.',
  },
  {
    id: 'cap-e-3',
    domain: 'engineering',
    task: 'Generate a SQL query to answer a business question against a known schema.',
    zone: 'extended',
    confidence: 74,
    signals: ['generation', 'schema-grounded', 'code'],
    reasoning: 'Reliable when the schema is supplied in context. Without it, the model invents table and column names that look right but do not exist. With schema retrieval + a query validator, this lands in the extended zone — generation is solid, grounding is the gating factor.',
  },
  {
    id: 'cap-e-4',
    domain: 'product',
    task: 'Recommend the three most relevant changelog entries to surface for a user based on their usage.',
    zone: 'extended',
    confidence: 73,
    signals: ['ranking', 'retrieval', 'personalisation'],
    reasoning: 'The recommendation is a ranking-and-language task; the inputs (changelog, user usage) need to be retrieved into context. Once they are, the model ranks them well and writes the surface copy. Extended zone — retrieval quality determines output quality.',
  },
  {
    id: 'cap-e-5',
    domain: 'general',
    task: 'Answer a question by combining facts from three internal wiki pages.',
    zone: 'extended',
    confidence: 76,
    signals: ['question-answering', 'multi-source-retrieval', 'synthesis'],
    reasoning: 'Multi-source synthesis is reliable once the right pages are retrieved into context. Without retrieval the model confabulates connections. With a hybrid search retriever and reranker, the model is strong at the synthesis step. Extended zone.',
  },
  {
    id: 'cap-e-6',
    domain: 'healthcare',
    task: 'Match a patient referral to the right specialist clinic from a directory of providers.',
    zone: 'extended',
    confidence: 71,
    signals: ['matching', 'retrieval', 'classification'],
    reasoning: 'The matching is a classification problem grounded in the provider directory. With embedding search over the directory plus a final language pass for confidence and reasoning, this is reliable. Without retrieval the model invents specialties.',
  },
  {
    id: 'cap-e-7',
    domain: 'operations',
    task: 'Draft a personalised reply to a complaint, citing the customer’s order history.',
    zone: 'extended',
    confidence: 75,
    signals: ['drafting', 'retrieval', 'personalisation'],
    reasoning: 'Drafting is reliable; the personalisation depends on retrieving the customer’s order history correctly. With a function call that fetches the relevant order and the model citing specific facts from it, the draft is consistent. Extended zone.',
  },

  // ─── UNRELIABLE · wrong even with help ────────────────────────────
  {
    id: 'cap-u-1',
    domain: 'engineering',
    task: 'Compute exact claim adjustment amounts based on coverage tables.',
    zone: 'unreliable',
    confidence: 88,
    signals: ['arithmetic', 'binding-numbers'],
    reasoning: 'Arithmetic is the wrong tool for a language model. Even with retrieval supplying the right rate, the model drifts on the multiplication and rounding. Use a deterministic calculator (Python tool, code execution) for the math and let the model only narrate the result.',
  },
  {
    id: 'cap-u-2',
    domain: 'healthcare',
    task: 'Make a binding compliance determination on whether a claim violates policy.',
    zone: 'unreliable',
    confidence: 95,
    signals: ['high-stakes-decision', 'binding', 'liability'],
    reasoning: 'Binding determinations carry legal and clinical liability. Fluency is not the same as accountability — even when the reasoning sounds correct, the model cannot be the system of record for a determination. Route to a human reviewer with the model providing a summary, never a verdict.',
  },
  {
    id: 'cap-u-3',
    domain: 'operations',
    task: 'Check whether an SLA window is met in real time and trigger an escalation if breached.',
    zone: 'unreliable',
    confidence: 86,
    signals: ['real-time-state', 'binding-action', 'silent-failure-risk'],
    reasoning: 'Real-time state checks need deterministic guarantees. A language model can describe an SLA window but cannot be relied on to fire or suppress the escalation action. Use a rules engine or scheduled job; have the model only draft the message that the rules engine sends.',
  },
  {
    id: 'cap-u-4',
    domain: 'general',
    task: 'Count exact occurrences of a phrase across a large document set.',
    zone: 'unreliable',
    confidence: 90,
    signals: ['counting', 'arithmetic'],
    reasoning: 'Counting is deterministic and a model cannot guarantee it across long contexts. Use a grep or full-text index; have the model only interpret and explain the count, never produce it.',
  },
  {
    id: 'cap-u-5',
    domain: 'product',
    task: 'Decide which experiment variant to roll to 100% based on revenue numbers.',
    zone: 'unreliable',
    confidence: 92,
    signals: ['high-stakes-decision', 'statistics', 'binding'],
    reasoning: 'Rollout decisions need statistical rigor (p-values, confidence intervals, segment analysis) and human accountability. A model can summarise the experiment readout but the call itself should be a PM owning a numeric threshold, not a language model.',
  },
  {
    id: 'cap-u-6',
    domain: 'healthcare',
    task: 'Determine drug dosing for a specific patient from their chart.',
    zone: 'unreliable',
    confidence: 96,
    signals: ['high-stakes-decision', 'arithmetic', 'safety'],
    reasoning: 'Dosing combines arithmetic with safety risk. Even with retrieval supplying the patient weight and renal function, the model cannot be the source of truth on the calculation, and the cost of being wrong is severe. Always a clinician decision; the model can only structure the supporting note.',
  },
  {
    id: 'cap-u-7',
    domain: 'engineering',
    task: 'Approve a large financial transfer based on the customer’s message tone.',
    zone: 'unreliable',
    confidence: 94,
    signals: ['high-stakes-action', 'binding', 'liability'],
    reasoning: 'Tone is not authorisation. The cost of a wrong approval is large and the model cannot carry the accountability for the action. Route to a human approver; the model can prepare a triage summary, but the action must require a person.',
  },

  // ─── Edge cases · easy to misclassify ─────────────────────────────
  {
    id: 'cap-r-8',
    domain: 'operations',
    task: 'Detect the sentiment of an incoming support email.',
    zone: 'reliable',
    confidence: 86,
    signals: ['classification', 'language'],
    reasoning: 'Sentiment is a well-bounded language classification task with abundant training data behind it. Models classify into positive / negative / neutral consistently and explain themselves clearly. Reliable as long as nuance like sarcasm is acknowledged in the prompt.',
  },
  {
    id: 'cap-e-8',
    domain: 'product',
    task: 'Suggest the next best onboarding step for a user based on their last three actions.',
    zone: 'extended',
    confidence: 70,
    signals: ['ranking', 'retrieval', 'recommendation'],
    reasoning: 'Reliable once the action history and onboarding step catalog are retrieved into context. Without retrieval the suggestion is generic. Add a retrieval step + a confidence threshold and this lands in extended.',
  },
  {
    id: 'cap-u-8',
    domain: 'operations',
    task: 'Forecast next quarter revenue based on partial historical data.',
    zone: 'unreliable',
    confidence: 84,
    signals: ['forecasting', 'arithmetic', 'high-stakes-number'],
    reasoning: 'Forecasting needs statistical models with calibrated uncertainty. A language model produces a plausible-sounding number that has no grounding in the time series. Use a forecasting model; the LLM can narrate the result but should not produce it.',
  },
];

// Fuzzy match the learner's typed task against the dataset by word
// overlap. Threshold tuned so unrelated text returns null and falls
// back to a generic-but-grammatical default.
export function matchCapabilityTask(input: string, minOverlap = 0.35): CapabilityEntry | null {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  const STOPWORDS = new Set(['the', 'and', 'for', 'with', 'from', 'into', 'that', 'this', 'are', 'will', 'has', 'have', 'can', 'should']);
  const inputTokens = new Set(normalize(input).filter(w => !STOPWORDS.has(w)));
  if (inputTokens.size === 0) return null;
  let best: { e: CapabilityEntry; score: number } | null = null;
  for (const e of CAPABILITY_DATASET) {
    const taskTokens = normalize(e.task).filter(w => !STOPWORDS.has(w));
    if (taskTokens.length === 0) continue;
    const overlap = taskTokens.filter(t => inputTokens.has(t)).length / taskTokens.length;
    if (!best || overlap > best.score) best = { e, score: overlap };
  }
  return best && best.score >= minOverlap ? best.e : null;
}

// Generic fallback verdict when no dataset entry matches the learner's
// free-text task. Still proper English, still teaches the framework.
export const CAPABILITY_FALLBACK: { reasoning: string; signals: string[] } = {
  reasoning: 'I cannot map this task to a known reliability pattern from the dataset. As a rule of thumb: if the work is language transformation (summary, rewrite, classify, draft from supplied facts) it sits in the reliable zone. If it needs external lookup or retrieval before language work, it is extended. If it requires exact arithmetic, real-time state, or binding decisions, it is unreliable and should be deterministic code with the model only narrating the result.',
  signals: ['needs-classification'],
};
