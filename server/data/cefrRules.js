const CEFR_RULES = {
  A1: {
    grammar: [
      'to be (am/is/are)', 'have got', 'Present Simple', 'can/can\'t', 'there is/are',
      'prepositions (in, on, at, to)', 'possessive adjectives (my, your, his)'
    ],
    vocabulary: '300-500 common words. Personal info, family, objects, numbers, days, colors.',
  },
  A2: {
    grammar: [
      'Past Simple', 'Present Continuous', 'be going to', 'comparatives/superlatives',
      'Present Perfect (basic experience)', 'countable/uncountable nouns'
    ],
    vocabulary: '1000 words. Daily routines, hobbies, food/drinks, giving directions, past events.',
  },
  B1: {
    grammar: [
      'Past Continuous', 'Present Perfect (all)', 'will/going to', 'Conditionals (0,1,2)',
      'Passive Voice (simple tenses)', 'basic phrasal verbs'
    ],
    vocabulary: '2000 words. Emotions, ideas, dreams, experiences, intro to abstract topics.',
  },
  B2: {
    grammar: [
      'Past Perfect', 'Past Perfect Continuous', 'Conditionals (all)', 'Reported Speech',
      'Passive Voice (all)', 'complex phrasal verbs, idioms'
    ],
    vocabulary: '4000 words. Concrete/abstract topics, current events, work/education debates.',
  },
  C1: {
    grammar: [
      'Future Continuous', 'Future Perfect', 'inversion', 'cleft sentences',
      'modal verbs with nuance (might have, could have done)'
    ],
    vocabulary: 'Wide and flexible vocabulary. Understand/register nuance, uncommon idioms.',
  },
  C2: {
    grammar: [
      'Mastery of all structures, flexibility and style variation as native speaker would.'
    ],
    vocabulary: 'Very wide, academic, technical and abstract vocabulary, cultural nuance.',
  },
};

export default CEFR_RULES;
