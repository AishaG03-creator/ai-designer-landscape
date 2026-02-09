import { Category } from './types';

// Helper to generate search link
const getLink = (name: string) => `https://www.google.com/search?q=${encodeURIComponent(name + ' AI tool')}`;

// Helper to get a random recent date for demo purposes (last 365 days)
const getRandomDate = () => {
  const end = new Date();
  const start = new Date(new Date().setFullYear(end.getFullYear() - 1));
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const fixedDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
}

// Dropbox-inspired palette: Sharp, vibrant, distinct
export const CATEGORIES: Category[] = [
  {
    id: '1',
    title: 'Research, Discovery & Strategy',
    shortTitle: 'Research & Strategy',
    description: 'Faster, deeper synthesis → better problem framing.',
    color: '#FF808B', // Salmon
    isDark: false,
    iconName: 'Search',
    tools: [
      {
        name: 'Helply',
        url: 'https://www.producthunt.com/products/helply',
        description: 'Helply analyzes user research summaries to automatically map out necessary feature flows and decision trees for your next design sprint.'
      },
      {
        name: 'Ask Ellie',
        url: 'https://www.producthunt.com/products/ask-ellie',
        description: 'Ask Ellie summarizes large volumes of raw user research and interview transcripts, providing immediate, consolidated pain points and needs.'
      },
      {
        name: 'Dottie',
        url: 'https://www.producthunt.com/products/dottie',
        description: 'Dottie synthesizes unstructured user interviews and competitive analysis into prioritized feature recommendations ready for sketching.'
      },
      {
        name: 'Emra / Always on Transcription and PTT',
        url: 'https://www.producthunt.com/products/emra',
        description: 'Ensure zero data loss from user interviews and design discussions by continuously transcribing speech, allowing you to focus completely on the convers'
      },
      { name: 'Dovetail AI', url: getLink('Dovetail AI'), description: 'Auto-tagging and sentiment analysis for user research repositories.', dateAdded: fixedDate(120) },
      { name: 'Condens AI', url: getLink('Condens AI'), description: 'Transcription and analysis automation for UX researchers.', dateAdded: fixedDate(140) },
      { name: 'EnjoyHQ', url: getLink('EnjoyHQ'), description: 'Centralize customer insights with AI-powered search and clustering.', dateAdded: fixedDate(200) },
      { name: 'Reframer AI', url: getLink('Reframer AI'), description: 'Qualitative research synthesis assistant.', dateAdded: fixedDate(45) },
      { name: 'ChatGPT', url: getLink('ChatGPT'), description: 'General purpose LLM for synthesizing notes and brainstorming research plans.', dateAdded: fixedDate(300) },
      { name: 'Claude', url: getLink('Claude'), description: 'High-context window LLM excellent for analyzing long interview transcripts.', dateAdded: fixedDate(100) },
      { name: 'Perplexity', url: getLink('Perplexity'), description: 'AI-powered search engine for rapid desk research and fact-finding.', dateAdded: fixedDate(60) },
    ],
    features: [
      'Interview summarization',
      'Insight clustering',
      'Sentiment detection',
      'Persona & JTBD generation',
      'Competitive analysis'
    ]
  },
  {
    id: '2',
    title: 'Ideation & Concept Design',
    shortTitle: 'Ideation',
    description: 'Expands solution space and reduces early friction.',
    color: '#FFD966', // Yellow
    isDark: false,
    iconName: 'Lightbulb',
    tools: [
      {
        name: 'Good Assistant',
        url: 'https://www.producthunt.com/products/good-assistant',
        description: 'Good Assistant rapidly converts sketched concepts or rough user flows into structured wireframes, allowing for quicker internal iteration cycles.'
      },
      { name: 'ChatGPT', url: getLink('ChatGPT'), description: 'Brainstorming partner for generating initial concepts and scenarios.', dateAdded: fixedDate(300) },
      { name: 'Claude', url: getLink('Claude'), description: 'Excellent for refining concepts and generating detailed user narratives.', dateAdded: fixedDate(100) },
      { name: 'FigJam AI', url: getLink('FigJam AI'), description: 'Generate templates, stickies, and diagrams from text prompts.', dateAdded: fixedDate(90) },
      { name: 'Miro AI', url: getLink('Miro AI'), description: 'Mind mapping and idea clustering on an infinite canvas.', dateAdded: fixedDate(95) },
      { name: 'Notion AI', url: getLink('Notion AI'), description: 'Integrated writing assistant for brainstorming and documentation.', dateAdded: fixedDate(150) },
    ],
    features: [
      'Concept generation',
      'Flow ideation',
      'Edge-case exploration',
      'Experience narratives',
      'Design principles drafting'
    ]
  },
  {
    id: '3',
    title: 'UI Design & Prototyping',
    shortTitle: 'UI & Prototyping',
    description: 'Enables rapid experimentation with system behavior, not just screens.',
    color: '#0061FE', // Dropbox Blue
    isDark: true,
    iconName: 'Layout',
    tools: [
      {
        name: 'Amara',
        url: 'https://www.producthunt.com/products/amara-3',
        description: 'Amara translates raw interaction concepts and user flows into high-fidelity prototype screens ready for immediate usability testing.'
      },
      {
        name: 'RUSTWA',
        url: 'https://www.producthunt.com/products/rustwa',
        description: 'RUSTWA automatically verifies your design drafts against accessibility standards and simulates their appearance on diverse device configurations befor'
      },
      {
        name: 'Archimyst',
        url: 'https://www.producthunt.com/products/archimyst',
        description: 'Archimyst quickly generates multiple, high-fidelity screen variations from a basic sketch, allowing you to test complex user flows more rapidly.'
      },
      {
        name: 'Leapility',
        url: 'https://www.producthunt.com/products/leapility-3',
        description: 'Leapility instantly converts your scribbled design concepts into functional, interactive prototypes ready for user testing.'
      },
      {
        name: 'Kokori',
        url: 'https://www.producthunt.com/products/kokori',
        description: 'Kokori automatically generates and refines complete user interface layouts based on functional requirements, allowing designers to move directly into '
      },
      { name: 'Figma AI', url: getLink('Figma AI'), description: 'Native AI features for generating layers, renaming, and prototyping connections.', dateAdded: fixedDate(30) },
      { name: 'Uizard', url: getLink('Uizard'), description: 'Turn sketches and text prompts into editable UI designs.', dateAdded: fixedDate(180) },
      { name: 'Galileo AI', url: getLink('Galileo AI'), description: 'Text-to-UI generation for high-fidelity mobile and web screens.', dateAdded: fixedDate(120) },
      { name: 'Framer AI', url: getLink('Framer AI'), description: 'Generate entire published websites from a single text prompt.', dateAdded: fixedDate(100) },
      { name: 'UXPin Merge', url: getLink('UXPin Merge'), description: 'Code-based design tool with AI capabilities for component management.', dateAdded: fixedDate(250) },
      { name: 'Anima', url: getLink('Anima App'), description: 'Turn Figma designs into React/Vue/HTML code automatically.', dateAdded: fixedDate(200) },
      { name: 'Locofy', url: getLink('Locofy'), description: 'Accelerate frontend development by converting designs to code.', dateAdded: fixedDate(210) },
    ],
    features: [
      'UI from text prompts',
      'Smart layouts',
      'Responsive suggestions',
      'Design-to-code',
      'Realistic content'
    ]
  },
  {
    id: '4',
    title: 'Content, Microcopy & UX Writing',
    shortTitle: 'Content & Copy',
    description: 'Content becomes a fluid design material.',
    color: '#CB9CF2', // Lavender
    isDark: false,
    iconName: 'Type',
    tools: [
      {
        name: 'Pretty Prompt 1.0 Extension + Web App',
        url: 'https://www.producthunt.com/products/pretty-prompt',
        description: 'You can instantly optimize your generative AI prompts to reliably create production-ready microcopy, labels, and user guidance text for your product i'
      },
      { name: 'Jasper', url: getLink('Jasper AI'), description: 'Enterprise-grade AI content platform for marketing and copy.', dateAdded: fixedDate(250) },
      { name: 'Copy.ai', url: getLink('Copy.ai'), description: 'Automate copywriting for marketing, blogs, and product descriptions.', dateAdded: fixedDate(240) },
      { name: 'Writer', url: getLink('Writer AI'), description: 'Full-stack generative AI platform for enterprise content.', dateAdded: fixedDate(200) },
      { name: 'GrammarlyGO', url: getLink('GrammarlyGO'), description: 'Context-aware writing assistance integrated into workflows.', dateAdded: fixedDate(180) },
      { name: 'ChatGPT', url: getLink('ChatGPT'), description: 'Versatile tool for rewriting error messages, empty states, and more.', dateAdded: fixedDate(300) },
    ],
    features: [
      'Microcopy variants',
      'Tone control',
      'Error messages',
      'Accessibility-friendly text',
      'Localization drafts'
    ]
  },
  {
    id: '5',
    title: 'Behavior Prototyping & Experimentation',
    shortTitle: 'Behavior & Models',
    description: 'Determines what AI behaviors are realistic, safe, and stable.',
    color: '#78D9B4', // Mint
    isDark: false,
    iconName: 'Cpu',
    tools: [
      { name: 'Google AI Studio (Gemini)', group: 'Model Playgrounds', url: getLink('Google AI Studio'), description: 'Fastest way to prototype with Gemini models.', dateAdded: fixedDate(40) },
      { name: 'OpenAI Playground', group: 'Model Playgrounds', url: getLink('OpenAI Playground'), description: 'Web interface for testing GPT models and parameters.', dateAdded: fixedDate(300) },
      { name: 'Anthropic Console', group: 'Model Playgrounds', url: getLink('Anthropic Console'), description: 'Workbench for prompt engineering with Claude.', dateAdded: fixedDate(120) },
      { name: 'Cohere Playground', group: 'Model Playgrounds', url: getLink('Cohere Playground'), description: 'Test models optimized for enterprise and RAG.', dateAdded: fixedDate(150) },
      { name: 'Hugging Face Inference', group: 'Model Playgrounds', url: getLink('Hugging Face Inference'), description: 'Access thousands of open-source models.', dateAdded: fixedDate(200) },
      
      { name: 'PromptLayer', group: 'Prompt & Behavior Tools', url: getLink('PromptLayer'), description: 'Prompt management and versioning middleware.', dateAdded: fixedDate(180) },
      { name: 'Humanloop', group: 'Prompt & Behavior Tools', url: getLink('Humanloop'), description: 'Collaborative prompt engineering and evaluation.', dateAdded: fixedDate(160) },
      { name: 'LangSmith', group: 'Prompt & Behavior Tools', url: getLink('LangSmith'), description: 'Debug, test, evaluate, and monitor LLM apps.', dateAdded: fixedDate(90) },
      { name: 'Helicone', group: 'Prompt & Behavior Tools', url: getLink('Helicone'), description: 'Open-source observability for generative AI.', dateAdded: fixedDate(100) },
      
      { name: 'Vercel AI SDK', group: 'Rapid App Prototyping', url: getLink('Vercel AI SDK'), description: 'Library for building AI-powered user interfaces.', dateAdded: fixedDate(80) },
      { name: 'Streamlit', group: 'Rapid App Prototyping', url: getLink('Streamlit'), description: 'Turn data scripts into shareable web apps.', dateAdded: fixedDate(250) },
      { name: 'Gradio', group: 'Rapid App Prototyping', url: getLink('Gradio'), description: 'Build and share demos of machine learning models.', dateAdded: fixedDate(240) },
      { name: 'Retool AI', group: 'Rapid App Prototyping', url: getLink('Retool AI'), description: 'Fast way to build internal tools with AI blocks.', dateAdded: fixedDate(120) },

      { name: 'LlamaIndex', group: 'RAG & Knowledge', url: getLink('LlamaIndex'), description: 'Data framework for LLM applications.', dateAdded: fixedDate(110) },
      { name: 'LangChain', group: 'RAG & Knowledge', url: getLink('LangChain'), description: 'Framework for developing applications powered by LLMs.', dateAdded: fixedDate(200) },
      { name: 'Haystack', group: 'RAG & Knowledge', url: getLink('Haystack'), description: 'Open source framework for building search and QA systems.', dateAdded: fixedDate(180) },
    ],
    features: [
      'Prompt iteration',
      'Tone & guardrail testing',
      'Multimodal input testing',
      'Behavior comparison',
      'Hallucination & failure discovery',
      'RAG feasibility testing'
    ]
  },
  {
    id: '6',
    title: 'Embedded in Product UI',
    shortTitle: 'Embedded UI',
    description: 'This defines what AI looks like to users.',
    color: '#5EC2C2', // Teal
    isDark: false,
    iconName: 'AppWindow',
    tools: [
      { name: 'Autofill / Next-best-action', group: 'AI Suggestions', url: getLink('AI Autofill UX'), description: 'Predictive inputs to reduce friction.', dateAdded: fixedDate(365) },
      { name: 'Semantic Search', group: 'Smart Search', url: getLink('Semantic Search UX'), description: 'Search by meaning rather than keywords.', dateAdded: fixedDate(365) },
      { name: 'Activity Feeds / Reports', group: 'Summarization', url: getLink('AI Summarization UX'), description: 'Condensing large volumes of data into insights.', dateAdded: fixedDate(365) },
      { name: 'Products / Actions', group: 'Recommendations', url: getLink('AI Recommendation System UX'), description: 'Personalized suggestions based on behavior.', dateAdded: fixedDate(365) },
      { name: 'Risk / Ops Tools', group: 'Anomaly Detection', url: getLink('Anomaly Detection UX'), description: 'Identifying outliers and potential issues automatically.', dateAdded: fixedDate(365) },
      { name: 'Dashboards', group: 'Forecasting', url: getLink('AI Forecasting UX'), description: 'Predicting future trends visually.', dateAdded: fixedDate(365) },
      { name: 'Copilots / Agents', group: 'Conversational UI', url: getLink('AI Copilot UX'), description: 'Interactive assistants embedded in workflows.', dateAdded: fixedDate(200) },
      { name: 'Tickets / Documents', group: 'Auto-classification', url: getLink('AI Classification UX'), description: 'Sorting and routing content automatically.', dateAdded: fixedDate(365) },
      { name: 'Adaptive Dashboards', group: 'Personalization', url: getLink('Adaptive Dashboard UX'), description: 'Interfaces that change layout based on user needs.', dateAdded: fixedDate(300) },
      { name: 'OCR / Visual Q&A', group: 'Doc & Image Understanding', url: getLink('Visual Q&A UX'), description: 'Extracting and interacting with information in images.', dateAdded: fixedDate(200) },
    ],
    features: [
      'AI suggestions',
      'Smart search',
      'Summarization',
      'Recommendations',
      'Anomaly detection',
      'Forecasting',
      'Conversational UI',
      'Auto-classification',
      'Personalization',
      'Doc & image understanding'
    ]
  },
  {
    id: '7',
    title: 'Workflow Automation & Operations',
    shortTitle: 'Automation',
    description: 'Designers increasingly shape processes, not just interfaces.',
    color: '#FF9E66', // Orange
    isDark: false,
    iconName: 'Workflow',
    tools: [
      {
        name: 'ManePaw',
        url: 'https://www.producthunt.com/products/manepaw',
        description: 'Automatically generate accurate, developer-ready design specifications and documentation directly from your completed prototype, eliminating manual ha'
      },
      {
        name: 'EasyClaw',
        url: 'https://www.producthunt.com/products/dereference-the-100x-ide',
        description: 'This tool automatically structures design files and component layers according to established style guides, eliminating manual cleanup before engineer'
      },
      { name: 'Zapier', url: getLink('Zapier'), description: 'Connects apps to automate workflows.', dateAdded: fixedDate(300) },
      { name: 'Make', url: getLink('Make'), description: 'Visual platform for designing complex automated workflows.', dateAdded: fixedDate(250) },
      { name: 'n8n', url: getLink('n8n'), description: 'Workflow automation tool with fair-code licensing.', dateAdded: fixedDate(200) },
      { name: 'UiPath AI', url: getLink('UiPath'), description: 'Robotic Process Automation with AI capabilities.', dateAdded: fixedDate(280) },
      { name: 'Automation Anywhere', url: getLink('Automation Anywhere'), description: 'Intelligent automation platform for enterprises.', dateAdded: fixedDate(270) },
    ],
    features: [
      'AI-triggered workflows',
      'AI + RPA hybrid flows',
      'End-to-end automation',
      'Exception routing'
    ]
  },
  {
    id: '8',
    title: 'Development & Design-to-Code',
    shortTitle: 'Dev & Code',
    description: 'Blurs the boundary between design and implementation.',
    color: '#546E7A', // Blue Grey 600 - Visible on hover against dark background
    isDark: true,
    iconName: 'Code',
    tools: [
      { name: 'GitHub Copilot', url: getLink('GitHub Copilot'), description: 'AI pair programmer.', dateAdded: fixedDate(300) },
      { name: 'Cursor', url: getLink('Cursor Editor'), description: 'Code editor built for programming with AI.', dateAdded: fixedDate(120) },
      { name: 'Codeium', url: getLink('Codeium'), description: 'Free AI code completion and chat.', dateAdded: fixedDate(150) },
      { name: 'Replit AI', url: getLink('Replit AI'), description: 'Integrated AI features in the Replit online IDE.', dateAdded: fixedDate(200) },
    ],
    features: [
      'UI code generation',
      'Logic explanation',
      'Rapid prototyping',
      'Refactoring'
    ]
  },
  {
    id: '9',
    title: 'Analytics, Insights & BI',
    shortTitle: 'Analytics & BI',
    description: 'Designing how users talk to data, not just view it.',
    color: '#4A6572', // Blue Grey
    isDark: true,
    iconName: 'BarChart3',
    tools: [
      { name: 'Power BI Copilot', url: getLink('Power BI Copilot'), description: 'Generative AI for data reporting.', dateAdded: fixedDate(150) },
      { name: 'Tableau GPT', url: getLink('Tableau GPT'), description: 'AI-powered analytics insights.', dateAdded: fixedDate(140) },
      { name: 'ThoughtSpot', url: getLink('ThoughtSpot'), description: 'Search and AI-driven analytics.', dateAdded: fixedDate(200) },
      { name: 'Looker AI', url: getLink('Looker AI'), description: 'Business intelligence with Google AI integration.', dateAdded: fixedDate(180) },
    ],
    features: [
      'Natural language queries',
      'Auto insights',
      'Anomaly detection',
      'Predictive analytics'
    ]
  },
  {
    id: '10',
    title: 'Trust, Safety & Governance',
    shortTitle: 'Trust & Safety',
    description: 'Directly influences transparency UI, error handling, and user trust patterns.',
    color: '#EF5350', // Red
    isDark: true,
    iconName: 'ShieldCheck',
    tools: [
      { name: 'TruLens', url: getLink('TruLens'), description: 'Evaluation and tracking for LLM apps.', dateAdded: fixedDate(100) },
      { name: 'Ragas', url: getLink('Ragas'), description: 'Evaluation framework for RAG pipelines.', dateAdded: fixedDate(90) },
      { name: 'Arize', url: getLink('Arize AI'), description: 'ML observability and troubleshooting.', dateAdded: fixedDate(150) },
      { name: 'WhyLabs', url: getLink('WhyLabs'), description: 'AI observability platform.', dateAdded: fixedDate(140) },
      { name: 'Fiddler', url: getLink('Fiddler AI'), description: 'Model performance management.', dateAdded: fixedDate(160) },
      { name: 'Credo AI', url: getLink('Credo AI'), description: 'Responsible AI governance platform.', dateAdded: fixedDate(120) },
      { name: 'Lakera', url: getLink('Lakera'), description: 'Security for LLM applications.', dateAdded: fixedDate(80) },
      { name: 'Private AI', url: getLink('Private AI'), description: 'PII redaction and data privacy.', dateAdded: fixedDate(110) },
    ],
    features: [
      'Output evaluation',
      'Bias detection',
      'Drift monitoring',
      'PII protection',
      'Explainability',
      'Audit trails'
    ]
  },
  {
    id: '11',
    title: 'Personalization & Experimentation',
    shortTitle: 'Personalization',
    description: 'Changes the stability and predictability of UX itself.',
    color: '#AB47BC', // Purple
    isDark: true,
    iconName: 'Users',
    tools: [
      { name: 'Dynamic Yield', url: getLink('Dynamic Yield'), description: 'Experience optimization platform.', dateAdded: fixedDate(250) },
      { name: 'Mutiny', url: getLink('Mutiny HQ'), description: 'No-code web personalization.', dateAdded: fixedDate(200) },
      { name: 'LaunchDarkly', url: getLink('LaunchDarkly'), description: 'Feature management and experimentation.', dateAdded: fixedDate(220) },
      { name: 'Statsig', url: getLink('Statsig'), description: 'Product experimentation platform.', dateAdded: fixedDate(150) },
    ],
    features: [
      'Adaptive UI',
      'A/B testing AI outputs',
      'Feature gating',
      'Journey personalization'
    ]
  },
  {
    id: '12',
    title: 'Multimodal AI (Beyond Text)',
    shortTitle: 'Multimodal',
    description: 'Designing for non-screen, non-text interactions is now mainstream.',
    color: '#EC407A', // Pink
    isDark: true,
    iconName: 'Mic',
    tools: [
      {
        name: 'Grok Imagine API',
        url: 'https://www.producthunt.com/products/grok-3',
        description: 'A new AI tool for designers'
      },
      { name: 'OpenAI Vision', url: getLink('OpenAI Vision'), description: 'Visual understanding capabilities.', dateAdded: fixedDate(180) },
      { name: 'Runway', url: getLink('Runway ML'), description: 'AI tools for video generation and editing.', dateAdded: fixedDate(120) },
      { name: 'Midjourney', url: getLink('Midjourney'), description: 'High-quality image generation.', dateAdded: fixedDate(200) },
      { name: 'Stability AI', url: getLink('Stability AI'), description: 'Open source generative audio and video models.', dateAdded: fixedDate(190) },
      { name: 'ElevenLabs', url: getLink('ElevenLabs'), description: 'Realistic AI speech software.', dateAdded: fixedDate(140) },
      { name: 'Whisper', url: getLink('OpenAI Whisper'), description: 'Robust speech recognition system.', dateAdded: fixedDate(250) },
    ],
    features: [
      'Image generation & understanding',
      'Voice UI',
      'Video generation',
      'Speech-to-text'
    ]
  }
];