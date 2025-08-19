


/* ========= Small helpers ========= */
const bySel = (s, p = document) => p.querySelector(s);
const chatLog = () => document.getElementById('chat-log');
const chatInput = () => bySel('.chat-mas input');

function escapeHTML(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function detectLang(text) {
  // وجود أي حرف عربي = عربي
  return /[\u0600-\u06FF]/.test(text) ? 'ar' : 'en';
}

function normalize(text, lang) {
  let t = text.toLowerCase().trim();
  // إزالة التشكيل والتمطيط في العربي
  if (lang === 'ar') t = t.replace(/[\u064B-\u0652\u0670\u0640]/g, '');
  return t;
}

function addMsg(role, msg) {
  const ul = chatLog();
  if (!ul) return;
  const item = document.createElement('li');
  const span = document.createElement('span');
  span.className = `ava ${role === 'ai' ? 'ai' : 'user'}`;
  span.textContent = role === 'ai' ? 'AI' : 'User';
  const bubble = document.createElement('div');
  bubble.className = 'mas';
  bubble.innerHTML = escapeHTML(msg);
  item.appendChild(span);
  item.appendChild(bubble);
  ul.appendChild(item);
  // scroll to bottom
  const scrollArea = bySel('.scrol-area');
  if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
}

/* ========= Knowledge Base (EN & AR) ========= */
/* اختصرته ومركز على اللي موجود في بورتفوليوك: الاسم، التعليم/التركيز، المهارات، الخبرات، المشاريع، التواصل */
const KB = {
  en: [
    {
      keys: ['name', 'who are you', 'your name'],
      answer:
        "Hi! I'm Fady Maged Annise — a Computer Science student driven by curiosity and creativity, focusing on Data Analysis and Front-End Development."
    },
    {
      keys: ['education', 'study', 'studies', 'major', 'field', 'college', 'university'],
      answer:
        "I'm a Computer Science student. I focus on two tracks: Data Analysis (Excel, SQL, Python, R, Power BI) and Web Development (HTML, CSS, JavaScript, React, Next.js)."
    },
    {
      keys: ['skills', 'stack', 'technical skills', 'soft skills', 'what are your skills'],
      answer:
        "Skills — Technical: Excel, SQL, Power BI, DAX, Python, R, Data Visualization, HTML, CSS, JavaScript, React, Next.js, Responsive Design, UI/UX principles. Soft: Problem solving, teamwork, communication."
    },
    {
      keys: ['experience', 'experiences', 'work', 'depi', 'google track', 'cs50', 'cisco', 'course', 'courses'],
      answer:
        "Experience: • DEPI Data Analyst Specialist (Google track) — 2025–Present. • Cisco: Introduction to Data Science — issued Dec 2024. • Harvard CS50 — 2024."
    },
    {
      keys: ['projects', 'project', 'portfolio', 'mobogo', 'power bi', 'excel'],
      answer:
        "Projects: • MoboGo online store (HTML, CSS, JavaScript, PHP, MySQL). • Data Analysis with Power BI (interactive dashboards, KPIs, filters). • Data Analysis with Excel (cleaning, pivot tables, slicers, KPIs)."
    },
    {
      keys: ['contact', 'email', 'linkedin', 'github', 'reach'],
      answer:
        "Contact: Email: fadymaged0120@gmail.com • LinkedIn: /in/fadymagedannise • GitHub: Fady-Maged-1."
    },
    {
      keys: ['cv', 'resume'],
      answer:
        "You can view or download my resume from the buttons on the site (View my Resume / Download my Resume)."
    }
  ],
  ar: [
    {
      keys: ['اسمك', 'مين انت', 'انت مين', 'ما اسمك', 'اسم'],
      answer:
        "أهلاً! أنا فادي ماجد أنيس — طالب علوم حاسب شغوف بالفضول والإبداع، مركّز على تحليل البيانات وتطوير الواجهات الأمامية."
    },
    {
      keys: ['تعليم', 'بتدرس', 'دراسة', 'تخصص', 'كلية', 'جامعة'],
      answer:
        "أنا طالب علوم حاسب. مركّز على مسارين: تحليل البيانات (Excel, SQL, Python, R, Power BI) وتطوير الويب (HTML, CSS, JavaScript, React, Next.js)."
    },
    {
      keys: ['مهارات', 'سكيلز', 'قدرات', 'تقنيات'],
      answer:
        "المهارات — التقنية: Excel، SQL، Power BI، DAX، Python، R، Data Visualization، HTML، CSS، JavaScript، React، Next.js، تصميم متجاوب، مبادئ UI/UX. الشخصية: حل المشكلات، العمل الجماعي، التواصل."
    },
    {
      keys: ['خبرة', 'خبرتك', 'خبرات', 'depi', 'ديبي', 'جوجل', 'cs50', 'هارفارد', 'cisco', 'سيسكو', 'كورسات', 'كورس'],
      answer:
        "الخبرات: • DEPI Data Analyst Specialist (Google track) — 2025–الآن. • Cisco: Introduction to Data Science — صادرة ديسمبر 2024. • Harvard CS50 — 2024."
    },
    {
      keys: ['مشاريع', 'مشروع', 'بروجكت', 'بروجكتات', 'mobogo', 'باور بي آي', 'power bi', 'excel', 'إكسل'],
      answer:
        "المشاريع: • MoboGo متجر إلكتروني (HTML, CSS, JavaScript, PHP, MySQL). • تحليل بيانات بـ Power BI (لوحات تفاعلية ومؤشرات). • تحليل بيانات بإكسل (تنظيف، Pivot، Slicers، KPIs)."
    },
    {
      keys: ['تواصل', 'ايميل', 'بريد', 'لينكدإن', 'جيتهاب', 'تقدر اكلمك'],
      answer:
        "التواصل: البريد الإلكتروني: fadymaged0120@gmail.com • لينكدإن: /in/fadymagedannise • جيتهاب: Fady-Maged-1."
    },
    {
      keys: ['cv', 'السيرة الذاتية', 'سي في', 'resume'],
      answer:
        "تقدر تشوف أو تنزل السيرة الذاتية من الأزرار الموجودة في الموقع (View my Resume / Download my Resume)."
    }
  ]
};

const FALLBACK = {
  en:
    "I can answer about: name, education, skills, experience, projects, and contact. Try: “What are your skills?” or “Tell me about your projects.”",
  ar:
    "أقدر أجاوب عن: الاسم، الدراسة، المهارات، الخبرات، المشاريع، وطرق التواصل. جرّب: «مهاراتك إيه؟» أو «كلمّني عن مشاريعك»."
};

/* ========= Matching ========= */
function findAnswer(userText) {
  const lang = detectLang(userText);
  const norm = normalize(userText, lang);
  const bank = KB[lang];

  for (const item of bank) {
    for (const k of item.keys) {
      const keyNorm = normalize(k, lang);
      if (norm.includes(keyNorm)) {
        return item.answer;
      }
    }
  }
  return FALLBACK[lang];
}

/* ========= Send flow ========= */
function handleSend() {
  const inputEl = chatInput();
  if (!inputEl) return;
  const raw = inputEl.value;
  const text = raw.trim();
  if (!text) return;

  addMsg('user', text);
  const reply = findAnswer(text);
  addMsg('ai', reply);

  inputEl.value = '';
}

function initChat() {
  const btn = bySel('.chat-mas button');
  const inputEl = chatInput();
  if (btn) btn.addEventListener('click', handleSend);
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }
}

document.addEventListener('DOMContentLoaded', initChat);
