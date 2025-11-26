// src/lib/projects.ts

export type ProjectId =
  | 'yachtpricer'
  | 'seatmap-abc360'
  | 'open-digital-hub'
  | 'lms-leonidk'
  | 'meet-leonidk';

export type Project = {
  id: ProjectId;
  title: string;
  label: string;      // короткая подпись в табе
  tagline: string;    // короткий жирный подзаголовок справа
  description: string;
  image: string;      // путь к изображению в /public/images/projects/...
  href?: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    id: 'yachtpricer',
    title: 'YachtPricer',
    label: 'Pricing engine for charter fleets',
    tagline: 'Сервис для ценообразования в чартерных компаниях.',
    description:
      'Платформа помогает флот-менеджерам анализировать цены конкурентов, управлять ставками и принимать решения по скидкам. В основе — NestJS, React, Prisma, PostgreSQL и глубокая предметная экспертиза чартерного рынка.',
    image: '/images/ptojects/yachtpricer-01.png',
    href: '/projects/yachtpricer',
    tags: ['SaaS', 'NestJS', 'React', 'Prisma', 'PostgreSQL', 'NauSYS API'],
  },

  {
    id: 'seatmap-abc360',
    title: 'SeatMap ABC360',
    label: 'Interactive seatmap for Sabre Red360',
    tagline: 'Интерактивная карта мест внутри Sabre Red360.',
    description:
      'Red App для Sabre Red360, добавляющий улучшенную карту мест, подсветку зон, ручное и авто-назначение пассажиров, обработку ошибок Sabre и расширенную визуализацию. Проект сочетает React, TypeScript и Sabre SDK.',
    image: '/images/projects/seatmap-abc360.png',
    href: '/projects/seatmap-abc360',
    tags: ['Sabre Red App', 'TypeScript', 'React', 'SDK Integration'],
  },

  {
    id: 'open-digital-hub',
    title: 'Open Digital Hub',
    label: 'Digital ecosystem for experts',
    tagline: 'Цифровая платформа для проектов, блога и автоматизаций.',
    description:
      'Open Digital Hub — твой личный цифровой дом и экосистема: лендинги, блог, Payload CMS, Jitsi, LMS, чаты, платежи, n8n-автоматизации. Это фундамент для консалтинга, EdTech и AI-сервисов.',
    image: '/images/projects/open-digital-hub.png',
    href: '/projects/open-digital-hub',
    tags: ['Next.js', 'Payload CMS', 'n8n', 'AI', 'Marketing Site'],
  },

  {
    id: 'lms-leonidk',
    title: 'LMS.LeonidK',
    label: 'Learning platform (LMS)',
    tagline: 'Система дистанционного обучения и AI-сценариев.',
    description:
      'Собственная LMS-платформа для курсов, тренировок и симуляторов. Интеграции с AI-тренером, автопроверкой задач, комментариями, прогресс-трекингом и персональными маршрутами обучения.',
    image: '/images/projects/lms-leonidk.png',
    href: '/projects/lms-leonidk',
    tags: ['EdTech', 'LMS', 'AI Tutors', 'Learning Paths'],
  },

  {
    id: 'meet-leonidk',
    title: 'Meet.LeonidK',
    label: 'Secure Video Communication',
    tagline: 'Видеоконференции на базе Jitsi для созвонов и встреч.',
    description:
      'Собственный видеосервис для консультаций, собеседований, групповых встреч и мастер-классов. Частный сервер, рекордеры, защита, комнаты-приглашения и интеграция с личным кабинетом.',
    image: '/images/projects/meet-leonidk.png',
    href: '/projects/meet-leonidk',
    tags: ['Jitsi', 'Videoconferencing', 'Self-Hosted', 'Consulting'],
  },
];