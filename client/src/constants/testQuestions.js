// Seviye tespit testi (tüm seviyeler için)
export const levelTestQuestions = [
  {
    text: "1. Which sentence is correct?",
    options: [
      "She go to school every day.",
      "She goes to school every day.",
      "She going to school every day.",
      "She gone to school every day."
    ],
    level: "A1 (Temel Zamanlar)"
  },
  {
    text: "2. What does 'rarely' mean?",
    options: ["Always", "Often", "Seldom", "Never"],
    level: "A2 (Kelime Anlamı – Zarf)"
  },
  {
    text: "3. If I had studied harder, I _____ the exam.",
    options: ["will pass", "would have passed", "passed", "will passed"],
    level: "B2 (Koşul Cümleleri – Third Conditional)"
  },
  {
    text: "4. Choose the correct question tag: You're coming to the party, _____?",
    options: ["aren't you", "don't you", "isn't it", "won't you"],
    level: "B1 (Question Tags)"
  },
  {
    text: "5. The book _____ on the table.",
    options: ["are", "is", "were", "be"],
    level: "A1 (To be)"
  },
  {
    text: "6. I have lived in this city _____ 2010.",
    options: ["for", "since", "at", "by"],
    level: "B1 (Present Perfect – Time Expressions)"
  },
  {
    text: "7. Which of the following is a synonym for 'happy'?",
    options: ["Sad", "Angry", "Joyful", "Nervous"],
    level: "A2 (Eş Anlamlılar)"
  },
  {
    text: "8. This is the man _____ house was robbed.",
    options: ["who", "whom", "whose", "which"],
    level: "B2 (Relative Clauses)"
  },
  {
    text: "9. I'm used to _____ up early.",
    options: ["get", "getting", "gets", "got"],
    level: "B1-B2 (Gerunds / alışkanlık ifadeleri)"
  },
  {
    text: "10. Not only _____ late, but he also forgot his homework.",
    options: ["he arrived", "arrived he", "did he arrive", "he did arrive"],
    level: "C1 (Inversion)"
  }
];

// Doğru cevapların indexleri (A:0, B:1, C:2, D:3)
export const levelTestCorrectAnswers = [1, 2, 1, 0, 1, 1, 2, 2, 1, 2];

