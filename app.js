/**
 * CalTrack — Daily Calorie & Macro Tracker
 * Vanilla JavaScript (No frameworks, pure LocalStorage client-side persistence)
 */

// ============================================================
// State Management & Constants
// ============================================================

const STORAGE_KEYS = {
  GOALS: 'caltrack_user_goals',
  DAYS: 'caltrack_days_log'
};

const DEFAULT_GOALS = {
  targetCalories: 2000,
  targetProtein: 150,
  targetCarbs: 225,
  targetFat: 65
};

// Common Staple Foods Library
const COMMON_FOODS = [
  { name: 'Rolled Oats (dry)', serving: '40g (1/2 cup)', calories: 150, protein: 5, carbs: 27, fat: 2.5 },
  { name: 'Whole Large Egg', serving: '1 egg (50g)', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8 },
  { name: 'Egg Whites', serving: '100g (~3 whites)', calories: 52, protein: 11, carbs: 0.7, fat: 0.2 },
  { name: 'Grilled Chicken Breast', serving: '150g cooked', calories: 247, protein: 46, carbs: 0, fat: 5.4 },
  { name: 'Atlantic Salmon (baked)', serving: '150g fillet', calories: 310, protein: 34, carbs: 0, fat: 18 },
  { name: 'Canned Tuna in Water', serving: '1 can drained (120g)', calories: 130, protein: 29, carbs: 0, fat: 1 },
  { name: 'Lean Ground Beef (90/10)', serving: '150g cooked', calories: 290, protein: 38, carbs: 0, fat: 15 },
  { name: 'White Rice (cooked)', serving: '1 cup (158g)', calories: 205, protein: 4.2, carbs: 45, fat: 0.4 },
  { name: 'Brown Rice (cooked)', serving: '1 cup (195g)', calories: 218, protein: 4.5, carbs: 46, fat: 1.6 },
  { name: 'Sweet Potato (baked)', serving: '1 medium (114g)', calories: 103, protein: 2.3, carbs: 24, fat: 0.1 },
  { name: 'Whole Wheat Bread', serving: '2 slices (64g)', calories: 160, protein: 8, carbs: 28, fat: 2 },
  { name: 'Banana', serving: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
  { name: 'Apple (medium)', serving: '1 apple (182g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: 'Blueberries', serving: '1 cup (148g)', calories: 84, protein: 1.1, carbs: 21, fat: 0.5 },
  { name: 'Avocado', serving: '1/2 fruit (100g)', calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
  { name: 'Greek Yogurt 0% Fat', serving: '170g container', calories: 100, protein: 18, carbs: 6, fat: 0 },
  { name: 'Whole Milk', serving: '1 cup (244ml)', calories: 149, protein: 7.7, carbs: 11.7, fat: 8 },
  { name: 'Almond Milk (Unsweetened)', serving: '1 cup (240ml)', calories: 30, protein: 1, carbs: 1, fat: 2.5 },
  { name: 'Peanut Butter', serving: '2 tbsp (32g)', calories: 188, protein: 8, carbs: 7, fat: 16 },
  { name: 'Raw Almonds', serving: '1 handful (30g)', calories: 173, protein: 6.4, carbs: 6.1, fat: 15 },
  { name: 'Whey Protein Powder', serving: '1 scoop (30g)', calories: 120, protein: 24, carbs: 3, fat: 1.5 },
  { name: 'Olive Oil', serving: '1 tbsp (14g)', calories: 119, protein: 0, carbs: 0, fat: 13.5 },
  { name: 'Steamed Broccoli', serving: '1 cup (150g)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  { name: 'Dark Chocolate (70%)', serving: '30g (3 squares)', calories: 170, protein: 2.2, carbs: 13, fat: 12 },
  { name: 'Cottage Cheese 2%', serving: '1/2 cup (113g)', calories: 90, protein: 13, carbs: 4.5, fat: 2.5 }
];

// App State
let state = {
  currentDateStr: getTodayDateString(),
  goals: loadGoals(),
  days: loadDays()
};

// ============================================================
// Date Utilities
// ============================================================

function getTodayDateString() {
  const now = new Date();
  return formatDateToString(now);
}

function formatDateToString(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateString(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function getFormattedDateLabel(dateStr) {
  const todayStr = getTodayDateString();
  const dateObj = parseDateString(dateStr);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateToString(yesterday);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatDateToString(tomorrow);

  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const formatted = dateObj.toLocaleDateString(undefined, options);

  if (dateStr === todayStr) {
    return `Today, ${formatted}`;
  } else if (dateStr === yesterdayStr) {
    return `Yesterday, ${formatted}`;
  } else if (dateStr === tomorrowStr) {
    return `Tomorrow, ${formatted}`;
  }
  return formatted;
}

// ============================================================
// Storage Helpers
// ============================================================

function loadGoals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!raw) return { ...DEFAULT_GOALS };
    return { ...DEFAULT_GOALS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading goals from localStorage:', e);
    return { ...DEFAULT_GOALS };
  }
}

function saveGoalsToStorage(goals) {
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (e) {
    console.error('Error saving goals to localStorage:', e);
  }
}

function loadDays() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAYS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading days from localStorage:', e);
    return {};
  }
}

function saveDaysToStorage(days) {
  try {
    localStorage.setItem(STORAGE_KEYS.DAYS, JSON.stringify(days));
  } catch (e) {
    console.error('Error saving days to localStorage:', e);
  }
}

function getCurrentDayRecord() {
  const dateStr = state.currentDateStr;
  if (!state.days[dateStr]) {
    state.days[dateStr] = {
      entries: [],
      water: 0,
      notes: ''
    };
  }
  return state.days[dateStr];
}

// ============================================================
// Toast Notification
// ============================================================

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = '✓';
  if (type === 'error') icon = '✕';
  if (type === 'info') icon = 'ℹ';

  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}

// ============================================================
// Initialization & Event Binding
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initDateNavigation();
  initWaterTracker();
  initDailyNotes();
  initFoodDatalist();
  renderFoodLibraryCards();
  renderApp();

  // Resize listener for responsive canvas chart
  window.addEventListener('resize', debounce(() => {
    renderWeeklyChart();
  }, 200));
});

