/* ========= Small helpers ========= */
const bySel = (s, p = document) => p.querySelector(s);
const chatLog = () => document.getElementById('chat-log');
const chatInput = () => bySel('.chat-mas input');
const sendBtn = () => bySel('.chat-mas .button');

function escapeHTML(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function toHTML(msg) { return escapeHTML(msg).replace(/\n/g, '<br>'); }

function detectLang(text = '') {
  // وجود أي حرف عربي = عربي
  return /[\u0600-\u06FF]/.test(text) ? 'ar' : 'en';
}
function normalize(text = '', lang) {
  let t = (text || '').toLowerCase().trim();
  if (lang === 'ar') t = t.replace(/[\u064B-\u0652\u0670\u0640]/g, '');
  t = t.replace(/[.,!?؛،/\\()"'`~[\]{}<>]/g, ' ').replace(/\s+/g, ' ');
  return t;
}

/* ========= UI helpers ========= */
function addMsg(role, msg) {
  const ul = chatLog();
  if (!ul) return;
  const item = document.createElement('li');

  const span = document.createElement('span');
  span.className = `ava ${role === 'ai' ? 'ai' : 'user'}`;
  span.textContent = role === 'ai' ? 'AI' : 'User';

  const bubble = document.createElement('div');
  bubble.className = 'mas';
  bubble.innerHTML = toHTML(msg);

  item.appendChild(span); item.appendChild(bubble);
  ul.appendChild(item);

  const scrollArea = bySel('.scrol-area');
  if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
}

function showTyping(lang = 'en') {
  const ul = chatLog();
  if (!ul) return () => {};
  const item = document.createElement('li');
  const span = document.createElement('span');
  span.className = 'ava ai'; span.textContent = 'AI';
  const bubble = document.createElement('div');
  bubble.className = 'mas';
  bubble.textContent = (lang === 'ar' ? 'جاري الكتابة' : 'typing');

  item.appendChild(span); item.appendChild(bubble);
  ul.appendChild(item);

  let dots = 0;
  const interval = setInterval(() => {
    dots = (dots + 1) % 4;
    const base = (lang === 'ar' ? 'جاري الكتابة' : 'typing');
    bubble.textContent = base + '.'.repeat(dots);
    const scrollArea = bySel('.scrol-area');
    if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
  }, 350);

  return () => { clearInterval(interval); if (ul.contains(item)) ul.removeChild(item); };
}
const sleep = (ms) => new Promise(res => setTimeout(res, ms));
function disableInput(disabled) {
  const btn = sendBtn(), input = chatInput();
  if (btn) btn.disabled = disabled;
  if (input) input.disabled = disabled;
}

/* ========= Knowledge Base (EN & AR) ========= */
const KB = {
  en: [
    {
      keys: ['name', 'who are you', 'your name'],
      answer:
        "Hi! I'm an AI assistant for this profile — I can explain the person's study, skills, projects and contact info."
    },
    {
      keys: ['education', 'study', 'studies', 'major', 'field', 'college', 'university'],
      answer:
        "The person studies Computer Science. Main tracks: Data Analysis (Excel, SQL, Python, R, Power BI) and Web Development (HTML, CSS, JavaScript, React, Next.js)."
    },
    {
      keys: ['skills', 'stack', 'technical skills', 'soft skills', 'what are your skills'],
      answer:
        "Skills\n• Technical: Excel, SQL, Power BI, DAX, Python, R, Data Visualization, HTML, CSS, JavaScript, React, Next.js, Responsive Design, UI/UX principles.\n• Soft: Problem solving, teamwork, communication."
    },
    {
      keys: ['experience', 'experiences', 'work', 'depi', 'google track', 'cs50', 'cisco', 'course', 'courses'],
      answer:
        "Experience\n• DEPI Data Analyst Specialist (Google track) — 2025–Present.\n• Cisco: Introduction to Data Science — Dec 2024.\n• Harvard CS50 — 2024."
    },
    {
      keys: ['projects', 'project', 'portfolio', 'mobogo', 'power bi', 'excel'],
      answer:
        "Projects\n• MoboGo online store (HTML, CSS, JavaScript, PHP, MySQL).\n• Power BI dashboards (interactive visuals, KPIs, filters).\n• Excel analytics (cleaning, Pivot Tables, slicers, KPIs)."
    },
    {
      keys: ['contact', 'email', 'linkedin', 'github', 'reach'],
      answer:
        "Contact\n• Email: fadymaged0120@gmail.com\n• LinkedIn: linkedin.com/in/fady-maged-a05bba297/\n• GitHub: github.com/Fady-Maged-1"
    },
    {
      keys: ['cv', 'resume'],
      answer:
        "You can view or download the resume using the buttons on the page (View/Download Resume)."
    }
  ],
  ar: [
    {
      keys: ['اسمك', 'مين انت', 'انت مين', 'ما اسمك', 'اسم'],
      answer:
        "أهلاً! أنا مساعد آلي للموديل ده — أقدر أشرح الدراسة، المهارات، المشاريع وطرق التواصل."
    },
    {
      keys: ['تعليم', 'بتدرس', 'دراسة', 'تخصص', 'كلية', 'جامعة'],
      answer:
        "الطالب بيدرس علوم الحاسبات. المحاور الرئيسية: تحليل البيانات (Excel، SQL، Python، R، Power BI) وتطوير الويب (HTML، CSS، JavaScript، React، Next.js)."
    },
    {
      keys: ['مهارات', 'سكيلز', 'قدرات', 'تقنيات'],
      answer:
        "المهارات\n• تقنية: Excel، SQL، Power BI، DAX، Python، R، تصور البيانات، HTML، CSS، JavaScript، React، Next.js، تصميم متجاوب.\n• شخصية: حل المشكلات، العمل الجماعي، التواصل."
    },
    {
      keys: ['خبرة', 'خبرتك', 'خبرات', 'depi', 'ديبي', 'جوجل', 'cs50', 'هارفارد', 'cisco', 'سيسكو', 'كورسات', 'كورس'],
      answer:
        "الخبرات\n• DEPI Data Analyst Specialist (Google track) — 2025–الآن.\n• Cisco: Introduction to Data Science — ديسمبر 2024.\n• Harvard CS50 — 2024."
    },
    {
      keys: ['مشاريع', 'مشروع', 'بروجكت', 'بروجكتات', 'mobogo', 'باور بي آي', 'power bi', 'excel', 'إكسل'],
      answer:
        "المشاريع\n• MoboGo — متجر إلكتروني (HTML، CSS، JavaScript، PHP، MySQL).\n• لوحات Power BI تفاعلية (Visuals، KPIs، فلاتر).\n• تحليلات Excel (تنظيف، Pivot، Slicers، KPIs)."
    },
    {
      keys: ['تواصل', 'ايميل', 'بريد', 'لينكدان', 'لينكدإن', 'جيتهاب', 'اكلمك', 'تواصل'],
      answer:
        "التواصل\n• البريد: fadymaged0120@gmail.com\n• لينكدإن: linkedin.com/in/fady-maged-a05bba297/\n• جيتهاب: github.com/Fady-Maged-1"
    },
    {
      keys: ['cv', 'السيرة الذاتية', 'سي في', 'resume', 'رزيوميه'],
      answer:
        "تقدر تشوف أو تنزّل السيرة الذاتية من الأزرار الموجودة في الصفحة (عرض/تحميل السيرة الذاتية)."
    }
  ]
};

const FALLBACK = {
  en:
    "I can answer about: name, education, skills, experience, projects, and contact.\nTry: “What are your skills?” or “Tell me about your projects.”",
  ar:
    "أقدر أجاوب عن: الاسم، الدراسة، المهارات، الخبرات، المشاريع، وطرق التواصل.\nجرّب: «مهاراتك إيه؟» أو «كلّمني عن مشاريعك»."
};

/* ========= Small talk & extras ========= */
const JOKES = {
  en: [
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "I told my computer I needed a break… it said: ‘No problem, I’ll go to sleep.’",
    "There are 10 types of people in the world: those who understand binary and those who don’t.",
    "Debugging: being the detective in a movie where you're the suspect."
  ],
  ar: [
    "ليه المبرمج بيحب القهوة؟ عشان من غيرها الكود مش بيرن! ☕",
    "المبرمج لما يشتغل لوقت طويل يقول: محتاج Compile وقهوة.",
    "فيه 10 أنواع من الناس: اللي بفهموا الـ binary واللي لأ.",
    "أحسن طريقة تشرح بها خطأ: قول 'it works on my machine' 😂"
  ]
};

/* ========= Intents (موسعة) ========= */
const INTENTS = {
  greet: {
    en: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon'],
    ar: ['ازيك', 'ازيك؟', 'اهلا', 'أهلاً', 'مرحبا', 'سلام', 'صباح الخير', 'مساء الخير', 'هاي', 'هلا']
  },
  thanks: {
    en: ['thanks', 'thank you', 'thx', 'appreciate'],
    ar: ['شكرا', 'شكرًا', 'متشكر', 'يسلمو', 'ميرسي']
  },
  joke: {
    en: ['joke', 'funny', 'make me laugh', 'tell me a joke'],
    ar: ['نكتة', 'نكته', 'ضحكني', 'قول نكتة', 'عايز نكتة', 'عايز نكته']
  },
  clear: {
    en: ['clear', 'reset', 'wipe', 'delete chat'],
    ar: ['امسح', 'مسح', 'نضف', 'ابدأ من جديد']
  },
  help: {
    en: ['help', 'what can you do', 'how to use', 'guide'],
    ar: ['مساعدة', 'بتعمل ايه', 'تقدر تعمل ايه', 'ازاي استخدم', 'دليل']
  },
  time: {
    en: ['time', 'date', 'today', 'now'],
    ar: ['الوقت', 'الساعة كام', 'التاريخ', 'النهارده', 'دلوقتي']
  },
  howareyou: {
    en: ['how are you', 'how are you doing', "what's up", 'howdy', 'you ok', 'how is it going'],
    ar: ['عامل ايه', 'ازيك عامل ايه', 'كيفك', 'ايه الاخبار', 'عاملين ايه', 'عامل ايه؟']
  },
  ack: {
    en: ['ok', 'okay', 'got it', 'alright', 'fine', 'sure'],
    ar: ['ماشي', 'تمام', 'حاضر', 'خلاص', 'طيب', 'اوكي', 'موافق']
  }
};

function matchIntent(text, lang) {
  const norm = normalize(text, lang);
  for (const [name, dict] of Object.entries(INTENTS)) {
    const list = dict[lang] || [];
    for (const k of list) {
      const keyNorm = normalize(k, lang);
      if (keyNorm && norm.includes(keyNorm)) return name;
    }
  }
  return null;
}

let jokeIndex = { en: 0, ar: 0 };
function nextJoke(lang) {
  const arr = JOKES[lang] || JOKES.en;
  const j = arr[jokeIndex[lang] % arr.length];
  jokeIndex[lang] = (jokeIndex[lang] + 1) % arr.length;
  return j;
}

function intentReply(intent, lang) {
  if (!intent) return null;

  if (intent === 'greet') {
    return lang === 'ar'
      ? `أهلاً! 👋 أنا الـ AI هنا. تحب نبتدي بحاجة معينة؟`
      : `Hello! 👋 I'm the AI assistant here. Want to start with something specific?`;
  }

  if (intent === 'thanks') {
    return lang === 'ar' ? 'العفو! تحت أمرك في أي وقت 🙌' : "You're welcome! Happy to help 🙌";
  }

  if (intent === 'help') {
    return lang === 'ar'
      ? "ممكن أساعد في: السيرة، المهارات، المشاريع، شرح كود بسيط، أو نصايح تطوير. جرّب: «كلمني عن مشاريعك» أو «ظبطلي CSS»."
      : "I can help with: resume info, skills, projects, simple code explanations, or dev tips. Try: “Tell me about your projects” or “Fix my CSS”.";
  }

  if (intent === 'time') {
    const d = new Date();
    const dateEn = d.toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' });
    const dateAr = d.toLocaleString('ar-EG', { dateStyle: 'long', timeStyle: 'short', hour12: false });
    return lang === 'ar' ? `التاريخ والوقت: ${dateAr}` : `Date & time: ${dateEn}`;
  }

  if (intent === 'joke') {
    return nextJoke(lang);
  }

  if (intent === 'clear') {
    const ul = chatLog();
    if (ul) ul.innerHTML = '';
    // keep focus after clearing
    const inputEl = chatInput();
    if (inputEl) inputEl.focus();
    return lang === 'ar' ? 'اتمسح الشات. نبدأ من جديد! ✨' : 'Chat cleared. Starting fresh! ✨';
  }

  if (intent === 'howareyou') {
    if (lang === 'ar') {
      const choices = [
        `الحمد لله تمام 🙂. أخبارك إيه؟`,
        `ماشي الحال، مستعد أساعدك. حابب تسأل عن حاجة؟`,
        `كويس، شكراً! تحب نصيحة سريعة أو حل لمشكلة؟`
      ];
      return choices[Math.floor(Math.random() * choices.length)];
    } else {
      const choices = [
        `I'm doing well, thanks! How about you?`,
        `All good here — ready to help. What's up?`,
        `Doing fine! Want a quick tip or help with a problem?`
      ];
      return choices[Math.floor(Math.random() * choices.length)];
    }
  }

  if (intent === 'ack') {
    return lang === 'ar'
      ? `تمام — لو حابب تكمل اسألني بأي وقت. 🙂`
      : `Got it — tell me whenever you want to continue. 🙂`;
  }

  return null;
}

/* ========= Smarter fallback ========= */
function smartFallback(userText, lang) {
  const norm = normalize(userText, lang);

  if ((lang === 'en' && (norm.includes('how') || norm.includes('how to') || norm.includes('explain'))) ||
      (lang === 'ar' && (norm.includes('ازاي') || norm.includes('كيف') || norm.includes('شرح')))) {
    if (lang === 'ar') {
      return `طيب هشرحها خطوة خطوة:\n1) اكتب الهدف أو الصعوبة.\n2) اعطيني مثال صغير يكرر المشكلة.\n3) هاقترح حلول وتجربها.\nابعتلي الكود أو المثال لو عايبك أطبق مثال عملي.`;
    } else {
      return `Okay — here's a short how-to template:\n1) Define the goal or paste the code/problem.\n2) Share a minimal example that reproduces it.\n3) Try suggested fixes and tell me the result.\nIf you want a practical example, paste your code or describe the exact issue.`;
    }
  }

  const codeKeysEn = ['css', 'html', 'javascript', 'js', 'react', 'sql', 'python', 'java'];
  const codeKeysAr = ['css', 'html', 'javascript', 'جافا', 'بايثون', 'ريأكت', 'sql'];

  if (lang === 'en' && codeKeysEn.some(k => norm.includes(k))) {
    return "If this is a code issue, paste the minimal snippet and I'll point the exact lines to change and explain why.";
  }
  if (lang === 'ar' && codeKeysAr.some(k => norm.includes(k))) {
    return "لو المشكلة في كود، ابعتلي جزء صغير يكرر المشكلة وهاقولك الأسطر اللي نعدّلها واشرحلك السبب خطوة خطوة.";
  }

  return FALLBACK[lang] + (lang === 'ar' ? '\nلو تحب اكتب سؤالك بصيغة أبسط أو ادي مثال.' : '\nIf you want, rephrase or give an example and I’ll help.');
}

/* ========= KB matching ========= */
function findAnswer(userText) {
  const lang = detectLang(userText);
  const norm = normalize(userText, lang);
  const bank = KB[lang] || [];

  const intent = matchIntent(userText, lang);
  const intentAns = intentReply(intent, lang);
  if (intentAns) return intentAns;

  for (const item of bank) {
    for (const k of item.keys) {
      const keyNorm = normalize(k, lang);
      if (keyNorm && norm.includes(keyNorm)) {
        return item.answer;
      }
    }
  }

  return smartFallback(userText, lang);
}

/* ========= Send flow ========= */
async function handleSend() {
  const inputEl = chatInput();
  if (!inputEl) return;
  const raw = inputEl.value;
  const text = (raw || '').trim();
  if (!text) return;

  addMsg('user', text);
  inputEl.value = '';

  const lang = detectLang(text);
  const removeTyping = showTyping(lang);
  disableInput(true);

  const reply = findAnswer(text);

  const simulatedMs = Math.min(1500, Math.max(300, reply.length * 10));
  await sleep(simulatedMs);

  removeTyping();
  addMsg('ai', reply);
  disableInput(false);

  // keep focus in the input so the caret (cursor) stays visible
  if (inputEl) {
    inputEl.focus();
  }
}

function initChat() {
  const btn = sendBtn();
  const inputEl = chatInput();
  if (btn) {
    // prevent the button from taking focus when clicked (keeps caret in input)
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });
    btn.addEventListener('click', handleSend);
  }
  if (inputEl) {
    // allow enter to send
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); handleSend(); }
    });
    // set English placeholder as requested
    inputEl.placeholder = "Type a message... (e.g. 'What are your skills?')";
    // try to autofocus on load
    inputEl.autofocus = true;
  }

  // no initial welcome message (per request). Input will be focused on load:
  window.addEventListener('load', () => {
    const inp = chatInput();
    if (inp) inp.focus();
  });
}

document.addEventListener('DOMContentLoaded', initChat);
