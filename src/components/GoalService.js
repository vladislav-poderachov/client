import {GoalProgress, Goal} from "./types.ts"
export const saveGoalProgress = (goalId: string, progress: Omit<GoalProgress, 'id' | 'createdAt'>): void => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.username === currentUser.username);

    if (userIndex === -1) return;

    const goalIndex = users[userIndex].goals.findIndex((g: Goal) => g.id === goalId);
    if (goalIndex === -1) return;

    const newProgress: GoalProgress = {
        ...progress,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        goalId
    };

    const updatedGoal = {
        ...users[userIndex].goals[goalIndex],
        progressHistory: [...users[userIndex].goals[goalIndex].progressHistory, newProgress]
    };

    // Обновляем текущие значения
    if (updatedGoal.type === 'QUANTITATIVE' && progress.type === 'QUANTITATIVE') {
        updatedGoal.currentValue = progress.value;
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex].goals[goalIndex] = updatedGoal;

    localStorage.setItem('users', JSON.stringify(updatedUsers));
};

export const getGoalProgressHistory = (goalId: string): GoalProgress[] => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === currentUser.username);
    const goal = user?.goals?.find((g: Goal) => g.id === goalId);
    return goal?.progressHistory || [];
};