function initDateNavigation() {
  const prevBtn = document.getElementById('prevDayBtn');
  const nextBtn = document.getElementById('nextDayBtn');
  const dateBtn = document.getElementById('dateDisplayBtn');
  const datePicker = document.getElementById('datePickerInput');

  prevBtn.addEventListener('click', () => {
    shiftDay(-1);
  });

  nextBtn.addEventListener('click', () => {
    shiftDay(1);
  });

  dateBtn.addEventListener('click', () => {
    datePicker.value = state.currentDateStr;
    try {
      datePicker.showPicker();
    } catch {
      datePicker.click();
    }
  });

  datePicker.addEventListener('change', (e) => {
    if (e.target.value) {
      state.currentDateStr = e.target.value;
      renderApp();
    }
  });

  // Header modal triggers
  document.getElementById('openFoodLibraryBtn').addEventListener('click', () => openModal('foodLibraryModal'));
  document.getElementById('openGoalsBtn').addEventListener('click', () => openGoalsModal());
  document.getElementById('openDataBtn').addEventListener('click', () => openModal('dataModal'));
}

function shiftDay(daysOffset) {
  const cur = parseDateString(state.currentDateStr);
  cur.setDate(cur.getDate() + daysOffset);
  state.currentDateStr = formatDateToString(cur);
  renderApp();
}

