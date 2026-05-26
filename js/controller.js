"use strict"

import { createModel } from './module.js';
import { createView } from './view.js';

export function initController() {
    const model = createModel();
    const view = createView();


    view.generateInputs("exercises-container");


    let exInputs = document.querySelectorAll('.ex-input');
    for (let i = 0; i < exInputs.length; i++) {
        exInputs[i].addEventListener('input', function(event) {
            let index = parseInt(event.target.getAttribute('data-index'));
            let val = parseFloat(event.target.value) || 0;
            model.setExerciseScore(index, val);
        });
    }

    document.getElementById("exam-input").addEventListener("input", function(event) {
        let val = parseFloat(event.target.value) || 0;
        model.setExamScore(val);
    });

    document.getElementById("attendance-input").addEventListener("input", function(event) {
        let val = parseFloat(event.target.value) || 0;
        model.setAttendance(val);
    });

    model.events.addEventListener("modelUpdated", function() {
        let result = model.calculateFinalGrade();
        view.highlightDropped(result.droppedIndex);
        view.renderResult(result);
    });

    model.setAttendance(100);
}

document.addEventListener("DOMContentLoaded", initController);