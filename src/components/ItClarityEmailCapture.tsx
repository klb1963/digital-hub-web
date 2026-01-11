// digital-hub-web/src/components/ItClarityEmailCapture.tsx

'use client';

import { useMemo, useState } from 'react';

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ItClarityEmailCapture(props: { level: string; persona: string }) {
    const { level, persona } = props;

    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    const canSubmit = useMemo(() => isValidEmail(email) && status !== 'loading', [email, status]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const cleanEmail = email.trim().toLowerCase();
        if (!isValidEmail(cleanEmail)) {
            setError('Введите корректный email.');
            return;
        }

        setStatus('loading');
        try {
            const res = await fetch('/api/it-clarity/email-result', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    email: cleanEmail,
                    level,
                    persona,
                    pageUrl: window.location.href,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || `Request failed: ${res.status}`);
            }

            setStatus('ok');
        } catch (e: unknown) {
            setStatus('error');

            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('Ошибка отправки. Попробуйте ещё раз.');
            }
        }
    }

    if (status === 'ok') {
        return (
            <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
                <div className="text-lg font-semibold">Результат отправлен</div>
                <div className="mt-2 text-sm text-black/70">
                    Я отправил результат на указанный email. Если не найдёте письмо — проверьте «Спам».
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
            <div className="text-base font-medium">Сохранить результат</div>
            <div className="mt-2 text-sm text-black/70">
                Этот разбор можно сохранить, переслать коллеге или вернуться к нему позже.
            </div>

            <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-black/15 px-3 py-2.5 text-sm outline-none focus:border-black/30"
                />

                <button
                type="submit"
                disabled={!canSubmit}
                className="
                    whitespace-nowrap
                    rounded-lg
                    bg-emerald-600
                    px-4 py-2.5
                    text-sm font-medium
                    text-white
                    hover:bg-emerald-700
                    disabled:opacity-40
                "
                >
                {status === 'loading' ? 'Отправляю…' : 'Получить результат'}
                </button>
                
            </form>

            {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

            <div className="mt-3 text-xs text-black/60">
                Без рассылок и спама. Я пришлю только результат теста и ссылку на эту страницу.
            </div>
        </div>
    );
}