function initDailyNotes() {
  const notesTextarea = document.getElementById('dailyNotesInput');
  const savedTag = document.getElementById('notesSavedTag');

  notesTextarea.addEventListener('input', debounce((e) => {
    const day = getCurrentDayRecord();
    day.notes = e.target.value;
    saveDaysToStorage(state.days);
    savedTag.textContent = 'Saved at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, 400));
}

function initWaterTracker() {
  const container = document.getElementById('waterGlassesRow');
  container.innerHTML = '';
  for (let i = 1; i <= 8; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'water-glass-btn';
    btn.setAttribute('data-glass', i);
    btn.title = `${i * 250} ml`;
    btn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
      </svg>
    `;
    btn.addEventListener('click', () => toggleWaterGlass(i));
    container.appendChild(btn);
  }
}

function toggleWaterGlass(index) {
  const day = getCurrentDayRecord();
  if (day.water === index) {
    day.water = index - 1;
  } else {
    day.water = index;
  }
  saveDaysToStorage(state.days);
  renderWater();
}

function initFoodDatalist() {
  const datalist = document.getElementById('commonFoodDatalist');
  datalist.innerHTML = '';
  COMMON_FOODS.forEach(food => {
    const option = document.createElement('option');
    option.value = food.name;
    option.label = `${food.calories} kcal - ${food.serving}`;
    datalist.appendChild(option);
  });

  // Auto-fill macros if user picks from datalist
  const nameInput = document.getElementById('entryNameInput');
  nameInput.addEventListener('change', () => {
    const matched = COMMON_FOODS.find(f => f.name.toLowerCase() === nameInput.value.trim().toLowerCase());
    if (matched) {
      document.getElementById('entryCaloriesInput').value = matched.calories;
      document.getElementById('entryServingInput').value = matched.serving;
      document.getElementById('entryProteinInput').value = matched.protein;
      document.getElementById('entryCarbsInput').value = matched.carbs;
      document.getElementById('entryFatInput').value = matched.fat;
    }
  });
}

// ============================================================
// Render App & UI State
// ============================================================

function renderApp() {
  // 1. Date label
  document.getElementById('dateDisplayText').textContent = getFormattedDateLabel(state.currentDateStr);
  document.getElementById('datePickerInput').value = state.currentDateStr;

  // 2. Day data
  const day = getCurrentDayRecord();

  // 3. Daily Notes
  const notesTextarea = document.getElementById('dailyNotesInput');
  notesTextarea.value = day.notes || '';
  document.getElementById('notesSavedTag').textContent = 'Saved to browser storage';

  // 4. Calculate day totals
  let foodKcal = 0;
  let burnedKcal = 0;
  let proteinTotal = 0;
  let carbsTotal = 0;
  let fatTotal = 0;

  const mealTotals = {
    breakfast: { kcal: 0, p: 0, c: 0, f: 0 },
    lunch: { kcal: 0, p: 0, c: 0, f: 0 },
    dinner: { kcal: 0, p: 0, c: 0, f: 0 },
    snack: { kcal: 0, p: 0, c: 0, f: 0 },
    exercise: { kcal: 0 }
  };

  (day.entries || []).forEach(item => {
    const cal = Number(item.calories) || 0;
    const p = Number(item.protein) || 0;
    const c = Number(item.carbs) || 0;
    const f = Number(item.fat) || 0;

    if (item.category === 'exercise') {
      burnedKcal += cal;
      mealTotals.exercise.kcal += cal;
    } else {
      foodKcal += cal;
      proteinTotal += p;
      carbsTotal += c;
      fatTotal += f;

      if (mealTotals[item.category]) {
        mealTotals[item.category].kcal += cal;
        mealTotals[item.category].p += p;
        mealTotals[item.category].c += c;
        mealTotals[item.category].f += f;
      }
    }
  });

  const targetKcal = state.goals.targetCalories || 2000;
  const netKcal = foodKcal - burnedKcal;
  const remainingKcal = targetKcal - foodKcal + burnedKcal;

  // 5. Update Calorie Equation Numbers
  document.getElementById('targetKcalDisplay').textContent = targetKcal.toLocaleString();
  document.getElementById('foodKcalDisplay').textContent = foodKcal.toLocaleString();
  document.getElementById('burnedKcalDisplay').textContent = burnedKcal.toLocaleString();
  document.getElementById('netKcalDisplay').textContent = netKcal.toLocaleString();

  // 6. Update Circular Progress Gauge
  const circle = document.getElementById('calorieProgressCircle');
  const circumference = 2 * Math.PI * 68; // radius is 68 in SVG -> ~427.26
  circle.style.strokeDasharray = `${circumference} ${circumference}`;

  const remainingValEl = document.getElementById('remainingCaloriesValue');
  const remainingLabelEl = document.getElementById('remainingCaloriesLabel');

  if (remainingKcal >= 0) {
    remainingValEl.textContent = remainingKcal.toLocaleString();
    remainingLabelEl.textContent = 'kcal remaining';
    remainingLabelEl.style.color = '#94a3b8';
    circle.style.stroke = '#10b981';

    const ratio = Math.min(foodKcal / (targetKcal + burnedKcal || 1), 1);
    const offset = circumference - (ratio * circumference);
    circle.style.strokeDashoffset = offset;
  } else {
    // Over target
    const overage = Math.abs(remainingKcal);
    remainingValEl.textContent = `+${overage.toLocaleString()}`;
    remainingLabelEl.textContent = 'kcal over target';
    remainingLabelEl.style.color = '#f43f5e';
    circle.style.stroke = '#f43f5e';
    circle.style.strokeDashoffset = 0;
  }

  // 7. Update Macronutrient Progress
  renderMacros(proteinTotal, carbsTotal, fatTotal);

  // 8. Render Water Tracker
  renderWater();

  // 9. Render Streak Badge
  renderStreak();

  // 10. Render Meal Sections and Item lists
  renderMealSections(day.entries || [], mealTotals);

  // 11. Render 7-day trend chart
  renderWeeklyChart();
}

function renderMacros(curP, curC, curF) {
  const g = state.goals;
  const pTarget = g.targetProtein || 150;
  const cTarget = g.targetCarbs || 225;
  const fTarget = g.targetFat || 65;

  // Protein
  document.getElementById('proteinCurrent').textContent = Math.round(curP);
  document.getElementById('proteinTarget').textContent = pTarget;
  const pPct = Math.min((curP / pTarget) * 100, 100);
  document.getElementById('proteinProgressBar').style.width = `${pPct}%`;
  const pKcal = Math.round(curP * 4);
  document.getElementById('proteinKcalText').textContent = `${pKcal} kcal (${Math.round((curP / (pTarget || 1)) * 100)}%)`;
  document.getElementById('proteinRemainingText').textContent = `${Math.max(0, Math.round(pTarget - curP))}g left`;

  // Carbs
  document.getElementById('carbsCurrent').textContent = Math.round(curC);
  document.getElementById('carbsTarget').textContent = cTarget;
  const cPct = Math.min((curC / cTarget) * 100, 100);
  document.getElementById('carbsProgressBar').style.width = `${cPct}%`;
  const cKcal = Math.round(curC * 4);
  document.getElementById('carbsKcalText').textContent = `${cKcal} kcal (${Math.round((curC / (cTarget || 1)) * 100)}%)`;
  document.getElementById('carbsRemainingText').textContent = `${Math.max(0, Math.round(cTarget - curC))}g left`;

  // Fat
  document.getElementById('fatCurrent').textContent = Math.round(curF);
  document.getElementById('fatTarget').textContent = fTarget;
  const fPct = Math.min((curF / fTarget) * 100, 100);
  document.getElementById('fatProgressBar').style.width = `${fPct}%`;
  const fKcal = Math.round(curF * 9);
  document.getElementById('fatKcalText').textContent = `${fKcal} kcal (${Math.round((curF / (fTarget || 1)) * 100)}%)`;
  document.getElementById('fatRemainingText').textContent = `${Math.max(0, Math.round(fTarget - curF))}g left`;
}

function renderWater() {
  const day = getCurrentDayRecord();
  const count = day.water || 0;
  document.getElementById('waterCupsCount').textContent = count;
  document.getElementById('waterMlCount').textContent = count * 250;

  const buttons = document.querySelectorAll('.water-glass-btn');
  buttons.forEach((btn, idx) => {
    if (idx < count) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function renderStreak() {
  let streak = 0;
  const today = new Date();

  // Count consecutive days with >= 1 logged food or exercise
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateToString(d);
    const rec = state.days[dateStr];

    if (rec && rec.entries && rec.entries.length > 0) {
      streak++;
    } else {
      // If today has 0 entries yet, check yesterday before breaking
      if (i === 0) {
        continue;
      }
      break;
    }
  }

  document.getElementById('streakCount').textContent = streak;
}

function renderMealSections(entries, mealTotals) {
  const categories = ['breakfast', 'lunch', 'dinner', 'snack', 'exercise'];

  categories.forEach(cat => {
    const listEl = document.getElementById(`${cat}EntriesList`);
    const statsEl = document.getElementById(`${cat}Stats`);
    if (!listEl || !statsEl) return;

    // Update Header stats text
    if (cat === 'exercise') {
      statsEl.textContent = `${mealTotals.exercise.kcal.toLocaleString()} kcal burned`;
    } else {
      const tot = mealTotals[cat];
      statsEl.textContent = `${tot.kcal.toLocaleString()} kcal • P: ${Math.round(tot.p)}g • C: ${Math.round(tot.c)}g • F: ${Math.round(tot.f)}g`;
    }

    // Filter items
    const catItems = entries.filter(e => e.category === cat);
    listEl.innerHTML = '';

    if (catItems.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'meal-empty-state';
      emptyDiv.textContent = cat === 'exercise'
        ? 'No workouts logged yet. Track your burned active calories.'
        : `No foods logged for ${cat} yet.`;
      listEl.appendChild(emptyDiv);
      return;
    }

    catItems.forEach(item => {
      const row = document.createElement('div');
      row.className = 'food-item-row';

      const isExercise = cat === 'exercise';
      const servingMarkup = item.serving ? `<span class="portion-text">${escapeHtml(item.serving)}</span>` : '';

      let macrosMarkup = '';
      if (!isExercise && (item.protein > 0 || item.carbs > 0 || item.fat > 0)) {
        macrosMarkup = `
          <div class="macros-pill">
            <span class="macro-p">P: ${item.protein || 0}g</span>
            <span class="macro-c">C: ${item.carbs || 0}g</span>
            <span class="macro-f">F: ${item.fat || 0}g</span>
          </div>
        `;
      }

      row.innerHTML = `
        <div class="food-item-info">
          <span class="food-name">${escapeHtml(item.name)}</span>
          <div class="food-details">
            ${servingMarkup}
            ${macrosMarkup}
          </div>
        </div>
        <div class="food-item-right">
          <div class="food-calories-badge ${isExercise ? 'exercise-calories-badge' : ''}">
            ${isExercise ? '-' : '+'}${Number(item.calories).toLocaleString()} <span style="font-size:0.7rem; font-weight:normal; color:#94a3b8;">kcal</span>
          </div>
          <div class="food-item-actions">
            <button class="btn-icon-tiny" title="Edit entry" onclick="openEditEntryModal('${item.id}')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-icon-tiny btn-icon-delete" title="Delete entry" onclick="deleteEntry('${item.id}')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;
      listEl.appendChild(row);
    });
  });
}

