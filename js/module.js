"use strict"
export function createModel() {
    let state = {
        exercises: [0, 0, 0, 0, 0, 0, 0, 0],
        exam: 0,
        attendance: 100
    };

    const modelEvents = new EventTarget();

    function triggerModelChange() {
        modelEvents.dispatchEvent(new Event("modelUpdated"));
    }

    function isPositive(points) {
        return points > 50;
    }

    function calculateExerciseTotal() {
        let minScore = state.exercises[0];
        let minIndex = 0;
        let positiveCount = 0;
        let sum = 0;

        for (let i = 0; i < state.exercises.length; i++) {
            let score = state.exercises[i];
            if (score < minScore) {
                minScore = score;
                minIndex = i;
            }
            if (isPositive(score)) {
                positiveCount++;
            }
            sum += score;
        }

        let totalWithoutMin = sum - minScore;
        let percentage = (totalWithoutMin / 700) * 100;
        return { percentage, positiveCount, droppedIndex: minIndex };
    }

    return {
        events: modelEvents,

        setExerciseScore: function(index, points) {
            state.exercises[index] = points;
            triggerModelChange();
        },

        setExamScore: function(points) {
            state.exam = points;
            triggerModelChange();
        },

        setAttendance: function(percent) {
            state.attendance = percent;
            triggerModelChange();
        },

        calculateFinalGrade: function() {
            let exerciseData = calculateExerciseTotal();
            let finalPct = (exerciseData.percentage * 0.6) + (state.exam * 0.4);

            let examOk = isPositive(state.exam);
            let exOk = isPositive(exerciseData.percentage);
            let countOk = exerciseData.positiveCount >= 6;
            let attOk = state.attendance >= 80;

            let passed = examOk && exOk && countOk && attOk;

            let gradeText = "Nicht Genügend";
            if (passed) {
                if (finalPct <= 61) gradeText = "Genügend";
                else if (finalPct <= 74) gradeText = "Befriedigend";
                else if (finalPct <= 86) gradeText = "Gut";
                else gradeText = "Sehr gut";
            }

            let reasons = [];
            if (!attOk) reasons.push("Anwesenheit ist unter 80%.");
            if (!examOk) reasons.push("Klausurnote ist negativ (<= 50%).");
            if (!exOk) reasons.push("Gesamte Übungsnote ist negativ (<= 50%).");
            if (!countOk) reasons.push(`Zu wenig positive Übungen (${exerciseData.positiveCount}/8). Min. 6 benötigt.`);

            return {
                finalPct: finalPct,
                text: gradeText,
                passed: passed,
                reasons: reasons,
                droppedIndex: exerciseData.droppedIndex
            };
        }
    };
}