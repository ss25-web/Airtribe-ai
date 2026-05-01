const fs = require('fs');
const content = fs.readFileSync('src/components/SWEPreRead1.tsx', 'utf-8');

const componentsToExtract = [
  'const ProtagonistAvatar',
  'const StoryCard',
  'const SWEMentorFace',
  'const SWEAvatar',
  'const SWEConversationScene'
];

let extracted = `import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SWETrack } from './sweTypes';
import { useLearnerStore } from '@/lib/learnerStore';

export type CSLine = { speaker: 'protagonist' | 'mentor'; text: string };

`;

const lines = content.split('\n');

function extractComponent(startSignature) {
  const startIdx = lines.findIndex(l => l.includes(startSignature));
  if (startIdx === -1) return '';
  let endIdx = startIdx;
  let braceCount = 0;
  let started = false;
  
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('{')) {
       braceCount += (line.match(/\{/g) || []).length;
       started = true;
    }
    if (line.includes('}')) {
       braceCount -= (line.match(/\}/g) || []).length;
    }
    if (started && braceCount === 0) {
       endIdx = i;
       if (lines[i].includes(');')) endIdx = i;
       else if (lines[i+1] && lines[i+1].includes(');')) endIdx = i + 1;
       break;
    }
  }
  
  if (startSignature === 'const StoryCard' && !started) {
     let parenCount = 0;
     let parenStarted = false;
     for (let i = startIdx; i < lines.length; i++) {
       const line = lines[i];
       if (line.includes('(')) { parenCount += (line.match(/\(/g) || []).length; parenStarted = true; }
       if (line.includes(')')) { parenCount -= (line.match(/\)/g) || []).length; }
       if (parenStarted && parenCount === 0) {
          endIdx = i;
          if (lines[i].includes(');')) endIdx = i;
          break;
       }
     }
  }
  
  return 'export ' + lines.slice(startIdx, endIdx + 1).join('\n') + '\n\n';
}

for (const comp of componentsToExtract) {
   extracted += extractComponent(comp);
}

fs.writeFileSync('src/components/sweDesignSystem.tsx', extracted);
console.log('Extracted components to src/components/sweDesignSystem.tsx');
