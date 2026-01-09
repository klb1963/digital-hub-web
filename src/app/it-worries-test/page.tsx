// src/app/it-worries-test/page.tsx

import { getItWorriesTest } from '@/lib/cms';
import ItWorriesQuizClient from './ItWorriesQuizClient';

export const revalidate = 60;

export default async function ItWorriesTestPage() {
  const quiz = await getItWorriesTest();

  if (!quiz) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">IT-беспокойство: тест</h1>

        <p className="mt-4 text-sm opacity-80">
          Не удалось загрузить данные теста из CMS. Проверь доступность Payload API и global{' '}
          <code className="mx-1 rounded bg-black/5 px-1 py-0.5">it-worries-test</code>.
          Иногда помогает просто обновить страницу.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <ItWorriesQuizClient quiz={quiz} />
    </main>
  );
}