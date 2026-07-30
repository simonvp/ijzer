/* ============================================================
   seed.js — default exercise library, workout templates, schedule
   All content sourced from the user's briefing document.
   ============================================================ */

const Seed = (() => {

  // ---- Exercise library -------------------------------------------------
  // weightUnit: 'per_dumbbell' | 'totaal' | 'barbell' | 'machine' | 'bodyweight' | 'kettlebell'
  const exercises = [
    { id: 'ex_incline_bb_bench', name: 'Incline Barbell Bench Press', category: 'Push', primaryMuscle: 'Borst (boven)', secondaryMuscles: ['Schouders', 'Triceps'], equipment: 'Barbell, bank', location: 'gym', type: 'compound', weightUnit: 'barbell', defaultReps: '6-8', defaultRir: '1-2', defaultRest: 150, instructions: 'Bank op 30-45°. Stang naar boven op de borst, volledige lock-out.', cues: 'Schouderbladen samen en naar beneden, voeten stevig geplant.', mistakes: 'Te steile bankhoek, stuiteren op de borst.', alternatives: ['ex_incline_db_bench'] },
    { id: 'ex_incline_db_bench', name: 'Incline Dumbbell Bench Press', category: 'Push', primaryMuscle: 'Borst (boven)', secondaryMuscles: ['Schouders', 'Triceps'], equipment: 'Dumbbells, bank', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '6-8', defaultRir: '1-2', defaultRest: 150, instructions: 'Bank op 30-45°. Dumbbells vanaf de borst naar boven drukken.', cues: 'Pols recht boven elleboog, gecontroleerde afdaling.', mistakes: 'Gewichten laten botsen bovenaan.', alternatives: ['ex_incline_bb_bench'] },
    { id: 'ex_flat_db_bench', name: 'Flat Dumbbell Bench Press', category: 'Push', primaryMuscle: 'Borst', secondaryMuscles: ['Schouders', 'Triceps'], equipment: 'Dumbbells, bank', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Vlakke bank, dumbbells vanaf borsthoogte naar boven drukken.', cues: 'Lichte boog, ellebogen niet volledig locken.', mistakes: 'Te snel excentrisch bewegen.', alternatives: [] },
    { id: 'ex_lat_pulldown', name: 'Lat Pulldown', category: 'Pull', primaryMuscle: 'Rug (lats)', secondaryMuscles: ['Biceps'], equipment: 'Kabelmachine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Stang naar de bovenborst trekken, ellebogen naar beneden en achteren.', cues: 'Borst omhoog, geen momentum met de rug.', mistakes: 'Te ver achterover leunen.', alternatives: ['ex_assisted_pullup'] },
    { id: 'ex_assisted_pullup', name: 'Assisted Pull-up', category: 'Pull', primaryMuscle: 'Rug (lats)', secondaryMuscles: ['Biceps'], equipment: 'Pull-up machine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Volledige range, kin boven de stang.', cues: 'Actief de schouderbladen naar beneden trekken bij start.', mistakes: 'Halve reps.', alternatives: ['ex_lat_pulldown'] },
    { id: 'ex_lateral_raise', name: 'Lateral Raise', category: 'Isolatie', primaryMuscle: 'Zijdelingse schouders', secondaryMuscles: [], equipment: 'Dumbbells of kabel', location: 'gym', type: 'isolatie', weightUnit: 'per_dumbbell', defaultReps: '12-20', defaultRir: '0-2', defaultRest: 60, instructions: 'Armen zijwaarts heffen tot schouderhoogte.', cues: 'Lichte buiging in de elleboog, leiden met de ellebogen.', mistakes: 'Momentum gebruiken vanuit de heupen.', alternatives: [] },
    { id: 'ex_triceps_pushdown', name: 'Triceps Pushdown', category: 'Isolatie', primaryMuscle: 'Triceps', secondaryMuscles: [], equipment: 'Kabelmachine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Ellebogen bij de romp, onderarmen naar beneden drukken.', cues: 'Volledige extensie onderaan.', mistakes: 'Ellebogen laten wegzwaaien.', alternatives: [] },
    { id: 'ex_incline_db_curl', name: 'Incline Dumbbell Curl', category: 'Isolatie', primaryMuscle: 'Biceps', secondaryMuscles: [], equipment: 'Dumbbells, schuine bank', location: 'gym', type: 'isolatie', weightUnit: 'per_dumbbell', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Op schuine bank, armen volledig strekken en curlen.', cues: 'Ellebogen achter de romp houden.', mistakes: 'Schouders mee optrekken.', alternatives: ['ex_cable_curl'] },
    { id: 'ex_chest_supported_row', name: 'Chest Supported Dumbbell Row', category: 'Pull', primaryMuscle: 'Bovenrug', secondaryMuscles: ['Biceps', 'Achterste schouders'], equipment: 'Dumbbells, schuine bank', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '6-10', defaultRir: '1-2', defaultRest: 120, instructions: 'Borst op schuine bank, dumbbells naar de heupen trekken.', cues: 'Schouderbladen samenknijpen bovenaan.', mistakes: 'Rug bollen.', alternatives: [] },

    // Lower A
    { id: 'ex_back_squat', name: 'Back Squat', category: 'Squat', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Bilspieren', 'Core'], equipment: 'Barbell, rek', location: 'gym', type: 'compound', weightUnit: 'barbell', defaultReps: '5-8', defaultRir: '1-2', defaultRest: 165, instructions: 'Stang op de bovenrug, diep zakken tot minstens parallel.', cues: 'Knieën in lijn met de tenen, borst omhoog.', mistakes: 'Knieën naar binnen laten zakken.', alternatives: ['ex_hack_squat'] },
    { id: 'ex_rdl', name: 'Romanian Deadlift', category: 'Hinge', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Bilspieren', 'Onderrug'], equipment: 'Barbell', location: 'gym', type: 'compound', weightUnit: 'barbell', defaultReps: '6-10', defaultRir: '1-2', defaultRest: 150, instructions: 'Heupen naar achteren, stang dicht bij de benen, rug neutraal.', cues: 'Lichte kniebuiging, rek voelen in de hamstrings.', mistakes: 'Rug ronden.', alternatives: [] },
    { id: 'ex_bulgarian_split_squat', name: 'Bulgarian Split Squat', category: 'Unilateraal', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Bilspieren'], equipment: 'Dumbbells, bank', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '8-12 per been', defaultRir: '1-2', defaultRest: 105, instructions: 'Achterste voet verhoogd, recht naar beneden zakken.', cues: 'Romp rechtop, gewicht op de voorste hiel.', mistakes: 'Te ver naar voren leunen.', alternatives: [] },
    { id: 'ex_leg_curl', name: 'Leg Curl', category: 'Isolatie', primaryMuscle: 'Hamstrings', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '0-2', defaultRest: 75, instructions: 'Hielen naar de bilspieren curlen.', cues: 'Gecontroleerd terug laten zakken.', mistakes: 'Heupen optillen.', alternatives: ['ex_seated_leg_curl'] },
    { id: 'ex_standing_calf_raise', name: 'Standing Calf Raise', category: 'Isolatie', primaryMuscle: 'Kuiten', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-20', defaultRir: '0-1', defaultRest: 60, instructions: 'Volledige range: diepe stretch tot volledig op de tenen.', cues: 'Even pauzeren bovenaan.', mistakes: 'Halve range.', alternatives: [] },
    { id: 'ex_cable_crunch', name: 'Cable Crunch', category: 'Core', primaryMuscle: 'Buikspieren', secondaryMuscles: [], equipment: 'Kabelmachine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '1-2', defaultRest: 60, instructions: 'Op de knieën, ronden vanuit de buikspieren naar beneden.', cues: 'Heupen stil houden, alleen de romp buigt.', mistakes: 'Met de armen trekken.', alternatives: ['ex_reverse_crunch'] },
    { id: 'ex_reverse_crunch', name: 'Reverse Crunch', category: 'Core', primaryMuscle: 'Buikspieren', secondaryMuscles: [], equipment: 'Mat', location: 'beide', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '10-15', defaultRir: '1-2', defaultRest: 60, instructions: 'Bekken optillen richting de ribben, benen gebogen.', cues: 'Traag en gecontroleerd.', mistakes: 'Momentum gebruiken.', alternatives: ['ex_cable_crunch'] },

    // Upper B
    { id: 'ex_ohp', name: 'Standing Barbell Overhead Press', category: 'Push', primaryMuscle: 'Schouders', secondaryMuscles: ['Triceps', 'Core'], equipment: 'Barbell', location: 'gym', type: 'compound', weightUnit: 'barbell', defaultReps: '5-8', defaultRir: '1-2', defaultRest: 150, instructions: 'Stang vanaf de schouders recht naar boven drukken.', cues: 'Billen aanspannen, hoofd licht door onder de stang.', mistakes: 'Overmatig doorbuigen in de onderrug.', alternatives: [] },
    { id: 'ex_oneam_db_row', name: 'One-arm Dumbbell Row', category: 'Pull', primaryMuscle: 'Bovenrug', secondaryMuscles: ['Biceps'], equipment: 'Dumbbell, bank', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Knie en hand op de bank, dumbbell naar de heup trekken.', cues: 'Romp stabiel, geen rotatie.', mistakes: 'Ruk-beweging.', alternatives: ['ex_seated_cable_row'] },
    { id: 'ex_seated_cable_row', name: 'Seated Cable Row', category: 'Pull', primaryMuscle: 'Bovenrug', secondaryMuscles: ['Biceps'], equipment: 'Kabelmachine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Handvat naar de buik trekken, rug rechtop.', cues: 'Schouderbladen samenknijpen op het einde.', mistakes: 'Achterover leunen om te trekken.', alternatives: ['ex_oneam_db_row'] },
    { id: 'ex_chest_press_machine', name: 'Machine Chest Press', category: 'Push', primaryMuscle: 'Borst', secondaryMuscles: ['Schouders', 'Triceps'], equipment: 'Machine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '8-12', defaultRir: '1-2', defaultRest: 105, instructions: 'Handvatten recht naar voren drukken.', cues: 'Schouderbladen ingedrukt op de rugsteun.', mistakes: 'Handvatten laten uitwijken.', alternatives: [] },
    { id: 'ex_rear_delt_fly', name: 'Rear Delt Fly', category: 'Isolatie', primaryMuscle: 'Achterste schouders', secondaryMuscles: ['Bovenrug'], equipment: 'Dumbbells of machine', location: 'gym', type: 'isolatie', weightUnit: 'per_dumbbell', defaultReps: '12-20', defaultRir: '0-2', defaultRest: 60, instructions: 'Licht voorover, armen zijwaarts-achterwaarts openen.', cues: 'Kleine range, focus op de achterste schouder.', mistakes: 'Te zwaar gewicht, momentum.', alternatives: ['ex_face_pull'] },
    { id: 'ex_face_pull', name: 'Face Pull', category: 'Isolatie', primaryMuscle: 'Achterste schouders', secondaryMuscles: ['Bovenrug'], equipment: 'Kabelmachine, touw', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '12-20', defaultRir: '0-2', defaultRest: 60, instructions: 'Touw naar het gezicht trekken, ellebogen hoog.', cues: 'Handen eindigen naast de oren.', mistakes: 'Te zwaar, korte range.', alternatives: ['ex_rear_delt_fly'] },
    { id: 'ex_cable_curl', name: 'Cable Curl', category: 'Isolatie', primaryMuscle: 'Biceps', secondaryMuscles: [], equipment: 'Kabelmachine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Constante spanning, volledige curl.', cues: 'Ellebogen bij de romp.', mistakes: 'Schouders meebewegen.', alternatives: ['ex_incline_db_curl'] },
    { id: 'ex_ov_triceps_ext', name: 'Overhead Triceps Extension', category: 'Isolatie', primaryMuscle: 'Triceps', secondaryMuscles: [], equipment: 'Dumbbell of kabel', location: 'gym', type: 'isolatie', weightUnit: 'per_dumbbell', defaultReps: '10-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Gewicht achter het hoofd strekken.', cues: 'Ellebogen dicht bij het hoofd houden.', mistakes: 'Ellebogen laten uitwaaieren.', alternatives: [] },

    // Lower B
    { id: 'ex_trap_bar_dl', name: 'Trap Bar Deadlift', category: 'Hinge', primaryMuscle: 'Posterior chain', secondaryMuscles: ['Quadriceps', 'Rug'], equipment: 'Trap bar', location: 'gym', type: 'compound', weightUnit: 'barbell', defaultReps: '4-6', defaultRir: '1-2', defaultRest: 165, instructions: 'Vanaf de vloer optrekken met rechte rug, heupen en knieën samen strekken.', cues: 'Stang dicht bij het lichaam houden.', mistakes: 'Rug ronden bij het optrekken.', alternatives: ['ex_conv_deadlift'] },
    { id: 'ex_conv_deadlift', name: 'Conventional Deadlift', category: 'Hinge', primaryMuscle: 'Posterior chain', secondaryMuscles: ['Quadriceps', 'Rug'], equipment: 'Barbell', location: 'gym', type: 'compound', weightUnit: 'barbell', defaultReps: '4-6', defaultRir: '1-2', defaultRest: 165, instructions: 'Klassieke deadlift, stang dicht bij de schenen.', cues: 'Heupen en schouders gelijktijdig optrekken.', mistakes: 'Heupen te vroeg optrekken.', alternatives: ['ex_trap_bar_dl'] },
    { id: 'ex_front_squat', name: 'Front Squat', category: 'Squat', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Core'], equipment: 'Barbell, rek', location: 'gym', type: 'compound', weightUnit: 'barbell', defaultReps: '6-10', defaultRir: '1-2', defaultRest: 120, instructions: 'Stang op de voorste schouders, rechtop blijven bij het zakken.', cues: 'Ellebogen hoog houden.', mistakes: 'Ellebogen laten zakken.', alternatives: ['ex_hack_squat'] },
    { id: 'ex_hack_squat', name: 'Hack Squat', category: 'Squat', primaryMuscle: 'Quadriceps', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'compound', weightUnit: 'machine', defaultReps: '6-10', defaultRir: '1-2', defaultRest: 120, instructions: 'Rug tegen de rugsteun, diep zakken en drukken.', cues: 'Volledige voetzool op de plaat.', mistakes: 'Hielen optillen.', alternatives: ['ex_front_squat', 'ex_back_squat'] },
    { id: 'ex_walking_lunge', name: 'Walking Lunge', category: 'Unilateraal', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Bilspieren'], equipment: 'Dumbbells', location: 'gym', type: 'compound', weightUnit: 'per_dumbbell', defaultReps: '8-12 per been', defaultRir: '1-2', defaultRest: 105, instructions: 'Grote stap naar voren, knie richting de vloer.', cues: 'Romp rechtop.', mistakes: 'Te korte pas.', alternatives: [] },
    { id: 'ex_seated_leg_curl', name: 'Seated Leg Curl', category: 'Isolatie', primaryMuscle: 'Hamstrings', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '10-15', defaultRir: '0-2', defaultRest: 75, instructions: 'Zittend, hielen naar beneden curlen.', cues: 'Volledige range.', mistakes: 'Heupen optillen.', alternatives: ['ex_leg_curl'] },
    { id: 'ex_leg_extension', name: 'Leg Extension', category: 'Isolatie', primaryMuscle: 'Quadriceps', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '12-15', defaultRir: '0-1', defaultRest: 60, instructions: 'Onderbenen strekken tot bijna volledige extensie.', cues: 'Korte pauze bovenaan.', mistakes: 'Te snel laten terugvallen.', alternatives: [] },
    { id: 'ex_seated_calf_raise', name: 'Seated Calf Raise', category: 'Isolatie', primaryMuscle: 'Kuiten (soleus)', secondaryMuscles: [], equipment: 'Machine', location: 'gym', type: 'isolatie', weightUnit: 'machine', defaultReps: '12-20', defaultRir: '0-1', defaultRest: 60, instructions: 'Zittend, volledige range op de kuiten.', cues: 'Diepe stretch onderaan.', mistakes: 'Halve range.', alternatives: [] },
    { id: 'ex_ab_wheel', name: 'Ab Wheel', category: 'Core', primaryMuscle: 'Buikspieren', secondaryMuscles: ['Lage rug'], equipment: 'Ab wheel', location: 'gym', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '8-15', defaultRir: '1-2', defaultRest: 60, instructions: 'Vanuit de knieën uitrollen zonder de rug door te laten zakken.', cues: 'Bekken gekanteld houden.', mistakes: 'Te ver uitrollen met verlies van core-spanning.', alternatives: ['ex_plank'] },
    { id: 'ex_plank', name: 'Plank', category: 'Core', primaryMuscle: 'Buikspieren', secondaryMuscles: ['Lage rug'], equipment: 'Mat', location: 'beide', type: 'isolatie', weightUnit: 'bodyweight', defaultReps: '30-60 sec', defaultRir: '1-2', defaultRest: 60, instructions: 'Rechte lijn van hoofd tot hielen.', cues: 'Billen licht aanspannen.', mistakes: 'Heupen laten zakken.', alternatives: ['ex_ab_wheel'] },

    // Kettlebell-only movements
    { id: 'kb_floor_press', name: 'Single-arm Floor Press', category: 'Push', primaryMuscle: 'Borst', secondaryMuscles: ['Triceps'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '8-10 per arm', defaultRest: 0, instructions: 'Liggend op de grond, kettlebell vanaf de borst rustig naar boven drukken.', cues: 'Elleboog raakt de grond voor je weer drukt.', mistakes: 'Onderrug hol trekken.', alternatives: [] },
    { id: 'kb_row', name: 'One-arm Kettlebell Row', category: 'Pull', primaryMuscle: 'Bovenrug', secondaryMuscles: ['Biceps'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '8-10 per arm', defaultRest: 0, instructions: 'Voorover gebogen, kettlebell naar de heup trekken.', cues: 'Rug neutraal houden.', mistakes: 'Rotatie in de romp.', alternatives: [] },
    { id: 'kb_strict_press', name: 'Half-kneeling Strict Press', category: 'Push', primaryMuscle: 'Schouders', secondaryMuscles: ['Triceps', 'Core'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '6-8 per arm', defaultRest: 0, instructions: 'Halfknielend, kettlebell recht naar boven drukken.', cues: 'Core aanspannen, geen doorbuiging.', mistakes: 'Achterover leunen.', alternatives: [] },
    { id: 'kb_pushup', name: 'Push-up', category: 'Push', primaryMuscle: 'Borst', secondaryMuscles: ['Triceps', 'Core'], equipment: 'Lichaamsgewicht', location: 'thuis', type: 'compound', weightUnit: 'bodyweight', defaultReps: '8-15', defaultRest: 0, instructions: 'Rechte lijn van hoofd tot hielen, borst naar de grond.', cues: 'Ellebogen circa 45° van de romp.', mistakes: 'Heupen laten doorzakken.', alternatives: [] },
    { id: 'kb_halo', name: 'Kettlebell Halo', category: 'Mobiliteit/Schouders', primaryMuscle: 'Schouders', secondaryMuscles: ['Core'], equipment: 'Kettlebell', location: 'thuis', type: 'isolatie', weightUnit: 'kettlebell', defaultReps: '8 per richting', defaultRest: 0, instructions: 'Kettlebell rond het hoofd bewegen, dicht bij de schedel.', cues: 'Romp stabiel, rustig tempo.', mistakes: 'Te ruime cirkel.', alternatives: [] },
    { id: 'kb_goblet_squat', name: 'Goblet Squat', category: 'Squat', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Bilspieren'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '10-12', defaultRest: 0, instructions: 'Kettlebell voor de borst, diep zakken tussen de knieën.', cues: 'Ellebogen tussen de knieën onderaan.', mistakes: 'Hielen optillen.', alternatives: [] },
    { id: 'kb_rdl', name: 'Kettlebell Romanian Deadlift', category: 'Hinge', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Bilspieren'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '12', defaultRest: 0, instructions: 'Heupen naar achteren, kettlebell dicht bij de benen.', cues: 'Rug neutraal.', mistakes: 'Rug ronden.', alternatives: [] },
    { id: 'kb_reverse_lunge', name: 'Reverse Lunge', category: 'Unilateraal', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Bilspieren'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '8 per been', defaultRest: 0, instructions: 'Stap naar achteren, knie richting de vloer.', cues: 'Romp rechtop.', mistakes: 'Te korte pas.', alternatives: [] },
    { id: 'kb_sl_rdl', name: 'Single-leg Romanian Deadlift', category: 'Unilateraal', primaryMuscle: 'Hamstrings', secondaryMuscles: ['Bilspieren', 'Balans'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '8 per been', defaultRest: 0, instructions: 'Op één been buigen, kettlebell naar de grond.', cues: 'Heupen recht houden.', mistakes: 'Rotatie in de heupen.', alternatives: [] },
    { id: 'kb_calf_raise', name: 'Standing Calf Raise (KB)', category: 'Isolatie', primaryMuscle: 'Kuiten', secondaryMuscles: [], equipment: 'Kettlebell', location: 'thuis', type: 'isolatie', weightUnit: 'kettlebell', defaultReps: '20', defaultRest: 0, instructions: 'Kettlebell vasthouden, op de tenen komen.', cues: 'Volledige range.', mistakes: 'Te snel tempo.', alternatives: [] },
    { id: 'kb_clean_press', name: 'Clean and Strict Press', category: 'Push', primaryMuscle: 'Schouders', secondaryMuscles: ['Bovenrug', 'Core'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '6 per arm', defaultRest: 0, instructions: 'Kettlebell optrekken naar rackpositie, dan drukken.', cues: 'Heupen aandrijven bij de clean.', mistakes: 'Kettlebell tegen de onderarm laten smakken.', alternatives: [] },
    { id: 'kb_tall_kneeling_press', name: 'Tall-kneeling Press', category: 'Push', primaryMuscle: 'Schouders', secondaryMuscles: ['Core'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '8 per arm', defaultRest: 0, instructions: 'Hoogknielend, kettlebell recht naar boven drukken.', cues: 'Heupen naar voren, geen hol houden.', mistakes: 'Doorbuigen in de onderrug.', alternatives: [] },
    { id: 'kb_curl', name: 'Kettlebell Curl', category: 'Isolatie', primaryMuscle: 'Biceps', secondaryMuscles: [], equipment: 'Kettlebell', location: 'thuis', type: 'isolatie', weightUnit: 'kettlebell', defaultReps: '10-12', defaultRest: 0, instructions: 'Kettlebell curlen vanuit de handvat-grip.', cues: 'Ellebogen stil houden.', mistakes: 'Schouders meebewegen.', alternatives: [] },
    { id: 'kb_ov_triceps_ext', name: 'Overhead Triceps Extension (KB)', category: 'Isolatie', primaryMuscle: 'Triceps', secondaryMuscles: [], equipment: 'Kettlebell', location: 'thuis', type: 'isolatie', weightUnit: 'kettlebell', defaultReps: '10-12', defaultRest: 0, instructions: 'Kettlebell achter het hoofd strekken.', cues: 'Ellebogen dicht bij het hoofd.', mistakes: 'Ellebogen laten uitwaaieren.', alternatives: [] },
    { id: 'kb_deadlift', name: 'Kettlebell Deadlift', category: 'Hinge', primaryMuscle: 'Posterior chain', secondaryMuscles: ['Quadriceps'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '15', defaultRest: 0, instructions: 'Kettlebell tussen de voeten, optrekken met rechte rug.', cues: 'Heupen naar achteren starten.', mistakes: 'Rug ronden.', alternatives: [] },
    { id: 'kb_bulgarian_split_squat', name: 'Bulgarian Split Squat (KB)', category: 'Unilateraal', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Bilspieren'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '8 per been', defaultRest: 0, instructions: 'Achterste voet verhoogd (bv. op een stoel), recht naar beneden zakken.', cues: 'Romp rechtop.', mistakes: 'Te ver voorover leunen.', alternatives: [] },
    { id: 'kb_goblet_squat_slow', name: 'Goblet Squat (3 sec zakken)', category: 'Squat', primaryMuscle: 'Quadriceps', secondaryMuscles: ['Bilspieren'], equipment: 'Kettlebell', location: 'thuis', type: 'compound', weightUnit: 'kettlebell', defaultReps: '10', defaultRest: 0, instructions: 'Zelfde als goblet squat, maar 3 seconden gecontroleerd zakken.', cues: 'Tempo tellen tijdens het zakken.', mistakes: 'Te snel zakken.', alternatives: [] },
    { id: 'kb_glute_bridge', name: 'Glute Bridge met Kettlebell', category: 'Hinge', primaryMuscle: 'Bilspieren', secondaryMuscles: ['Hamstrings'], equipment: 'Kettlebell', location: 'thuis', type: 'isolatie', weightUnit: 'kettlebell', defaultReps: '15', defaultRest: 0, instructions: 'Kettlebell op de heupen, bekken optillen.', cues: 'Bovenaan de bilspieren aanspannen.', mistakes: 'Doorbuigen in de onderrug.', alternatives: [] },
    { id: 'kb_suitcase_march', name: 'Suitcase March', category: 'Core', primaryMuscle: 'Buikspieren (lateraal)', secondaryMuscles: ['Heupen'], equipment: 'Kettlebell', location: 'thuis', type: 'isolatie', weightUnit: 'kettlebell', defaultReps: '30-45 sec per kant', defaultRest: 0, instructions: 'Kettlebell aan één kant, ter plaatse stappen zonder opzij te hellen.', cues: 'Romp recht houden.', mistakes: 'Naar de kant van de kettlebell hellen.', alternatives: [] },

    // Cardio (generic placeholder for logging)
    { id: 'ex_cardio_session', name: 'Cardiosessie', category: 'Cardio', primaryMuscle: 'Cardiovasculair', secondaryMuscles: [], equipment: 'Variabel', location: 'beide', type: 'cardio', weightUnit: 'bodyweight', defaultReps: '45-75 min', defaultRest: 0, instructions: 'Fietsen, zwemmen, rustig lopen, wandelen met helling of vrije cardio, hoofdzakelijk zone 2.', cues: 'Niet volledig uitputtend.', mistakes: 'Te hoge intensiteit die krachtherstel hindert.', alternatives: [] },
  ];

  exercises.forEach(e => { e.status = e.status || 'actief'; });

  // ---- Gym workout templates --------------------------------------------
  // essential:false marks accessories dropped in the 80% version
  const gymTemplates = [
    {
      id: 'gym_upper_a', type: 'gym', day: 'upperA', name: 'Upper A',
      focus: ['Borst', 'Horizontale trek', 'Bovenrug', 'Schouders', 'Armen'],
      exercises: [
        { exerciseId: 'ex_incline_bb_bench', sets: 3, repsMin: 6, repsMax: 8, rir: '1-2', restSec: 150, essential: true },
        { exerciseId: 'ex_chest_supported_row', sets: 3, repsMin: 6, repsMax: 10, rir: '1-2', restSec: 120, essential: true },
        { exerciseId: 'ex_flat_db_bench', sets: 3, repsMin: 8, repsMax: 12, rir: '1-2', restSec: 105, essential: true },
        { exerciseId: 'ex_lat_pulldown', sets: 3, repsMin: 8, repsMax: 12, rir: '1-2', restSec: 105, essential: true },
        { exerciseId: 'ex_lateral_raise', sets: 3, repsMin: 12, repsMax: 20, rir: '0-2', restSec: 60, essential: true },
        { exerciseId: 'ex_triceps_pushdown', sets: 2, repsMin: 10, repsMax: 15, rir: '0-1', restSec: 60, essential: false },
        { exerciseId: 'ex_incline_db_curl', sets: 2, repsMin: 10, repsMax: 15, rir: '0-1', restSec: 60, essential: false },
      ]
    },
    {
      id: 'gym_lower_a', type: 'gym', day: 'lowerA', name: 'Lower A',
      focus: ['Squatpatroon', 'Quadriceps', 'Hamstrings', 'Bilspieren', 'Kuiten', 'Core'],
      exercises: [
        { exerciseId: 'ex_back_squat', sets: 3, repsMin: 5, repsMax: 8, rir: '1-2', restSec: 165, essential: true },
        { exerciseId: 'ex_rdl', sets: 3, repsMin: 6, repsMax: 10, rir: '1-2', restSec: 165, essential: true },
        { exerciseId: 'ex_bulgarian_split_squat', sets: 3, repsMin: 8, repsMax: 12, rir: '1-2', restSec: 105, essential: true },
        { exerciseId: 'ex_leg_curl', sets: 3, repsMin: 10, repsMax: 15, rir: '0-2', restSec: 75, essential: true },
        { exerciseId: 'ex_standing_calf_raise', sets: 3, repsMin: 10, repsMax: 20, rir: '0-1', restSec: 60, essential: false },
        { exerciseId: 'ex_cable_crunch', sets: 3, repsMin: 10, repsMax: 15, rir: '1-2', restSec: 60, essential: false },
      ]
    },
    {
      id: 'gym_upper_b', type: 'gym', day: 'upperB', name: 'Upper B',
      focus: ['Schouders', 'Verticale duw', 'Verticale trek', 'Rug', 'Borst', 'Armen'],
      exercises: [
        { exerciseId: 'ex_ohp', sets: 3, repsMin: 5, repsMax: 8, rir: '1-2', restSec: 150, essential: true },
        { exerciseId: 'ex_lat_pulldown', sets: 3, repsMin: 8, repsMax: 12, rir: '1-2', restSec: 105, essential: true },
        { exerciseId: 'ex_oneam_db_row', sets: 3, repsMin: 8, repsMax: 12, rir: '1-2', restSec: 105, essential: true },
        { exerciseId: 'ex_chest_press_machine', sets: 3, repsMin: 8, repsMax: 12, rir: '1-2', restSec: 105, essential: true },
        { exerciseId: 'ex_lateral_raise', sets: 3, repsMin: 12, repsMax: 20, rir: '0-2', restSec: 60, essential: true },
        { exerciseId: 'ex_rear_delt_fly', sets: 2, repsMin: 12, repsMax: 20, rir: '0-2', restSec: 60, essential: false },
        { exerciseId: 'ex_cable_curl', sets: 2, repsMin: 10, repsMax: 15, rir: '0-1', restSec: 60, essential: false },
        { exerciseId: 'ex_ov_triceps_ext', sets: 2, repsMin: 10, repsMax: 15, rir: '0-1', restSec: 60, essential: false },
      ]
    },
    {
      id: 'gym_lower_b', type: 'gym', day: 'lowerB', name: 'Lower B',
      focus: ['Posterior chain', 'Deadliftvariant', 'Quadriceps', 'Unilateraal', 'Kuiten', 'Core'],
      exercises: [
        { exerciseId: 'ex_trap_bar_dl', sets: 3, repsMin: 4, repsMax: 6, rir: '1-2', restSec: 165, essential: true },
        { exerciseId: 'ex_front_squat', sets: 3, repsMin: 6, repsMax: 10, rir: '1-2', restSec: 120, essential: true },
        { exerciseId: 'ex_walking_lunge', sets: 3, repsMin: 8, repsMax: 12, rir: '1-2', restSec: 105, essential: true },
        { exerciseId: 'ex_seated_leg_curl', sets: 3, repsMin: 10, repsMax: 15, rir: '0-2', restSec: 75, essential: true },
        { exerciseId: 'ex_leg_extension', sets: 2, repsMin: 12, repsMax: 15, rir: '0-1', restSec: 60, essential: false },
        { exerciseId: 'ex_seated_calf_raise', sets: 3, repsMin: 12, repsMax: 20, rir: '0-1', restSec: 60, essential: false },
        { exerciseId: 'ex_ab_wheel', sets: 3, repsMin: 8, repsMax: 15, rir: '1-2', restSec: 60, essential: false },
      ]
    },
  ];

  // ---- Kettlebell templates (standard + express) ------------------------
  const kettlebellTemplates = [
    {
      id: 'kb_upper_a_std', type: 'kettlebell', day: 'upperA', variant: 'standard', name: 'Upper A – Kettlebell',
      durationMin: 25,
      items: [
        { exerciseId: 'kb_floor_press', reps: '10 per arm' },
        { exerciseId: 'kb_row', reps: '10 per arm' },
        { exerciseId: 'kb_strict_press', reps: '8 per arm' },
        { exerciseId: 'kb_pushup', reps: '8-15' },
        { exerciseId: 'kb_halo', reps: '8 per richting' },
      ]
    },
    {
      id: 'kb_upper_a_exp', type: 'kettlebell', day: 'upperA', variant: 'express', name: 'Upper A – Express',
      durationMin: 15,
      items: [
        { exerciseId: 'kb_floor_press', reps: '8 per arm' },
        { exerciseId: 'kb_row', reps: '10 per arm' },
        { exerciseId: 'kb_strict_press', reps: '6 per arm' },
        { exerciseId: 'kb_pushup', reps: '8-12' },
      ]
    },
    {
      id: 'kb_lower_a_std', type: 'kettlebell', day: 'lowerA', variant: 'standard', name: 'Lower A – Kettlebell',
      durationMin: 25,
      items: [
        { exerciseId: 'kb_goblet_squat', reps: '12' },
        { exerciseId: 'kb_rdl', reps: '12' },
        { exerciseId: 'kb_reverse_lunge', reps: '8 per been' },
        { exerciseId: 'kb_sl_rdl', reps: '8 per been' },
        { exerciseId: 'kb_calf_raise', reps: '20' },
      ]
    },
    {
      id: 'kb_lower_a_exp', type: 'kettlebell', day: 'lowerA', variant: 'express', name: 'Lower A – Express',
      durationMin: 15,
      items: [
        { exerciseId: 'kb_goblet_squat', reps: '10' },
        { exerciseId: 'kb_rdl', reps: '12' },
        { exerciseId: 'kb_reverse_lunge', reps: '6 per been' },
      ]
    },
    {
      id: 'kb_upper_b_std', type: 'kettlebell', day: 'upperB', variant: 'standard', name: 'Upper B – Kettlebell',
      durationMin: 25,
      items: [
        { exerciseId: 'kb_clean_press', reps: '6 per arm' },
        { exerciseId: 'kb_row', reps: '10 per arm' },
        { exerciseId: 'kb_floor_press', reps: '10 per arm' },
        { exerciseId: 'kb_tall_kneeling_press', reps: '8 per arm' },
        { exerciseId: 'kb_curl', reps: '10-12' },
        { exerciseId: 'kb_ov_triceps_ext', reps: '10-12' },
      ]
    },
    {
      id: 'kb_upper_b_exp', type: 'kettlebell', day: 'upperB', variant: 'express', name: 'Upper B – Express',
      durationMin: 15,
      items: [
        { exerciseId: 'kb_clean_press', reps: '5 per arm' },
        { exerciseId: 'kb_row', reps: '8 per arm' },
        { exerciseId: 'kb_floor_press', reps: '8 per arm' },
      ]
    },
    {
      id: 'kb_lower_b_std', type: 'kettlebell', day: 'lowerB', variant: 'standard', name: 'Lower B – Kettlebell',
      durationMin: 25,
      items: [
        { exerciseId: 'kb_deadlift', reps: '15' },
        { exerciseId: 'kb_bulgarian_split_squat', reps: '8 per been' },
        { exerciseId: 'kb_goblet_squat_slow', reps: '10' },
        { exerciseId: 'kb_glute_bridge', reps: '15' },
        { exerciseId: 'kb_suitcase_march', reps: '30-45 sec per kant' },
      ]
    },
    {
      id: 'kb_lower_b_exp', type: 'kettlebell', day: 'lowerB', variant: 'express', name: 'Lower B – Express',
      durationMin: 15,
      items: [
        { exerciseId: 'kb_deadlift', reps: '12' },
        { exerciseId: 'kb_bulgarian_split_squat', reps: '6 per been' },
        { exerciseId: 'kb_goblet_squat', reps: '10' },
        { exerciseId: 'kb_suitcase_march', reps: '30 sec per kant' },
      ]
    },
  ];

  const cardioTemplate = {
    id: 'cardio_default', type: 'cardio', day: 'cardio', name: 'Cardio',
    durationMin: [45, 75], zone: 'Zone 2'
  };

  // ---- Default weekly schedule -------------------------------------------
  const defaultSchedule = {
    key: 'app',
    firstDayOfWeek: 'mon',
    days: {
      mon: 'upperA',
      tue: 'lowerA',
      wed: 'cardio',
      thu: 'upperB',
      fri: 'lowerB',
      sat: 'rest',
      sun: 'rest',
    }
  };

  const defaultSettings = {
    key: 'app',
    name: 'Simon',
    heightCm: 189,
    startWeightKg: 82,
    goalWeightKg: null,
    weightUnit: 'kg',
    distanceUnit: 'km',
    firstDayOfWeek: 'mon',
    defaultGymDurationMin: 60,
    defaultKettlebellWeight: 12,
    dumbbellSteps: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
    plateSteps: [1.25, 2.5, 5, 10, 15, 20],
    machineStep: 5,
    kettlebells: [12, 16],
    cardioFavorite: 'fietsen',
    darkMode: true,
    goal: 'spiermassa',
    photosHiddenByDefault: false,
    onboardingDone: false,
  };

  return { exercises, gymTemplates, kettlebellTemplates, cardioTemplate, defaultSchedule, defaultSettings };
})();
