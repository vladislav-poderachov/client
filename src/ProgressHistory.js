// @ts-ignore
import React from 'react';
import { GoalProgress } from './components/types';
// @ts-ignore
import { getGoalProgressHistory } from './components/GoalService.tsx';
import './ProgressHistory.css';
interface ProgressHistoryProps {
    goalId: string;
}

const ProgressHistory: React.FC<ProgressHistoryProps> = ({ goalId }) => {
    const [history, setHistory] = React.useState<GoalProgress[]>([]);

    React.useEffect(() => {
        setHistory(getGoalProgressHistory(goalId));
    }, [goalId]);

    return (
        <div className="progress-history">
            <h3>История прогресса</h3>
            {history.length === 0 ? (
                <p>Нет записей о прогрессе</p>
            ) : (
                <ul>
                    {history.map((record) => (
                        <li key={record.id} className="history-record">
                            <div className="record-date">
                                {new Date(record.date).toLocaleDateString()}
                            </div>
                            <div className="record-value">
                                {renderRecordValue(record)}
                            </div>
                            {record.notes && (
                                <div className="record-notes">
                                    <p>{record.notes}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

function renderRecordValue(record: GoalProgress): React.ReactNode {
    switch(record.type) {
        case 'BINARY':
            return record.completed ? '✅ Выполнено' : '❌ Не выполнено';
        case 'QUANTITATIVE':
            return `Значение: ${record.value}`;
        case 'TIME_BASED':
            return `Время: ${record.actualTime} (отклонение: ${record.deviation} мин)`;
        default:
            return null;
    }
}

export default ProgressHistory;