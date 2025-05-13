// @ts-ignore
import React, { useState } from 'react';

import { Goal, GoalProgress, BinaryProgress, QuantitativeProgress, TimeBasedProgress } from './components/types';
import './ProgressTracker.css';

interface ProgressTrackerProps {
    goal: Goal;
    onProgressSaved?: () => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ goal, onProgressSaved }) => {
    const [notes, setNotes] = useState('');
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const calculateDeviation = (target: string, actual: string): number => {
        if (!target || !actual) return 0;

        try {
            // Для целей времени суток (формат HH:MM)
            if (target.includes(':') && target.length === 5) {
                const [targetHours, targetMinutes] = target.split(':').map(Number);
                const [actualHours, actualMinutes] = actual.split(':').map(Number);

                const targetTotal = targetHours * 60 + targetMinutes;
                const actualTotal = actualHours * 60 + actualMinutes;

                return Math.abs(actualTotal - targetTotal); // в минутах
            }
            // Для временных интервалов (формат MM:SS)
            else if (target.includes(':') && target.length <= 5) {
                const [targetM, targetS] = target.split(':').map(Number);
                const [actualM, actualS] = actual.split(':').map(Number);

                const targetTotal = targetM * 60 + targetS;
                const actualTotal = actualM * 60 + actualS;

                return Math.abs(actualTotal - targetTotal); // в секундах
            }
            return 0;
        } catch {
            return 0;
        }
    };

    const handleSubmit = () => {
        if (goal.type === 'QUANTITATIVE' && !value) {
            setError('Пожалуйста, введите значение');
            return;
        }

        if (goal.type === 'TIME_BASED' && !/^\d{1,2}:\d{2}$/.test(value)) {
            setError('Введите время в формате MM:SS или HH:MM');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.username === localStorage.getItem('currentUser'));
        if (userIndex === -1) return;

        const goalIndex = users[userIndex].goals.findIndex((g: Goal) => g.id === goal.id);
        if (goalIndex === -1) return;

        let newProgress: GoalProgress;

        switch (goal.type) {
            case 'BINARY':
                newProgress = {
                    id: Date.now().toString(),
                    goalId: goal.id,
                    date: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    notes: notes.trim() || undefined,
                    type: 'BINARY',
                    completed: true
                } as BinaryProgress;
                break;
            case 'QUANTITATIVE':
                newProgress = {
                    id: Date.now().toString(),
                    goalId: goal.id,
                    date: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    notes: notes.trim() || undefined,
                    type: 'QUANTITATIVE',
                    value: parseFloat(value)
                } as QuantitativeProgress;
                // Обновляем текущее значение цели
                users[userIndex].goals[goalIndex].currentValue = parseFloat(value);
                break;
            case 'TIME_BASED':
                const deviation = calculateDeviation(goal.targetTime, value);
                newProgress = {
                    id: Date.now().toString(),
                    goalId: goal.id,
                    date: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    notes: notes.trim() || undefined,
                    type: 'TIME_BASED',
                    actualTime: value,
                    deviation: deviation,
                    success: deviation <= (goal.allowedDeviation || 15)
                } as TimeBasedProgress;
                break;
            default:
                return;
        }

        // Добавляем запись прогресса
        users[userIndex].goals[goalIndex].progressHistory = [
            ...(users[userIndex].goals[goalIndex].progressHistory || []),
            newProgress
        ];

        localStorage.setItem('users', JSON.stringify(users));
        setNotes('');
        setValue('');
        setError('');
        onProgressSaved?.();
    };

    const renderInput = () => {
        switch (goal.type) {
            case 'BINARY':
                return (
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={true}
                                readOnly
                            />
                            Отметить как выполненное
                        </label>
                    </div>
                );
            case 'QUANTITATIVE':
                return (
                    <div className="form-group">
                        <label>Текущее значение ({goal.valueUnit})</label>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                setError('');
                            }}
                            step="0.01"
                            min="0"
                        />
                    </div>
                );
            case 'TIME_BASED':
                return (
                    <div className="form-group">
                        <label>Фактическое время ({'subtype' in goal && goal.subtype === 'TIME_INTERVAL' ? 'MM:SS' : 'HH:MM'})</label>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                setError('');
                            }}
                            placeholder={'subtype' in goal && goal.subtype === 'TIME_INTERVAL' ? 'MM:SS' : 'HH:MM'}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="progress-tracker">
            <h3>Запись прогресса</h3>
            {renderInput()}
            <div className="form-group">
                <label>Заметки (необязательно)</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={
                    (goal.type === 'QUANTITATIVE' && !value) ||
                    (goal.type === 'TIME_BASED' && !/^\d{1,2}:\d{2}$/.test(value))
                }
            >
                Записать прогресс
            </button>
        </div>
    );
};

export default ProgressTracker;