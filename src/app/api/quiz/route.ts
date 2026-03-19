import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface QuizRequest {
  conceptId: string;
  conceptName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  moduleContext: string;
  masteredConcepts: string[];
  weakConcepts: string[];
  previousQuestions?: string[];
}

export interface GeneratedQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  keyInsight: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: QuizRequest = await req.json();
    const { conceptId, conceptName, difficulty, moduleContext, masteredConcepts, weakConcepts, previousQuestions } = body;

    const difficultyGuide = {
      easy: 'definitional, recognition-based. Should be answerable with basic understanding.',
      medium: 'application-based. Requires understanding in context, not just definitions.',
      hard: 'analysis/synthesis-based. Requires connecting multiple concepts or identifying edge cases.',
    };

    const systemPrompt = `You are an expert PM educator creating adaptive quiz questions.
Your questions should be intellectually stimulating, directly tied to real PM work, and designed to build genuine understanding.
Always respond with valid JSON only, no markdown.`;

    const userPrompt = `Generate ONE multiple-choice quiz question for a PM learning module.

CONCEPT TO TEST: "${conceptName}" (ID: ${conceptId})
DIFFICULTY: ${difficulty} — ${difficultyGuide[difficulty]}
MODULE CONTEXT: ${moduleContext}
ALREADY MASTERED: ${masteredConcepts.length > 0 ? masteredConcepts.join(', ') : 'None yet'}
WEAK AREAS: ${weakConcepts.length > 0 ? weakConcepts.join(', ') : 'None identified'}
${previousQuestions?.length ? `AVOID REPEATING THESE ANGLES: ${previousQuestions.slice(-3).join(' | ')}` : ''}

REQUIREMENTS:
- Question must be realistic — drawn from actual PM scenarios, not textbook definitions
- Create exactly 4 options: 1 clearly correct, 3 plausible distractors representing real misconceptions
- The explanation should teach the "why", not just confirm the answer
- keyInsight should be 1 punchy sentence a PM can apply tomorrow

Respond with this exact JSON structure:
{
  "question": "...",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "correctIndex": 0,
  "explanation": "...",
  "keyInsight": "..."
}`;

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      thinking: { type: 'adaptive' },
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const textBlock = response.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Could not parse JSON response');

    const parsed = JSON.parse(jsonMatch[0]);

    const quiz: GeneratedQuiz = {
      question: parsed.question,
      options: parsed.options,
      correctIndex: parsed.correctIndex,
      explanation: parsed.explanation,
      conceptId,
      difficulty,
      keyInsight: parsed.keyInsight,
    };

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}