// ============================================================
// 7-Day History Chart (Vanilla Canvas)
// ============================================================

function renderWeeklyChart() {
  const canvas = document.getElementById('weeklyHistoryCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width > 50 ? rect.width : (canvas.parentElement ? canvas.parentElement.clientWidth : 800);
  const height = 240;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  // Collect the last 7 days ending at currentDate
  const daysData = [];
  const selectedDate = parseDateString(state.currentDateStr);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateToString(d);
    const rec = state.days[dateStr] || { entries: [] };

    let foodKcal = 0;
    let burnedKcal = 0;
    (rec.entries || []).forEach(e => {
      const kcal = Number(e.calories) || 0;
      if (e.category === 'exercise') {
        burnedKcal += kcal;
      } else {
        foodKcal += kcal;
      }
    });

    const netKcal = Math.max(0, foodKcal - burnedKcal);

    daysData.push({
      dateStr,
      label: d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }),
      foodKcal,
      burnedKcal,
      netKcal,
      isCurrentDay: dateStr === state.currentDateStr
    });
  }

  const targetKcal = state.goals.targetCalories || 2000;
  const maxNetFound = Math.max(...daysData.map(d => d.netKcal), targetKcal);
  const chartMax = Math.ceil((maxNetFound * 1.25) / 500) * 500;

  const padding = { top: 25, bottom: 45, left: 50, right: 25 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Draw background grid lines
  const gridSteps = 4;
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#64748b';
  ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'right';

  for (let i = 0; i <= gridSteps; i++) {
    const val = (chartMax / gridSteps) * i;
    const y = padding.top + plotHeight - (val / chartMax) * plotHeight;

    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    ctx.fillText(`${Math.round(val)}`, padding.left - 8, y + 4);
  }

  // Draw Target Calorie Line (Cyan dashed line)
  const targetY = padding.top + plotHeight - (targetKcal / chartMax) * plotHeight;
  ctx.save();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(padding.left, targetY);
  ctx.lineTo(width - padding.right, targetY);
  ctx.stroke();
  ctx.restore();

  // Draw Bars
  const barWidth = Math.min(plotWidth / 7 * 0.55, 42);
  const step = plotWidth / 7;

  daysData.forEach((day, idx) => {
    const centerX = padding.left + (idx * step) + (step / 2);
    const barX = centerX - (barWidth / 2);
    const barHeight = Math.max((day.netKcal / chartMax) * plotHeight, 3);
    const barY = padding.top + plotHeight - barHeight;

    // Pick color: Green if net <= target, Red/Rose if net > target
    const isOver = day.netKcal > targetKcal;
    const barColor = isOver ? '#f43f5e' : '#10b981';

    // Draw bar with rounded top corners
    ctx.fillStyle = barColor;
    drawRoundedBar(ctx, barX, barY, barWidth, barHeight, 6);

    // If it's the currently selected day, draw a subtle highlight ring/box
    if (day.isCurrentDay) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(barX - 3, barY - 3, barWidth + 6, barHeight + 3);
    }

    // Calorie value on top of bar
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${day.netKcal}`, centerX, barY - 7);

    // Day label under x-axis
    ctx.fillStyle = day.isCurrentDay ? '#38bdf8' : '#94a3b8';
    ctx.font = day.isCurrentDay ? 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif' : '11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(day.label, centerX, height - padding.bottom + 18);
  });
}

function drawRoundedBar(ctx, x, y, width, height, radius) {
  if (height < radius) radius = height / 2;
  ctx.beginPath();
  ctx.moveTo(x, y + height);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height);
  ctx.closePath();
  ctx.fill();
}

// ============================================================
// Add / Edit Entry Modal Logic
// ============================================================

function openAddEntryModal(defaultCategory = 'lunch') {
  document.getElementById('entryForm').reset();
  document.getElementById('entryIdInput').value = '';
  document.getElementById('entryModalTitle').textContent = 'Add Food Entry';
  document.getElementById('saveEntryBtn').textContent = 'Save Entry';

  const catSelect = document.getElementById('entryMealSelect');
  catSelect.value = defaultCategory;
  handleCategoryChange();

  openModal('entryModal');
  setTimeout(() => document.getElementById('entryNameInput').focus(), 150);
}

function openEditEntryModal(id) {
  const day = getCurrentDayRecord();
  const item = (day.entries || []).find(e => e.id === id);
  if (!item) return;

  document.getElementById('entryIdInput').value = item.id;
  document.getElementById('entryMealSelect').value = item.category;
  document.getElementById('entryNameInput').value = item.name;
  document.getElementById('entryCaloriesInput').value = item.calories;
  document.getElementById('entryServingInput').value = item.serving || '';
  document.getElementById('entryProteinInput').value = item.protein || '';
  document.getElementById('entryCarbsInput').value = item.carbs || '';
  document.getElementById('entryFatInput').value = item.fat || '';

  document.getElementById('entryModalTitle').textContent = 'Edit Entry';
  document.getElementById('saveEntryBtn').textContent = 'Update Entry';

  handleCategoryChange();
  openModal('entryModal');
}

function handleCategoryChange() {
  const cat = document.getElementById('entryMealSelect').value;
  const isExercise = (cat === 'exercise');
  const macrosGroup = document.getElementById('macroInputsGroup');
  const nameLabel = document.getElementById('entryNameLabel');
  const caloriesLabel = document.getElementById('entryCaloriesLabel');

  if (isExercise) {
    macrosGroup.style.display = 'none';
    nameLabel.textContent = 'Activity / Exercise Name';
    caloriesLabel.innerHTML = 'Calories Burned (kcal) <span class="required">*</span>';
    document.getElementById('entryNameInput').placeholder = 'e.g. 5km Running, Cycling, Strength Training';
  } else {
    macrosGroup.style.display = 'flex';
    nameLabel.textContent = 'Food Name';
    caloriesLabel.innerHTML = 'Calories (kcal) <span class="required">*</span>';
    document.getElementById('entryNameInput').placeholder = 'e.g. Grilled Chicken Salad';
  }
}

function setQuickCalories(amount) {
  const calInput = document.getElementById('entryCaloriesInput');
  const cur = Number(calInput.value) || 0;
  calInput.value = cur + amount;
}

function calcCaloriesFromMacros() {
  const p = Number(document.getElementById('entryProteinInput').value) || 0;
  const c = Number(document.getElementById('entryCarbsInput').value) || 0;
  const f = Number(document.getElementById('entryFatInput').value) || 0;

  const estimated = Math.round((p * 4) + (c * 4) + (f * 9));
  if (estimated > 0) {
    document.getElementById('entryCaloriesInput').value = estimated;
    showToast(`Estimated ${estimated} kcal from macros!`, 'info');
  } else {
    showToast('Enter protein, carbs, or fat first to calculate calories.', 'info');
  }
}

function handleEntrySubmit(e) {
  e.preventDefault();

  const id = document.getElementById('entryIdInput').value;
  const category = document.getElementById('entryMealSelect').value;
  const name = document.getElementById('entryNameInput').value.trim();
  const calories = Number(document.getElementById('entryCaloriesInput').value);
  const serving = document.getElementById('entryServingInput').value.trim();
  const protein = Number(document.getElementById('entryProteinInput').value) || 0;
  const carbs = Number(document.getElementById('entryCarbsInput').value) || 0;
  const fat = Number(document.getElementById('entryFatInput').value) || 0;

  if (!name || isNaN(calories) || calories < 0) {
    showToast('Please enter a valid name and calorie count', 'error');
    return;
  }

  const day = getCurrentDayRecord();
  if (!day.entries) day.entries = [];

  if (id) {
    // Edit
    const index = day.entries.findIndex(entry => entry.id === id);
    if (index !== -1) {
      day.entries[index] = {
        ...day.entries[index],
        category,
        name,
        calories,
        serving,
        protein,
        carbs,
        fat
      };
      showToast(`Updated "${name}"`);
    }
  } else {
    // New entry
    const newEntry = {
      id: 'entry_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      category,
      name,
      calories,
      serving,
      protein,
      carbs,
      fat,
      createdAt: Date.now()
    };
    day.entries.push(newEntry);
    showToast(`Logged "${name}" (+${calories} kcal)`);
  }

  saveDaysToStorage(state.days);
  closeModal('entryModal');
  renderApp();
}

function deleteEntry(id) {
  const day = getCurrentDayRecord();
  if (!day.entries) return;

  const item = day.entries.find(e => e.id === id);
  const name = item ? item.name : 'Entry';

  day.entries = day.entries.filter(e => e.id !== id);
  saveDaysToStorage(state.days);
  renderApp();
  showToast(`Removed "${name}"`, 'info');
}

// ============================================================
// Common Foods Library Modal Logic
// ============================================================

function renderFoodLibraryCards(filterText = '') {
  const grid = document.getElementById('libraryFoodsGrid');
  grid.innerHTML = '';

  const filtered = COMMON_FOODS.filter(food => {
    if (!filterText) return true;
    return food.name.toLowerCase().includes(filterText.toLowerCase());
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 2rem;">No foods match your search.</div>';
    return;
  }

  filtered.forEach(food => {
    const card = document.createElement('div');
    card.className = 'library-card';
    card.innerHTML = `
      <div>
        <div class="library-card-header">
          <span class="library-food-title">${escapeHtml(food.name)}</span>
          <span class="library-calories">${food.calories} kcal</span>
        </div>
        <div class="library-serving">${escapeHtml(food.serving)}</div>
      </div>
      <div class="library-macros">
        <span class="macro-p">P: ${food.protein}g</span>
        <span class="macro-c">C: ${food.carbs}g</span>
        <span class="macro-f">F: ${food.fat}g</span>
      </div>
      <button type="button" class="btn-library-add" onclick="addFromLibrary('${escapeHtml(food.name)}')">
        + Add to Day
      </button>
    `;
    grid.appendChild(card);
  });
}

function filterFoodLibrary() {
  const q = document.getElementById('librarySearchInput').value.trim();
  renderFoodLibraryCards(q);
}

function addFromLibrary(foodName) {
  const food = COMMON_FOODS.find(f => f.name === foodName);
  if (!food) return;

  const targetCategory = document.getElementById('libraryMealTargetSelect').value || 'lunch';
  const day = getCurrentDayRecord();
  if (!day.entries) day.entries = [];

  const newEntry = {
    id: 'entry_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    category: targetCategory,
    name: food.name,
    calories: food.calories,
    serving: food.serving,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    createdAt: Date.now()
  };

  day.entries.push(newEntry);
  saveDaysToStorage(state.days);
  renderApp();

  showToast(`Added ${food.name} to ${targetCategory}!`);
}

// ============================================================
// Goals & TDEE Calculator
// ============================================================

function openGoalsModal() {
  document.getElementById('targetCaloriesInput').value = state.goals.targetCalories;
  document.getElementById('targetProteinInput').value = state.goals.targetProtein;
  document.getElementById('targetCarbsInput').value = state.goals.targetCarbs;
  document.getElementById('targetFatInput').value = state.goals.targetFat;

  openModal('goalsModal');
}

function calculateTDEE() {
  const gender = document.getElementById('calcGender').value;
  const age = Number(document.getElementById('calcAge').value) || 28;
  const weight = Number(document.getElementById('calcWeight').value) || 75;
  const height = Number(document.getElementById('calcHeight').value) || 175;
  const activity = Number(document.getElementById('calcActivity').value) || 1.375;
  const goalOffset = Number(document.getElementById('calcGoal').value) || 0;

  // Mifflin-St Jeor formula
  let bmr = 0;
  if (gender === 'male') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }

  const tdee = Math.round(bmr * activity);
  const targetCal = Math.max(1200, Math.round(tdee + goalOffset));

  document.getElementById('targetCaloriesInput').value = targetCal;

  // Default to Balanced Macro Split (40% Carbs, 30% Protein, 30% Fat)
  applyMacroSplit(40, 30, 30, targetCal);
  showToast(`Calculated TDEE: ${tdee} kcal → Goal Target: ${targetCal} kcal`, 'info');
}

function applyMacroSplit(carbPct, proteinPct, fatPct, overrideCalories) {
  const cal = overrideCalories || Number(document.getElementById('targetCaloriesInput').value) || 2000;

  const carbKcal = cal * (carbPct / 100);
  const proteinKcal = cal * (proteinPct / 100);
  const fatKcal = cal * (fatPct / 100);

  const carbGrams = Math.round(carbKcal / 4);
  const proteinGrams = Math.round(proteinKcal / 4);
  const fatGrams = Math.round(fatKcal / 9);

  document.getElementById('targetProteinInput').value = proteinGrams;
  document.getElementById('targetCarbsInput').value = carbGrams;
  document.getElementById('targetFatInput').value = fatGrams;
}

function saveGoals(e) {
  e.preventDefault();

  const targetCal = Number(document.getElementById('targetCaloriesInput').value) || 2000;
  const protein = Number(document.getElementById('targetProteinInput').value) || 150;
  const carbs = Number(document.getElementById('targetCarbsInput').value) || 225;
  const fat = Number(document.getElementById('targetFatInput').value) || 65;

  state.goals = {
    targetCalories: targetCal,
    targetProtein: protein,
    targetCarbs: carbs,
    targetFat: fat
  };

  saveGoalsToStorage(state.goals);
  closeModal('goalsModal');
  renderApp();
  showToast('Daily calorie and macro targets saved!');
}

// ============================================================
// Data Backup, Export & Sample Data
// ============================================================

function exportDataToJSON() {
  const exportPayload = {
    app: 'CalTrack Vanilla',
    version: '1.0',
    exportDate: new Date().toISOString(),
    goals: state.goals,
    days: state.days
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `caltrack-backup-${state.currentDateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Data exported successfully!');
}

function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.goals) {
        state.goals = { ...DEFAULT_GOALS, ...data.goals };
        saveGoalsToStorage(state.goals);
      }
      if (data.days && typeof data.days === 'object') {
        state.days = { ...state.days, ...data.days };
        saveDaysToStorage(state.days);
      }
      closeModal('dataModal');
      renderApp();
      showToast('Data backup restored successfully!');
    } catch (err) {
      console.error(err);
      showToast('Invalid backup file. Could not parse JSON.', 'error');
    }
  };
  reader.readAsText(file);
}

