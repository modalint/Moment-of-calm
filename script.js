document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const quizScreen = document.getElementById('quizScreen');
    const chooseRoutineScreen = document.getElementById('chooseRoutineScreen');
    const breathingRoutine = document.getElementById('breathingRoutine');
    const visualizationRoutine = document.getElementById('visualizationRoutine');
    const selfTalkRoutine = document.getElementById('selfTalkRoutine');

    // Buttons
    const startButton = document.getElementById('startButton');
    const submitQuizButton = document.getElementById('submitQuiz');
    const routineButtons = document.querySelectorAll('.routine-btn');
    const backButtons = document.querySelectorAll('.back-button');

    // Quiz elements
    const userNameInput = document.getElementById('userName');
    const otherPlaceInput = document.getElementById('otherPlace');
    const placeRadios = document.querySelectorAll('input[name="place"]');

    // Personalization data
    let userData = {
        name: 'חבר', // Default
        place: 'מקום שליו', // Default
        feeling: 'רגשות של לחץ' // Default
    };

    // --- Screen Navigation Functions ---
    function showScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    startButton.addEventListener('click', () => {
        showScreen('quizScreen');
    });

    backButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetScreen = event.target.dataset.screen;
            showScreen(targetScreen);
            // Stop any ongoing routines when navigating back
            stopBreathingRoutine();
            stopSelfTalkRoutine();
            // Reset start buttons
            document.getElementById('startBreathing').textContent = 'התחל/י נשימות';
            document.getElementById('startSelfTalk').textContent = 'התחל/י דיבור עצמי';
        });
    });

    // --- Quiz Logic ---
    placeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'אחר') {
                otherPlaceInput.classList.remove('hidden');
            } else {
                otherPlaceInput.classList.add('hidden');
                otherPlaceInput.value = ''; // Clear if not "other"
            }
        });
    });

    submitQuizButton.addEventListener('click', () => {
        userData.name = userNameInput.value.trim() || 'חבר/ה';

        let selectedPlace = document.querySelector('input[name="place"]:checked').value;
        if (selectedPlace === 'אחר') {
            userData.place = otherPlaceInput.value.trim() || 'מקום שליו ונעים';
        } else {
            userData.place = selectedPlace;
        }

        userData.feeling = document.querySelector('input[name="feeling"]:checked').value;

        // Update choose routine screen title
        document.getElementById('chooseRoutineTitle').textContent = `נהדר, ${userData.name}! בוא/י נמצא את הדרך שלך לרוגע.`;

        showScreen('chooseRoutineScreen');
    });

    // --- Routine Selection ---
    routineButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const routineType = event.target.dataset.routine;
            switch (routineType) {
                case 'breathing':
                    showScreen('breathingRoutine');
                    break;
                case 'visualization':
                    updateVisualizationText();
                    showScreen('visualizationRoutine');
                    break;
                case 'selfTalk':
                    updateSelfTalkText();
                    showScreen('selfTalkRoutine');
                    break;
            }
        });
    });

    // --- Breathing Routine Logic (4-7-8) ---
    const breathingCircle = document.querySelector('.breathing-circle');
    const breathingInstruction = document.getElementById('breathingInstruction');
    const breathingTimerDisplay = document.getElementById('breathingTimer');
    const startBreathingBtn = document.getElementById('startBreathing');
    let breathingInterval;
    let breathingTimerTimeout;
    let breathingCycleCount = 0;
    const maxBreathingCycles = 3; // Number of 4-7-8 cycles

    function startBreathingRoutine() {
        if (breathingInterval) {
            stopBreathingRoutine(); // Stop if already running
            startBreathingBtn.textContent = 'התחל/י נשימות';
            return;
        }

        startBreathingBtn.textContent = 'עצור/י נשימות';
        breathingCycleCount = 0;
        runBreathingCycle(); // Start the first cycle
    }

    function runBreathingCycle() {
        if (breathingCycleCount >= maxBreathingCycles) {
            stopBreathingRoutine();
            startBreathingBtn.textContent = 'התחל/י נשימות';
            breathingInstruction.textContent = 'סיום התרגיל';
            breathingTimerDisplay.textContent = '';
            return;
        }

        // Inhale (4 seconds)
        breathingCircle.classList.remove('exhale', 'hold');
        breathingCircle.classList.add('inhale');
        breathingInstruction.textContent = 'שאפו (4)';
        let count = 4;
        breathingTimerDisplay.textContent = `${count} שניות`;
        const inhaleInterval = setInterval(() => {
            count--;
            breathingTimerDisplay.textContent = `${count} שניות`;
            if (count <= 0) clearInterval(inhaleInterval);
        }, 1000);

        breathingTimerTimeout = setTimeout(() => {
            // Hold (7 seconds)
            clearInterval(inhaleInterval); // Ensure interval stops
            breathingCircle.classList.remove('inhale');
            breathingCircle.classList.add('hold');
            breathingInstruction.textContent = 'החזיקו (7)';
            count = 7;
            breathingTimerDisplay.textContent = `${count} שניות`;
            const holdInterval = setInterval(() => {
                count--;
                breathingTimerDisplay.textContent = `${count} שניות`;
                if (count <= 0) clearInterval(holdInterval);
            }, 1000);

            breathingTimerTimeout = setTimeout(() => {
                // Exhale (8 seconds)
                clearInterval(holdInterval); // Ensure interval stops
                breathingCircle.classList.remove('hold');
                breathingCircle.classList.add('exhale');
                breathingInstruction.textContent = 'נשפו (8)';
                count = 8;
                breathingTimerDisplay.textContent = `${count} שניות`;
                const exhaleInterval = setInterval(() => {
                    count--;
                    breathingTimerDisplay.textContent = `${count} שניות`;
                    if (count <= 0) clearInterval(exhaleInterval);
                }, 1000);

                breathingTimerTimeout = setTimeout(() => {
                    clearInterval(exhaleInterval); // Ensure interval stops
                    breathingCycleCount++;
                    runBreathingCycle(); // Next cycle
                }, 8000);
            }, 7000);
        }, 4000);
    }

    function stopBreathingRoutine() {
        clearInterval(breathingInterval);
        clearTimeout(breathingTimerTimeout);
        breathingCircle.classList.remove('inhale', 'hold', 'exhale');
        breathingInstruction.textContent = '';
        breathingTimerDisplay.textContent = '';
        breathingCycleCount = 0;
        startBreathingBtn.textContent = 'התחל/י נשימות'; // Reset button text
    }

    startBreathingBtn.addEventListener('click', startBreathingRoutine);

    // --- Visualization Routine Logic ---
    const visualizationTitle = document.getElementById('visualizationTitle');
    const visualizationInstruction = document.getElementById('visualizationInstruction');
    const startVisualizationBtn = document.getElementById('startVisualization');
    let visualizationTimeout;

    function updateVisualizationText() {
        visualizationTitle.textContent = `מסע ל${userData.place}`;
        let instructionText = `עצמו עיניים אם נוח לכם. קחו נשימות עמוקות ודמיינו את עצמכם ב${userData.place}. `;

        if (userData.place.includes('חוף ים')) {
            instructionText += `אתם שומעים את קול הגלים המתנפצים בעדינות. אתם מרגישים את החול הרך מתחת לרגליכם, ואת רוח הים המרעננת על עורכם. קרני השמש החמות מלטפות אתכם, ואין דאגות. ${userData.name} מרגיש/ה שלווה ורוגע.`;
        } else if (userData.place.includes('יער')) {
            instructionText += `אתם נושמים את ריח האדמה הרענן והעלים. אתם שומעים את ציוץ הציפורים ואת רשרוש העלים. אור השמש מסנן דרך צמרות העצים, ויוצר כתמי אור וצל מרגיעים. ${userData.name} מחובר/ת לטבע ושקט/ה בפנים.`;
        } else if (userData.place.includes('פסגת הר')) {
            instructionText += `אתם עומדים על פסגת הר, מביטים בנוף עוצר נשימה הנפרש מולכם. האוויר צלול וקריר, ואתם מרגישים תחושת חופש ומרחב אינסופי. הדאגות נראות קטנות ורחוקות. ${userData.name} חש/ה בהירות ושלווה.`;
        } else if (userData.place.includes('בית')) {
            instructionText += `דמיינו את הפינה האהובה עליכם בבית. אתם מרגישים את החמימות והביטחון של המקום. זהו המרחב שלכם, שבו אתם יכולים להרפות מכל המתחים. ${userData.name} מוגן/ת ונינוח/ה.`;
        } else { // Custom place
            instructionText += `דמיינו את המקום המיוחד הזה, את הצבעים, הקולות, הריחות והתחושות שבו. תנו לעצמכם לשקוע בשלווה של המקום הזה. ${userData.name} מרגיש/ה רוגע וביטחון.`;
        }
        visualizationInstruction.textContent = instructionText;
    }

    function startVisualizationRoutine() {
        startVisualizationBtn.textContent = 'ממשיך/ה...';
        // You might add a simple countdown or sound here if desired
        // For now, it just shows the text for a duration
        visualizationTimeout = setTimeout(() => {
            alert('סיום תרגיל הויזואליזציה. הרגישו את הרוגע נשאר איתכם.');
            startVisualizationBtn.textContent = 'התחל/י ויזואליזציה';
        }, 5 * 60 * 1000); // 5 minutes for visualization
    }

    function stopVisualizationRoutine() {
        clearTimeout(visualizationTimeout);
        startVisualizationBtn.textContent = 'התחל/י ויזואליזציה';
    }

    startVisualizationBtn.addEventListener('click', startVisualizationRoutine);

    // --- Self-Talk Routine Logic ---
    const selfTalkTitle = document.getElementById('selfTalkTitle');
    const selfTalkTextDiv = document.getElementById('selfTalkText');
    const startSelfTalkBtn = document.getElementById('startSelfTalk');
    let selfTalkInterval;
    let currentSelfTalkIndex = 0;
    let selfTalkPhrases = [];

    function generateSelfTalkPhrases() {
        const name = userData.name;
        const feeling = userData.feeling;
        selfTalkPhrases = [
            `${name} מרגיש/ה ${feeling} כרגע, וזה בסדר גמור. זהו רגע חולף.`,
            `קח/י נשימה עמוקה. ${name} יכול/ה להרגיע את המחשבות ${feeling.includes('מחשבות רצות') ? 'המרוצות' : 'המלחיצות'}.`,
            `זכור/זכרי, ${name}, שיש לך את הכוח להתמודד עם אתגרים. עבר/ה בעבר, ויצליח/ה גם עכשיו.`,
            `תתמקד/י במה שאתה/את יכול/ה לשלוט בו. צעד אחר צעד, ${name} יפתור/תפתור את זה.`,
            `הכל יהיה בסדר. ${name} חזק/ה ומסוגל/ת.`,
            `תזכור/י שאת/ה עושה את המיטב שלך, ${name}. תן/תני לעצמך רגע של חמלה.`
        ];
    }

    function updateSelfTalkText() {
        selfTalkTitle.textContent = `הכוח שבך, ${userData.name}`;
        generateSelfTalkPhrases();
        currentSelfTalkIndex = 0;
        selfTalkTextDiv.textContent = selfTalkPhrases[currentSelfTalkIndex];
    }

    function startSelfTalkRoutine() {
        if (selfTalkInterval) {
            stopSelfTalkRoutine();
            startSelfTalkBtn.textContent = 'התחל/י דיבור עצמי';
            return;
        }

        startSelfTalkBtn.textContent = 'עצור/י דיבור עצמי';
        selfTalkTextDiv.textContent = selfTalkPhrases[currentSelfTalkIndex]; // Show first phrase
        selfTalkInterval = setInterval(() => {
            currentSelfTalkIndex = (currentSelfTalkIndex + 1) % selfTalkPhrases.length;
            selfTalkTextDiv.textContent = selfTalkPhrases[currentSelfTalkIndex];
        }, 8000); // Change phrase every 8 seconds
    }

    function stopSelfTalkRoutine() {
        clearInterval(selfTalkInterval);
        selfTalkInterval = null;
        startSelfTalkBtn.textContent = 'התחל/י דיבור עצמי'; // Reset button text
    }

    startSelfTalkBtn.addEventListener('click', startSelfTalkRoutine);

    // Initial screen setup
    showScreen('welcomeScreen');
});