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
   label: string;
   tagline: string;
   description: string;
   tags: string[];
   image: string;
   /**
    * Дополнительные скриншоты проекта.
    * Если не заданы, в слайдере используется image.
    */
   screenshots?: string[];
   href?: string;
 };

export const projects: Project[] = [
  {
    id: 'yachtpricer',
    title: 'YachtPricer',
    label: 'Pricing engine for charter fleets',
    tagline: 'Сервис для ценообразования в чартерных компаниях',
    description:
      'Платформа помогает менеджерам яхт анализировать цены конкурентов, управлять базовыми ценами и скидкам.',
    image: '/images/ptojects/yachtpricer-01.png',
    screenshots: [
      '/images/ptojects/yachtpricer-01.png',
      '/images/ptojects/yachtpricer-02.png',
      '/images/ptojects/yachtpricer-03.png',
    ],
    href: '/projects/yachtpricer',
    tags: ['SaaS', 'NestJS', 'React', 'Prisma', 'PostgreSQL', 'NauSYS API'],
  },

  {
    id: 'seatmap-abc360',
    title: 'SeatMap ABC360',
    label: 'Interactive seatmap for Sabre Red360',
    tagline: 'Интерактивная карта мест салона самолета внутри Sabre Red360.',
    description:
      'Red App для Sabre Red360, добавляющий улучшенную карту мест, подсветку зон, ручное и авто-назначение пассажиров, обработку ошибок Sabre и расширенную визуализацию. Проект сочетает React, TypeScript и Sabre SDK.',
    image: '/images/projects/seatmap-abc360.png',
    href: '/projects/seatmap-01.png',
    screenshots: [
      '/images/ptojects/seatmap-01.png',
      '/images/ptojects/seatmap-02.png',
      '/images/ptojects/seatmap-03.png',
    ],
    tags: ['Sabre Red App', 'TypeScript', 'React', 'SDK Integration'],
  },

  {
    id: 'open-digital-hub',
    title: 'Open Digital Hub',
    label: 'Digital ecosystem for experts',
    tagline: 'Цифровая платформа для проектов, блога и автоматических публикаций.',
    description:
      'Open Digital Hub — личный цифровой дом и экосистема: лендинги, блог, Payload CMS, Jitsi, LMS, чаты, платежи, n8n-автоматизации. Это фундамент для консалтинга, EdTech и AI-сервисов.',
    image: '/images/projects/digital-hub-01.png',
    screenshots: [
      '/images/ptojects/digital-hub-01.png',
      '/images/ptojects/digital-hub-02.png',
      '/images/ptojects/digital-hub-03.png',
    ],
    href: '/projects/open-digital-hub',
    tags: ['Next.js', 'Payload CMS', 'n8n', 'AI', 'Marketing Site'],
  },

//   {
//     id: 'lms-leonidk',
//     title: 'LMS.LeonidK',
//     label: 'Learning platform (LMS)',
//     tagline: 'Система дистанционного обучения и AI-сценариев.',
//     description:
//       'Собственная LMS-платформа для курсов, тренировок и симуляторов. Интеграции с AI-тренером, автопроверкой задач, комментариями, прогресс-трекингом и персональными маршрутами обучения.',
//     image: '/images/projects/lms-leonidk.png',
//     href: '/projects/lms-leonidk',
//     tags: ['EdTech', 'LMS', 'AI Tutors', 'Learning Paths'],
//   },

  {
    id: 'meet-leonidk',
    title: 'Meet.LeonidK',
    label: 'Secure Video Communication',
    tagline: 'Видеоконференции на базе Jitsi для созвонов и встреч.',
    description:
      'Собственный видеосервис для консультаций, собеседований, групповых встреч и мастер-классов. Частный сервер, рекордеры, защита, комнаты-приглашения и интеграция с личным кабинетом.',
    image: '/images/projects/meet-leonidk-01.png',
    screenshots: [
      '/images/ptojects/meet-leonidk-01.png',
      '/images/ptojects/meet-leonidk-02.png',
      // '/images/ptojects/digital-hub-03.png',
    ],
    href: '/projects/meet-leonidk',
    tags: ['Jitsi', 'Videoconferencing', 'Self-Hosted', 'Consulting'],
  },
];