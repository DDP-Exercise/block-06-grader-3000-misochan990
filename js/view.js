"use strict"
export function createView() {

    function createInputRow(index) {
        return `
            <div class="input-row" id="ex-row-${index}">
                <label>Übung ${index + 1} (0-100):</label>
                <input type="number" class="ex-input" data-index="${index}" min="0" max="100" value="0">
                <span class="dropped-badge">- Streichergebnis</span>
            </div>
        `;
    }

    return {
        generateInputs: function(containerId) {
            let container = document.getElementById(containerId);
            let htmlString = "";
            for (let i = 0; i < 8; i++) {
                htmlString += createInputRow(i);
            }
            container.innerHTML = htmlString;
        },

        highlightDropped: function(droppedIndex) {
            for (let i = 0; i < 8; i++) {
                let row = document.getElementById(`ex-row-${i}`);
                if (i === droppedIndex) {
                    row.classList.add("is-dropped");
                } else {
                    row.classList.remove("is-dropped");
                }
            }
        },

        renderResult: function(resultData) {
            let output = document.getElementById("result-text");
            let reasons = document.getElementById("reasons-text");

            output.innerHTML = `Gesamtnote: ${resultData.finalPct.toFixed(1)}% - <strong>${resultData.text}</strong>`;

            if (resultData.passed) {
                output.className = "success";
                reasons.innerHTML = "";
            } else {
                output.className = "error";
                reasons.innerHTML = "<strong>Warum negativ?</strong><br>" + resultData.reasons.join("<br>");
            }
        }
    };
}