function loadSampleData() {
  const today = new Date();
  const sampleDays = {};

  const sampleMeals = [
    [
      { category: 'breakfast', name: 'Rolled Oats with Berries & Milk', calories: 340, protein: 14, carbs: 58, fat: 6, serving: '1 bowl' },
      { category: 'lunch', name: 'Grilled Chicken Breast with Quinoa & Veggies', calories: 520, protein: 48, carbs: 52, fat: 12, serving: '1 meal box' },
      { category: 'dinner', name: 'Baked Salmon with Sweet Potato', calories: 560, protein: 42, carbs: 45, fat: 22, serving: '1 plate' },
      { category: 'snack', name: 'Greek Yogurt with Honey & Almonds', calories: 230, protein: 19, carbs: 20, fat: 9, serving: '1 bowl' },
      { category: 'exercise', name: 'Outdoor Jogging', calories: 350, serving: '35 mins' }
    ],
    [
      { category: 'breakfast', name: 'Scrambled Eggs (3) with Toast', calories: 380, protein: 22, carbs: 26, fat: 20, serving: '2 slices' },
      { category: 'lunch', name: 'Tuna Salad Wrap', calories: 450, protein: 36, carbs: 40, fat: 14, serving: '1 wrap' },
      { category: 'dinner', name: 'Lean Beef Stir Fry with Jasmine Rice', calories: 620, protein: 45, carbs: 65, fat: 18, serving: '1 large bowl' },
      { category: 'snack', name: 'Whey Protein Shake & Apple', calories: 215, protein: 25, carbs: 26, fat: 2, serving: '1 shaker + fruit' },
      { category: 'exercise', name: 'Gym Strength Training', calories: 280, serving: '50 mins' }
    ],
    [
      { category: 'breakfast', name: 'Protein Pancakes with Maple Syrup', calories: 410, protein: 32, carbs: 54, fat: 7, serving: '3 pancakes' },
      { category: 'lunch', name: 'Turkey & Avocado Sandwich', calories: 480, protein: 32, carbs: 42, fat: 20, serving: '1 sandwich' },
      { category: 'dinner', name: 'Grilled Chicken with Pasta & Marinara', calories: 590, protein: 46, carbs: 68, fat: 14, serving: '1 bowl' },
      { category: 'snack', name: 'Peanut Butter on Rice Cakes', calories: 240, protein: 8, carbs: 22, fat: 14, serving: '2 cakes' },
      { category: 'exercise', name: 'High Intensity Intervals', calories: 320, serving: '30 mins' }
    ]
  ];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateToString(d);

    const mealTemplate = sampleMeals[i % sampleMeals.length];
    sampleDays[dateStr] = {
      entries: mealTemplate.map((item, idx) => ({
        id: 'sample_' + dateStr + '_' + idx,
        ...item,
        createdAt: Date.now() - (i * 86400000)
      })),
      water: 6 + (i % 3),
      notes: i === 0 ? 'Felt super energetic today after morning run!' : 'Solid nutrition day, met protein targets.'
    };
  }

  state.days = { ...state.days, ...sampleDays };
  saveDaysToStorage(state.days);
  closeModal('dataModal');
  renderApp();
  showToast('Populated 7 days of realistic sample logs!');
}

function confirmResetAllData() {
  if (confirm('Are you sure you want to permanently erase all saved calorie logs, targets, and notes?')) {
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.DAYS);
    state.goals = { ...DEFAULT_GOALS };
    state.days = {};
    closeModal('dataModal');
    renderApp();
    showToast('Storage wiped completely clean', 'error');
  }
}

// ============================================================
// Modal Manager Helpers
// ============================================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
  }
}

// Close modal when user clicks backdrop
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
  }
});

// Escape key to close open modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
  }
});

// Utility: HTML escape
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Utility: Debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}