// Beginner seviye testleri
export const beginnerTests = [
  {
    id: "beginner-grammar-1",
    title: "Temel Gramer Testi",
    description: "Basit zamanlar ve temel gramer kuralları",
    duration: 15, // dakika
    questions: [
      {
        text: "1. I _____ a student.",
        options: ["am", "is", "are", "be"],
        correctAnswer: 0
      },
      {
        text: "2. She _____ to school every day.",
        options: ["go", "goes", "going", "gone"],
        correctAnswer: 1
      },
      {
        text: "3. They _____ in London.",
        options: ["live", "lives", "living", "lived"],
        correctAnswer: 0
      },
      {
        text: "4. What _____ your name?",
        options: ["am", "is", "are", "be"],
        correctAnswer: 1
      },
      {
        text: "5. We _____ English.",
        options: ["speak", "speaks", "speaking", "spoke"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: "beginner-vocabulary-1",
    title: "Temel Kelime Testi",
    description: "Günlük hayatta kullanılan temel kelimeler",
    duration: 10,
    questions: [
      {
        text: "1. What is the opposite of 'big'?",
        options: ["Large", "Small", "Huge", "Great"],
        correctAnswer: 1
      },
      {
        text: "2. Which word means 'happy'?",
        options: ["Sad", "Joyful", "Angry", "Tired"],
        correctAnswer: 1
      },
      {
        text: "3. What do you call a person who teaches?",
        options: ["Student", "Teacher", "Doctor", "Engineer"],
        correctAnswer: 1
      },
      {
        text: "4. Which is a color?",
        options: ["Fast", "Blue", "Loud", "Soft"],
        correctAnswer: 1
      },
      {
        text: "5. What is the opposite of 'hot'?",
        options: ["Warm", "Cold", "Cool", "Fresh"],
        correctAnswer: 1
      }
    ]
  }
];

// Intermediate seviye testleri
export const intermediateTests = [
  {
    id: "intermediate-grammar-1",
    title: "Orta Seviye Gramer Testi",
    description: "Present Perfect, Past Continuous ve diğer orta seviye konular",
    duration: 20,
    questions: [
      {
        text: "1. I _____ in this city for 5 years.",
        options: ["live", "lived", "have lived", "am living"],
        correctAnswer: 2
      },
      {
        text: "2. She _____ when I called her.",
        options: ["cooks", "cooked", "was cooking", "has cooked"],
        correctAnswer: 2
      },
      {
        text: "3. Have you ever _____ to Paris?",
        options: ["go", "went", "gone", "going"],
        correctAnswer: 2
      },
      {
        text: "4. I _____ my homework yet.",
        options: ["don't finish", "didn't finish", "haven't finished", "am not finishing"],
        correctAnswer: 2
      },
      {
        text: "5. They _____ each other for 10 years.",
        options: ["know", "knew", "have known", "are knowing"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "intermediate-vocabulary-1",
    title: "Orta Seviye Kelime Testi",
    description: "İş ve akademik hayatta kullanılan kelimeler",
    duration: 15,
    questions: [
      {
        text: "1. What does 'accomplish' mean?",
        options: ["Start", "Finish", "Achieve", "Begin"],
        correctAnswer: 2
      },
      {
        text: "2. Which word means 'very tired'?",
        options: ["Sleepy", "Exhausted", "Lazy", "Weak"],
        correctAnswer: 1
      },
      {
        text: "3. What is a 'deadline'?",
        options: ["A line", "A time limit", "A goal", "A plan"],
        correctAnswer: 1
      },
      {
        text: "4. Which word means 'to increase'?",
        options: ["Decrease", "Reduce", "Enhance", "Lower"],
        correctAnswer: 2
      },
      {
        text: "5. What does 'efficient' mean?",
        options: ["Fast", "Productive", "Quick", "All of the above"],
        correctAnswer: 3
      }
    ]
  }
];

// Upper-Intermediate seviye testleri
export const upperIntermediateTests = [
  {
    id: "upper-intermediate-grammar-1",
    title: "İleri Orta Seviye Gramer Testi",
    description: "Conditionals, Passive Voice ve diğer ileri konular",
    duration: 25,
    questions: [
      {
        text: "1. If I _____ rich, I would travel the world.",
        options: ["am", "was", "were", "be"],
        correctAnswer: 2
      },
      {
        text: "2. The book _____ by many students.",
        options: ["reads", "is read", "has read", "read"],
        correctAnswer: 1
      },
      {
        text: "3. I wish I _____ to the party.",
        options: ["go", "went", "had gone", "would go"],
        correctAnswer: 2
      },
      {
        text: "4. She suggested _____ to the cinema.",
        options: ["go", "going", "to go", "went"],
        correctAnswer: 1
      },
      {
        text: "5. The house _____ last year.",
        options: ["builds", "built", "was built", "has built"],
        correctAnswer: 2
      }
    ]
  }
];

// Advanced seviye testleri
export const advancedTests = [
  {
    id: "advanced-grammar-1",
    title: "İleri Seviye Gramer Testi",
    description: "Inversion, Cleft Sentences ve diğer ileri gramer konuları",
    duration: 30,
    questions: [
      {
        text: "1. Not only _____ late, but he also forgot his homework.",
        options: ["he arrived", "arrived he", "did he arrive", "he did arrive"],
        correctAnswer: 2
      },
      {
        text: "2. It was John _____ won the prize.",
        options: ["who", "whom", "which", "that"],
        correctAnswer: 0
      },
      {
        text: "3. Had I known about the meeting, I _____ attended.",
        options: ["would", "would have", "will", "will have"],
        correctAnswer: 1
      },
      {
        text: "4. No sooner _____ home than it started raining.",
        options: ["I got", "did I get", "I had got", "had I got"],
        correctAnswer: 1
      },
      {
        text: "5. The more you practice, _____ you become.",
        options: ["the better", "better", "the best", "best"],
        correctAnswer: 0
      }
    ]
  }
];

// Tüm testleri seviyeye göre grupla
export const testsByLevel = {
  beginner: beginnerTests,
  intermediate: intermediateTests,
  "upper-intermediate": upperIntermediateTests,
  advanced: advancedTests
};

// Seviye tespit testi için özel obje
export const levelDetectionTest = {
  id: "level-detection",
  title: "Seviye Tespit Sınavı",
  description: "İngilizce seviyenizi belirlemek için kapsamlı test",
  duration: 30,
  questions: levelTestQuestions,
  correctAnswers: levelTestCorrectAnswers
}; 